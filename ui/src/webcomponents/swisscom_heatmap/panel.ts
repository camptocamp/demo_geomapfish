import {html, TemplateResult, CSSResult, css, unsafeCSS} from 'lit';
import {customElement, state, property} from 'lit/decorators.js';
import {unsafeSVG} from 'lit/directives/unsafe-svg.js';
import loadingSvg from 'gmf/icons/spinner.svg';
import ToolPanelElement from 'gmfapi/elements/ToolPanelElement';
import mapModel from 'gmfapi/store/map';
import configModel from 'gmfapi/store/config';
import panelsModel from 'gmfapi/store/panels';
import {Subscription} from 'rxjs';

import Map from 'ol/Map.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import {Heatmap as HeatmapLayer} from 'ol/layer.js';
import {GeoJSON} from 'ol/format.js';
import {transform} from 'ol/proj.js';
import {Point} from 'ol/geom.js';
import {Feature} from 'ol/Feature.js';
import {extend, Extent, createEmpty, isEmpty, buffer} from 'ol/extent.js';

import SwisscomHeatmapService, {ConfigType} from './service';

@customElement('swisscom-heatmap')
export default class SwisscomHeatmap extends ToolPanelElement {
  @state() private active = false;
  @state() private customCSS_ = '';
  @state() private waitingConfig = true;
  @state() private waitingData = false;
  @state() private messageText = '';
  @state() private blur = 4;
  @state() private radius = 8;
  @state() private queryType = 'dwell-density.json';
  @state() private dateLabel = '';
  @state() private year = 2022;
  @state() private month = 10;
  @state() private day = 3;
  @state() private time = 12;
  @state() private postalCode = 1003;
  private subscriptions: Subscription[] = [];
  private swisscomHeatmapService = new SwisscomHeatmapService();
  private config?: ConfigType;
  private map?: Map;
  private view?: View;
  private isInitialRecenterDone: boolean;
  private geoJsonFormat = new GeoJSON({});
  private vectorSource = new VectorSource({
    features: [],
  });
  private heatmapLayer = new HeatmapLayer({
    source: this.vectorSource,
    blur: this.blur,
    radius: this.radius,
    opacity: 0.8,
    weight: this.getHeatmapWeight.bind(this),
  });

  connectedCallback(): void {
    super.connectedCallback();
    panelsModel.getActiveToolPanel().subscribe({
      next: (activePanel) => {
        if (activePanel === 'swisscom-heatmap') {
          this.addObservers();
          this.showComponent();
        } else {
          this.hideComponent();
        }
      },
    });
  }

  private addObservers() {
    this.subscriptions.push(
      configModel.getConfig().subscribe({
        next: (configuration) => {
          if (configuration) {
            const baseUrl = new URL(configuration.swisscomHeatmapPath, configuration.gmfBase).href;
            this.swisscomHeatmapService.setBaseUrl(baseUrl);
            if (!this.config) {
              this.swisscomHeatmapService.fetchConfig();
            }
          }
        },
      }),
    );
    this.subscriptions.push(
      this.swisscomHeatmapService.getConfig().subscribe((config) => {
        if (config) {
          this.config = config;
          this.waitingConfig = false;
          this.showComponent();
        }
      }),
    );
    this.subscriptions.push(
      mapModel.getMap().subscribe({
        next: (map: Map) => {
          if (!map) {
            return;
          }
          this.map = map;
          this.view = this.map.getView();
        },
      }),
    );
  }

  private showComponent() {
    if (this.config) {
      this.dateLabel = this.getDateLabel();
      this.addLayer();
    }
    this.active = true;
  }

  private hideComponent() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
    this.subscriptions.length = 0;
    this.removeLayer();
    this.active = false;
  }

  private addLayer() {
    if (this.map && !this.map.get('swisscom-heatmap-added')) {
      this.map.set('swisscom-heatmap-added', true);
      this.map.addLayer(this.heatmapLayer);
      this.vectorSource.changed();
    }
  }

  private removeLayer() {
    if (!this.map) {
      return;
    }
    this.map.set('swisscom-heatmap-added', false);
    this.map.removeLayer(this.heatmapLayer);
  }

  private getHeatmapWeight(feature: Feature): number {
    if (this.queryType === 'dwell-density.json') {
      return feature.get('score') / 100;
    }
    if (this.queryType === 'dwell-demographics.json') {
      const prop = feature.get('maleProportion');
      const factor = 1.5;
      return prop > 0.5 ? Math.min(prop * factor, 1) : Math.max(prop / factor, 0);
    }
    return 0;
  }

  private getIntValueFromEvent(event: Event): number {
    const target = event.target as HTMLInputElement;
    return parseInt(target.value, 10);
  }

  private blurOnChange(event: Event) {
    const value = this.getIntValueFromEvent(event);
    this.blur = value;
    this.heatmapLayer.setBlur(value);
  }

  private radiusOnChange(event: Event) {
    const value = this.getIntValueFromEvent(event);
    this.radius = value;
    this.heatmapLayer.setRadius(value);
  }

  private queryOnChange(event: Event) {
    const target = event.target as HTMLInputElement;
    this.queryType = target.value;
  }

  private timeOnChange(event: Event) {
    this.time = this.getIntValueFromEvent(event);
  }

  private yearOnChange(event: Event) {
    this.year = this.getIntValueFromEvent(event);
    this.dateLabel = this.getDateLabel();
  }

  private monthOnChange(event: Event) {
    this.month = this.getIntValueFromEvent(event);
    this.dateLabel = this.getDateLabel();
  }

  private dayOnChange(event: Event) {
    this.day = this.getIntValueFromEvent(event);
    this.dateLabel = this.getDateLabel();
  }

  private postalCodeOnChange(event: Event) {
    this.isInitialRecenterDone = false;
    this.postalCode = this.getIntValueFromEvent(event);
  }

  private days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  private getDayName(dateTxt: string): string {
    const date = new Date(dateTxt);
    return this.days[date.getDay()];
  }

  private getDateLabel(): string {
    const dayName = this.getDayName(`${this.year}.${this.month}.${this.day}`);
    return `${dayName} ${this.day.toString()}`;
  }

  private getDateTime() {
    return `${this.day}.${this.month}.${this.year}T${this.time}:00`;
  }

  private getLimit(kind: 'day' | 'month' | 'year', isMin: boolean) {
    const date1 = this.config.minDate;
    const date2 = this.config.maxDate;
    let limit1, limit2;
    if (kind === 'day') {
      limit1 = date1.getDate();
      limit2 = date2.getDate();
    } else if (kind === 'month') {
      limit1 = date1.getMonth() + 1;
      limit2 = date2.getMonth() + 1;
    } else {
      limit1 = date1.getFullYear();
      limit2 = date2.getFullYear();
    }
    if (limit1 === limit2) {
      return -1;
    }
    return isMin ? Math.min(limit1, limit2) : Math.max(limit1, limit2);
  }

  private getFeaturesExtent(features: Feature[]): Extent | null {
    const extent =
      features.reduce(
        (currentExtent, feature) => extend(currentExtent, feature.getGeometry()?.getExtent() ?? []),
        createEmpty(),
      ) ?? null;
    return extent && !isEmpty(extent) ? extent : null;
  }

  private zoomToFeatures() {
    const extent = this.getFeaturesExtent(this.vectorSource.getFeatures());
    this.view.fit(buffer(extent, 200));
    this.isInitialRecenterDone = true;
  }

  private async onRequest() {
    this.waitingData = true;
    this.messageText = `Request ${this.queryType} on ${this.getDateLabel()} at ${this.time}:00`;
    const data = await this.swisscomHeatmapService.fetchGeoJson(
      this.queryType,
      this.postalCode,
      this.getDateTime(),
    );
    this.vectorSource.clear();
    this.waitingData = false;
    if (!data) {
      this.messageText = this.swisscomHeatmapService.getLastError();
      return;
    }
    const features = this.geoJsonFormat.readFeatures(data).map((feature: Feature) => {
      const coord = (feature.getGeometry() as Point).getCoordinates();
      const reproj = transform(coord, 'EPSG:21781', 'EPSG:2056');
      feature.setGeometry(new Point(reproj));
      return feature;
    });
    this.vectorSource.addFeatures(features);
    if (!this.isInitialRecenterDone) {
      this.zoomToFeatures();
    }
  }

  static styles: CSSResult[] = [
    ...ToolPanelElement.styles,
    css`
      .svg-spinner {
        float: left;
        margin-right: 20px;
      }

      i.fa-spin {
        fill: black;
        width: 1.3rem;
      }

      form {
        margin: 1rem 0;
      }

      .two-item {
        display: flex;
        column-gap: 1rem;
      }

      .two-item > label {
        flex-grow: 1;
        width: 40%;
      }

      #console {
        background-color: whitesmoke;
      }

      #console .title {
        color: grey;
      }

      #console p {
        margin: 0;
        padding: 0.5rem;
      }
    `,
  ];

  private spinnerTemplate = html`
    <div>
      <i class="fa fa-spin svg-spinner"> ${unsafeSVG(loadingSvg)} </i>
      Loading data...
    </div>
  `;

  protected render(): TemplateResult {
    if (!this.active) {
      return '';
    }
    if (this.waitingConfig) {
      return html` ${this.spinnerTemplate} `;
    }
    return html`
      <style>
        ${unsafeCSS(this.customCSS_)}
      </style>
      <div class="gmf-app-tools-content-heading">Simple heatmap example.</div>
      <form>
        <div class="input two-item">
          <label for="radius">
            <span>Radius size:&nbsp;</span>
            <span id="radius-label">${this.radius}</span>
          </label>
          <input
            id="radius"
            type="range"
            min="1"
            max="50"
            step="1"
            value=${this.radius}
            @input=${this.radiusOnChange}
          />
        </div>
        <div class="input two-item">
          <label for="blur">
            <span>Blur size:&nbsp;</span>
            <span id="blur-label">${this.blur}</span>
          </label>
          <input
            id="blur"
            type="range"
            min="1"
            max="50"
            step="1"
            value="${this.blur}"
            @input=${this.blurOnChange}
          />
        </div>
        <br />
        <div class="input">
          <label for="query">Query:&nbsp;</label>
          <select id="query" class="input" @change=${this.queryOnChange}>
            <option value="dwell-density.json">dwell-density</option>
            <option value="dwell-demographics.json">dwell-demographics</option>
          </select>
        </div>
        <div class="input two-item">
          <label for="year">
            <span>Year:&nbsp;</span>
            <span id="day-label">${this.year}</span>
          </label>
          <input
            ?disabled="${this.getLimit('year', true) === -1}"
            id="year"
            type="range"
            min="${this.getLimit('year', true)}"
            max="${this.getLimit('year', false)}"
            step="1"
            value="${this.year}"
            @input=${this.yearOnChange}
          />
        </div>
        <div class="input two-item">
          <label for="month">
            <span>Month:&nbsp;</span>
            <span id="day-label">${this.month}</span>
          </label>
          <input
            ?disabled="${this.getLimit('month', true) === -1}"
            id="month"
            type="range"
            min="${this.getLimit('month', true)}"
            max="${this.getLimit('month', false)}"
            step="1"
            value="${this.month}"
            @input=${this.monthOnChange}
          />
        </div>
        <div class="input two-item">
          <label for="day">
            <span>Date:&nbsp;</span>
            <span id="day-label">${this.dateLabel}</span>
          </label>
          <input
            ?disabled="${this.getLimit('day', true) === -1}"
            id="day"
            type="range"
            min="${this.getLimit('day', true)}"
            max="${this.getLimit('day', false)}"
            step="1"
            value="${this.day}"
            @input=${this.dayOnChange}
          />
        </div>
        <div class="input two-item">
          <label for="time">
            <span>Time:&nbsp;</span>
            <span id="time-label">${this.time}</span>
            <span>:00</span>
          </label>
          <input
            id="time"
            type="range"
            min="0"
            max="23"
            step="1"
            value="${this.time}"
            @input=${this.timeOnChange}
          />
        </div>
        <div class="input">
          <label for="postal-code">
            <span>Postal code: &nbsp;</span>
          </label>
          <input
            id="postal-code"
            type="number"
            min="1000"
            max="9999"
            value="${this.postalCode}"
            @input=${this.postalCodeOnChange}
          />
        </div>
        <br />
        <div class="input">
          <button id="request" type="button" @click=${this.onRequest}>Request</button>
        </div>
      </form>
      <div id="console">
        <p class="title">Output message:</p>
        <p class="text">${this.messageText}</p>
      </div>
      ${this.waitingData ? this.spinnerTemplate : ''}
    `;
  }
}

import {html, TemplateResult, CSSResult, css, unsafeCSS} from 'lit';
import {customElement, state, property} from 'lit/decorators.js';
import {Subscription} from 'rxjs';
import moment from 'moment';
import epsg21781 from '@geoblocks/proj/src/EPSG_21781.js';
import epsg2056 from '@geoblocks/proj/src/EPSG_2056.js';

import Map from 'ol/Map.js';
import VectorSource from 'ol/source/Vector.js';
import View from 'ol/View.js';
import {Heatmap as HeatmapLayer} from 'ol/layer.js';
import {GeoJSON} from 'ol/format.js';
import {transform} from 'ol/proj.js';
import {Point} from 'ol/geom.js';
import Feature from 'ol/Feature.js';
import {extend, Extent, createEmpty, isEmpty, buffer} from 'ol/extent.js';

import SwisscomHeatmapService, {ConfigType} from './service';

const QUERY_TYPE = {
  dwellDensity: 'dwell-density.json',
  dwellDemo: 'dwell-demographics.json',
};

// @ts-ignore
@customElement('swisscom-heatmap')
export default class SwisscomHeatmap extends (window as any).gmfapi.elements.ToolPanelElement {
  @state() private active = false;
  @state() private customCSS_ = '';
  @state() private waitingConfig = true;
  @state() private waitingData = false;
  @state() private messageText = '';
  @state() private blur = 20;
  @state() private radius = 25;
  @state() private queryType = QUERY_TYPE.dwellDensity;
  @state() private meaning = '';
  @state() private date = new Date();
  @state() private dateLabel = this.getDateLabel(this.date);
  @state() private time = 0;
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
    (window as any).gmfapi.store.panels.getActiveToolPanel().subscribe({
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
      (window as any).gmfapi.store.config.getConfig().subscribe({
        next: (configuration) => {
          if (configuration) {
            const baseUrl = new URL(configuration.swisscomHeatmapPath, configuration.gmfBase).href;
            this.swisscomHeatmapService.setBaseUrl(baseUrl);
            if (!this.config) {
              this.swisscomHeatmapService.fetchConfig();
            }
          }
        },
      })
    );
    this.subscriptions.push(
      this.swisscomHeatmapService.getConfig().subscribe((config) => {
        if (config) {
          this.config = config;
          this.waitingConfig = false;
          this.showComponent();
        }
      })
    );
    this.subscriptions.push(
      (window as any).gmfapi.store.map.getMap().subscribe({
        next: (map: Map) => {
          if (!map) {
            return;
          }
          this.map = map;
          this.view = this.map.getView();
        },
      })
    );
  }

  private showComponent() {
    if (this.config) {
      this.setDate(this.config.minDate);
      this.updateHeatmapStyle();
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
    if (this.queryType === QUERY_TYPE.dwellDensity) {
      // Small villages get 0-100, big 100-1000. Smooth the curve.
      return Math.min(Math.log(feature.get('score')) / 6.6, 1);
    }
    if (this.queryType === QUERY_TYPE.dwellDemo) {
      // Score is between 0 (woman) and 1 (men). Show a bigger polarisation.
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
    this.vectorSource.clear();
    this.updateHeatmapStyle();
  }

  private updateHeatmapStyle() {
    let gradient = ['#00f', '#8ff', '#D8f', '#f00'];
    let meaning = 'Blue means deserted, red means crowded.';
    if (this.queryType === QUERY_TYPE.dwellDemo) {
      gradient = ['#ff00d8', '#AAA', '#00d4ff'];
      meaning = 'Pink means woman , blue means men.';
    }
    this.meaning = meaning;
    this.heatmapLayer.setGradient(gradient);
  }

  private timeOnChange(event: Event) {
    this.time = this.getIntValueFromEvent(event);
  }

  private dateOnChange(event: Event) {
    const target = event.target as HTMLInputElement;
    const date = moment(target.value, 'YYYY-MM-DD');
    this.setDate(date.toDate());
  }

  private setDate(date: Date) {
    this.date = date;
    this.dateLabel = this.getDateLabel(date);
  }

  private postalCodeOnChange(event: Event) {
    this.isInitialRecenterDone = false;
    this.postalCode = this.getIntValueFromEvent(event);
  }

  private getDayName(date: Date): string {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[date.getDay()];
  }

  private getDateLabel(date: Date): string {
    return moment(date).format('YYYY-MM-DD');
  }

  private getDateFullLabel(): string {
    const dayName = this.getDayName(this.date);
    return `${dayName} ${this.getDateLabel(this.date)}`;
  }

  private getDateTime(): string {
    const date = moment(this.date).format('DD.MM.YYYY');
    return `${date}T${this.time}:00`;
  }

  private getFeaturesExtent(features: Feature[]): Extent | null {
    const extent =
      features.reduce(
        (currentExtent, feature) => extend(currentExtent, feature.getGeometry()?.getExtent() ?? []),
        createEmpty()
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
    this.messageText = `Request ${this.queryType} on ${this.getDateFullLabel()} at ${this.time}:00`;
    const data = await this.swisscomHeatmapService.fetchGeoJson(
      this.queryType,
      this.postalCode,
      this.getDateTime()
    );
    this.vectorSource.clear();
    this.waitingData = false;
    if (!data) {
      this.messageText = this.swisscomHeatmapService.getLastError();
      return;
    }
    const features = this.geoJsonFormat.readFeatures(data).map((feature: Feature) => {
      const coord = (feature.getGeometry() as Point).getCoordinates();
      const reproj = transform(coord, epsg21781, epsg2056);
      feature.setGeometry(new Point(reproj));
      return feature;
    });
    this.vectorSource.addFeatures(features);
    if (!this.isInitialRecenterDone) {
      this.zoomToFeatures();
    }
  }

  static styles: CSSResult[] = [
    ...(window as any).gmfapi.elements.ToolPanelElement.styles,
    css`
      .svg-spinner {
        float: left;
        margin-right: 20px;
      }

      .italic {
        font-style: italic;
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
      <i class="fa fa-spin fa-spinner"></i>
      Loading data...
    </div>
  `;

  protected render() {
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
        <p class="italic">${this.meaning}</p>
        <div class="input two-item">
          <label for="date">
            <span>Date</span>
          </label>
          <input
            id="date"
            type="date"
            min="${this.getDateLabel(this.config.minDate)}"
            max="${this.getDateLabel(this.config.maxDate)}"
            value="${this.getDateLabel(this.config.minDate)}"
            @input=${this.dateOnChange}
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

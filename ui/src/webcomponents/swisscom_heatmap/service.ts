import {BehaviorSubject} from 'rxjs';
import moment from 'moment';

export interface ConfigType {
  minDate: Date;
  maxDate: Date;
}

export default class SwisscomHeatmapService {
  private lastError: string;
  private data: BehaviorSubject<Record<string, unknown> | null> = new BehaviorSubject<
    Record<string, unknown>
  >(null);
  private config: BehaviorSubject<Record<string, Date> | null> = new BehaviorSubject<Record<string, Date>>(
    null
  );
  private baseUrl: string;

  setBaseUrl(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  getLastError(): string {
    return this.lastError;
  }

  getData(): BehaviorSubject<Record<string, unknown> | null> {
    return this.data;
  }

  getConfig(): BehaviorSubject<Record<string, Date> | null> {
    return this.config;
  }

  async fetchConfig(): Promise<ConfigType> {
    const data = await fetch(`${this.baseUrl}/get-config.json`)
      .then((response) => {
        if (response.status !== 200) {
          throw `Status code is ${response.status}`;
        }
        return response;
      })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
        this.lastError = error;
        return null;
      });
    const parsedData = JSON.parse(data);
    const config = {
      minDate: moment(parsedData['minDate'], 'DD.MM.YYYY').toDate(),
      maxDate: moment(parsedData['maxDate'], 'DD.MM.YYYY').toDate(),
    };
    this.config.next(config);
    return config;
  }

  async fetchGeoJson(
    path: string,
    postalCode: number,
    dateTime: string
  ): Promise<Record<string, unknown> | null> {
    const url = `${this.baseUrl}/${path}?postal_code=${postalCode}&date_time=${dateTime}`;
    const data = await fetch(url)
      .then((response) => {
        if (response.status !== 200) {
          throw `Status code is ${response.status}`;
        }
        return response;
      })
      .then((response) => response.json())
      .catch((error) => {
        console.error('Error:', error);
        this.lastError = error;
        return null;
      });
    this.data.next(data);
    return data;
  }
}

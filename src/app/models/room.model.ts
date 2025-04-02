import { Widget } from './widget';

export interface Room {
  id: number;
  name: string;
  devices: Widget[]; // Az eszközök azonosítói
}

import { Widget } from './widget';

export interface Room {
  id: number;
  userId: string;
  name: string;
  devices: Widget[]; // Az eszközök azonosítói
}

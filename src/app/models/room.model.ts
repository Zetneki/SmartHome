import { Widget } from './widget';

export interface Room {
  id: string;
  userId: string;
  name: string;
  devices: Widget[]; // Az eszközök azonosítói
}

import { Type } from '@angular/core';
import { WidgetContent } from './widget-content';

export interface Widget {
  id: number;
  roomId: number;
  label: string;
  content: Type<unknown>;
  //contentData: WidgetContent;
  rows: number;
  columns: number;
  backgroundColor: string;
  color: string;
}

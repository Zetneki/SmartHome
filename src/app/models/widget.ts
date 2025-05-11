import { Type } from '@angular/core';
import { WidgetContent } from './widget-content';

export interface Widget {
  id: string;
  roomId: string;
  label: string;
  content: string;
  contentData: WidgetContent;
  rows: number;
  columns: number;
  backgroundColor: string;
  color: string;
}

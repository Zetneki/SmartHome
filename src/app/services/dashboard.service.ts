import { Injectable } from '@angular/core';
import { Widget } from '../models/widget';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  // Widget logika (pl. mozgatás, méretezés)
  updateWidget(widgets: Widget[], id: number, widget: Partial<Widget>) {
    const index = widgets.findIndex((w) => w.id === id);
    if (index !== -1) {
      const newWidgets = [...widgets];
      newWidgets[index] = { ...newWidgets[index], ...widget };
      return newWidgets;
    }
    return widgets;
  }

  moveWidgetToRight(widgets: Widget[], id: number): Widget[] {
    if (!widgets || !id) {
      console.warn('Invalid input for moveWidgetToRight');
      return widgets;
    }

    const index = widgets.findIndex((w) => w?.id === id); // Null check hozzáadva

    if (index === -1) {
      console.warn(`Widget with id ${id} not found`);
      return widgets;
    }

    if (index === widgets.length - 1) {
      console.warn('Widget is already at the end');
      return widgets;
    }

    // Mély másolat készítése
    const newWidgets = [...widgets];
    [newWidgets[index], newWidgets[index + 1]] = [
      { ...newWidgets[index + 1] },
      { ...newWidgets[index] },
    ];

    return newWidgets;
  }

  moveWidgetToLeft(widgets: Widget[], id: number): Widget[] {
    const index = widgets.findIndex((w) => w.id === id);
    if (index === 0) {
      return widgets;
    }
    const newWidgets = [...widgets];
    [newWidgets[index], newWidgets[index - 1]] = [
      { ...newWidgets[index - 1] },
      { ...newWidgets[index] },
    ];

    return newWidgets;
  }

  deleteWidget(widgets: Widget[], id: number) {
    console.log('lefutott a delete');
    return widgets.filter((w) => w.id !== id);
  }
}

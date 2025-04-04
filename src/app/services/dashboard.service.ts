import { Injectable } from '@angular/core';
import { Widget } from '../models/widget';
import { LightComponent } from '../pages/home/widgets/light/light.component';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { WidgetComponent } from '../components/widget/widget.component';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  /*
  ID = Date.now();

  addedWidgets = new BehaviorSubject<Widget[]>([
    {
      id: this.ID,
      label: 'Light',
      content: LightComponent,
      rows: 1,
      columns: 1,
      backgroundColor: 'var(--mat-sys-primary)',
      color: 'white',
      contentData: {
        widgetId: this.ID,
        name: 'Light',
        switch: true,
      },
    },
  ]);

  items$ = this.addedWidgets.asObservable();

  addWidget(w: Widget) {
    this.addedWidgets.next([...this.addedWidgets.getValue(), { ...w }]);
    console.log(this.addedWidgets.getValue());
  }

  updateWidget(id: number, widget: Partial<Widget>) {
    console.log(widget);
    const index = this.addedWidgets.getValue().findIndex((w) => w.id === id);
    if (index !== -1) {
      const newWidgets = [...this.addedWidgets.getValue()];
      newWidgets[index] = { ...newWidgets[index], ...widget };
      this.addedWidgets.next(newWidgets);
    }
  }
  
  moveWidgetToRight(id: number) {
    const index = this.addedWidgets.value.findIndex((w) => w.id === id);
    if (index === this.addedWidgets.getValue().length - 1) {
      return;
    }
    const newWidgets = [...this.addedWidgets.getValue()];
    [newWidgets[index], newWidgets[index + 1]] = [
      { ...newWidgets[index + 1] },
      { ...newWidgets[index] },
    ];

    this.addedWidgets.next(newWidgets);
  }

  
  moveWidgetToLeft(id: number) {
    const index = this.addedWidgets.getValue().findIndex((w) => w.id === id);
    if (index === 0) {
      return;
    }
    const newWidgets = [...this.addedWidgets.getValue()];
    [newWidgets[index], newWidgets[index - 1]] = [
      { ...newWidgets[index - 1] },
      { ...newWidgets[index] },
    ];

    this.addedWidgets.next(newWidgets);
  }

  deleteWidget(id: number) {
    this.addedWidgets.next(
      this.addedWidgets.getValue().filter((w) => w.id !== id)
    );
  }*/

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

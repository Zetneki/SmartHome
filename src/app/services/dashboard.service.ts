import { Injectable } from '@angular/core';
import { Widget } from '../models/dashboard';
import { LightComponent } from '../pages/home/widgets/light/light.component';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  addedWidgets = new BehaviorSubject<Widget[]>([
    {
      id: 1,
      label: 'Light',
      content: LightComponent,
      rows: 1,
      columns: 1,
      backgroundColor: 'var(--mat-sys-primary)',
      color: 'white',
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
  }

  constructor() {}
}

import { computed, effect, Injectable, signal } from '@angular/core';
import { Widget } from '../models/dashboard';
import { SubscribersComponent } from '../pages/home/widgets/subscribers/subscribers.component';
import { TemperatureComponent } from '../pages/home/widgets/temperature/temperature.component';
import { LightComponent } from '../pages/home/widgets/light/light.component';
import { SecurityCameraComponent } from '../pages/home/widgets/security-camera/security-camera.component';

@Injectable()
export class DashboardService {
  widgets = signal<Widget[]>([
    {
      id: 1,
      label: 'Subscribers',
      content: SubscribersComponent,
      rows: 1,
      columns: 1,
      backgroundColor: 'var(--mat-sys-primary)',
      color: 'white',
    },
    {
      id: 2,
      label: 'Security-camera',
      content: SecurityCameraComponent,
      rows: 1,
      columns: 1,
      backgroundColor: 'var(--mat-sys-primary)',
      color: 'white',
    },
    {
      id: 3,
      label: 'Temperature',
      content: TemperatureComponent,
      rows: 1,
      columns: 1,
      backgroundColor: 'var(--mat-sys-primary)',
      color: 'white',
    },
    {
      id: 4,
      label: 'Light',
      content: LightComponent,
      rows: 1,
      columns: 1,
      backgroundColor: 'var(--mat-sys-primary)',
      color: 'white',
    },
  ]);

  addedWidgets = signal<Widget[]>([
    /*
    {
      id: 1,
      label: 'Subscribers',
      content: SubscribersComponent,
      rows: 1,
      columns: 1,
      backgroundColor: 'var(--mat-sys-primary)',
      color: 'white',
    },
    {
      id: 2,
      label: 'Views',
      content: ViewsComponent,
      rows: 1,
      columns: 1,
      backgroundColor: 'var(--mat-sys-primary)',
      color: 'white',
    },
    {
      id: 3,
      label: 'Temperature',
      content: TemperatureComponent,
      rows: 1,
      columns: 1,
      backgroundColor: 'var(--mat-sys-primary)',
      color: 'white',
    },
    {
      id: 4,
      label: 'Light',
      content: LightComponent,
      rows: 1,
      columns: 1,
      backgroundColor: 'var(--mat-sys-primary)',
      color: 'white',
    },
    */
  ]);

  widgetsToAdd = computed(() => {
    const addedIds = this.addedWidgets().map((w) => w.id);
    return this.widgets().filter((w) => !addedIds.includes(w.id));
  });

  addWidget(w: Widget) {
    this.addedWidgets.set([...this.addedWidgets(), { ...w }]);
  }

  updateWidget(id: number, widget: Partial<Widget>) {
    console.log(widget);
    const index = this.addedWidgets().findIndex((w) => w.id === id);
    if (index !== -1) {
      const newWidgets = [...this.addedWidgets()];
      newWidgets[index] = { ...newWidgets[index], ...widget };
      this.addedWidgets.set(newWidgets);
    }
  }

  moveWidgetToRight(id: number) {
    const index = this.addedWidgets().findIndex((w) => w.id === id);
    if (index === this.addedWidgets().length - 1) {
      return;
    }
    const newWidgets = [...this.addedWidgets()];
    [newWidgets[index], newWidgets[index + 1]] = [
      { ...newWidgets[index + 1] },
      { ...newWidgets[index] },
    ];

    this.addedWidgets.set(newWidgets);
  }

  moveWidgetToLeft(id: number) {
    const index = this.addedWidgets().findIndex((w) => w.id === id);
    if (index === 0) {
      return;
    }
    const newWidgets = [...this.addedWidgets()];
    [newWidgets[index], newWidgets[index - 1]] = [
      { ...newWidgets[index - 1] },
      { ...newWidgets[index] },
    ];

    this.addedWidgets.set(newWidgets);
  }

  deleteWidget(id: number) {
    this.addedWidgets.set(this.addedWidgets().filter((w) => w.id !== id));
  }

  fetchWidgets() {
    const widgetsAsString = localStorage.getItem('dashboardWidgets');
    if (widgetsAsString) {
      const widgets = JSON.parse(widgetsAsString) as Widget[];
      widgets.forEach((widget) => {
        const content = this.widgets().find((w) => w.id === widget.id)?.content;
        if (content) {
          widget.content = content;
        }
      });

      this.addedWidgets.set(widgets);
    }
  }

  constructor() {
    this.fetchWidgets();
  }

  saveWidgets = effect(() => {
    const widgetsWithoutContent: Partial<Widget>[] = this.addedWidgets().map(
      (w) => ({ ...w })
    );
    widgetsWithoutContent.forEach((w) => delete w.content);

    localStorage.setItem(
      'dashboardWidgets',
      JSON.stringify(widgetsWithoutContent)
    );
  });
}

import { computed, effect, Injectable, signal, Type } from '@angular/core';
import { Widget } from '../models/dashboard';
import { SubscribersComponent } from '../pages/home/widgets/subscribers/subscribers.component';
import { TemperatureComponent } from '../pages/home/widgets/temperature/temperature.component';
import { LightComponent } from '../pages/home/widgets/light/light.component';
import { SecurityCameraComponent } from '../pages/home/widgets/security-camera/security-camera.component';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs/internal/Observable';
import { combineLatest, map } from 'rxjs';

@Injectable()
export class DashboardService {
  widgets = new BehaviorSubject<Widget[]>([]);

  addedWidgets = new BehaviorSubject<Widget[]>([]);

  items$: Observable<Widget[]> = this.widgets.asObservable();

  widgetsToAdd$ = combineLatest([
    this.addedWidgets.asObservable(),
    this.widgets.asObservable(),
  ]).pipe(
    map(([addedWidgets, widgets]) => {
      const addedIds = addedWidgets.map((w) => w.id);
      return widgets.filter((w) => !addedIds.includes(w.id));
    })
  );

  addWidget(w: Widget) {
    this.addedWidgets.next([...this.addedWidgets.getValue(), { ...w }]);
    this.saveWidgetsToStorage();
  }

  updateWidget(id: number, widget: Partial<Widget>) {
    console.log(widget);
    const index = this.addedWidgets.getValue().findIndex((w) => w.id === id);
    if (index !== -1) {
      const newWidgets = [...this.addedWidgets.getValue()];
      newWidgets[index] = { ...newWidgets[index], ...widget };
      this.addedWidgets.next(newWidgets);
      this.saveWidgetsToStorage();
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
    this.saveWidgetsToStorage();
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
    this.saveWidgetsToStorage();
  }

  deleteWidget(id: number) {
    this.addedWidgets.next(
      this.addedWidgets.getValue().filter((w) => w.id !== id)
    );
    this.saveWidgetsToStorage();
  }

  fetchWidgets() {
    const widgetsAsString = localStorage.getItem('dashboardWidgets');
    if (widgetsAsString) {
      const widgets = JSON.parse(widgetsAsString) as Widget[];
      widgets.forEach((widget) => {
        const contentName = widget.contentName;
        if (contentName) {
          const content = this.getComponentByName(contentName);

          if (content) {
            widget.content = content; // Visszaállítjuk a content típust
          } else {
            console.log('Nincs contentName!');
          }
        }
      });
      console.log('Betöltött widgetek:', widgets);
      this.addedWidgets.next(widgets);
      this.saveWidgetsToStorage();
    } else {
      this.addedWidgets.next([]); // Ha nincs mentett állapot, akkor üres lista!
      console.log('Nincsenek elmentett widgetek!');
      this.saveWidgetsToStorage();
    }
  }

  getComponentByName(name: string): Type<unknown> | undefined {
    switch (name) {
      case 'LightComponent':
        return LightComponent;
      case 'TemperatureComponent':
        return TemperatureComponent;
      case 'SecurityCameraComponent':
        return SecurityCameraComponent;
      case 'SubscribersComponent':
        return SubscribersComponent;
      default:
        return undefined;
    }
  }

  constructor() {
    this.fetchWidgets();
  }

  private saveWidgetsToStorage() {
    const widgetsWithContentAsString: Partial<Widget>[] = this.addedWidgets
      .getValue()
      .map((w) => {
        // Távolítsuk el a content mezőt és tároljuk el a komponens nevét stringként
        const { content, ...widgetWithoutContent } = w;
        var contentName = undefined;
        switch (content) {
          case LightComponent:
            contentName = 'LightComponent';
            break;
          case TemperatureComponent:
            contentName = 'TemperatureComponent';
            break;
          case SecurityCameraComponent:
            contentName = 'SecurityCameraComponent';
            break;
          case SubscribersComponent:
            contentName = 'SubscribersComponent';
            break;
        }
        return { ...widgetWithoutContent, contentName }; // contentName tárolása stringként
      });

    localStorage.setItem(
      'dashboardWidgets',
      JSON.stringify(widgetsWithContentAsString)
    );
  }
}

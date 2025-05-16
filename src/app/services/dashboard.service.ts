import { Injectable } from '@angular/core';
import { Widget } from '../models/widget';
import { deleteDoc, doc, Firestore, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class DashboardService {
  constructor(private firestore: Firestore) {}

  async updateWidget(widgets: Widget[], id: string, widget: Partial<Widget>) {
    const index = widgets.findIndex((w) => w.id === id);
    if (index === -1) return widgets;

    const originalWidgets = [...widgets];

    widgets[index] = { ...widgets[index], ...widget };

    try {
      await updateDoc(doc(this.firestore, 'Widget', id), widget);
      return widgets;
    } catch (error) {
      console.error('Update failed, rolling back:', error);
      return originalWidgets;
    }
  }

  async moveWidgetToRight(widgets: Widget[], id: string): Promise<Widget[]> {
    if (!widgets || !id) {
      console.warn('Invalid input for moveWidgetToRight');
      return widgets;
    }

    const index = widgets.findIndex((w) => w?.id === id);

    if (index === -1) {
      console.warn(`Widget with id ${id} not found`);
      return widgets;
    }

    if (index === widgets.length - 1) {
      return widgets;
    }

    const newWidgets = [...widgets];
    [newWidgets[index], newWidgets[index + 1]] = [
      { ...newWidgets[index + 1] },
      { ...newWidgets[index] },
    ];

    try {
      await updateDoc(doc(this.firestore, 'Widget', newWidgets[index].id), {
        orderIndex: index,
      });
      await updateDoc(doc(this.firestore, 'Widget', newWidgets[index + 1].id), {
        orderIndex: index + 1,
      });
    } catch (error) {
      console.error('Error updating widget positionin database:', error);
      throw error;
    }

    return newWidgets;
  }

  async moveWidgetToLeft(widgets: Widget[], id: string): Promise<Widget[]> {
    const index = widgets.findIndex((w) => w.id === id);
    if (index === 0) {
      return widgets;
    }
    const newWidgets = [...widgets];
    [newWidgets[index], newWidgets[index - 1]] = [
      { ...newWidgets[index - 1] },
      { ...newWidgets[index] },
    ];

    try {
      await updateDoc(doc(this.firestore, 'Widget', newWidgets[index].id), {
        orderIndex: index,
      });
      await updateDoc(doc(this.firestore, 'Widget', newWidgets[index - 1].id), {
        orderIndex: index - 1,
      });
    } catch (error) {
      console.error('Error updating widget positionin database:', error);
      throw error;
    }

    return newWidgets;
  }

  async deleteWidget(widgets: Widget[], id: string) {
    try {
      const widgetRef = doc(this.firestore, 'Widget', id);
      await deleteDoc(widgetRef);
      return widgets.filter((w) => w.id !== id);
    } catch (error) {
      console.error('Error deleting widget from Firestore:', error);
      throw error;
    }
  }
}

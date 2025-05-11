import { Injectable, inject } from '@angular/core';
import {
  Firestore,
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  orderBy,
  limit,
} from '@angular/fire/firestore';
import { AppUser } from '../models/user.model';
import { Room } from '../models/room.model';
import { Widget } from '../models/widget';
import { UserWidgetInfo } from '../models/userwidgetinfo.model';
import { UserCreatedAt } from '../models/usercreatedat.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private firestore = inject(Firestore);

  async getUserEmailsAndWidgetContents(): Promise<UserWidgetInfo[]> {
    try {
      const usersCollection = collection(this.firestore, 'AppUser');
      const usersQuery = query(
        usersCollection,
        where('role', '==', 'user'),
        where('name', '!=', ''),
        orderBy('name')
      );
      const usersSnapshot = await getDocs(usersQuery);

      const result: UserWidgetInfo[] = [];

      for (const userDoc of usersSnapshot.docs) {
        const userData = userDoc.data() as AppUser;

        const roomsCollection = collection(this.firestore, 'Room');
        // Create a query with composite index
        const roomsQuery = query(
          roomsCollection,
          where('userId', '==', userData.id),
          orderBy('name'),
          limit(100)
        );

        // This query requires a composite index in Firestore
        // You'll need to create an index on 'Room' collection with fields:
        // - userId (ascending)
        // - name (ascending)

        const roomsSnapshot = await getDocs(roomsQuery);

        const widgetContents: string[] = [];

        for (const roomDoc of roomsSnapshot.docs) {
          const roomData = roomDoc.data() as Room;

          if (roomData.devices && Array.isArray(roomData.devices)) {
            // Safely handle widgets - improved type checking
            for (const widgetId of roomData.devices) {
              if (typeof widgetId === 'string') {
                try {
                  const widgetDoc = await getDoc(
                    doc(this.firestore, 'Widget', widgetId)
                  );
                  if (widgetDoc.exists()) {
                    const widgetData = widgetDoc.data() as Widget;
                    if (widgetData.content) {
                      widgetContents.push(widgetData.content);
                    }
                  }
                } catch (error) {
                  console.error(`Error fetching widget ${widgetId}:`, error);
                }
              }
            }
          }
        }

        result.push({
          email: userData.email,
          name: userData.name,
          widgetContents: [...new Set(widgetContents)],
        });
      }

      return result;
    } catch (error) {
      console.error('Error getting user emails and widget contents:', error);
      throw error;
    }
  }

  async getSimpleUserWidgetList(): Promise<
    Array<{
      email: string;
      name: string;
      widgetTypes: string[];
    }>
  > {
    const userWidgetInfo = await this.getUserEmailsAndWidgetContents();

    return userWidgetInfo.map((user) => ({
      email: user.email,
      name: user.name,
      widgetTypes: user.widgetContents,
    }));
  }

  async getUsersCreatedAt(): Promise<UserCreatedAt[]> {
    const usersCollection = collection(this.firestore, 'AppUser');
    const usersQuery = query(
      usersCollection,
      where('role', '==', 'user'),
      where('name', '!=', ''),
      orderBy('createdAt', 'asc')
    );
    const usersSnapshot = await getDocs(usersQuery);

    const result: UserCreatedAt[] = [];

    for (const userDoc of usersSnapshot.docs) {
      const userData = userDoc.data() as UserCreatedAt;
      result.push({
        email: userData.email,
        name: userData.name,
        createdAt: userData.createdAt,
      });
    }

    return result;
  }

  async getWidgetContent(): Promise<Map<string, number>> {
    const widgetsCollection = collection(this.firestore, 'Widget');
    const widgetsQuery = query(
      widgetsCollection,
      where('color', '==', 'white'),
      where('backgroundColor', '==', 'var(--mat-sys-primary)'),
      orderBy('label')
    );
    const widgetsSnapshot = await getDocs(widgetsCollection);

    const widgetContent: string[] = [];

    for (const widgetDoc of widgetsSnapshot.docs) {
      const widgetData = widgetDoc.data() as Widget;
      widgetContent.push(widgetData.content);
    }

    const result: Map<string, number> = new Map();
    for (const widget of widgetContent) {
      result.set(widget, (result.get(widget) ?? 0) + 1);
    }

    return result;
  }
}

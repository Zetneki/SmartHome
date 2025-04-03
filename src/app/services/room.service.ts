import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Room } from '../models/room.model';
import { AuthService } from './auth.service';
import { Widget } from '../models/widget';
import { DashboardService } from './dashboard.service';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  roomsSubject = new BehaviorSubject<Room[]>([]);
  rooms$ = this.roomsSubject.asObservable();
  currentRoom = new BehaviorSubject<Room | null>(null);
  currentRoom$ = this.currentRoom.asObservable();

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService
  ) {
    // Inicializálás: Betölti a bejelentkezett felhasználó szobáit
    this.authService.getCurrentUser().subscribe((user) => {
      if (user) {
        this.roomsSubject.next(user.rooms);
      }
    });
  }

  // Új szoba hozzáadása
  addRoom(room: Room) {
    const user = this.authService.currentUserSubject.value;
    if (user) {
      user.rooms.push(room);
      this.authService.updateUser(user); // Frissíti a felhasználót az AuthService-ben
      this.roomsSubject.next(user.rooms);
    }
  }

  // Widget hozzáadása egy szobához
  addWidgetToRoom(roomId: number, widget: Widget) {
    console.log('fut a bro');
    const user = this.authService.currentUserSubject.value;
    if (user) {
      const room = user.rooms.find((r) => r.id === roomId);
      if (room) {
        room.devices.push(widget);
        this.authService.updateUser(user);
        this.roomsSubject.next(user.rooms);
      }
    }
  }

  updateWidgetInRoom(
    roomId: number,
    widgetId: number,
    updates: Partial<Widget>
  ) {
    const user = this.authService.currentUserSubject.value;
    if (user) {
      const room = user.rooms.find((r) => r.id === roomId);
      if (room) {
        room.devices = this.dashboardService.updateWidget(
          room.devices,
          widgetId,
          updates
        );
        this.authService.updateUser(user);
        this.roomsSubject.next(user.rooms);
      }
    }
  }

  moveWidgetRight(roomId: number, widgetId: number) {
    const user = this.authService.currentUserSubject.value;
    if (user) {
      const room = user.rooms.find((r) => r.id === roomId);
      if (room) {
        room.devices = this.dashboardService.moveWidgetToRight(
          room.devices,
          widgetId
        );
        this.authService.updateUser(user);
        this.roomsSubject.next(user.rooms);
      }
    }
  }

  moveWidgetLeft(roomId: number, widgetId: number) {
    const user = this.authService.currentUserSubject.value;
    if (user) {
      const room = user.rooms.find((r) => r.id === roomId);
      if (room) {
        room.devices = this.dashboardService.moveWidgetToLeft(
          room.devices,
          widgetId
        );
        this.authService.updateUser(user);
        this.roomsSubject.next(user.rooms);
      }
    }
  }

  removeWidgetFromRoom(roomId: number, widgetId: number) {
    console.log('belepett a removeba');
    const user = this.authService.currentUserSubject.value;
    if (user) {
      const room = user.rooms.find((r) => r.id === roomId);
      if (room) {
        room.devices = this.dashboardService.deleteWidget(
          room.devices,
          widgetId
        );
        console.log('lefutott a remove');
        this.authService.updateUser(user);
        this.roomsSubject.next(user.rooms);
      }
    }
  }
}

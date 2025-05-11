import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  filter,
  Subject,
  Subscription,
  take,
  takeUntil,
} from 'rxjs';
import { Room } from '../models/room.model';
import { AuthService } from './auth.service';
import { Widget } from '../models/widget';
import { DashboardService } from './dashboard.service';
import {
  addDoc,
  arrayRemove,
  arrayUnion,
  collection,
  deleteDoc,
  doc,
  Firestore,
  setDoc,
  updateDoc,
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class RoomService {
  roomsSubject = new BehaviorSubject<Room[]>([]);
  rooms$ = this.roomsSubject.asObservable();
  currentRoom = new BehaviorSubject<Room | null>(null);
  currentRoom$ = this.currentRoom.asObservable();
  widgetErrorSubject = new BehaviorSubject<string>('');
  widgetError$ = this.widgetErrorSubject.asObservable();

  private subscriptions: Subscription = new Subscription();
  private destroy$ = new Subject<void>();

  constructor(
    private authService: AuthService,
    private dashboardService: DashboardService,
    private firestore: Firestore
  ) {
    this.subscriptions.add(
      this.authService.getCurrentUser().subscribe((user) => {
        user ? this.loadRooms() : this.resetRooms();
      })
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
    this.subscriptions.unsubscribe();
  }

  selectRoom(room: Room) {
    this.currentRoom.next(room);
    sessionStorage.setItem('selectedRoomId', room.id);
  }

  loadSelectedRoom() {
    const savedRoomId = sessionStorage.getItem('selectedRoomId');
    const user = this.authService.currentUser$;

    user
      .pipe(
        filter((user) => user !== undefined),
        take(1),
        takeUntil(this.destroy$)
      )
      .subscribe((user) => {
        if (user && savedRoomId) {
          const savedRoom = user.rooms.find((room) => room.id === savedRoomId);
          if (savedRoom !== undefined) {
            this.selectRoom(savedRoom);
          }
        } else if (user && user.rooms.length > 0) {
          this.selectRoom(user.rooms[0]);
        }
      });
  }

  private loadRooms() {
    const user = this.authService.currentUserSubject.value;
    this.roomsSubject.next(user?.rooms ?? []);
  }

  // Új szoba hozzáadása
  async addRoom(room: Room) {
    const user = this.authService.currentUserSubject.value;
    if (!user) {
      console.log('nincs bejelentkezett felhasznalo');
      return;
    }

    try {
      const roomCollection = collection(this.firestore, 'Room');
      const newRoomRef = await addDoc(roomCollection, room);

      const roomRef = doc(this.firestore, 'Room', newRoomRef.id);
      await updateDoc(roomRef, {
        id: newRoomRef.id,
      });

      const userRef = doc(this.firestore, 'AppUser', user.id);
      await updateDoc(userRef, {
        rooms: arrayUnion(newRoomRef.id),
      });

      const newRoom: Room = {
        ...room,
        id: newRoomRef.id,
      };

      user.rooms.push(newRoom);
      this.authService.updateUser(user);
      this.roomsSubject.next(user.rooms);

      return newRoom;
    } catch (error) {
      console.error('Hiba a szoba hozzáadása közben:', error);
      this.widgetErrorSubject.next('Error adding room. Please try again.');
      throw error;
    }
  }

  // Widget hozzáadása egy szobához
  async addWidgetToRoom(currentRoom: Room, widget: Widget) {
    console.log('fut a bro');
    if (this.currentRoom.value?.devices) {
      for (const device of this.currentRoom.value?.devices) {
        if (
          device.label.trim() === widget.label.trim() &&
          device.content === widget.content
        ) {
          this.widgetErrorSubject.next(
            `'${widget.label}' already exists in this room`
          );
          console.log('ilyen widget mar van');
          return;
        }
      }
    }
    const user = this.authService.currentUserSubject.value;
    if (!user) {
      console.log('nincs bejelentkezett felhasznalo');
      return;
    }

    try {
      const widgetCollection = collection(this.firestore, 'Widget');

      const count = currentRoom.devices.length;

      const newWidgetRef = await addDoc(widgetCollection, {
        ...widget,
        orderIndex: count,
      });

      const widgetRef = doc(this.firestore, 'Widget', newWidgetRef.id);
      await updateDoc(widgetRef, {
        contentData: {
          ...widget.contentData,
          widgetId: newWidgetRef.id,
        },
        id: newWidgetRef.id,
      });

      const roomRef = doc(this.firestore, 'Room', currentRoom.id);
      await updateDoc(roomRef, {
        devices: arrayUnion(newWidgetRef.id),
      });

      const room = user.rooms.find((r) => r.id === currentRoom.id);
      if (room) {
        const newWidget: Widget = {
          ...widget,
          id: newWidgetRef.id,
          contentData: {
            ...widget.contentData,
            widgetId: newWidgetRef.id,
          },
        };
        room.devices.push(newWidget);
        this.authService.updateUser(user);
        this.roomsSubject.next(user.rooms);

        console.log('sikeres widget hozzaadas');
      }
    } catch (error) {
      console.error('Hiba a widget hozzáadása közben:', error);
      this.widgetErrorSubject.next('Error adding widget. Please try again.');
      throw error;
    }
  }

  async updateWidgetInRoom(
    roomId: string,
    widgetId: string,
    updates: Partial<Widget>
  ) {
    const user = this.authService.currentUserSubject.value;
    if (!user) return;

    const room = user.rooms.find((r) => r.id === roomId);
    if (!room) return;

    room.devices = await this.dashboardService.updateWidget(
      room.devices,
      widgetId,
      updates
    );

    this.authService.updateUser(user);
    this.roomsSubject.next(user.rooms);
  }

  async moveWidgetRight(roomId: string, widgetId: string) {
    const user = this.authService.currentUserSubject.value;
    if (user) {
      const room = user.rooms.find((r) => r.id === roomId);
      if (room) {
        room.devices = await this.dashboardService.moveWidgetToRight(
          room.devices,
          widgetId
        );
        this.authService.updateUser(user);
        this.roomsSubject.next(user.rooms);
      }
    }
  }

  async moveWidgetLeft(roomId: string, widgetId: string) {
    const user = this.authService.currentUserSubject.value;
    if (user) {
      const room = user.rooms.find((r) => r.id === roomId);
      if (room) {
        room.devices = await this.dashboardService.moveWidgetToLeft(
          room.devices,
          widgetId
        );
        this.authService.updateUser(user);
        this.roomsSubject.next(user.rooms);
      }
    }
  }

  async removeWidgetFromRoom(roomId: string, widgetId: string) {
    console.log('belepett a removeba');
    const user = this.authService.currentUserSubject.value;
    if (user) {
      const room = user.rooms.find((r) => r.id === roomId);
      if (room) {
        room.devices = await this.dashboardService.deleteWidget(
          room.devices,
          widgetId
        );
        if (room.devices.length === 0) {
          try {
            console.log('lefutott');
            const roomRef = doc(this.firestore, 'Room', roomId);
            await deleteDoc(roomRef);
            const userRef = doc(this.firestore, 'AppUser', user.id);
            await updateDoc(userRef, {
              rooms: arrayRemove(roomId),
            });
            user.rooms = user.rooms.filter((r) => r.id !== roomId);
            sessionStorage.removeItem('selectedRoomId');
          } catch (error) {
            console.error('Error deleting room from Firestore:', error);
            throw error;
          }
        }
        console.log('lefutott a remove');
        this.authService.updateUser(user);
        this.roomsSubject.next(user.rooms);
      }
    }
  }

  resetRooms() {
    this.roomsSubject.next([]);
    this.currentRoom.next(null);
  }
}

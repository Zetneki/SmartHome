import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { WidgetComponent } from '../../components/widget/widget.component';
import { DashboardService } from '../../services/dashboard.service';
import { MatButtonModule } from '@angular/material/button';
import { wrapGrid } from 'animate-css-grid';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddWidgetsComponent } from '../../components/add-widgets/add-widgets.component';

import { RoomService } from '../../services/room.service';
import { take } from 'rxjs';
import { Room } from '../../models/room.model';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  imports: [
    WidgetComponent,
    MatButtonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatSelectModule,
    MatDialogModule,
    RouterLink,
  ],
  providers: [DashboardService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  roomService = inject(RoomService);
  userService = inject(AuthService);

  rooms$ = this.roomService.rooms$;
  currentRoom$ = this.roomService.currentRoom$;

  dashboard = viewChild.required<ElementRef>('dashboard');

  readonly dialog = inject(MatDialog);

  ngOnInit() {
    wrapGrid(this.dashboard().nativeElement, { duration: 300 });

    console.log(this.rooms$.subscribe((r) => console.log(r)));

    this.roomService.loadSelectedRoom();

    this.rooms$.pipe(take(1)).subscribe((rooms) => {
      if (rooms.length > 0) {
        if (!this.roomService.currentRoom.value) {
          this.selectRoom(rooms[0]);
        }
      }
    });
  }

  selectRoom(room: Room) {
    this.roomService.selectRoom(room);
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddWidgetsComponent);
    const open = document.querySelector('.add-widgets') as HTMLButtonElement;
    const appRoot = document.querySelector('app-root');

    if (open) {
      open.blur();
    }

    dialogRef.afterOpened().subscribe(() => {
      if (appRoot) {
        appRoot.setAttribute('inert', '');
      }
      console.log(appRoot);
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (appRoot) {
        appRoot.removeAttribute('inert');
      }
      if (result) {
        const { widget, roomName } = result;

        const existingRoom = this.roomService.roomsSubject.value.find(
          (r) => r.name.toLowerCase() === roomName.toLowerCase()
        );

        if (existingRoom) {
          this.roomService.addWidgetToRoom(existingRoom.id, widget);
        } else {
          const roomId = Date.now();
          widget.roomId = roomId;
          const newRoom: Room = {
            id: roomId,
            name: roomName,
            devices: [widget],
          };
          this.roomService.addRoom(newRoom);
        }
      }
    });
  }
}

import {
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  viewChild,
} from '@angular/core';
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
import { filter, Subscription, take } from 'rxjs';
import { Room } from '../../models/room.model';
import { AuthService } from '../../services/auth.service';
import { RouterLink } from '@angular/router';
import { MatIcon } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatIcon,
    MatProgressSpinnerModule,
  ],
  providers: [DashboardService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements OnInit, OnDestroy {
  roomService = inject(RoomService);
  userService = inject(AuthService);

  rooms$ = this.roomService.rooms$;
  currentRoom$ = this.roomService.currentRoom$;
  widgetError = this.roomService.widgetErrorSubject;

  dashboard = viewChild.required<ElementRef>('dashboard');

  readonly dialog = inject(MatDialog);
  private dialogSubscriptions: Subscription[] = [];

  ngOnInit() {
    wrapGrid(this.dashboard().nativeElement, { duration: 300 });

    this.roomService.loadSelectedRoom();
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

    const afterOpenedSub = dialogRef.afterOpened().subscribe(() => {
      if (appRoot) {
        appRoot.setAttribute('inert', '');
      }
    });
    this.dialogSubscriptions.push(afterOpenedSub);

    const afterClosedSub = dialogRef.afterClosed().subscribe(async (result) => {
      if (appRoot) {
        appRoot.removeAttribute('inert');
      }
      if (result) {
        const { widget, roomName } = result;

        const existingRoom = this.roomService.roomsSubject.value.find(
          (r) => r.name.toLowerCase() === roomName.toLowerCase()
        );

        if (existingRoom) {
          await this.roomService.addWidgetToRoom(existingRoom, widget);
          this.selectRoom(existingRoom);
        } else {
          const roomId = 'temp-' + Date.now().toString();
          widget.roomId = roomId;
          const newRoom: Room = {
            userId: this.userService.currentUserSubject.value?.id || '',
            id: roomId,
            name: roomName,
            devices: [],
          };
          const createdRoom = await this.roomService.addRoom(newRoom);

          widget.roomId = createdRoom!.id;
          this.roomService.addWidgetToRoom(createdRoom!, widget);
          this.selectRoom(createdRoom!);
        }
      }
    });
    this.dialogSubscriptions.push(afterClosedSub);
  }

  ngOnDestroy() {
    this.dialogSubscriptions.forEach((sub) => sub.unsubscribe());
    this.dialogSubscriptions = [];
  }
}

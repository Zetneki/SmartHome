import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { RoomService } from '../../../../services/room.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-lock',
  imports: [MatIconModule, MatSlideToggleModule],
  templateUrl: './lock.component.html',
  styleUrl: './lock.component.scss',
})
export class LockComponent implements OnInit, OnDestroy {
  roomService = inject(RoomService);
  @Input() id!: string;

  isLocked = false;
  private lockSubscription!: Subscription;

  ngOnInit() {
    this.updateState();
    this.lockSubscription = this.roomService.currentRoom$.subscribe(() =>
      this.updateState()
    );
  }

  updateState() {
    const device = this.roomService.currentRoom.value?.devices.find(
      (d) => d.id === this.id
    );
    this.isLocked = device?.contentData?.switch ?? false;
  }

  toggleLock() {
    const room = this.roomService.currentRoom.value;
    if (!room) return;

    const deviceIndex = room.devices.findIndex((d) => d.id === this.id);
    if (deviceIndex === -1) return;

    const newState = !this.isLocked;

    this.roomService.updateWidgetInRoom(room.id, this.id, {
      contentData: {
        ...room.devices[deviceIndex].contentData,
        switch: newState,
      },
    });

    this.isLocked = newState;
  }

  get icon(): string {
    return this.isLocked ? 'lock' : 'lock_open';
  }

  ngOnDestroy() {
    if (this.lockSubscription) {
      this.lockSubscription.unsubscribe();
    }
  }
}

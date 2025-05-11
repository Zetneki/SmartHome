import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RoomService } from '../../../../services/room.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-security-camera',
  imports: [MatIcon],
  templateUrl: './security-camera.component.html',
  styleUrl: './security-camera.component.scss',
})
export class SecurityCameraComponent implements OnInit, OnDestroy {
  roomService = inject(RoomService);
  @Input() id!: string;

  isOn = false;
  private securityCameraSubscription!: Subscription;

  ngOnInit() {
    this.updateState();

    this.securityCameraSubscription = this.roomService.currentRoom$.subscribe(
      () => {
        this.updateState();
      }
    );
  }

  private updateState() {
    const device = this.roomService.currentRoom.value?.devices.find(
      (d) => d.id === this.id
    );
    this.isOn = device?.contentData?.switch ?? false;
  }

  toggleCamera() {
    const room = this.roomService.currentRoom.value;
    if (!room) return;

    const deviceIndex = room.devices.findIndex((d) => d.id === this.id);
    if (deviceIndex === -1) return;

    const newState = !room.devices[deviceIndex].contentData?.switch;

    this.roomService.updateWidgetInRoom(room.id, this.id, {
      contentData: {
        ...room.devices[deviceIndex].contentData,
        switch: newState,
      },
    });

    this.isOn = newState;
  }

  ngOnDestroy() {
    if (this.securityCameraSubscription) {
      this.securityCameraSubscription.unsubscribe();
    }
  }
}

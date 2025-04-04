import { Component, inject, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RoomService } from '../../../../services/room.service';

@Component({
  selector: 'app-security-camera',
  imports: [MatIcon],
  templateUrl: './security-camera.component.html',
  styleUrl: './security-camera.component.scss',
})
export class SecurityCameraComponent {
  roomService = inject(RoomService);
  @Input() id!: number;

  isOn = false;

  ngOnInit() {
    this.updateState();

    this.roomService.currentRoom$.subscribe(() => {
      this.updateState();
    });
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
}

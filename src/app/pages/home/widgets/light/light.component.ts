import { Component, inject, Input, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { RoomService } from '../../../../services/room.service';

@Component({
  selector: 'app-light',
  standalone: true,
  imports: [MatIcon, CommonModule],
  templateUrl: './light.component.html',
  styleUrls: ['./light.component.scss'],
})
export class LightComponent implements OnInit {
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

  toggleLight() {
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

  get brightness(): number {
    return this.isOn ? 100 : 0;
  }
}

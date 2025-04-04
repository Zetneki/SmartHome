import { Component, inject, Input } from '@angular/core';
import { RoomService } from '../../../../services/room.service';

@Component({
  selector: 'app-temperature',
  imports: [],
  templateUrl: './temperature.component.html',
  styleUrl: './temperature.component.scss',
})
export class TemperatureComponent {
  roomService = inject(RoomService);
  @Input() id!: number;

  temperature = 20;

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
    this.temperature = device?.contentData?.numberValue ?? 20;
  }

  adjustTemp(change: number) {
    const room = this.roomService.currentRoom.value;
    if (!room) return;

    const deviceIndex = room.devices.findIndex((d) => d.id === this.id);
    if (deviceIndex === -1) return;

    const currentValue =
      room.devices[deviceIndex].contentData?.numberValue ?? this.temperature;
    const newState = currentValue + change;

    this.roomService.updateWidgetInRoom(room.id, this.id, {
      contentData: {
        ...room.devices[deviceIndex].contentData,
        numberValue: newState,
      },
    });

    this.temperature = newState;
  }
}

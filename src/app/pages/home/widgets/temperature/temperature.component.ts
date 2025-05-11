import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { RoomService } from '../../../../services/room.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-temperature',
  imports: [],
  templateUrl: './temperature.component.html',
  styleUrl: './temperature.component.scss',
})
export class TemperatureComponent implements OnInit, OnDestroy {
  roomService = inject(RoomService);
  @Input() id!: string;

  temperature = 20;
  private temperatureSubscription!: Subscription;

  ngOnInit() {
    this.updateState();

    this.temperatureSubscription = this.roomService.currentRoom$.subscribe(
      () => {
        this.updateState();
      }
    );
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

  ngOnDestroy() {
    if (this.temperatureSubscription) {
      this.temperatureSubscription.unsubscribe();
    }
  }
}

import { Component, inject, Input } from '@angular/core';
import { RoomService } from '../../../../services/room.service';
import { MatSliderModule } from '@angular/material/slider';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-roller-shutter',
  imports: [MatSliderModule, MatIconModule],
  templateUrl: './roller-shutter.component.html',
  styleUrl: './roller-shutter.component.scss',
})
export class RollerShutterComponent {
  roomService = inject(RoomService);
  @Input() id!: number;

  sliderValue = 0;

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
    this.sliderValue = device?.contentData?.percentage ?? 0;
  }

  get statusText(): string {
    if (this.sliderValue === 0) return 'Opened';
    if (this.sliderValue === 100) return 'Closed';
    return `${this.sliderValue}%`;
  }

  onValueChange(newValue: number) {
    this.sliderValue = newValue;
    this.saveToService();
  }

  saveToService() {
    const room = this.roomService.currentRoom.value;
    if (!room) return;

    const deviceIndex = room.devices.findIndex((d) => d.id === this.id);
    if (deviceIndex === -1) return;

    this.roomService.updateWidgetInRoom(room.id, this.id, {
      contentData: {
        ...room.devices[deviceIndex].contentData,
        percentage: this.sliderValue,
      },
    });
  }
}

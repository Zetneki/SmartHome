import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { MatSliderModule } from '@angular/material/slider';
import { RoomService } from '../../../../services/room.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-light',
  standalone: true,
  imports: [MatIcon, MatSliderModule],
  templateUrl: './light.component.html',
  styleUrls: ['./light.component.scss'],
})
export class LightComponent implements OnInit, OnDestroy {
  roomService = inject(RoomService);
  @Input() id!: string;

  isOn = false;
  brightness = 0;
  private lightSubscription!: Subscription;

  ngOnInit() {
    this.updateState();
    this.lightSubscription = this.roomService.currentRoom$.subscribe(() =>
      this.updateState()
    );
  }

  private updateState() {
    const device = this.roomService.currentRoom.value?.devices.find(
      (d) => d.id === this.id
    );
    this.isOn = device?.contentData?.switch ?? false;
    this.brightness = device?.contentData?.percentage ?? (this.isOn ? 80 : 0);
  }

  toggleLight() {
    this.isOn = !this.isOn;
    this.brightness = this.isOn ? 100 : 0;
    this.saveState();
  }

  updateBrightness(value: number) {
    this.brightness = value;
    this.isOn = value > 0;
    this.saveState();
  }

  private saveState() {
    const room = this.roomService.currentRoom.value;
    if (!room) return;

    const deviceIndex = room.devices.findIndex((d) => d.id === this.id);
    if (deviceIndex === -1) return;

    this.roomService.updateWidgetInRoom(room.id, this.id, {
      contentData: {
        ...room.devices[deviceIndex].contentData,
        switch: this.isOn,
        percentage: this.brightness,
      },
    });
  }

  get brightnessLabel(): string {
    if (!this.isOn) return 'Off';
    if (this.brightness < 30) return 'Low';
    if (this.brightness < 70) return 'Medium';
    if (this.brightness < 100) return 'High';
    return 'On';
  }

  ngOnDestroy() {
    if (this.lightSubscription) {
      this.lightSubscription.unsubscribe();
    }
  }
}

import { Component, inject, Input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RoomService } from '../../../../services/room.service';

@Component({
  selector: 'app-energy',
  imports: [MatIcon],
  templateUrl: './energy.component.html',
  styleUrl: './energy.component.scss',
})
export class EnergyComponent {
  roomService = inject(RoomService);
  @Input() id!: number;

  currentPower: number = 0;
  dailyCost: number = 0;

  ngOnInit() {
    this.updateState();

    this.roomService.currentRoom$.subscribe(() => {
      this.updateState();
    });
    this.simulateRealTimeData();
  }

  private updateState() {
    const device = this.roomService.currentRoom.value?.devices.find(
      (d) => d.id === this.id
    );
    if (device?.contentData) {
      this.currentPower = device.contentData.numberValue || 0;
      this.dailyCost = this.calculateCost(this.currentPower);
    } else {
      this.generateInitialData();
    }
  }

  generateInitialData() {
    this.currentPower = Math.floor(Math.random() * 1000);
    this.dailyCost = this.calculateCost(this.currentPower);
    this.saveToService();
  }

  calculateCost(power: number) {
    return Math.round(power * 0.5);
  }

  saveToService() {
    const room = this.roomService.currentRoom.value;
    if (!room) return;

    const deviceIndex = room.devices.findIndex((d) => d.id === this.id);
    if (deviceIndex === -1) return;

    this.roomService.updateWidgetInRoom(room.id, this.id, {
      contentData: {
        ...room.devices[deviceIndex].contentData,
        numberValue: this.currentPower,
        text: `${this.dailyCost} Ft/day`,
      },
    });
  }

  simulateRealTimeData() {
    setInterval(() => {
      const fluctuation = Math.floor(Math.random() * 100) - 50;
      this.currentPower = Math.max(0, this.currentPower + fluctuation);
      this.dailyCost = this.calculateCost(this.currentPower);
      this.saveToService();
    }, 5000);
  }
}

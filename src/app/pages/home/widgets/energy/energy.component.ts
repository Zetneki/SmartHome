import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { RoomService } from '../../../../services/room.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-energy',
  imports: [MatIcon],
  templateUrl: './energy.component.html',
  styleUrl: './energy.component.scss',
})
export class EnergyComponent implements OnInit, OnDestroy {
  roomService = inject(RoomService);
  @Input() id!: string;

  currentPower: number = 0;
  dailyCost: number = 0;

  private energySubscription!: Subscription;
  private dataInterval!: any;

  ngOnInit() {
    this.updateState();

    this.energySubscription = this.roomService.currentRoom$.subscribe(() => {
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
        text: `${this.dailyCost}`,
      },
    });
  }

  simulateRealTimeData() {
    this.dataInterval = setInterval(() => {
      const fluctuation = Math.floor(Math.random() * 100) - 50;
      this.currentPower = Math.max(0, this.currentPower + fluctuation);
      this.dailyCost = this.calculateCost(this.currentPower);
      this.saveToService();
    }, 5000);
  }

  ngOnDestroy() {
    if (this.energySubscription) {
      this.energySubscription.unsubscribe();
    }

    if (this.dataInterval) {
      clearInterval(this.dataInterval);
    }
  }
}

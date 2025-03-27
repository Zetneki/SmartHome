import { Component } from '@angular/core';

@Component({
  selector: 'app-temperature',
  imports: [],
  templateUrl: './temperature.component.html',
  styleUrl: './temperature.component.scss',
})
export class TemperatureComponent {
  title = 'Room Temperature';
  temperature = 22;

  adjustTemp(change: number) {
    this.temperature += change;
  }
}

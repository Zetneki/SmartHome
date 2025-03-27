import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-light',
  imports: [MatIcon],
  templateUrl: './light.component.html',
  styleUrl: './light.component.scss',
})
export class LightComponent {
  title = 'Smart Light';
  isOn = false;
  brightness = 50;

  toggleLight() {
    this.isOn = !this.isOn;
    if (this.brightness == 0) {
      this.brightness = 100;
    } else {
      this.brightness = 0;
    }
  }

  constructor() {}
}

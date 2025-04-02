// light.component.ts
import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-light',
  standalone: true,
  imports: [MatIcon, CommonModule],
  templateUrl: './light.component.html',
  styleUrls: ['./light.component.scss'],
})
export class LightComponent {
  isOn = false;
  brightness = 50;

  toggleLight() {
    this.isOn = !this.isOn;
    this.brightness = this.isOn ? 100 : 0;
  }
}

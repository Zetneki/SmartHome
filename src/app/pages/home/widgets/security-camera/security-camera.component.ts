import { Component } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-security-camera',
  imports: [MatIcon],
  templateUrl: './security-camera.component.html',
  styleUrl: './security-camera.component.scss',
})
export class SecurityCameraComponent {
  isOn = false;

  toggleCamera() {
    this.isOn = !this.isOn;
  }
}

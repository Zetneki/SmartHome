import {
  Component,
  input,
  HostListener,
  OnInit,
  inject,
  model,
} from '@angular/core';
import { Widget } from '../../models/widget';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { WidgetOptionsComponent } from './widget-options/widget-options.component';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { RoomService } from '../../services/room.service';
import { LightComponent } from '../../pages/home/widgets/light/light.component';
import { SecurityCameraComponent } from '../../pages/home/widgets/security-camera/security-camera.component';
import { TemperatureComponent } from '../../pages/home/widgets/temperature/temperature.component';
import { EnergyComponent } from '../../pages/home/widgets/energy/energy.component';
import { RollerShutterComponent } from '../../pages/home/widgets/roller-shutter/roller-shutter.component';
import { LockComponent } from '../../pages/home/widgets/lock/lock.component';

@Component({
  selector: 'app-widget',
  imports: [
    MatButtonModule,
    MatIcon,
    WidgetOptionsComponent,
    TruncatePipe,
    LightComponent,
    SecurityCameraComponent,
    TemperatureComponent,
    EnergyComponent,
    RollerShutterComponent,
    LockComponent,
  ],
  templateUrl: './widget.component.html',
  styleUrl: './widget.component.scss',
  host: {
    '[style.grid-area]':
      '"span " + (data().rows ?? 1) + "/ span " + (data().columns ?? 1)',
  },
})
export class WidgetComponent implements OnInit {
  data = input.required<Widget>();

  showOptions = model(false);

  store = inject(RoomService);

  LightComponent = LightComponent;
  SecurityCameraComponent = SecurityCameraComponent;
  TemperatureComponent = TemperatureComponent;
  EnergyComponent = EnergyComponent;
  RollerShutterComponent = RollerShutterComponent;
  LockComponent = LockComponent;

  ngOnInit() {
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if (
      window.innerWidth < 660 &&
      (this.data().columns !== 1 || this.data().rows !== 1)
    ) {
      this.store.updateWidgetInRoom(this.data().roomId, this.data().id, {
        columns: 1,
      });
      this.store.updateWidgetInRoom(this.data().roomId, this.data().id, {
        rows: 1,
      });
    }
  }

  onDataChange(update: Partial<Widget>) {
    this.store.updateWidgetInRoom(this.data().roomId, this.data().id, update);
  }
}

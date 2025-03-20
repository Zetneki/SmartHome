import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NewDeviceComponent } from './pages/new-device/new-device.component';

export const routes: Routes = [
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'new-device',
    component: NewDeviceComponent,
  },
];

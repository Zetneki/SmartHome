import { Component, ElementRef, inject, Type, viewChild } from '@angular/core';
import { WidgetComponent } from '../../components/widget/widget.component';
import { DashboardService } from '../../services/dashboard.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { wrapGrid } from 'animate-css-grid';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Widget } from '../../models/dashboard';
import { LightComponent } from './widgets/light/light.component';
import { TemperatureComponent } from './widgets/temperature/temperature.component';
import { SecurityCameraComponent } from './widgets/security-camera/security-camera.component';
import { SubscribersComponent } from './widgets/subscribers/subscribers.component';

@Component({
  selector: 'app-home',
  imports: [
    WidgetComponent,
    MatButtonModule,
    MatIcon,
    MatMenuModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatSelectModule,
  ],
  providers: [DashboardService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  store = inject(DashboardService);

  dashboard = viewChild.required<ElementRef>('dashboard');

  ngOnInit() {
    wrapGrid(this.dashboard().nativeElement, { duration: 300 });
  }

  id_value = Date.now();
  value = '';
  selectedWidget: Type<unknown> = LightComponent;

  widgets = [
    { value: LightComponent, viewValue: 'Light' },
    { value: TemperatureComponent, viewValue: 'Temperature' },
    { value: SecurityCameraComponent, viewValue: 'SecurityCamera' },
    { value: SubscribersComponent, viewValue: 'Subscribers' },
  ];

  newWidget() {
    this.id_value = Date.now();

    this.store.addWidget({
      id: this.id_value,
      label: this.value,
      content: this.selectedWidget,
      rows: 1,
      columns: 1,
      backgroundColor: 'var(--mat-sys-primary)',
      color: 'white',
    });
  }
}

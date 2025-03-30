import { Component, ElementRef, inject, Type, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { LightComponent } from '../widgets/light/light.component';
import { TemperatureComponent } from '../widgets/temperature/temperature.component';
import { SecurityCameraComponent } from '../widgets/security-camera/security-camera.component';
import { SubscribersComponent } from '../widgets/subscribers/subscribers.component';
import { DashboardService } from '../../../services/dashboard.service';
import { Widget } from '../../../models/dashboard';

@Component({
  selector: 'app-add-widgets',
  imports: [
    MatButtonModule,
    MatMenuModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    CommonModule,
    MatSelectModule,
    MatDialogModule,
    MatLabel,
  ],
  templateUrl: './add-widgets.component.html',
  styleUrl: './add-widgets.component.scss',
})
export class AddWidgetsComponent {
  store = inject(DashboardService);
  readonly dialogRef = inject(MatDialogRef<AddWidgetsComponent>);

  dashboard = viewChild.required<ElementRef>('dashboard');

  id_value = Date.now();
  value = '';
  selectedWidget: Type<unknown> = LightComponent;

  readonly dialog = inject(MatDialog);

  constructor() {}

  widgets = [
    { value: LightComponent, viewValue: 'Light' },
    { value: TemperatureComponent, viewValue: 'Temperature' },
    { value: SecurityCameraComponent, viewValue: 'SecurityCamera' },
    { value: SubscribersComponent, viewValue: 'Subscribers' },
  ];

  newWidget() {
    this.id_value = Date.now();

    this.dialogRef.close({
      id: this.id_value,
      label: this.value,
      content: this.selectedWidget,
      rows: 1,
      columns: 1,
      backgroundColor: 'var(--mat-sys-primary)',
      color: 'white',
    } as Widget);
  }

  onNoClick() {
    this.dialogRef.close(false);
  }
}

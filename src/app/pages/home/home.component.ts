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
import { LightComponent } from './widgets/light/light.component';
import { TemperatureComponent } from './widgets/temperature/temperature.component';
import { SecurityCameraComponent } from './widgets/security-camera/security-camera.component';
import { SubscribersComponent } from './widgets/subscribers/subscribers.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddWidgetsComponent } from './add-widgets/add-widgets.component';
import { Observable } from 'rxjs';
import { Widget } from '../../models/dashboard';

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
    MatDialogModule,
  ],
  providers: [DashboardService],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  store = inject(DashboardService);

  dashboard = viewChild.required<ElementRef>('dashboard');

  id_value = Date.now();
  value = '';
  selectedWidget: Type<unknown> = LightComponent;

  readonly dialog = inject(MatDialog);

  ngOnInit() {
    wrapGrid(this.dashboard().nativeElement, { duration: 300 });
  }

  openDialog() {
    const dialogRef = this.dialog.open(AddWidgetsComponent);
    setTimeout(() => {
      const appRoot = document.querySelector('app-root');
      if (appRoot) {
        appRoot.setAttribute('inert', '');
        appRoot.removeAttribute('aria-hidden');
      }
    }, 100);

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (result) {
        this.store.addWidget(result);
      }
      const appRoot = document.querySelector('app-root');
      if (appRoot) {
        appRoot.removeAttribute('inert');
      }
    });
  }
}

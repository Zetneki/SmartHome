import { Component, ElementRef, inject, Type, viewChild } from '@angular/core';
import { WidgetComponent } from '../../components/widget/widget.component';
import { DashboardService } from '../../services/dashboard.service';
import { MatButtonModule } from '@angular/material/button';
import { wrapGrid } from 'animate-css-grid';
import { MatInputModule } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LightComponent } from './widgets/light/light.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddWidgetsComponent } from '../../components/add-widgets/add-widgets.component';

@Component({
  selector: 'app-home',
  imports: [
    WidgetComponent,
    MatButtonModule,
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
    const nyitoGomb = document.querySelector(
      '.add-widgets'
    ) as HTMLButtonElement;
    const appRoot = document.querySelector('app-root');

    // Fókusz eltávolítása a nyitó gombról
    if (nyitoGomb) {
      nyitoGomb.blur();
    }

    dialogRef.afterOpened().subscribe(() => {
      if (appRoot) {
        appRoot.setAttribute('inert', '');
      }
      console.log(appRoot);
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('The dialog was closed');
      if (appRoot) {
        appRoot.removeAttribute('inert');
      }
      if (result) {
        this.store.addWidget(result);
      }
    });
  }
}

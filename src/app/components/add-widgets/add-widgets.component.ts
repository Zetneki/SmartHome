import { Component, ElementRef, inject, viewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule, MatLabel } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { LightComponent } from '../../pages/home/widgets/light/light.component';
import { TemperatureComponent } from '../../pages/home/widgets/temperature/temperature.component';
import { SecurityCameraComponent } from '../../pages/home/widgets/security-camera/security-camera.component';
import { Widget } from '../../models/widget';
import { RoomService } from '../../services/room.service';
import { AuthService } from '../../services/auth.service';
import { map, Observable, startWith, switchMap } from 'rxjs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Room } from '../../models/room.model';
import { EnergyComponent } from '../../pages/home/widgets/energy/energy.component';
import { RollerShutterComponent } from '../../pages/home/widgets/roller-shutter/roller-shutter.component';
import { LockComponent } from '../../pages/home/widgets/lock/lock.component';

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
    MatAutocompleteModule,
    ReactiveFormsModule,
  ],
  templateUrl: './add-widgets.component.html',
  styleUrl: './add-widgets.component.scss',
})
export class AddWidgetsComponent {
  roomService = inject(RoomService);
  authService = inject(AuthService);

  selectedRoomId: string = '';

  rooms = this.roomService.roomsSubject;
  currentUser$ = this.authService.currentUser$;

  widgetForm: FormGroup;
  filteredRooms$: Observable<Room[]>;

  private manualSelection = false;

  constructor(private fb: FormBuilder) {
    this.widgetForm = this.fb.group({
      name: ['', Validators.required],
      widgetType: [LightComponent, Validators.required],
      roomName: ['', Validators.required],
    });

    this.filteredRooms$ = this.widgetForm.get('roomName')!.valueChanges.pipe(
      startWith(''),
      switchMap((value) =>
        this.roomService.rooms$.pipe(
          map((rooms) => {
            const filtered = rooms.filter((room) =>
              room.name.toLowerCase().includes((value || '').toLowerCase())
            );

            if (filtered.length === 1 && !this.manualSelection) {
              this.selectedRoomId = filtered[0].id;
            }
            return filtered;
          })
        )
      )
    );
  }

  readonly dialogRef = inject(MatDialogRef<AddWidgetsComponent>);

  dashboard = viewChild.required<ElementRef>('dashboard');

  id_value = Date.now().toString();

  widgets = [
    { value: LightComponent, viewValue: ['Light', 'LightComponent'] },
    {
      value: TemperatureComponent,
      viewValue: ['Temperature', 'TemperatureComponent'],
    },
    {
      value: SecurityCameraComponent,
      viewValue: ['Security Camera', 'SecurityCameraComponent'],
    },
    { value: EnergyComponent, viewValue: ['Energy', 'EnergyComponent'] },
    {
      value: RollerShutterComponent,
      viewValue: ['Roller Shutter', 'RollerShutterComponent'],
    },
    { value: LockComponent, viewValue: ['Lock', 'LockComponent'] },
  ];

  getControl(controlName: string) {
    return this.widgetForm.get(controlName);
  }

  selectRoom(room: Room) {
    this.selectedRoomId = room.id;
    this.manualSelection = true;
    this.widgetForm.patchValue({
      roomName: room.name,
    });
  }

  widgetContent = [
    {
      value: LightComponent,
      defaultContent: (id: string) => ({
        widgetId: id,
        switch: false,
        percentage: 0,
      }),
    },
    {
      value: TemperatureComponent,
      defaultContent: (id: string) => ({
        widgetId: id,
        numberValue: 20,
      }),
    },
    {
      value: SecurityCameraComponent,
      defaultContent: (id: string) => ({
        widgetId: id,
        switch: false,
      }),
    },
    {
      value: EnergyComponent,
      defaultContent: (id: string) => ({
        widgetId: id,
        numberValue: 20,
        text: '0',
      }),
    },
    {
      value: RollerShutterComponent,
      defaultContent: (id: string) => ({
        widgetId: id,
        percentage: 0,
      }),
    },
    {
      value: LockComponent,
      defaultContent: (id: string) => ({
        widgetId: id,
        switch: false,
      }),
    },
  ];

  newWidget() {
    if (this.widgetForm.valid) {
      const formValue = this.widgetForm.value;
      const tempId = 'temp-' + Date.now().toString();

      const widgetContent = this.widgets.find(
        (w) => w.value === formValue.widgetType
      );

      const widgetConfig = this.widgetContent.find(
        (w) => w.value === formValue.widgetType
      );

      const currentWidget: Widget = {
        id: tempId,
        roomId: this.selectedRoomId,
        label: formValue.name,
        content: widgetContent!.viewValue[1],
        contentData: widgetConfig!.defaultContent(tempId),
        rows: 1,
        columns: 1,
        backgroundColor: 'var(--mat-sys-primary)',
        color: 'white',
      };

      this.dialogRef.close({
        widget: currentWidget,
        roomName: formValue.roomName.trim(),
      });
    }
  }

  onNoClick() {
    this.dialogRef.close(false);
  }
}

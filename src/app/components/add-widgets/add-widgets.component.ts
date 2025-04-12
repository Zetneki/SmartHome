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

  selectedRoomId: number = 0;

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

            // Automatikus választás csak ha nem volt kézi választás
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

  id_value = Date.now();

  widgets = [
    { value: LightComponent, viewValue: 'Light' },
    { value: TemperatureComponent, viewValue: 'Temperature' },
    { value: SecurityCameraComponent, viewValue: 'SecurityCamera' },
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
      defaultContent: (id: number) => ({
        widgetId: id,
        text: 'Brightness',
        switch: false,
      }),
    },
    {
      value: TemperatureComponent,
      defaultContent: (id: number) => ({
        widgetId: id,
        numberValue: 20,
      }),
    },
    {
      value: SecurityCameraComponent,
      defaultContent: (id: number) => ({
        widgetId: id,
        switch: false,
      }),
    },
  ];

  getDefaultWidgetConfig() {
    return {
      value: LightComponent,
      defaultContent: (id: number) => ({
        widgetId: id,
        text: 'Brightness',
        switch: false,
      }),
    };
  }

  newWidget() {
    if (this.widgetForm.valid) {
      this.id_value = Date.now();
      const formValue = this.widgetForm.value;

      const widgetConfig =
        this.widgetContent.find((w) => w.value === formValue.value) ||
        this.getDefaultWidgetConfig();

      const currentWidget: Widget = {
        id: this.id_value,
        roomId: this.selectedRoomId,
        label: formValue.name,
        content: formValue.widgetType,
        contentData: widgetConfig.defaultContent(this.id_value),
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

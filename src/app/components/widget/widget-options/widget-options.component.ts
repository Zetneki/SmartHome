import {
  Component,
  EventEmitter,
  inject,
  Input,
  input,
  model,
  Output,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { DashboardService } from '../../../services/dashboard.service';
import { Widget } from '../../../models/widget';

@Component({
  selector: 'app-widget-options',
  imports: [MatButtonModule, MatIcon, MatButtonToggleModule],
  templateUrl: './widget-options.component.html',
  styleUrl: './widget-options.component.scss',
})
export class WidgetOptionsComponent {
  @Input({ required: true }) data!: Widget;
  @Input() showOptions = false;
  @Output() showOptionsChange = new EventEmitter<boolean>();
  @Output() dataChange = new EventEmitter<Partial<Widget>>();
  @Output() moveRight = new EventEmitter<void>();
  @Output() moveLeft = new EventEmitter<void>();
  @Output() delete = new EventEmitter<void>();

  store = inject(DashboardService);

  updateData(update: Partial<Widget>) {
    this.dataChange.emit(update);
  }

  close() {
    this.showOptions = false;
    this.showOptionsChange.emit(this.showOptions);
  }
}

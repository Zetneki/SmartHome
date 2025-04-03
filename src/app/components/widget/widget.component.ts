import {
  Component,
  input,
  signal,
  HostListener,
  OnInit,
  inject,
  model,
} from '@angular/core';
import { Widget } from '../../models/widget';
import { NgComponentOutlet } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { WidgetOptionsComponent } from './widget-options/widget-options.component';
import { DashboardService } from '../../services/dashboard.service';
import { TruncatePipe } from '../../pipes/truncate.pipe';
import { RoomService } from '../../services/room.service';

@Component({
  selector: 'app-widget',
  imports: [
    NgComponentOutlet,
    MatButtonModule,
    MatIcon,
    WidgetOptionsComponent,
    TruncatePipe,
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

  ngOnInit() {
    console.log('Window width:', window.innerWidth);
    //this.checkScreenSize(); // Induláskor ellenőrizzük a méretet
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize() {
    if (
      (window.innerWidth < 660 && this.data().columns !== 1) ||
      this.data().rows !== 1
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

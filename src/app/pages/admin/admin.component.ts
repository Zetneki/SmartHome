import { Component, OnInit } from '@angular/core';
import { AdminService } from '../../services/admin.service';
import { KeyValuePipe, NgFor, NgIf } from '@angular/common';
import { CreatedAtDatePipe } from '../../pipes/created-at-date.pipe';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-admin',
  imports: [
    NgIf,
    NgFor,
    CreatedAtDatePipe,
    KeyValuePipe,
    MatProgressSpinnerModule,
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent implements OnInit {
  userWidgets: any[] = [];
  usersCreatedAt: any[] = [];
  widgetContent: Map<string, number> = new Map();
  loadingWidgets = false;
  loadingCreatedAt = false;
  loadingContent = false;

  constructor(private AdminService: AdminService) {}

  ngOnInit() {
    this.loadUserWidgetData();
    this.loadUsersCreatedAt();
    this.loadWidgetContent();
  }

  async loadUserWidgetData() {
    this.loadingWidgets = true;
    try {
      this.userWidgets = await this.AdminService.getSimpleUserWidgetList();
    } catch (err) {
      console.error(err);
    } finally {
      this.loadingWidgets = false;
    }
  }

  async loadUsersCreatedAt() {
    this.loadingCreatedAt = true;
    try {
      this.usersCreatedAt = await this.AdminService.getUsersCreatedAt();
    } catch (err) {
      console.error(err);
    } finally {
      this.loadingCreatedAt = false;
    }
  }

  async loadWidgetContent() {
    this.loadingContent = true;
    try {
      this.widgetContent = await this.AdminService.getWidgetContent();
    } catch (err) {
      console.error(err);
    } finally {
      this.loadingContent = false;
    }
  }
}

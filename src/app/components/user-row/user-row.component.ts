import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe, TitleCasePipe, NgClass } from '@angular/common';
import { AvatarComponent } from '../avatar/avatar.component';
import type { User } from '../../models/user.model';

@Component({
  selector: 'app-user-row',
  standalone: true,
  imports: [AvatarComponent, DatePipe, TitleCasePipe, NgClass],
  templateUrl: './user-row.component.html',
  styleUrls: ['./user-row.component.css']
})
export class UserRowComponent {
  @Input() user!: User;
  @Input() currentUserId: string = '';
  @Output() delete = new EventEmitter<string>();

  get isAdmin(): boolean {
    return this.user.id === 'admin' || this.user.username === 'admin';
  }

  get isSelf(): boolean {
    return this.user.id === this.currentUserId;
  }

  get isDeleteDisabled(): boolean {
    return this.isAdmin || this.isSelf;
  }

  onDelete(): void {
    if (!this.isDeleteDisabled) {
      this.delete.emit(this.user.id);
    }
  }
}
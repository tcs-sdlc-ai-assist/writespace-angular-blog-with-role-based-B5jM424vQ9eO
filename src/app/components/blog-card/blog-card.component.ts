import { Component, Input, Output, EventEmitter } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Post } from '../../models/post.model';
import { AvatarComponent } from '../avatar/avatar.component';

@Component({
  selector: 'app-blog-card',
  standalone: true,
  imports: [DatePipe, AvatarComponent],
  templateUrl: './blog-card.component.html',
  styleUrls: ['./blog-card.component.css']
})
export class BlogCardComponent {
  @Input() post!: Post;
  @Input() isOwner: boolean = false;
  @Input() accentIndex: number = 0;

  @Output() edit = new EventEmitter<string>();
  @Output() delete = new EventEmitter<string>();
  @Output() cardClick = new EventEmitter<string>();

  get accentClass(): string {
    const index = this.accentIndex % 6;
    return 'accent-' + index;
  }

  get excerpt(): string {
    if (!this.post || !this.post.content) {
      return '';
    }
    if (this.post.content.length > 150) {
      return this.post.content.slice(0, 150) + '...';
    }
    return this.post.content;
  }

  get authorInitial(): string {
    if (!this.post || !this.post.authorName) {
      return '?';
    }
    return this.post.authorName.charAt(0).toUpperCase();
  }

  onCardClick(): void {
    this.cardClick.emit(this.post.id);
  }

  onEdit(event: Event): void {
    event.stopPropagation();
    this.edit.emit(this.post.id);
  }

  onDelete(event: Event): void {
    event.stopPropagation();
    this.delete.emit(this.post.id);
  }
}
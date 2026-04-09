import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { AvatarComponent } from '../../components/avatar/avatar.component';
import type { Post } from '../../models/post.model';
import type { Session } from '../../models/session.model';

@Component({
  selector: 'app-read-blog',
  standalone: true,
  imports: [NavbarComponent, AvatarComponent, DatePipe, RouterLink],
  templateUrl: './read-blog.component.html',
  styleUrls: ['./read-blog.component.css']
})
export class ReadBlogComponent implements OnInit {
  post: Post | null = null;
  errorMessage: string = '';
  isOwner: boolean = false;
  isAdmin: boolean = false;
  showDeleteConfirm: boolean = false;

  private session: Session | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.session = this.authService.getSession();
    this.isAdmin = this.authService.isAdmin();

    const postId = this.route.snapshot.paramMap.get('id');

    if (!postId) {
      this.errorMessage = 'Invalid post ID. The post you are looking for does not exist.';
      return;
    }

    this.loadPost(postId);
  }

  loadPost(postId: string): void {
    this.errorMessage = '';
    this.post = null;

    try {
      const posts = this.storageService.getPosts();
      const found = posts.find(p => p.id === postId);

      if (!found) {
        this.errorMessage = 'Post not found. It may have been deleted or the link is incorrect.';
        return;
      }

      this.post = found;
      this.isOwner = this.session !== null && this.post.authorId === this.session.userId;
    } catch {
      this.errorMessage = 'An error occurred while loading the post. Please try again.';
    }
  }

  get canEditOrDelete(): boolean {
    return this.isAdmin || this.isOwner;
  }

  get authorInitial(): string {
    if (!this.post || !this.post.authorName) {
      return '?';
    }
    return this.post.authorName.charAt(0).toUpperCase();
  }

  onEdit(): void {
    if (this.post && this.canEditOrDelete) {
      this.router.navigate(['/write', this.post.id]);
    }
  }

  onDeleteRequest(): void {
    this.showDeleteConfirm = true;
  }

  onDeleteCancel(): void {
    this.showDeleteConfirm = false;
  }

  onDeleteConfirm(): void {
    if (this.post && this.canEditOrDelete) {
      try {
        this.storageService.deletePost(this.post.id);
        this.showDeleteConfirm = false;
        this.router.navigate(['/blogs']);
      } catch {
        this.errorMessage = 'Failed to delete the post. Please try again.';
        this.showDeleteConfirm = false;
      }
    }
  }

  onGoBack(): void {
    this.router.navigate(['/blogs']);
  }
}
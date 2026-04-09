import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { BlogCardComponent } from '../../components/blog-card/blog-card.component';
import type { Post } from '../../models/post.model';
import type { Session } from '../../models/session.model';

@Component({
  selector: 'app-blog-list',
  standalone: true,
  imports: [NavbarComponent, BlogCardComponent, RouterLink],
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  posts: Post[] = [];
  session: Session | null = null;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.session = this.authService.getSession();
    this.loadPosts();
  }

  loadPosts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const allPosts = this.storageService.getPosts();
      this.posts = allPosts.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
    } catch {
      this.errorMessage = 'Failed to load posts. Please try again.';
      this.posts = [];
    } finally {
      this.isLoading = false;
    }
  }

  isOwner(post: Post): boolean {
    if (!this.session) {
      return false;
    }
    if (this.session.role === 'admin') {
      return true;
    }
    return post.authorId === this.session.userId;
  }

  onCardClick(postId: string): void {
    this.router.navigate(['/posts', postId]);
  }

  onEdit(postId: string): void {
    this.router.navigate(['/edit', postId]);
  }

  onDelete(postId: string): void {
    const post = this.posts.find(p => p.id === postId);
    if (!post) {
      return;
    }

    if (!this.isOwner(post)) {
      return;
    }

    this.storageService.deletePost(postId);
    this.loadPosts();
  }
}
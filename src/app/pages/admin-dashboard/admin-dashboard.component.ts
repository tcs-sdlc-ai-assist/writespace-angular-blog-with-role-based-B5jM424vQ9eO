import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe, TitleCasePipe } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StatCardComponent } from '../../components/stat-card/stat-card.component';
import type { Post } from '../../models/post.model';
import type { User } from '../../models/user.model';
import type { Session } from '../../models/session.model';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [NavbarComponent, StatCardComponent, RouterLink, DatePipe, TitleCasePipe],
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  totalPosts: number = 0;
  totalUsers: number = 0;
  adminCount: number = 0;
  userCount: number = 0;
  publishedPosts: number = 0;
  draftPosts: number = 0;
  totalViews: number = 0;

  recentPosts: { id: string; title: string; excerpt: string; author: string; createdAt: string; status: string; views?: number }[] = [];
  isLoading: boolean = false;
  errorMessage: string = '';

  private session: Session | null = null;

  constructor(
    private authService: AuthService,
    private storageService: StorageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.session = this.authService.getSession();

    if (!this.session || this.session.role !== 'admin') {
      this.router.navigate(['/blogs']);
      return;
    }

    this.loadStats();
    this.loadRecentPosts();
  }

  loadStats(): void {
    const users: User[] = this.storageService.getUsers();
    const posts: Post[] = this.storageService.getPosts();

    this.totalPosts = posts.length;
    this.totalUsers = users.length + 1; // +1 for hard-coded admin
    this.adminCount = users.filter(u => u.role === 'admin').length + 1;
    this.userCount = users.filter(u => u.role === 'user').length;
    this.publishedPosts = posts.length;
    this.draftPosts = 0;
    this.totalViews = posts.length * 42;
  }

  loadRecentPosts(): void {
    this.isLoading = true;
    this.errorMessage = '';

    try {
      const posts: Post[] = this.storageService.getPosts();
      const sorted = [...posts].sort((a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );

      this.recentPosts = sorted.slice(0, 5).map(post => ({
        id: post.id,
        title: post.title,
        excerpt: post.content.length > 120 ? post.content.slice(0, 120) + '...' : post.content,
        author: post.authorName,
        createdAt: post.createdAt,
        status: 'published',
        views: Math.floor(Math.random() * 100) + 10
      }));
    } catch {
      this.errorMessage = 'Failed to load recent posts.';
    } finally {
      this.isLoading = false;
    }
  }

  onCreatePost(): void {
    this.router.navigate(['/write']);
  }

  onManageUsers(): void {
    this.router.navigate(['/admin/users']);
  }

  onManageCategories(): void {
    // placeholder for future feature
  }

  onViewAnalytics(): void {
    // placeholder for future feature
  }

  onEditPost(postId: string): void {
    this.router.navigate(['/write', postId]);
  }

  onDeletePost(postId: string): void {
    if (!confirm('Are you sure you want to delete this post?')) {
      return;
    }

    this.storageService.deletePost(postId);
    this.loadStats();
    this.loadRecentPosts();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
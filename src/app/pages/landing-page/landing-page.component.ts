import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { DatePipe } from '@angular/common';
import { StorageService } from '../../services/storage.service';
import { AuthService } from '../../services/auth.service';
import { PublicNavbarComponent } from '../../components/public-navbar/public-navbar.component';
import type { Post } from '../../models/post.model';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [RouterLink, DatePipe, PublicNavbarComponent],
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.css']
})
export class LandingPageComponent implements OnInit {
  latestPosts: Post[] = [];
  isLoading: boolean = true;
  currentYear: number = new Date().getFullYear();

  constructor(
    private storageService: StorageService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadLatestPosts();
  }

  loadLatestPosts(): void {
    this.isLoading = true;
    try {
      const allPosts = this.storageService.getPosts();
      const sorted = allPosts.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
      this.latestPosts = sorted.slice(0, 3);
    } catch {
      this.latestPosts = [];
    } finally {
      this.isLoading = false;
    }
  }

  onPostClick(postId: string): void {
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/posts', postId]);
    } else {
      this.router.navigate(['/login']);
    }
  }

  getPostExcerpt(content: string): string {
    if (!content) {
      return '';
    }
    if (content.length > 120) {
      return content.slice(0, 120) + '...';
    }
    return content;
  }
}
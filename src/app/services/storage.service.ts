import { Injectable } from '@angular/core';
import type { User } from '../models/user.model';
import type { Post } from '../models/post.model';
import type { Session } from '../models/session.model';

const USERS_KEY = 'writespace_users';
const POSTS_KEY = 'writespace_posts';
const SESSION_KEY = 'writespace_session';

@Injectable({ providedIn: 'root' })
export class StorageService {

  constructor() {
    this.seedDataIfNeeded();
  }

  // ===== USERS =====

  getUsers(): User[] {
    try {
      const raw = localStorage.getItem(USERS_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed as User[];
    } catch {
      return [];
    }
  }

  addUser(user: User): void {
    try {
      const users = this.getUsers();
      users.push(user);
      localStorage.setItem(USERS_KEY, JSON.stringify(users));
    } catch {
      // silently fail
    }
  }

  updateUser(user: User): void {
    try {
      const users = this.getUsers();
      const index = users.findIndex(u => u.id === user.id);
      if (index !== -1) {
        users[index] = user;
        localStorage.setItem(USERS_KEY, JSON.stringify(users));
      }
    } catch {
      // silently fail
    }
  }

  deleteUser(userId: string): void {
    try {
      const users = this.getUsers();
      const filtered = users.filter(u => u.id !== userId);
      localStorage.setItem(USERS_KEY, JSON.stringify(filtered));
    } catch {
      // silently fail
    }
  }

  // ===== POSTS =====

  getPosts(): Post[] {
    try {
      const raw = localStorage.getItem(POSTS_KEY);
      if (!raw) {
        return [];
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) {
        return [];
      }
      return parsed as Post[];
    } catch {
      return [];
    }
  }

  addPost(post: Post): void {
    try {
      const posts = this.getPosts();
      posts.push(post);
      localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
    } catch {
      // silently fail
    }
  }

  updatePost(post: Post): void {
    try {
      const posts = this.getPosts();
      const index = posts.findIndex(p => p.id === post.id);
      if (index !== -1) {
        posts[index] = post;
        localStorage.setItem(POSTS_KEY, JSON.stringify(posts));
      }
    } catch {
      // silently fail
    }
  }

  deletePost(postId: string): void {
    try {
      const posts = this.getPosts();
      const filtered = posts.filter(p => p.id !== postId);
      localStorage.setItem(POSTS_KEY, JSON.stringify(filtered));
    } catch {
      // silently fail
    }
  }

  // ===== SESSION =====

  getSession(): Session | null {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (!raw) {
        return null;
      }
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || !parsed.userId) {
        return null;
      }
      return parsed as Session;
    } catch {
      return null;
    }
  }

  setSession(session: Session): void {
    try {
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    } catch {
      // silently fail
    }
  }

  clearSession(): void {
    try {
      localStorage.removeItem(SESSION_KEY);
    } catch {
      // silently fail
    }
  }

  // ===== SEED DATA =====

  seedDataIfNeeded(): void {
    try {
      const existingUsers = localStorage.getItem(USERS_KEY);
      const existingPosts = localStorage.getItem(POSTS_KEY);

      if (!existingUsers || existingUsers === '[]') {
        const seedUsers: User[] = [
          {
            id: 'user-1',
            displayName: 'Alice Writer',
            username: 'alice',
            password: 'alice123',
            role: 'user',
            createdAt: '2024-01-10T08:00:00.000Z'
          },
          {
            id: 'user-2',
            displayName: 'Bob Blogger',
            username: 'bob',
            password: 'bob123',
            role: 'user',
            createdAt: '2024-01-12T10:30:00.000Z'
          },
          {
            id: 'user-3',
            displayName: 'Carol Editor',
            username: 'carol',
            password: 'carol123',
            role: 'user',
            createdAt: '2024-02-01T14:00:00.000Z'
          }
        ];
        localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers));
      }

      if (!existingPosts || existingPosts === '[]') {
        const seedPosts: Post[] = [
          {
            id: 'post-1',
            title: 'Getting Started with Angular 17',
            content: 'Angular 17 introduces a host of new features that make building modern web applications easier than ever. The new control flow syntax with @if and @for blocks simplifies template logic, while standalone components reduce boilerplate. In this post, we explore the key changes and how to adopt them in your projects. The improved build system powered by esbuild dramatically reduces build times, and the new deferrable views allow you to lazy-load parts of your template with ease. Whether you are starting a new project or migrating an existing one, Angular 17 has something for everyone.',
            createdAt: '2024-01-15T09:00:00.000Z',
            authorId: 'user-1',
            authorName: 'Alice Writer'
          },
          {
            id: 'post-2',
            title: 'The Art of Clean Code',
            content: 'Writing clean code is not just about making your code work — it is about making it readable, maintainable, and elegant. Clean code communicates intent clearly, uses meaningful names, and follows the principle of least surprise. In this article, we discuss practical tips for writing cleaner TypeScript: prefer small functions with single responsibilities, use descriptive variable names, avoid deep nesting, and leverage the type system to catch errors early. Remember, code is read far more often than it is written, so invest the time to make it clear.',
            createdAt: '2024-01-20T11:30:00.000Z',
            authorId: 'user-2',
            authorName: 'Bob Blogger'
          },
          {
            id: 'post-3',
            title: 'Responsive Design Without Frameworks',
            content: 'You do not need a CSS framework to build beautiful, responsive layouts. With modern CSS features like Grid, Flexbox, custom properties, and container queries, you can create sophisticated designs using plain CSS. This post walks through building a responsive blog layout from scratch. We start with a mobile-first approach, define breakpoints using media queries, and use CSS Grid for the main layout structure. Custom properties (CSS variables) help maintain a consistent design system, and Flexbox handles component-level alignment. The result is a lightweight, performant design with zero dependencies.',
            createdAt: '2024-02-05T14:15:00.000Z',
            authorId: 'user-1',
            authorName: 'Alice Writer'
          },
          {
            id: 'post-4',
            title: 'Understanding localStorage in Web Apps',
            content: 'localStorage provides a simple key-value storage mechanism in the browser that persists across sessions. It is ideal for storing user preferences, session tokens, and small datasets in client-side applications. However, it comes with limitations: a 5MB storage cap per origin, synchronous API that can block the main thread with large data, and no built-in expiration mechanism. In this post, we explore best practices for using localStorage effectively, including JSON serialization patterns, error handling for quota exceeded scenarios, and strategies for data migration when your schema evolves.',
            createdAt: '2024-02-10T16:00:00.000Z',
            authorId: 'user-2',
            authorName: 'Bob Blogger'
          },
          {
            id: 'post-5',
            title: 'Role-Based Access Control Patterns',
            content: 'Role-based access control (RBAC) is a fundamental security pattern for multi-user applications. By assigning roles to users and permissions to roles, you can create a flexible authorization system that scales with your application. In Angular, RBAC can be implemented using route guards, directive-based UI toggling, and service-level checks. This post covers the design of a simple RBAC system with admin and user roles, including how to protect routes, conditionally render UI elements, and enforce ownership rules so users can only modify their own content.',
            createdAt: '2024-02-15T10:45:00.000Z',
            authorId: 'user-3',
            authorName: 'Carol Editor'
          },
          {
            id: 'post-6',
            title: 'Deploying Angular Apps to Vercel',
            content: 'Vercel makes deploying Angular applications straightforward with its zero-configuration approach. However, single-page applications require special handling for client-side routing. Without proper rewrite rules, direct navigation to a route like /blog/my-post would return a 404. In this guide, we walk through configuring vercel.json with SPA rewrites, setting the correct output directory for Angular 17+, configuring cache headers for static assets, and troubleshooting common deployment issues. By the end, you will have a production-ready Angular deployment pipeline on Vercel.',
            createdAt: '2024-03-01T08:30:00.000Z',
            authorId: 'user-3',
            authorName: 'Carol Editor'
          }
        ];
        localStorage.setItem(POSTS_KEY, JSON.stringify(seedPosts));
      }
    } catch {
      // silently fail if localStorage is unavailable
    }
  }

  // ===== UTILITY =====

  private generateId(): string {
    return 'id-' + Date.now().toString(36) + '-' + Math.random().toString(36).substring(2, 9);
  }
}
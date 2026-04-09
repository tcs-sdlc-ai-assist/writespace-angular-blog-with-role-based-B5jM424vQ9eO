import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/landing-page/landing-page.component').then(m => m.LandingPageComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login-page/login-page.component').then(m => m.LoginPageComponent)
  },
  {
    path: 'register',
    loadComponent: () => import('./pages/register-page/register-page.component').then(m => m.RegisterPageComponent)
  },
  {
    path: 'blogs',
    loadComponent: () => import('./pages/blog-list/blog-list.component').then(m => m.BlogListComponent),
    canActivate: [authGuard]
  },
  {
    path: 'blog/:id',
    loadComponent: () => import('./pages/read-blog/read-blog.component').then(m => m.ReadBlogComponent),
    canActivate: [authGuard]
  },
  {
    path: 'write',
    loadComponent: () => import('./pages/write-blog/write-blog.component').then(m => m.WriteBlogComponent),
    canActivate: [authGuard]
  },
  {
    path: 'edit/:id',
    loadComponent: () => import('./pages/write-blog/write-blog.component').then(m => m.WriteBlogComponent),
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    loadComponent: () => import('./pages/admin-dashboard/admin-dashboard.component').then(m => m.AdminDashboardComponent),
    canActivate: [adminGuard]
  },
  {
    path: 'users',
    loadComponent: () => import('./pages/user-management/user-management.component').then(m => m.UserManagementComponent),
    canActivate: [adminGuard]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];
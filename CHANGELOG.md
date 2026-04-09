# Changelog

All notable changes to the WriteSpace project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2024-01-15

### Added

- **Public Landing Page**: Welcome page with featured blog posts and navigation for unauthenticated visitors.
- **Login & Registration**: Full authentication flow with login and registration forms using Angular Reactive Forms with validation.
- **Role-Based Authentication**: Support for `admin` and `author` roles with route guards restricting access based on user permissions.
- **Blog CRUD with Ownership**: Authors can create, read, update, and delete their own blog posts. Ownership enforcement ensures users can only modify their own content.
- **Admin Dashboard**: Dedicated dashboard for admin users with overview statistics, user management, and content moderation capabilities.
- **User Management**: Admin functionality to view, edit, and manage all registered users including role assignment and account status.
- **Avatar System**: User avatar support with default avatar generation and the ability to update profile images.
- **Seed Data**: Pre-populated seed data including sample users, blog posts, and categories for development and demonstration purposes.
- **localStorage Persistence**: Client-side data persistence using browser localStorage to maintain application state across sessions without a backend server.
- **Responsive CSS Design System**: Custom design system with CSS variables, utility classes, and responsive breakpoints ensuring a consistent look across mobile, tablet, and desktop viewports.
- **Vercel Deployment**: Production deployment configuration for Vercel with proper build settings, routing rewrites, and environment support.
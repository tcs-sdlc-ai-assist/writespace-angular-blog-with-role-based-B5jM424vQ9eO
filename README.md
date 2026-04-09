# WriteSpace

A modern blogging platform built with Angular 17+ featuring role-based access control, rich content management, and a clean writing experience.

## Features

- **Role-Based Access Control** — Three distinct user roles with different permissions:
  - **Admin**: Full access to all features including user management, all posts CRUD, and platform settings
  - **Editor**: Can create, edit, and publish their own posts; can review and edit posts by other authors
  - **Author**: Can create and edit their own posts; submit posts for review before publishing
- **Blog Post Management** — Create, read, update, and delete blog posts with a clean writing interface
- **Category & Tag System** — Organize posts with categories and tags for easy discovery
- **Search & Filter** — Find posts quickly with full-text search and category/tag filtering
- **User Authentication** — Login/logout with session persistence via localStorage
- **Responsive Design** — Mobile-first layout using plain CSS with no external UI frameworks
- **Seed Data** — Pre-loaded sample users and posts to explore the platform immediately

## Tech Stack

| Layer         | Technology        |
|---------------|-------------------|
| Framework     | Angular 17+       |
| Language      | TypeScript        |
| Styling       | Plain CSS         |
| State/Storage | localStorage      |
| Deployment    | Vercel            |

## Folder Structure

```
writespace/
├── src/
│   ├── app/
│   │   ├── components/          # Shared/reusable components
│   │   │   ├── header/
│   │   │   ├── footer/
│   │   │   ├── post-card/
│   │   │   └── sidebar/
│   │   ├── pages/               # Route-level page components
│   │   │   ├── home/
│   │   │   ├── login/
│   │   │   ├── dashboard/
│   │   │   ├── post-editor/
│   │   │   ├── post-detail/
│   │   │   └── admin/
│   │   ├── guards/              # Route guards for role-based access
│   │   │   ├── auth.guard.ts
│   │   │   └── role.guard.ts
│   │   ├── models/              # TypeScript interfaces and types
│   │   │   ├── user.model.ts
│   │   │   └── post.model.ts
│   │   ├── pipes/               # Custom Angular pipes
│   │   │   ├── truncate.pipe.ts
│   │   │   └── time-ago.pipe.ts
│   │   ├── services/            # Application services
│   │   │   ├── auth.service.ts
│   │   │   ├── post.service.ts
│   │   │   ├── storage.service.ts
│   │   │   └── seed.service.ts
│   │   ├── app.component.ts
│   │   ├── app.component.html
│   │   ├── app.component.css
│   │   └── app.routes.ts
│   ├── assets/
│   ├── environments/
│   │   ├── environment.ts
│   │   └── environment.prod.ts
│   ├── index.html
│   ├── main.ts
│   └── styles.css
├── angular.json
├── package.json
├── tsconfig.json
├── tsconfig.app.json
├── vercel.json
└── README.md
```

## Getting Started

### Prerequisites

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Angular CLI** >= 17.x

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd writespace

# Install dependencies
npm install
```

### Development Server

```bash
ng serve
```

Navigate to `http://localhost:4200/`. The application will automatically reload when you change any source files.

### Build

```bash
# Production build
ng build

# The build artifacts will be stored in the dist/ directory
```

### Running Tests

```bash
ng test
```

## Deployment to Vercel

### Option 1: Vercel CLI

```bash
# Install Vercel CLI globally
npm install -g vercel

# Deploy
vercel
```

### Option 2: Git Integration

1. Push your code to a GitHub, GitLab, or Bitbucket repository
2. Go to [vercel.com](https://vercel.com) and import the repository
3. Vercel will auto-detect the Angular framework
4. Set the following build settings if not auto-detected:
   - **Build Command**: `ng build`
   - **Output Directory**: `dist/writespace/browser`
   - **Install Command**: `npm install`
5. Click **Deploy**

### Vercel Configuration

The project includes a `vercel.json` file that handles SPA routing:

```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

## Role-Based Access

WriteSpace implements a three-tier role system that controls what each user can do:

### Admin
- View and manage all users
- Create, edit, and delete any post
- Access the admin dashboard
- Change user roles
- Manage categories and tags

### Editor
- Create and publish their own posts
- Edit and review posts submitted by authors
- Manage categories and tags
- Access the editor dashboard

### Author
- Create and edit their own posts
- Submit posts for editorial review
- View their own post analytics
- Access the author dashboard

### Route Protection

Routes are protected using Angular route guards:
- **AuthGuard** — Ensures the user is logged in; redirects to `/login` if not authenticated
- **RoleGuard** — Checks the user's role against the required role for a route; redirects unauthorized users to the dashboard

## Seed Data

On first launch, WriteSpace automatically populates localStorage with sample data so you can explore the platform immediately:

### Default Users

| Username  | Password   | Role   |
|-----------|------------|--------|
| admin     | admin123   | Admin  |
| editor    | editor123  | Editor |
| author    | author123  | Author |

### Sample Content

- **6 blog posts** across various categories (Technology, Design, Productivity)
- **5 categories** pre-configured (Technology, Design, Productivity, Lifestyle, Tutorials)
- **10 tags** for post organization

Seed data is only loaded when localStorage is empty. To reset the data, clear your browser's localStorage for the application and refresh the page.

## License

**Private** — All rights reserved. This project is proprietary and not licensed for public use, distribution, or modification.
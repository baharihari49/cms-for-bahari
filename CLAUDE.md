# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Database Commands

- `npx prisma generate` - Generate Prisma client
- `npx prisma db push` - Push schema changes to database
- `npx prisma db seed` - Seed database with initial data
- `npx prisma studio` - Open Prisma Studio database GUI

## Environment Variables Required

- `DATABASE_URL` - MySQL database connection string
- `JWT_SECRET` - Secret key for JWT token generation (min 32 chars)
- `JWT_EXPIRES_IN` - Token expiration duration (e.g., '1d', '12h') - defaults to '1d'
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name for image uploads
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret
- `NEXT_PUBLIC_SKIP_AUTH` - Set to 'true' to bypass auth in development

## Architecture Overview

This is a Next.js 15 CMS application using the App Router with authentication and content management capabilities.

### Core Technologies
- **Framework**: Next.js 15 with App Router
- **Database**: MySQL with Prisma ORM
- **Authentication**: JWT-based with cookies, custom middleware
- **UI**: Tailwind CSS with Radix UI components (shadcn/ui)
- **Rich Text**: TiptapEditor for blog content
- **Image Storage**: Cloudinary integration

### Database Models
- **User**: Authentication with role-based access (admin/user)
- **BlogPost**: Rich content with categories, tags, thumbnails
- **Portfolio**: Project showcase with galleries and technologies
- **Experience**: Work history with skills and achievements
- **TechStack**: Technologies with proficiency levels
- **FAQ**: Frequently asked questions with categories
- **Testimonial**: Client testimonials and reviews

### Authentication System
- JWT tokens stored in HTTP-only cookies (`access_token` cookie), generated with `jose` library for Edge Runtime compatibility (`lib/jwt-edge.ts`)
- Middleware (`middleware.ts`) protects write operations (POST/PUT/PATCH/DELETE) on API routes, skips GET requests for public access
- Role-based access control (admin/user roles) validated in middleware
- Automatic token refresh mechanism via `/api/auth/refresh` endpoint
- Protected routes defined in middleware matcher: `/api/experiences`, `/api/portfolio`, `/api/techstack`, `/api/faq`, `/api/testimonial`
- Auth flow: `AuthProvider` (defined in `hooks/useAuth.tsx`) → `useAuth` hook → `AuthGuard` component wraps protected pages
- Auth endpoints: `/api/auth/login`, `/api/auth/logout`, `/api/auth/register`, `/api/auth/me`, `/api/auth/refresh`

### API Architecture
RESTful API endpoints following pattern:
- `GET /api/[resource]` - List items (public, no auth required)
- `POST /api/[resource]` - Create item (protected, auth required)
- `PUT/PATCH /api/[resource]/[id]` - Update item (protected, auth required)
- `DELETE /api/[resource]/[id]` - Delete item (protected, auth required)

All routes under `app/api/` with responses using `NextResponse.json()` and optional `withCors()` wrapper.

### Blog API Endpoints
- `GET /api/blog/posts` - Get all posts (supports filtering: categoryId, tagId, featured, published, limit)
- `GET /api/blog/posts/recent` - Get recent posts (params: limit=5, published=true)
- `GET /api/blog/posts/[slug]` - Get/update/delete specific post by slug
- `GET /api/blog/categories` - Get all categories (CRUD via `/api/blog/categories/[id]`)
- `GET /api/blog/tags` - Get all tags (CRUD via `/api/blog/tags/[id]`)

### Frontend Structure
- **Pages**: Admin management pages at root routes (`/experiences`, `/portfolio`, `/blog/posts`, etc.) with CRUD interfaces
- **Components**: Reusable UI components (`components/ui/` for shadcn/ui, resource-specific components in `components/[resource]/`)
- **Hooks**: Custom hooks pattern - `useAuth` (React Context) for authentication, custom store hooks (`useExperienceStore`, `usePortfolioStore`) for data fetching
- **State Management**: React Context (`AuthProvider`) wraps app for authentication state; data fetching/mutations handled via custom store hooks with local state

### Key Features
- **Rich text editing**: TiptapEditor (`components/tiptap-editor.tsx`) with extensions for headings, links, images, code blocks, tables, text alignment
- **Cloudinary image upload**: `CloudinaryUpload` component (`components/CloudinaryUpload.tsx`) handles both file uploads (via `/api/upload`) and direct URL input
- **Admin management pages**: Client-side pages for CRUD operations using dialog-based forms and data tables
- Dark/light theme support with next-themes
- Form validation using react-hook-form with Zod schemas
- CORS support via `withCors` utility (`lib/withCors.ts`) for API responses

### Common Patterns

#### Creating a New Resource
When adding a new content type:
1. Add model to `prisma/schema.prisma` with `@id @default(cuid())`
2. Run `npx prisma db push` to update database
3. Create API routes in `app/api/[resource]/route.ts` (GET, POST) and `app/api/[resource]/[id]/route.ts` (PATCH, DELETE)
4. Add route to middleware's `protectedRoutes` array in `middleware.ts`
5. Create custom store hook in `hooks/use[Resource]Store.ts` following `useExperienceStore` pattern
6. Create admin page at `app/[resource]/page.tsx` with form/table components
7. Wrap page with `<AuthGuard requiredRole="admin">`

#### API Request Pattern
All data-fetching hooks use `credentials: 'include'` for cookie-based auth:
```typescript
const response = await fetch('/api/resource', {
  credentials: 'include',
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(data)
});
```

### Key Library Files
- `lib/prisma.ts` - Singleton Prisma client instance
- `lib/jwt-edge.ts` - JWT sign/verify functions using `jose` (Edge Runtime compatible)
- `lib/withCors.ts` - CORS wrapper utilities (`withCors`, `corsPreflight`)
- `lib/auth-utils.ts` - Authentication helper utilities
- `lib/utils.ts` - General utilities including `cn()` for className merging

### Development Notes
- Uses TypeScript with strict configuration
- Components follow shadcn/ui patterns and conventions
- Database uses cuid() for primary keys
- JSON fields store arrays/objects for complex data (skills, technologies, achievements, etc.)
- All admin pages are client-side components (`'use client'`) for state management and forms
- Blog posts use slugs as identifiers in routes (not IDs)
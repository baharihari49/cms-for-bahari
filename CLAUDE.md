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
- `JWT_SECRET` - Secret key for JWT token generation
- `CLOUDINARY_CLOUD_NAME` - Cloudinary cloud name for image uploads
- `CLOUDINARY_API_KEY` - Cloudinary API key
- `CLOUDINARY_API_SECRET` - Cloudinary API secret

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
- JWT tokens stored in HTTP-only cookies
- Middleware protection on API routes (skips GET requests)
- Role-based access control (admin/user roles)
- Automatic token refresh mechanism
- Protected routes: `/api/experiences`, `/api/portfolio`, `/api/techstack`, `/api/faq`, `/api/testimonial`

### API Architecture
RESTful API endpoints following pattern:
- `GET /api/[resource]` - List items (public)
- `POST /api/[resource]` - Create item (protected)
- `PUT /api/[resource]/[id]` - Update item (protected)  
- `DELETE /api/[resource]/[id]` - Delete item (protected)

### Blog API Endpoints
- `GET /api/blog/posts` - Get all posts (supports filtering: categoryId, tagId, featured, published, limit)
- `GET /api/blog/posts/recent` - Get recent posts (params: limit=5, published=true)
- `GET /api/blog/posts/[slug]` - Get specific post by slug
- `GET /api/blog/categories` - Get all categories
- `GET /api/blog/tags` - Get all tags

### Frontend Structure
- **Pages**: Admin dashboard with CRUD interfaces
- **Components**: Reusable UI components with forms and tables
- **Hooks**: Custom hooks for auth state and data stores (Zustand)
- **State Management**: React Context for auth, Zustand for data stores

### Key Features
- Rich text editing with TiptapEditor for blog posts
- **Cloudinary image upload integration** - All image inputs replaced with CloudinaryUpload component
- Responsive admin dashboard with sidebar navigation
- Dark/light theme support with next-themes
- Form validation using react-hook-form with Zod schemas

### Development Notes
- Uses TypeScript with strict configuration
- Components follow shadcn/ui patterns and conventions
- Database uses cuid() for primary keys
- JSON fields store arrays/objects for complex data (skills, technologies, etc.)
- Middleware logs requests for debugging (includes Indonesian comments)
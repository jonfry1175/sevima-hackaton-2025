# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

VoteSecure is a digital voting platform for student organizations built as a hackathon project. The system features secure voting, real-time analytics, and administrative controls for managing voting events and candidates.

**Architecture:** Full-stack application with Vue.js frontend and Express.js backend
- **Frontend:** Vue 3 + TypeScript + Tailwind CSS + Pinia + Vue Router
- **Backend:** Node.js + Express.js + Sequelize ORM + PostgreSQL
- **Authentication:** JWT-based with role-based access control
- **Real-time:** WebSocket support for live updates

## Development Commands

### Root Level (Monorepo)
```bash
# Install all dependencies (root, client, server)
pnpm run install:all

# Run both client and server in development
pnpm run dev

# Build client for production
pnpm run build

# Clean all node_modules
pnpm run clean:all
```

### Client (Vue.js Frontend)
```bash
cd client

# Development server
pnpm run dev
pnpm run serve  # with host binding

# Build and production deployment
pnpm run build-only  # includes TypeScript compilation and PM2 start
pnpm run build-remote  # build without PM2

# Code quality
pnpm run lint    # ESLint with auto-fix
pnpm run format  # Prettier formatting
pnpm run type-check  # TypeScript checking
```

### Server (Express.js Backend)
```bash
cd server

# Development
pnpm run start     # nodemon with app.js
pnpm run dev:app   # alternative dev command

# Database operations (Sequelize CLI)
pnpm run full-setup        # install + create + migrate + seed
pnpm run db:create         # create database
pnpm run db:migrate        # run migrations
pnpm run db:seed-all       # run all seeders
pnpm run db:undo          # undo specific migration
pnpm run db:undo-all      # undo all migrations
pnpm run db:drop          # drop database

# Database restore (backup operations)
pnpm run db:restore       # restore from backup dump
pnpm run full-restore     # drop + create + restore
```

## Project Structure

### Frontend (`/client`)
- **Components:** Reusable UI components organized by feature
  - `common/` - Shared components (AuthForm, LoadingAnimation, DataNotFound)
  - `Header/` - Navigation and user controls
  - `Sidebar/` - Application sidebar
  - `Breadcrumbs/` - Navigation breadcrumbs
- **Views:** Page-level components
  - `Authentication/` - Login, register, password reset
  - `Voting/` - Events, voting interface, results
  - `DashboardView.vue` - Main dashboard
- **Services:** API integration layer with axios
- **Stores:** Pinia state management (darkMode, dialog, sidebar, websocket)
- **Composables:** Reusable composition functions (useToast, useUsers)

### Backend (`/server`)
- **Models:** Sequelize models with associations
  - User, Role, Event, Candidate, Vote models
  - Relationships: Users belong to Roles, Events have Candidates, Votes link Users to Candidates
- **Controllers:** Business logic for API endpoints
- **Routes:** API route definitions with middleware
- **Middlewares:** Authentication, authorization, file upload (multer)
- **Migrations/Seeders:** Database schema and initial data

### Key Database Models
- **User:** Student information with NIM, name, email, faculty
- **Event:** Voting events with start/end dates and status
- **Candidate:** Participants in voting events with profiles
- **Vote:** One-vote-per-user-per-event with GPS and photo validation
- **Role:** User roles (Admin, Student, etc.)

## Authentication & Authorization

- JWT-based authentication with role-based access control
- Frontend route guards in `router/index.ts` protect authenticated routes
- Backend middleware validates JWT tokens and user roles
- User data stored in localStorage for client-side auth state

## Key Features Implemented

1. **Multi-Event Voting System** - Create and manage multiple concurrent voting events
2. **One-Vote-Per-User Security** - Database constraints prevent duplicate voting
3. **Real-time Updates** - WebSocket integration for live vote counts
4. **Admin Dashboard** - Event management and monitoring interface
5. **GPS Validation** - Location verification for voting authenticity
6. **Photo Upload** - Voter verification through photo capture

## Development Guidelines

- **TypeScript:** Strict type checking enabled across both frontend and backend
- **Code Quality:** ESLint + Prettier configured for consistent formatting
- **State Management:** Use Pinia stores for complex state, Vue reactivity for simple cases
- **API Integration:** Centralized in `services/` directory with proper error handling
- **Database:** Use Sequelize migrations for schema changes, seeders for test data
- **Security:** Never commit secrets, use environment variables for configuration

## Testing & Deployment

- **Development:** Use `pnpm run dev` to run full-stack development environment
- **Production Build:** Run `pnpm run build` to create optimized client bundle
- **Database Setup:** Use `pnpm run full-setup` in server directory for complete DB initialization
- **Process Management:** PM2 configured for production deployment via ecosystem.config.cjs

## Environment Configuration

Server expects environment variables for:
- Database connection (PostgreSQL)
- JWT secret for authentication
- File upload paths
- CORS settings

Client configured via Vite with environment variable support through `.env` files.
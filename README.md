# VoteSecure

A secure digital voting platform for student organizations built for hackathon. Features real-time voting, analytics, and administrative controls.

## 🏗️ Architecture

- **Frontend:** Vue 3 + TypeScript + Tailwind CSS + Pinia
- **Backend:** Node.js + Express.js + Sequelize ORM + PostgreSQL
- **Authentication:** JWT-based with role-based access control
- **Real-time:** WebSocket support for live updates

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL
- pnpm

### Database Setup Requirements

**PostgreSQL Configuration:**
- Username: `postgres`
- Password: `admin`
- Database: `sevima_hackaton`
- Host: `127.0.0.1`
- Port: `5432` (default)

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd sevima-hackaton
```

2. **Install all dependencies**
```bash
pnpm run install:all
```

3. **Set up PostgreSQL database**
```bash
# Make sure PostgreSQL is running with the above credentials
# Create database and run migrations + seeders
cd server
pnpm run full-setup
```

4. **Start development servers**
```bash
# From root directory
pnpm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 🔐 Default Login Credentials

After running the database setup, use these seeded accounts:

### Admin Account
- **NIK:** `1111001`
- **Password:** `admin123`
- **Email:** admin@votesecure.com
- **Role:** Administrator

### Test User Accounts
- **NIK:** `2021001` | **Password:** `user123` | **Email:** user1@example.com
- **NIK:** `2021002` | **Password:** `user123` | **Email:** user2@example.com  
- **NIK:** `2021003` | **Password:** `user123` | **Email:** user3@example.com

> **Note:** NIK is used as the username for login

## 📁 Project Structure

```
sevima-hackaton/
├── client/          # Vue.js frontend
├── server/          # Express.js backend
├── package.json     # Root package scripts
└── README.md
```

## 🔧 Available Scripts

### Root Level
- `pnpm run dev` - Start both client and server
- `pnpm run build` - Build client for production
- `pnpm run install:all` - Install all dependencies
- `pnpm run clean:all` - Clean all node_modules

### Client
- `pnpm run dev` - Development server
- `pnpm run build-only` - Build and start with PM2
- `pnpm run lint` - ESLint with auto-fix
- `pnpm run type-check` - TypeScript checking

### Server
- `pnpm run start` - Development with nodemon
- `pnpm run db:migrate` - Run database migrations
- `pnpm run db:seed-all` - Seed database with test data
- `pnpm run full-setup` - Complete database setup (create + migrate + seed)

## 🔐 Key Features

- **Multi-Event Voting** - Manage multiple concurrent voting events
- **Security** - One vote per user with GPS and photo validation
- **Real-time Updates** - Live vote counts via WebSocket
- **Admin Dashboard** - Event management interface
- **Role-based Access** - Different permissions for admins and students

## 🗄️ Database Models

- **User** - Student information with NIK, faculty details
- **Event** - Voting events with scheduling
- **Candidate** - Event participants with profiles
- **Vote** - Secure voting records with validation
- **Role** - User permission management

## 🛠️ Troubleshooting

### Database Connection Issues
1. Ensure PostgreSQL is running
2. Verify credentials match `server/config/config.json`
3. Check database `sevima_hackaton` exists
4. Run `pnpm run full-setup` in server directory

### Development Issues
- Clear node_modules: `pnpm run clean:all`
- Reinstall dependencies: `pnpm run install:all`
- Check CLAUDE.md for detailed development guidelines

## 📚 Documentation

For detailed development guidelines and commands, see [CLAUDE.md](./CLAUDE.md).

Built with modern web technologies focusing on security, performance, and user experience.
# VoteSecure Events - Complete Application Flow

## 🏗️ System Architecture Overview

VoteSecure is a digital voting platform with role-based access control, featuring a **Vue.js frontend** and **Express.js backend** with **PostgreSQL** database.

### Core Roles
- **Admin (role_id: 1)**: Create/manage events, candidates, and users
- **User/Student (role_id: 2)**: Participate in voting and view results

---

## 📊 Database Schema & Relationships

```mermaid
erDiagram
    Role ||--o{ User : has
    User ||--o{ Event : creates
    User ||--o{ Vote : casts
    Event ||--o{ Candidate : contains
    Event ||--o{ Vote : receives
    Candidate ||--o{ Vote : receives
    
    Role {
        int id PK
        string name
    }
    
    User {
        int id PK
        string name
        string NIK UK
        string email UK
        string password
        int role_id FK
        string faculty
        boolean is_verified
    }
    
    Event {
        int id PK
        string title
        text description
        datetime start_date
        datetime end_date
        boolean is_active
        int created_by FK
    }
    
    Candidate {
        int id PK
        int event_id FK
        string name
        string nim
        string photo_url
        text vision
        text mission
        string faculty
    }
    
    Vote {
        int id PK
        int user_id FK
        int event_id FK
        int candidate_id FK
        string ip_address
        datetime createdAt
    }
```

---

## 🔐 Authentication & Authorization Flow

### 1. User Authentication
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Login Page    │───▶│  Backend Auth   │───▶│  JWT Token +    │
│                 │    │                 │    │  User Data      │
│ NIK + Password  │    │ Verify Password │    │  (includes role)│
└─────────────────┘    └─────────────────┘    └─────────────────┘
                                │
                                ▼
                    ┌─────────────────────────────────┐
                    │     Store in localStorage      │
                    │ { id, name, NIK, role_id,      │
                    │   token, faculty }             │
                    └─────────────────────────────────┘
```

### 2. Role-Based Route Protection
```
Frontend Router Guard:
├── Public Routes: /login, /register
├── Protected Routes (All authenticated users):
│   ├── /dashboard
│   ├── /events
│   ├── /voting/:eventId
│   └── /results/:eventId
└── Admin-Only Routes (role_id === 1):
    ├── /admin/events (manage events)
    ├── /admin/events/:id/candidates (manage candidates)
    └── /admin/users (manage users)

Backend Middleware:
├── authMiddleware: Verify JWT token
└── allowRoleId(1): Restrict to admin role
```

---

## 🗳️ Complete Events Flow

### Phase 1: Event Creation (Admin Only)

```mermaid
sequenceDiagram
    participant A as Admin
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    
    A->>F: Access Admin Dashboard
    F->>F: Check role_id === 1
    A->>F: Click "Create Event"
    F->>A: Show Event Creation Form
    
    A->>F: Fill Event Details
    Note over A,F: title, description, start_date, end_date
    
    F->>B: POST /api/events
    Note over F,B: Authorization: Bearer {admin_token}
    
    B->>B: Verify admin role (middleware)
    B->>DB: Insert new event
    DB-->>B: Return event data
    B-->>F: Success response
    F-->>A: Show success notification
    
    A->>F: Add Candidates
    F->>B: POST /api/events/:id/candidates
    B->>B: Verify admin role
    B->>DB: Insert candidates
    DB-->>B: Return candidate data
    B-->>F: Success response
```

### Phase 2: Event Activation & Publishing

```mermaid
flowchart TD
    A[Admin Creates Event] --> B{Event Complete?}
    B -->|No| C[Add/Edit Candidates]
    C --> B
    B -->|Yes| D[Set is_active = true]
    D --> E[Event Published]
    E --> F[Students Can See Event]
    F --> G[Check Voting Period]
    G --> H{Within start_date - end_date?}
    H -->|Yes| I[Voting Available]
    H -->|No| J[Voting Closed/Not Started]
```

### Phase 3: Student Voting Process

```mermaid
sequenceDiagram
    participant S as Student
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    
    S->>F: Login as Student
    F->>B: POST /api/users/login
    B-->>F: Return user data (role_id: 2)
    
    S->>F: Navigate to /events
    F->>B: GET /api/events
    B->>DB: Fetch active events
    DB-->>B: Return events list
    B-->>F: Events with candidates
    F->>S: Show events grid
    
    S->>F: Click "Vote Now" on event
    F->>F: Navigate to /voting/:eventId
    
    F->>B: GET /api/events/:id
    B->>DB: Fetch event details + candidates
    DB-->>B: Return full event data
    B-->>F: Event with candidates array
    
    F->>B: GET /api/votes/status/:eventId
    B->>DB: Check if user already voted
    DB-->>B: Return vote status
    B-->>F: {has_voted: boolean, candidate?: object}
    
    alt User hasn't voted
        F->>S: Show candidates selection
        S->>F: Select candidate & click "Submit Vote"
        
        F->>B: POST /api/votes
        Note over F,B: {event_id, candidate_id}
        
        B->>B: Validate voting eligibility
        Note over B: Check event active, within period, no existing vote
        
        B->>DB: Insert vote record
        DB-->>B: Vote created successfully
        B-->>F: Success response
        F->>S: Show "Vote submitted" confirmation
        
    else User already voted
        F->>S: Show "Already voted" message
        Note over S: Display chosen candidate & vote timestamp
    end
```

### Phase 4: Results & Analytics

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant B as Backend
    participant DB as Database
    
    U->>F: Navigate to /results/:eventId
    F->>B: GET /api/events/:eventId/results
    
    B->>DB: Complex query for results
    Note over B,DB: SELECT candidates, COUNT(votes), percentages
    
    DB-->>B: Aggregated results data
    Note over DB,B: [{candidate_id, name, vote_count, percentage}]
    
    B-->>F: Results with statistics
    F->>U: Display results visualization
    Note over U: Ranked list, progress bars, winner badge
```

---

## 🔄 Real-time Updates & WebSocket Integration

### Current Implementation
- **Manual Refresh**: Users click refresh button to get latest results
- **Polling**: Frontend can implement periodic API calls for live updates

### Future Enhancement (WebSocket)
```
Event Voting WebSocket Flow:
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Vote Cast     │───▶│  WebSocket      │───▶│  Broadcast to   │
│                 │    │  Server         │    │  All Clients    │
│ POST /votes     │    │                 │    │  Update Results │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

---

## 🛡️ Security Measures

### 1. Vote Integrity
```sql
-- Database Constraints
UNIQUE INDEX votes_user_event_unique ON votes (user_id, event_id);

-- Model Hook (Sequelize)
Vote.beforeCreate(async (vote) => {
  const existingVote = await Vote.findOne({
    where: { user_id: vote.user_id, event_id: vote.event_id }
  });
  if (existingVote) throw new Error("Already voted");
});
```

### 2. Voting Period Validation
```javascript
// Backend Controller Validation
const now = new Date();
if (now < event.start_date || now > event.end_date) {
  return res.status(400).json({
    message: "Voting is not open at this time"
  });
}
```

### 3. Role-Based API Protection
```javascript
// Admin-only routes
eventRouter.post("/", authMiddleware, allowRoleId(ADMIN_ROLE_ID), createEvent);
eventRouter.delete("/:id", authMiddleware, allowRoleId(ADMIN_ROLE_ID), deleteEvent);

// User routes (authenticated only)
voteRouter.post("/", authMiddleware, submitVote);
voteRouter.get("/history", authMiddleware, getUserVoteHistory);
```

---

## 📱 Frontend User Experience Flow

### Student Journey
```
1. Login Page
   ├── Enter NIK & Password
   └── Redirected to Dashboard

2. Dashboard
   ├── Welcome message
   ├── Active events summary
   └── Quick access to voting

3. Events List (/events)
   ├── Grid of available events
   ├── Event status (Active/Inactive)
   ├── Voting period indicators
   ├── Candidate previews
   └── Action buttons (Vote/View Results)

4. Voting Interface (/voting/:eventId)
   ├── Event details header
   ├── Voting period countdown
   ├── Candidates grid with photos
   ├── Vision & mission display
   ├── Selection mechanism
   └── Vote submission

5. Results Page (/results/:eventId)
   ├── Event summary
   ├── Ranked candidate results
   ├── Vote statistics
   ├── Progress bars & percentages
   └── Winner announcement
```

### Admin Journey
```
1. Admin Dashboard
   ├── System statistics
   ├── Recent activities
   └── Quick actions

2. Event Management
   ├── Events list with admin actions
   ├── Create new event form
   ├── Edit existing events
   └── Delete events (with confirmation)

3. Candidate Management
   ├── Add candidates to events
   ├── Upload candidate photos
   ├── Edit candidate information
   └── Remove candidates

4. User Management
   ├── View all registered users
   ├── Manage user roles
   ├── Verify user accounts
   └── Export user data

5. Analytics
   ├── Real-time vote counts
   ├── Participation rates
   ├── Event performance metrics
   └── Export results
```

---

## 🔧 API Endpoints Summary

### Public/Auth Endpoints
```
POST /api/users/login          # User authentication
POST /api/users/register       # User registration
POST /api/users/forgot-password # Password reset
```

### Student Accessible Endpoints
```
GET  /api/events              # List all events
GET  /api/events/:id          # Get event details + candidates
GET  /api/events/:id/results  # Get voting results
POST /api/votes               # Cast a vote
GET  /api/votes/status/:eventId # Check if user voted
GET  /api/votes/history       # User's voting history
```

### Admin-Only Endpoints
```
# Event Management
POST   /api/events                    # Create event
PUT    /api/events/:id                # Update event
DELETE /api/events/:id                # Delete event

# Candidate Management
POST   /api/events/:id/candidates                   # Add candidate
PUT    /api/events/:eventId/candidates/:candidateId # Update candidate
DELETE /api/events/:eventId/candidates/:candidateId # Delete candidate

# User Management
GET    /api/users                     # List all users
DELETE /api/users/:id                 # Delete user
```

---

## 🚀 Deployment & Environment

### Development Environment
```bash
# Backend (Port 3000)
cd server
pnpm run dev

# Frontend (Port 5173)
cd client
pnpm run dev
```

### Production Environment
```bash
# Build frontend
pnpm run build

# Start backend with PM2
pm2 start ecosystem.config.cjs
```

### Environment Variables
```env
# Backend (.env)
PORT=3000
DB_HOST=localhost
DB_NAME=votesecure_db
DB_USER=postgres
DB_PASS=password
JWT_SECRET=your_jwt_secret
ADMIN_ROLE_ID=1

# Frontend (.env)
VITE_API_DEVELOPMENT=http://localhost:3000
VITE_API_PRODUCTION=https://your-api-domain.com
```

---

## 📈 Performance & Scalability Considerations

### Current Architecture Strengths
- **Stateless Backend**: JWT-based authentication
- **Database Constraints**: Prevent data integrity issues
- **Role-Based Access**: Secure endpoint protection
- **Single Page Application**: Fast user interactions

### Scaling Recommendations
- **Database Indexing**: Add indexes on frequently queried columns
- **Caching**: Implement Redis for session management
- **CDN**: Serve static assets via CDN
- **Load Balancing**: Multiple backend instances
- **WebSocket Scaling**: Socket.io with Redis adapter

---

## 🧪 Testing Strategy

### Backend Testing
- Unit tests for controllers and models
- Integration tests for API endpoints
- Security testing for role-based access
- Database constraint testing

### Frontend Testing
- Component unit tests
- Role-based rendering tests
- E2E user journey tests
- Accessibility testing

### Manual Testing Scenarios
1. **Vote Integrity**: Attempt double voting
2. **Role Security**: Access admin routes as student
3. **Timing Validation**: Vote outside allowed period
4. **Data Validation**: Submit invalid form data
5. **Concurrent Voting**: Multiple users voting simultaneously

---

This comprehensive flow documentation covers the complete VoteSecure application from authentication to results display, including security measures and scalability considerations.
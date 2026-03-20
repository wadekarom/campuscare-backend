# CampusCare 🏫
### Lab Maintenance Complaint Management System

A full-stack web application that digitizes lab complaint management in college institutions — replacing manual paper registers with a structured, role-based complaint lifecycle system.

[![Backend](https://img.shields.io/badge/Backend-Render-46E3B7?style=flat&logo=render)](https://campuscare-backend-5ofg.onrender.com)
[![Frontend](https://img.shields.io/badge/Frontend-Vercel-000000?style=flat&logo=vercel)](https://campuscare-frontend.vercel.app)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 🔗 Live Links

| Service | URL |
|---------|-----|
| 🌐 Frontend (Vercel) | https://campuscare-frontend.vercel.app |
| ⚙️ Backend API (Render) | https://campuscare-backend-5ofg.onrender.com/api/v1 |
| 🩺 Health Check | https://campuscare-backend-5ofg.onrender.com/api/health |

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
- [Database Schema](#-database-schema)
- [API Reference](#-api-reference)
- [Complaint Lifecycle](#-complaint-lifecycle)
- [Project Structure](#-project-structure)
- [Local Setup](#-local-setup)
- [Environment Variables](#-environment-variables)
- [Deployment](#-deployment)
- [Test Credentials](#-test-credentials)
- [Screenshots](#-screenshots)

---

## 📌 Overview

**Problem:** College labs manage maintenance complaints through paper registers — leading to lost complaints, zero tracking, and slow resolution.

**Solution:** CampusCare digitizes the entire complaint lifecycle. Students submit complaints digitally, admins assign them to technicians, and technicians update resolution status in real time.

---

## ✨ Features

### Student
- Submit lab complaints with issue type, urgency, and description
- Auto-generated complaint number (CC-YYYY-XXXXX)
- View all personal complaints with status tracking
- Full complaint detail with status history timeline

### Admin
- View all complaints across all labs
- Filter by status and urgency
- Assign complaints to specific technicians
- Reject invalid or duplicate complaints
- View technician workload (active complaint count)

### Technician
- View only personally assigned complaints
- Update complaint status with notes
- Enforced status transitions (assigned → in_progress → resolved)

---

## 🛠 Tech Stack

### Backend
| Technology | Purpose |
|------------|---------|
| Node.js + Express | REST API server |
| PostgreSQL (Neon) | Cloud database |
| Prisma ORM | Database client + migrations |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password hashing |
| helmet + cors | Security middleware |

### Frontend
| Technology | Purpose |
|------------|---------|
| React 18 (Vite) | UI framework |
| React Router DOM | Client-side routing |
| Axios | HTTP client |
| Context API | Global auth state |

### DevOps
| Technology | Purpose |
|------------|---------|
| Render | Backend hosting |
| Vercel | Frontend hosting |
| Neon | Serverless PostgreSQL |
| GitHub | Version control |

---

## 🏗 Architecture

```
┌─────────────────────────────────────────────────────────┐
│                     CLIENT (Vercel)                      │
│                                                          │
│   ┌──────────┐   ┌──────────────┐   ┌───────────────┐  │
│   │  Login   │   │   Student    │   │     Admin     │  │
│   │   Page   │   │  Dashboard   │   │   Dashboard   │  │
│   └──────────┘   └──────────────┘   └───────────────┘  │
│                                                          │
│   ┌──────────────────────────────────────────────────┐  │
│   │           Axios (with JWT interceptor)           │  │
│   └──────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────┘
                          │ HTTPS
                          ▼
┌─────────────────────────────────────────────────────────┐
│                   API SERVER (Render)                    │
│                                                          │
│   ┌────────────┐  ┌─────────────┐  ┌────────────────┐  │
│   │    Auth    │  │  Complaint  │  │     Admin      │  │
│   │  Middleware│  │  Controller │  │   Controller   │  │
│   └────────────┘  └─────────────┘  └────────────────┘  │
│                                                          │
│   ┌──────────────────────────────────────────────────┐  │
│   │              Prisma ORM Client                   │  │
│   └──────────────────────────────────────────────────┘  │
└─────────────────────────┬───────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│               PostgreSQL Database (Neon)                 │
│                                                          │
│   users    labs    complaints    status_logs             │
└─────────────────────────────────────────────────────────┘
```

---

## 🗄 Database Schema

```
┌─────────────┐         ┌──────────────────┐         ┌──────────────┐
│    users    │         │   complaints     │         │     labs     │
├─────────────┤         ├──────────────────┤         ├──────────────┤
│ id (PK)     │────┐    │ id (PK)          │    ┌────│ id (PK)      │
│ name        │    │    │ complaintNo      │    │    │ name         │
│ email       │    ├───►│ studentId (FK)   │    │    │ location     │
│ passwordHash│    │    │ labId (FK)       │◄───┘    │ building     │
│ role        │    └───►│ assignedToId (FK)│         │ isActive     │
│ department  │         │ issueType        │         └──────────────┘
│ isActive    │         │ title            │
└─────────────┘         │ description      │         ┌──────────────┐
                        │ urgency          │         │ status_logs  │
                        │ status           │         ├──────────────┤
                        │ adminNote        │    ┌────│ id (PK)      │
                        │ assignedAt       │    │    │ complaintId  │
                        │ resolvedAt       │────┘    │ changedById  │
                        └──────────────────┘         │ oldStatus    │
                                                     │ newStatus    │
                                                     │ note         │
                                                     │ changedAt    │
                                                     └──────────────┘
```

**Enums:**
- `Role`: student | technician | admin
- `Status`: open | assigned | in_progress | resolved | closed | rejected
- `IssueType`: hardware | software | electrical | furniture | network | other
- `Urgency`: low | medium | high

---

## 📡 API Reference

### Base URL
```
https://campuscare-backend-5ofg.onrender.com/api/v1
```

### Authentication
All protected routes require:
```
Authorization: Bearer <JWT_TOKEN>
```

### Endpoints

#### Auth
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/register` | Public | Register new user |
| POST | `/auth/login` | Public | Login + get token |
| GET | `/auth/me` | Any | Get current user |

#### Labs
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/labs` | Any | Get all active labs |

#### Student — Complaints
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/complaints` | Student | Submit complaint |
| GET | `/complaints` | Student | My complaints |
| GET | `/complaints/:id` | Student/Admin/Tech | Complaint detail |

#### Admin
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/admin/complaints` | Admin | All complaints |
| PUT | `/admin/complaints/:id/assign` | Admin | Assign technician |
| PUT | `/admin/complaints/:id/reject` | Admin | Reject complaint |
| GET | `/admin/technicians` | Admin | List technicians |

#### Technician
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/technician/complaints` | Technician | Assigned complaints |
| PUT | `/technician/complaints/:id/status` | Technician | Update status |

---

## 🔄 Complaint Lifecycle

```
Student Submits
      │
      ▼
   [ open ] ──────────────────────────────► [ rejected ]
      │                                      (Admin)
      │ Admin assigns technician
      ▼
 [ assigned ]
      │
      │ Technician starts work
      ▼
 [ in_progress ]
      │
      │ Technician resolves
      ▼
 [ resolved ]
      │
      │ Admin confirms
      ▼
  [ closed ]
```

Every status transition is:
- Validated server-side (invalid transitions rejected)
- Recorded in `status_logs` table with timestamp and actor

---

## 📁 Project Structure

### Backend
```
campuscare-backend/
├── src/
│   ├── config/
│   │   └── db.js                  # Prisma client
│   ├── controllers/
│   │   ├── auth.controller.js
│   │   ├── complaint.controller.js
│   │   ├── admin.controller.js
│   │   ├── technician.controller.js
│   │   └── labs.controller.js
│   ├── middleware/
│   │   ├── authenticate.js        # JWT verification
│   │   ├── authorize.js           # Role guard
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── complaint.routes.js
│   │   ├── admin.routes.js
│   │   ├── technician.routes.js
│   │   └── labs.routes.js
│   ├── utils/
│   │   ├── response.js            # Standard response envelope
│   │   └── complaintNumber.js     # CC-YYYY-XXXXX generator
│   └── app.js
├── prisma/
│   ├── schema.prisma
│   └── seed.js
├── server.js
└── .env
```

### Frontend
```
campuscare-frontend/
├── src/
│   ├── api/
│   │   └── axios.js               # Axios instance + all API functions
│   ├── context/
│   │   └── AuthContext.jsx        # Global auth state
│   ├── components/
│   │   └── StatusBadge.jsx        # Color-coded status pill
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── student/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── SubmitComplaint.jsx
│   │   │   └── ComplaintDetail.jsx
│   │   ├── admin/
│   │   │   └── Dashboard.jsx
│   │   └── technician/
│   │       └── Dashboard.jsx
│   └── App.jsx                    # Router + PrivateRoute
├── vercel.json                    # SPA routing fix
└── .env
```

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- npm v9+
- PostgreSQL (or free Neon account)

### Backend Setup

```bash
# 1. Clone repository
git clone https://github.com/YOURUSERNAME/campuscare-backend.git
cd campuscare-backend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env
# Fill in your values (see Environment Variables section)

# 4. Run database migration
npx prisma migrate dev --name init

# 5. Seed test data
npx prisma db seed

# 6. Start development server
npm run dev
```

Server runs at: `http://localhost:3001`

### Frontend Setup

```bash
# 1. Clone repository
git clone https://github.com/YOURUSERNAME/campuscare-frontend.git
cd campuscare-frontend

# 2. Install dependencies
npm install

# 3. Create .env file
echo "VITE_API_BASE_URL=http://localhost:3001/api/v1" > .env

# 4. Start development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

## 🔐 Environment Variables

### Backend `.env`
```env
PORT=3001
NODE_ENV=development
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/campuscare?sslmode=require
JWT_SECRET=your_64_character_random_secret_here
CLIENT_URL=http://localhost:5173
```

### Frontend `.env`
```env
VITE_API_BASE_URL=http://localhost:3001/api/v1
```

### Production (Render + Vercel)
Set these in your hosting platform dashboards — never commit real secrets to Git.

---

## 🚀 Deployment

### Backend → Render

1. Push code to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your `campuscare-backend` repository
4. Set build command: `npm install && npx prisma generate && npx prisma migrate deploy`
5. Set start command: `npm start`
6. Add environment variables from backend `.env`
7. Deploy

### Frontend → Vercel

1. Push code to GitHub (ensure `vercel.json` is committed)
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import `campuscare-frontend` repository
4. Framework: Vite (auto-detected)
5. Add environment variable: `VITE_API_BASE_URL`
6. Deploy

**`vercel.json`** (required for React Router):
```json
{
  "rewrites": [
    { "source": "/(.*)", "destination": "/" }
  ]
}
```

---

## 🧪 Test Credentials

All accounts use password: `Test@1234`

| Role | Email | Access |
|------|-------|--------|
| Admin | admin@college.edu | Full system access |
| Technician | ramesh@college.edu | Assigned complaints only |
| Student | riya@college.edu | Own complaints only |

---

## 👤 Author

**Om Wadekar**
- GitHub: [@omwadekar](https://github.com/omwadekar)
- Project built as part of full-stack development learning

---

## 📄 License

This project is licensed under the MIT License.

---

> ⚠️ **Note:** The backend is hosted on Render's free tier. The first request after inactivity may take 30–60 seconds to respond while the server wakes up. This is expected behavior.

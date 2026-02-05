# TaskFlow - Task & Employee Management System

> A full-stack web application for managing tasks and employees with real-time updates, built with React, Node.js, Express, and PostgreSQL.

[![Netlify Deploy](https://img.shields.io/badge/Deployed%20on-Netlify-00C7B7?logo=netlify)](https://taskfloooww.netlify.app)
[![Node.js](https://img.shields.io/badge/Node.js-v18+-339933?logo=node.js)](https://nodejs.org)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v14+-336791?logo=postgresql)](https://www.postgresql.org)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Demo](#demo)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Running Locally](#running-locally)
- [Deployment](#deployment)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)

---

## 🎯 Overview

TaskFlow is a comprehensive task and employee management system designed for team leaders and managers. It provides a centralized platform to:

- **Manage Tasks**: Create, assign, track, and update task status
- **Manage Employees**: Add employees, assign tasks, track performance
- **Real-time Analytics**: View dashboard with task statistics and employee metrics
- **Role-based Access**: Manager and Employee roles with different permissions
- **Cloud-based**: Fully deployed on Render (backend) and Netlify (frontend) with Neon PostgreSQL

---

## ✨ Features

### For Managers
- ✅ Create and assign tasks to employees
- ✅ Update task status and priority
- ✅ Add/edit/remove employees
- ✅ View comprehensive dashboard with analytics
- ✅ Filter tasks by status, priority, assignee, and search keywords
- ✅ Track employee performance and statistics
- ✅ Reset employee passwords

### For Employees
- ✅ View assigned tasks
- ✅ Update task status (Pending → In Progress → Completed)
- ✅ View personal dashboard
- ✅ Change password
- ✅ Track task completion rates

### General Features
- ✅ Secure JWT-based authentication
- ✅ CORS-enabled API for frontend-backend communication
- ✅ Cloud PostgreSQL database on Neon
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Real-time data synchronization
- ✅ Error handling and validation

---

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **Vite** - Build tool & dev server
- **Tailwind CSS** - Utility-first CSS framework
- **JavaScript (ES6+)** - Programming language

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **PostgreSQL** - Database
- **JWT (jsonwebtoken)** - Authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-Origin Resource Sharing
- **Dotenv** - Environment variables

### Deployment
- **Netlify** - Frontend hosting
- **Render** - Backend hosting
- **Neon** - PostgreSQL database hosting
- **Git/GitHub** - Version control

---

## 🚀 Demo

**Live Application**: [https://taskfloooww.netlify.app](https://taskfloooww.netlify.app)

### Test Credentials

**Manager Account:**
```
Username: lenok
Password: password123
```

**Employee Accounts:**
```
Username: nidal / wasim / sanin
Password: password123 (all)
```

---

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** v18 or higher ([Download](https://nodejs.org))
- **npm** v9 or higher (comes with Node.js)
- **PostgreSQL** v14 or higher (for local database, optional if using Railway)
- **Git** ([Download](https://git-scm.com))

---

## 💻 Installation

### 1. Clone the Repository
```bash
git clone https://github.com/IRFXN3671/TaskFlow.git
cd TaskFlow
```

### 2. Install Frontend Dependencies
```bash
npm install
```

### 3. Install Backend Dependencies
```bash
cd backend
npm install
cd ..
```

---

## 🏃 Running Locally

### Option A: Run Both Frontend & Backend (Recommended)

**Terminal 1 - Start Backend:**
```bash
cd backend
npm run dev
```
Backend runs on: `http://localhost:5000`

**Terminal 2 - Start Frontend:**
```bash
npm run dev
```
Frontend runs on: `http://localhost:5173`

### Option B: Frontend Only (Requires Running Backend)
```bash
npm run dev
```

### Option C: Production Build
```bash
npm run build
npm run preview
```

---

## 🌍 Deployment

### Prerequisites
- Render account ([Sign up](https://render.com))
- Neon account ([Sign up](https://neon.tech))
- Netlify account ([Sign up](https://netlify.com))
- GitHub account with repository

### Deploy Backend to Render

1. Go to [render.com](https://render.com)
2. Create a new Web Service and connect your GitHub repository
3. Configure build and start commands:
   - Build command: `cd backend && npm install`
   - Start command: `cd backend && npm start`
4. Add environment variables (see [Environment Variables](#environment-variables))
5. Render auto-deploys on every push to main branch

### Deploy Frontend to Netlify

1. Go to [netlify.com](https://netlify.com)
2. Connect your GitHub repository
3. Build settings:
   - Build command: `npm ci && npm run build`
   - Publish directory: `dist`
4. Add environment variable: `VITE_API_URL = <your-render-backend-url>/api`
5. Deploy

### Setup Cloud Database (Neon)

1. Go to [neon.tech](https://neon.tech) and create a new project
2. Get your PostgreSQL connection string
3. Run migrations on cloud database:
   ```bash
   $env:DB_HOST = "your-neon-host"
   $env:DB_PORT = "5432"
   $env:DB_NAME = "neondb"
   $env:DB_USER = "postgres"
   $env:DB_PASSWORD = "your-neon-password"
   npm run migrate
   npm run seed
   ```

---

## 📂 Project Structure

```
TaskFlow/
├── src/                              # Frontend source code
│   ├── components/                   # React components
│   │   ├── auth/                     # Login, auth components
│   │   ├── dashboard/                # Dashboard views
│   │   ├── employees/                # Employee management
│   │   ├── tasks/                    # Task management
│   │   ├── icons/                    # Icon components
│   │   └── shared/                   # Shared components
│   ├── services/                     # API services
│   │   ├── AuthService.js           # Authentication logic
│   │   ├── TaskService.js           # Task API calls
│   │   └── EmployeeService.js       # Employee API calls
│   ├── App.js                        # Main app component
│   └── index.css                     # Global styles
│
├── backend/                          # Backend source code
│   ├── server.js                     # Express app entry
│   ├── config/
│   │   └── database.js              # PostgreSQL connection
│   ├── controllers/                  # Business logic
│   │   ├── authController.js
│   │   ├── taskController.js
│   │   └── employeeController.js
│   ├── routes/                       # API routes
│   │   ├── auth.js
│   │   ├── tasks.js
│   │   └── employees.js
│   ├── middleware/
│   │   ├── auth.js                  # JWT verification
│   │   └── errorHandler.js
│   ├── migrations/                   # Database migrations
│   ├── utils/                        # Helper functions
│   ├── package.json
│   └── .env                          # Backend config
│
├── index.html                        # HTML entry point
├── vite.config.js                    # Vite configuration
├── tailwind.config.js                # Tailwind CSS config
├── package.json                      # Frontend dependencies
├── netlify.toml                      # Netlify deploy config
├── _redirects                        # Netlify routing rules
└── README.md                         # This file
```

---

## 🔐 Environment Variables

### Backend (.env)
```env
# Database Configuration (Neon PostgreSQL)
DB_HOST=your-neon-host.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USER=postgres
DB_PASSWORD=your-neon-password

# Server Configuration
PORT=5000
NODE_ENV=production

# Authentication
JWT_SECRET=your_very_long_random_secret_key_here_change_this

# CORS
CORS_ORIGIN=https://taskfloooww.netlify.app
```

### Frontend (Netlify Environment Variables)
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

---

## 📡 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user |
| POST | `/api/auth/change-password` | Change password |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks (with filtering) |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create new task |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| GET | `/api/tasks/stats` | Get dashboard statistics |

### Employees
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/active` | Get active employees |
| POST | `/api/employees` | Create employee |
| PUT | `/api/employees/:id` | Update employee |
| PATCH | `/api/employees/:id/status` | Toggle employee status |
| DELETE | `/api/employees/:id` | Delete employee |
| GET | `/api/employees/stats` | Get employee statistics |

---

## 🚀 Available Scripts

### Frontend
```bash
npm run dev           # Start development server
npm run build         # Build for production
npm run preview       # Preview production build
npm run lint          # Run ESLint (if configured)
```

### Backend
```bash
npm start            # Start production server
npm run dev          # Start with nodemon (auto-reload)
npm run migrate      # Run database migrations
npm run seed         # Seed database with test data
npm run rollback     # Rollback database migrations
```

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🆘 Troubleshooting

### Backend not connecting to database
- Check Neon database credentials in `.env`
- Verify Neon database host is accessible
- Ensure PostgreSQL service is running

### CORS errors
- Update `CORS_ORIGIN` in Render backend environment variables
- Ensure frontend URL matches exactly (with/without trailing slash)

### Build errors on Netlify
- Check `npm run build` works locally
- Verify all dependencies are in `package.json`
- Check Node.js version on Netlify matches local version

### Employees not showing in filters
- Ensure migrations and seed have been run on Neon database
- Check backend API is returning employees correctly
- Verify token is valid

---

## 📧 Support

For issues or questions, please:
1. Check existing GitHub issues
2. Create a new issue with detailed description
3. Include error messages and steps to reproduce

---

**Made with ❤️ by Irfan | Last Updated: February 2026**

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview the production build**
   ```bash
   npm run preview
   ```

---

## 📌 Notes
- Ensure **Node.js (>=16)** is installed.
- Configurations can be modified in `tailwind.config.js` and `vite.config.js`.

---

.
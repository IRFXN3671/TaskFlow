# Taskflow: Authentication & Database Integration Roadmap

## Overview
**Project Duration:** 10-14 days  
**Goal:** Migrate from mock data + localStorage to real backend with JWT authentication and external database

---

## **WEEK 1: Foundation & Backend Setup**

### **Day 1: Backend Project Initialization**
- [ ] Create `backend/` folder in project root
- [ ] Run `npm init -y` in backend folder
- [ ] Install dependencies: `npm install express cors dotenv bcryptjs jsonwebtoken mongoose`
- [ ] Create folder structure: `models/`, `routes/`, `middleware/`, `config/`
- [ ] Create `.env` file with placeholders for DATABASE_URL, JWT_SECRET, PORT
- [ ] Create `backend/server.js` with basic Express server
- [ ] Test: Run `node server.js` - server should start on port 5000
- [ ] **Deliverable:** Backend folder with basic Express server running

### **Day 2: Database Setup (Choose One Option)**

#### **Option A: MongoDB (Recommended - Faster Setup)**
- [ ] Create free MongoDB Atlas account (mongodb.com/cloud/atlas)
- [ ] Create new cluster (free tier M0)
- [ ] Create database user with strong password
- [ ] Get connection string from Atlas
- [ ] Add `MONGODB_URI` to `.env` file
- [ ] Install `mongoose`: `npm install mongoose`
- [ ] Test connection in `server.js`
- [ ] **Deliverable:** Database connection confirmed in console logs

#### **Option B: PostgreSQL (More Robust)**
- [ ] Create account on Render.com or Railway.app
- [ ] Create new PostgreSQL database
- [ ] Get connection string
- [ ] Add `DATABASE_URL` to `.env` file
- [ ] Install `pg`: `npm install pg`
- [ ] Test connection in `server.js`
- [ ] **Deliverable:** Database connection confirmed in console logs

### **Day 3: Create Database Models (MongoDB) OR Schema (PostgreSQL)**

#### **For MongoDB - Create These Models:**
- [ ] Create `backend/models/User.js`
  - Fields: id, username, email, password (hashed), role, createdAt, updatedAt
- [ ] Create `backend/models/Employee.js`
  - Fields: id, name, email, position, department, username, isActive, skills, joinedDate, lastLogin
- [ ] Create `backend/models/Task.js`
  - Fields: id, title, description, status, priority, assigneeId, managerId, createdAt, updatedAt, dueDate
- [ ] Add validation to each model
- [ ] **Deliverable:** 3 working Mongoose models with schema validation

#### **For PostgreSQL - Create These Tables:**
- [ ] Create `users` table: id, username, email, password_hash, role, created_at, updated_at
- [ ] Create `employees` table: id, name, email, position, department, username, is_active, skills[], joined_date, last_login
- [ ] Create `tasks` table: id, title, description, status, priority, assignee_id, manager_id, created_at, updated_at, due_date
- [ ] Create migration files
- [ ] **Deliverable:** All 3 tables created with proper relationships

### **Day 4: Authentication Middleware & Utilities**
- [ ] Create `backend/middleware/auth.js` - JWT verification middleware
- [ ] Create `backend/middleware/errorHandler.js` - Global error handling
- [ ] Create `backend/config/jwt.js` - Token generation & verification helpers
- [ ] Implement password hashing utility with bcryptjs
- [ ] Create role-based access control (RBAC) middleware
- [ ] Test middleware with Postman/Insomnia
- [ ] **Deliverable:** Working auth middleware tested with API calls

### **Day 5: Authentication Endpoints - Part 1**
- [ ] Create `backend/routes/auth.js`
- [ ] Implement POST `/api/auth/register` endpoint
  - Validate input (username, email, password)
  - Check if user already exists
  - Hash password with bcryptjs
  - Save user to database
  - Return user data (without password)
- [ ] Implement POST `/api/auth/login` endpoint
  - Validate username & password
  - Compare password hash
  - Generate JWT token
  - Return user data + token
- [ ] Add rate limiting on login endpoint (npm install express-rate-limit)
- [ ] Test with Postman - create test account and login
- [ ] **Deliverable:** Login/Register working, tokens being generated

### **Day 6: Authentication Endpoints - Part 2**
- [ ] Implement POST `/api/auth/refresh` endpoint
  - Verify refresh token
  - Generate new access token
- [ ] Implement POST `/api/auth/logout` endpoint
  - Invalidate token (optional: maintain blacklist in Redis or DB)
- [ ] Implement POST `/api/auth/change-password` endpoint
  - Verify current password
  - Hash new password
  - Update in database
- [ ] Implement GET `/api/auth/me` endpoint
  - Return current user info
  - Protected route (requires JWT)
- [ ] Test all endpoints in Postman
- [ ] **Deliverable:** All 5 auth endpoints working and tested

---

## **WEEK 2: Employee & Task APIs**

### **Day 7: Employee Management Endpoints**
- [ ] Create `backend/routes/employees.js`
- [ ] Implement GET `/api/employees` (manager only)
  - Fetch all employees from database
  - Support filters: department, isActive
- [ ] Implement GET `/api/employees/active` (accessible by all)
  - Fetch only active employees
- [ ] Implement GET `/api/employees/:id` (owner or manager)
  - Fetch single employee details
- [ ] Implement POST `/api/employees` (manager only)
  - Create new employee
  - Generate username from name
  - Set default password
  - Auto-create user account
- [ ] Implement PUT `/api/employees/:id` (manager only)
  - Update employee details
  - Update skills, department, position, etc.
- [ ] Test all endpoints with proper role checks
- [ ] **Deliverable:** All employee endpoints working with role-based access control

### **Day 8: Employee Deactivation & Dashboard**
- [ ] Implement PUT `/api/employees/:id/deactivate` (manager only)
  - Set isActive to false
  - Reassign tasks if needed
- [ ] Implement GET `/api/employees/stats` (manager only)
  - Return: total employees, active count, by department breakdown
- [ ] Create seed data migration - populate initial employees from your mockData
- [ ] Test data integrity
- [ ] **Deliverable:** Full employee CRUD operations working, data migration complete

### **Day 9: Task Management Endpoints - Part 1**
- [ ] Create `backend/routes/tasks.js`
- [ ] Implement GET `/api/tasks` (authenticated users)
  - For employees: show only their assigned tasks
  - For managers: show all tasks
  - Support filters: status, priority, assigneeId, search
  - Support sorting: dueDate, priority, createdAt
- [ ] Implement GET `/api/tasks/:id` (task owner or manager)
  - Fetch single task with assignee details populated
- [ ] Implement POST `/api/tasks` (manager only)
  - Create new task
  - Validate assignee exists
  - Set manager ID from JWT
  - Generate unique task ID
- [ ] Test filtering and sorting
- [ ] **Deliverable:** GET and POST tasks endpoints working

### **Day 10: Task Management Endpoints - Part 2**
- [ ] Implement PUT `/api/tasks/:id` (manager or task owner)
  - Update title, description, dueDate
  - Update assignee (manager only)
  - Update status and priority
  - Track updatedAt timestamp
- [ ] Implement DELETE `/api/tasks/:id` (manager only)
  - Soft delete (archive) or hard delete based on preference
- [ ] Implement PUT `/api/tasks/:id/status` (task owner or manager)
  - Quick status update endpoint
- [ ] Implement GET `/api/tasks/stats` (dashboard data)
  - Total tasks, by status, by priority
  - For managers: overall stats
  - For employees: their personal stats
- [ ] Seed task data
- [ ] **Deliverable:** Complete CRUD for tasks, all endpoints tested

---

## **WEEK 3: Frontend Integration**

### **Day 11: Frontend Setup & API Client**
- [ ] Add to `package.json`: `npm install axios`
- [ ] Create `src/services/ApiClient.js`
  - Axios instance with base URL pointing to `http://localhost:5000`
  - Request interceptor: add JWT token to headers
  - Response interceptor: handle 401/403 errors
  - Auto-redirect to login on 401
- [ ] Create `.env.local` file with `VITE_API_URL=http://localhost:5000`
- [ ] Test API client with a simple GET request
- [ ] **Deliverable:** API client working, can make authenticated requests

### **Day 12: Update AuthService for Backend**
- [ ] Update `src/services/AuthService.js`
  - Replace mock login with real API call to `/api/auth/login`
  - Replace mock register with API call to `/api/auth/register`
  - Update logout to call `/api/auth/logout`
  - Update changePassword to call `/api/auth/change-password`
  - Store JWT tokens (access + refresh) in localStorage
  - Add token refresh logic on 401 response
- [ ] Update Login component:
  - Replace mock credentials with real API validation
  - Show proper error messages from backend
  - Handle loading states during API call
- [ ] Test: Login with real database credentials
- [ ] **Deliverable:** Real login/logout working with backend

### **Day 13: Update Task & Employee Services**
- [ ] Update `src/services/TaskService.js`
  - Replace mock task data with API calls
  - GET `/api/tasks` - getAllTasks()
  - POST `/api/tasks` - createTask()
  - PUT `/api/tasks/:id` - updateTask()
  - DELETE `/api/tasks/:id` - deleteTask()
  - GET `/api/tasks/stats` - getDashboardStats()
  - Remove localStorage dependency
- [ ] Update `src/services/EmployeeService.js`
  - Replace mock employees with API calls
  - GET `/api/employees` - getAllEmployees()
  - GET `/api/employees/active` - getActiveEmployees()
  - POST `/api/employees` - createEmployee()
  - PUT `/api/employees/:id` - updateEmployee()
  - Remove localStorage dependency
- [ ] Handle loading states in components
- [ ] **Deliverable:** All services connected to backend APIs

### **Day 14: Testing, Security & Deployment Prep**
- [ ] Create `src/components/ProtectedRoute.js`
  - Redirect unauthenticated users to login
  - Check token validity on app load
  - Refresh token if needed
- [ ] Update `src/App.js` to use ProtectedRoute wrapper
- [ ] Test complete user flow:
  - New user registration
  - Login/logout
  - Create task
  - Update task
  - Change password
  - Role-based access (employee sees only their tasks)
- [ ] Error handling:
  - Handle network errors
  - Handle 401/403 properly
  - Show user-friendly error messages
- [ ] Performance checks:
  - Remove console.logs from production code
  - Check for unused imports
  - Verify API response times
- [ ] **Deliverable:** Complete end-to-end working application

---

## **Post-Completion: Production Deployment**

### **Backend Deployment (Render or Railway)**
- [ ] Set environment variables on hosting platform
- [ ] Deploy backend
- [ ] Update frontend `.env` to point to production backend URL
- [ ] Test all endpoints in production

### **Frontend Deployment**
- [ ] Update `vite.config.js` for production build
- [ ] Run `npm run build`
- [ ] Deploy to Netlify
- [ ] Update CORS settings in backend for production domain

---

## **Technology Stack Summary**

| Component | Technology | Status |
|-----------|-----------|--------|
| Frontend | React 18 + Vite | ✅ Existing |
| Styling | Tailwind CSS | ✅ Existing |
| Backend | Node.js + Express | 📋 To Create |
| Database | MongoDB or PostgreSQL | 📋 To Create |
| Authentication | JWT + bcryptjs | 📋 To Create |
| API Client | Axios | 📋 To Add |
| Environment | dotenv | 📋 To Add |

---

## **Dependencies Checklist**

### **Backend (package.json)**
```
✅ express
✅ cors
✅ dotenv
✅ bcryptjs
✅ jsonwebtoken
✅ mongoose (for MongoDB) OR pg (for PostgreSQL)
✅ express-rate-limit (for security)
```

### **Frontend (package.json)**
```
✅ axios
```

---

## **Key Testing Scenarios**

- [ ] Manager can create employees and tasks
- [ ] Employee can only see their assigned tasks
- [ ] Employee can change their password
- [ ] Inactive employees cannot login
- [ ] Tokens refresh automatically
- [ ] API returns proper error messages
- [ ] Tasks filter and sort correctly
- [ ] Database persists data across server restarts
- [ ] CORS works correctly between frontend and backend

---

## **Notes & Tips**

1. **Start with MongoDB** - it's easier and requires no separate schema setup
2. **Test with Postman/Insomnia** - before connecting frontend
3. **Use seed scripts** - to populate initial data quickly
4. **Keep .env files private** - never commit to git
5. **Log API responses** - in development to debug issues
6. **Test role-based access** - make sure managers/employees have correct permissions
7. **Backup your database** - especially before major changes
8. **Monitor API response times** - optimize slow endpoints

---

## **Completed Tasks Progress**

- [ ] **Day 1** Backend Initialization
- [ ] **Day 2** Database Setup
- [ ] **Day 3** Database Models/Schema
- [ ] **Day 4** Auth Middleware
- [ ] **Day 5** Auth Endpoints Part 1
- [ ] **Day 6** Auth Endpoints Part 2
- [ ] **Day 7** Employee Endpoints
- [ ] **Day 8** Employee Features & Migration
- [ ] **Day 9** Task Endpoints Part 1
- [ ] **Day 10** Task Endpoints Part 2
- [ ] **Day 11** Frontend API Client
- [ ] **Day 12** Update AuthService
- [ ] **Day 13** Update Services
- [ ] **Day 14** Testing & Security

---

**Generated:** January 7, 2026  
**Estimate:** 10-14 days with 4-6 hours daily commitment
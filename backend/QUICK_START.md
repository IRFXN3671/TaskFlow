# 🚀 QUICK START GUIDE - PHASE 1

## Installation & Setup (First Time Only)

```bash
# 1. Install dependencies
npm install

# 2. Create PostgreSQL database
npm run setup-db

# 3. Create tables (migrations)
npm run migrate

# 4. Populate sample data
npm run seed
```

---

## Running the Server

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Server runs at: `http://localhost:5000`

---

## API TEST WORKFLOW

### 1. Get Authentication Token
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"manager1","password":"password123"}'
```

**Response:**
```json
{
  "user": {
    "id": 1,
    "username": "manager1",
    "role": "manager",
    "name": "Irfan"
  },
  "token": "eyJhbGc..."
}
```

Copy the `token` value for next requests.

---

### 2. Use Token in API Calls

Add this header to all protected endpoints:
```
Authorization: Bearer <token_from_login>
```

Example:
```bash
curl -X GET http://localhost:5000/api/tasks \
  -H "Authorization: Bearer eyJhbGc..."
```

---

## KEY ENDPOINTS

### **Tasks**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tasks` | Get all tasks |
| GET | `/api/tasks/:id` | Get single task |
| POST | `/api/tasks` | Create task (Manager) |
| PUT | `/api/tasks/:id` | Update task (Manager) |
| DELETE | `/api/tasks/:id` | Delete task (Manager) |
| GET | `/api/tasks/stats` | Dashboard statistics |

### **Employees**
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/employees` | Get all employees |
| GET | `/api/employees/active` | Get active only |
| GET | `/api/employees/:id` | Get single employee |
| POST | `/api/employees` | Create employee (Manager) |
| PUT | `/api/employees/:id` | Update employee (Manager) |
| PATCH | `/api/employees/:id/status` | Toggle status (Manager) |
| DELETE | `/api/employees/:id` | Delete employee (Manager) |
| GET | `/api/employees/stats` | Employee statistics (Manager) |

### **Auth**
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| POST | `/api/auth/change-password` | Change password |

---

## TEST CREDENTIALS

```
Manager:
  Username: manager1
  Password: password123

Employees:
  Username: employee1  Password: password123
  Username: employee2  Password: password123
  Username: employee3  Password: password123
```

---

## COMMON TASKS

### Get all pending tasks
```bash
curl -X GET "http://localhost:5000/api/tasks?status=pending" \
  -H "Authorization: Bearer <TOKEN>"
```

### Get high-priority tasks sorted by due date
```bash
curl -X GET "http://localhost:5000/api/tasks?priority=high&sortBy=due_date&sortOrder=ASC" \
  -H "Authorization: Bearer <TOKEN>"
```

### Get tasks assigned to employee with ID 2
```bash
curl -X GET "http://localhost:5000/api/tasks?assigneeId=2" \
  -H "Authorization: Bearer <TOKEN>"
```

### Search for tasks with keyword
```bash
curl -X GET "http://localhost:5000/api/tasks?search=design" \
  -H "Authorization: Bearer <TOKEN>"
```

### Create a new task (Manager only)
```bash
curl -X POST http://localhost:5000/api/tasks \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Fix Login Bug",
    "description": "Mobile login not working",
    "status": "pending",
    "priority": "high",
    "dueDate": "2025-02-10",
    "assigneeId": 2
  }'
```

### Update task status (Manager only)
```bash
curl -X PUT http://localhost:5000/api/tasks/1 \
  -H "Authorization: Bearer <TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"status": "in-progress"}'
```

### Get employee statistics (Manager only)
```bash
curl -X GET http://localhost:5000/api/employees/stats \
  -H "Authorization: Bearer <TOKEN>"
```

---

## ERROR RESPONSES

All errors follow this format:
```json
{
  "success": false,
  "message": "Error message"
}
```

### Common Status Codes
- **200**: Success (GET, PUT, DELETE)
- **201**: Created (POST)
- **400**: Bad Request (validation error)
- **401**: Unauthorized (no token or expired)
- **403**: Forbidden (insufficient permissions)
- **404**: Not Found (resource doesn't exist)
- **500**: Server Error

---

## FILES REFERENCE

| File | Purpose |
|------|---------|
| `server.js` | Main Express app |
| `config/database.js` | DB connection |
| `controllers/` | Business logic |
| `routes/` | API endpoints |
| `middleware/auth.js` | JWT verification |
| `migrations/` | Database schema |
| `.env` | Configuration (keep private!) |
| `seed-data.js` | Sample data |
| `API_ENDPOINTS.md` | Full API docs |
| `PHASE_1_COMPLETE.md` | Detailed summary |

---

## ENVIRONMENT VARIABLES

```bash
NODE_ENV=development           # Environment mode
PORT=5000                      # Server port
DB_HOST=localhost              # Database host
DB_PORT=5432                   # Database port
DB_NAME=taskflow_db           # Database name
DB_USER=postgres              # DB username
DB_PASSWORD=your_password      # DB password
JWT_SECRET=your_secret_key    # Token signing key
JWT_EXPIRY=24h                # Token expiration
API_URL=http://localhost:5000 # API base URL
```

---

## RESETTING EVERYTHING

```bash
# Stop server (Ctrl+C)

# Rollback database
npm run rollback

# Drop and recreate
npm run setup-db
npm run migrate
npm run seed
```

---

## NEXT STEPS

1. ✅ Backend Phase 1 Complete
2. 📋 Connect React frontend to API
3. 🔐 Add input validation
4. 📊 Add logging & monitoring
5. 🧪 Write tests

---

**Need help?** Check `API_ENDPOINTS.md` for complete endpoint documentation.

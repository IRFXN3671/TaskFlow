# TaskFlow Backend API - Test Endpoints

## BASE URL
http://localhost:5000/api

## 1. LOGIN (Get Token)
POST /auth/login
Content-Type: application/json

{
  "username": "manager1",
  "password": "password123"
}

### Response:
{
  "user": {
    "id": 1,
    "username": "manager1",
    "role": "manager",
    "name": "Irfan"
  },
  "token": "eyJhbGc..."
}

---

## 2. GET CURRENT USER
GET /auth/me
Authorization: Bearer <token_from_login>

---

## 3. GET ALL TASKS
GET /tasks
Authorization: Bearer <token>

### Query Parameters (optional):
- status=pending|in-progress|completed
- priority=low|medium|high
- assigneeId=2
- search=Design
- sortBy=due_date|priority|created_at|status
- sortOrder=ASC|DESC

### Example:
GET /tasks?status=pending&priority=high&sortBy=due_date&sortOrder=DESC

---

## 4. GET SINGLE TASK
GET /tasks/:id
Authorization: Bearer <token>

Example:
GET /tasks/1

---

## 5. CREATE TASK (Manager Only)
POST /tasks
Authorization: Bearer <manager_token>
Content-Type: application/json

{
  "title": "Fix Login Bug",
  "description": "Login button not working on mobile",
  "status": "pending",
  "priority": "high",
  "dueDate": "2025-02-10",
  "assigneeId": 2
}

---

## 6. UPDATE TASK (Manager Only)
PUT /tasks/:id
Authorization: Bearer <manager_token>
Content-Type: application/json

{
  "status": "in-progress",
  "priority": "medium"
}

---

## 7. DELETE TASK (Manager Only)
DELETE /tasks/:id
Authorization: Bearer <manager_token>

---

## 8. GET DASHBOARD STATS
GET /tasks/stats
Authorization: Bearer <token>

Response includes:
- totalTasks
- completedTasks
- pendingTasks
- inProgressTasks
- overdueTasks
- tasksByPriority
- completionRate

---

## 9. GET ALL EMPLOYEES
GET /employees
Authorization: Bearer <token>

---

## 10. GET ACTIVE EMPLOYEES ONLY
GET /employees/active
Authorization: Bearer <token>

---

## 11. GET SINGLE EMPLOYEE
GET /employees/:id
Authorization: Bearer <token>

Example:
GET /employees/2

---

## 12. CREATE EMPLOYEE (Manager Only)
POST /employees
Authorization: Bearer <manager_token>
Content-Type: application/json

{
  "name": "Ahmed Hassan",
  "email": "ahmed@taskflow.com",
  "position": "Full Stack Developer",
  "department": "Development",
  "username": "ahmed_hassan",
  "password": "initial_password",
  "skills": ["React", "Node.js", "MongoDB"]
}

---

## 13. UPDATE EMPLOYEE (Manager Only)
PUT /employees/:id
Authorization: Bearer <manager_token>
Content-Type: application/json

{
  "position": "Senior Developer",
  "department": "Development",
  "skills": ["React", "Node.js", "MongoDB", "AWS"]
}

---

## 14. TOGGLE EMPLOYEE STATUS (Manager Only)
PATCH /employees/:id/status
Authorization: Bearer <manager_token>

---

## 15. RESET EMPLOYEE PASSWORD (Manager Only)
POST /employees/:id/reset-password
Authorization: Bearer <manager_token>

Response:
{
  "success": true,
  "message": "Password reset successfully",
  "username": "employee1",
  "newPassword": "password123"
}

---

## 16. DELETE EMPLOYEE (Manager Only)
DELETE /employees/:id
Authorization: Bearer <manager_token>

---

## 17. GET EMPLOYEE STATISTICS (Manager Only)
GET /employees/stats
Authorization: Bearer <manager_token>

Response includes:
- totalEmployees
- activeEmployees
- inactiveEmployees
- tasksByEmployee (with task counts)

---

## 18. CHANGE PASSWORD
POST /auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "password123",
  "newPassword": "new_password_123"
}

---

## 19. HEALTH CHECK
GET /health

---

## TEST DATA CREDENTIALS

Manager:
- Username: manager1
- Password: password123

Employees:
- Username: employee1, Password: password123 (Nidal)
- Username: employee2, Password: password123 (Wasim)
- Username: employee3, Password: password123 (Sanin)

---

## ERROR RESPONSES

All endpoints return errors in this format:
{
  "success": false,
  "message": "Error message here"
}

Common Status Codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized (no token or invalid token)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Server Error

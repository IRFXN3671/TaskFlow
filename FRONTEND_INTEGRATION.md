# 🔗 FRONTEND-BACKEND INTEGRATION GUIDE

## ✅ What's Been Updated

Your React frontend services have been updated to connect to the backend API:

### **Updated Services:**

1. **AuthService.js** ✅
   - `login()` - Calls `/api/auth/login`
   - `logout()` - Clears tokens
   - `changePassword()` - Calls `/api/auth/change-password`
   - Stores JWT token in localStorage

2. **TaskService.js** ✅
   - `getAllTasks()` - Calls `/api/tasks` with filtering/sorting
   - `createTask()` - Calls `POST /api/tasks`
   - `updateTask()` - Calls `PUT /api/tasks/:id`
   - `deleteTask()` - Calls `DELETE /api/tasks/:id`
   - `getDashboardStats()` - Calls `GET /api/tasks/stats`

3. **EmployeeService.js** ✅
   - `getAllEmployees()` - Calls `/api/employees`
   - `getActiveEmployees()` - Calls `/api/employees/active`
   - `createEmployee()` - Calls `POST /api/employees`
   - `updateEmployee()` - Calls `PUT /api/employees/:id`
   - `toggleEmployeeStatus()` - Calls `PATCH /api/employees/:id/status`
   - `resetPassword()` - Calls `POST /api/employees/:id/reset-password`
   - `deleteEmployee()` - Calls `DELETE /api/employees/:id`
   - `getEmployeeStats()` - Calls `GET /api/employees/stats`

---

## 🚀 HOW TO RUN

### **Terminal 1: Start Backend Server**
```bash
cd backend
npm start
```
Server runs on: `http://localhost:5000`

### **Terminal 2: Start Frontend Server**
```bash
npm run dev
```
Frontend runs on: `http://localhost:5173`

---

## ✨ KEY FEATURES IMPLEMENTED

### **Automatic Token Management**
- Token is stored after successful login
- Token is automatically included in all API requests
- Token is removed on logout

### **Error Handling**
All service methods throw errors with descriptive messages that can be caught by components

### **API Response Transformation**
Frontend expects camelCase properties, backend returns snake_case:
- `user_id` → `userId`
- `is_active` → `isActive`
- `due_date` → `dueDate`
- `created_at` → `createdAt`
- `updated_at` → `updatedAt`

---

## 🧪 TESTING THE INTEGRATION

### **Test Login**
```bash
# In another terminal, after both servers are running
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"manager1","password":"password123"}'
```

### **Open Browser**
1. Go to `http://localhost:5173`
2. Login with credentials:
   - Username: `manager1`
   - Password: `password123`
3. You should see the dashboard with real data from the database

---

## 📊 WHAT DATA FLOWS WHERE

```
User Input
    ↓
React Component
    ↓
Service Method (e.g., taskService.createTask())
    ↓
Fetch API Call to Backend
    ↓
Backend API Endpoint (e.g., POST /api/tasks)
    ↓
Database Operation
    ↓
JSON Response
    ↓
Component Updates State
    ↓
UI Re-renders
```

---

## 🔐 AUTHENTICATION FLOW

1. **Login Page**
   - User enters credentials
   - `authService.login(username, password)` called
   - Backend validates and returns JWT token
   - Token stored in localStorage

2. **Subsequent Requests**
   - `authService.getToken()` gets token from localStorage
   - Token added to `Authorization: Bearer <token>` header
   - Backend validates token and processes request

3. **Logout**
   - `authService.logout()` removes token from localStorage
   - User redirected to login page

---

## 🎯 COMMON OPERATIONS

### **Fetch All Tasks**
```javascript
const tasks = await taskService.getAllTasks(
  { status: 'pending', priority: 'high' },
  { field: 'dueDate', direction: 'asc' }
);
```

### **Create New Task**
```javascript
const newTask = await taskService.createTask({
  title: 'Fix Login Bug',
  description: 'Mobile login not working',
  status: 'pending',
  priority: 'high',
  dueDate: '2025-02-15',
  assigneeId: 2
});
```

### **Change Password**
```javascript
await authService.changePassword(
  'currentPassword123',
  'newPassword456'
);
```

### **Get Dashboard Stats**
```javascript
const stats = await taskService.getDashboardStats();
// Returns: { totalTasks, completedTasks, pendingTasks, inProgressTasks, overdueTasks, tasksByPriority, completionRate }
```

---

## ⚙️ ENVIRONMENT VARIABLES

Vite automatically picks up `http://localhost:5000/api` for development.

To change it, update `vite.config.js`:
```javascript
define: {
  'import.meta.env.VITE_API_URL': JSON.stringify('http://your-backend-url/api')
}
```

---

## 🔄 API RESPONSE HANDLING

All responses from backend follow this format:

### **Success Response**
```json
{
  "success": true,
  "data": { /* resource data */ },
  "count": 10
}
```

### **Error Response**
```json
{
  "success": false,
  "message": "Error description"
}
```

### **In Components, Handle Like This**
```javascript
try {
  const tasks = await taskService.getAllTasks();
  setTasks(tasks);
} catch (error) {
  setError(error.message);
  console.error('Failed to fetch tasks:', error);
}
```

---

## 📱 COMPONENT UPDATES NEEDED

Some components may need updates to handle async operations:

### **Example: TaskCard Component**
```javascript
// Change from sync to async
const handleStatusChange = async (taskId, newStatus) => {
  try {
    setLoading(true);
    await taskService.updateTask(taskId, { status: newStatus });
    // Refresh tasks
    const updatedTasks = await taskService.getAllTasks();
    setTasks(updatedTasks);
  } catch (error) {
    setError(error.message);
  } finally {
    setLoading(false);
  }
};
```

---

## 🐛 DEBUGGING

### **Check if Backend is Running**
```bash
curl http://localhost:5000/api/health
# Should return: { "status": "ok", "message": "Server is running" }
```

### **Check if Frontend Can Reach Backend**
Open browser DevTools → Network tab → Login → Check API calls

### **Check Token Storage**
```javascript
// In browser console
localStorage.getItem('task_tracker_token')
localStorage.getItem('task_tracker_user')
```

### **Check Server Logs**
Look at terminal where backend is running for error messages

---

## ✅ CHECKLIST FOR FULL INTEGRATION

- [ ] Backend server running on port 5000
- [ ] Frontend server running on port 5173
- [ ] Successfully login with manager1/password123
- [ ] See tasks from database on dashboard
- [ ] Can create a new task
- [ ] Can update task status
- [ ] Can delete a task
- [ ] Dashboard stats display correctly
- [ ] Can view employees list
- [ ] Can change password (Manager only in production)
- [ ] Logout clears token and redirects to login

---

## 🎉 YOU'RE CONNECTED!

Your frontend is now fully integrated with the backend API. All operations use real database instead of mock data!

**Next Steps:**
1. Test all features thoroughly
2. Handle edge cases and errors
3. Proceed to Phase 2 (Validation & Error Handling)

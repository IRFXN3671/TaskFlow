# 🧪 COMPLETE TESTING GUIDE - STEP BY STEP

## 🎯 GOAL
Test that your frontend and backend are fully integrated and working together with a real database.

---

## ✅ PREREQUISITES

Before starting, verify:
- ✅ PostgreSQL is running
- ✅ `npm run migrate` was successful
- ✅ `npm run seed` was successful
- ✅ Both `backend` and frontend folders exist
- ✅ All dependencies installed (`npm install`)

---

## 📋 TESTING CHECKLIST

- [ ] Backend server starts successfully
- [ ] Database is accessible
- [ ] Frontend server starts successfully
- [ ] Login works with real credentials
- [ ] Dashboard displays data from database
- [ ] Can create a new task
- [ ] Can update a task
- [ ] Can delete a task
- [ ] Employee list loads from database
- [ ] Can view employee details
- [ ] Dashboard statistics are accurate
- [ ] Filtering works
- [ ] Sorting works
- [ ] Password change works

---

# 🚀 STEP-BY-STEP SETUP & TESTING

## STEP 1: Verify Database Setup

### Open PowerShell and navigate to backend folder:
```powershell
cd "d:\Projects\Taskflow\Version 5 - Backend implementation\backend"
```

### Check if migrations were run:
```powershell
npm run migrate
```

**Expected Output:**
```
📦 Running migrations...
✓ Users table created
✓ Employees table created
✓ Tasks table created
✅ All migrations completed!
```

If you see "already exists" messages, that's fine - it means tables are already there.

---

## STEP 2: Seed Sample Data

### Run seed script:
```powershell
npm run seed
```

**Expected Output:**
```
📦 Seeding database...
🗑️  Clearing existing data...
👤 Creating manager user...
👥 Creating employee users...
📝 Creating sample tasks...

✅ Database seeded successfully!

📊 Seed data:
   - 1 Manager: manager1 / password123
   - 3 Employees: employee1, employee2, employee3 / password123
   - 6 Sample tasks
```

**If you get an error:**
- Make sure PostgreSQL is running
- Check .env file has correct credentials
- Try `npm run setup-db` first, then `npm run migrate`, then `npm run seed`

---

## STEP 3: Start Backend Server

### In the same PowerShell terminal (backend folder):
```powershell
npm start
```

**Expected Output:**
```
[dotenv@17.2.3] injecting env (10) from .env...
🚀 Server running on http://localhost:5000
📚 API Documentation: http://localhost:5000/api/docs
```

**If you see this, backend is running! ✅**

**If you get "port already in use" error:**
- Kill the process on port 5000: `netstat -ano | findstr :5000`
- Or change PORT in .env file to 5001

**Do NOT close this terminal - backend must stay running!**

---

## STEP 4: Open New PowerShell Terminal for Frontend

### Open **NEW PowerShell window** (keep backend running in previous window)

### Navigate to frontend folder:
```powershell
cd "d:\Projects\Taskflow\Version 5 - Backend implementation"
```

### Start frontend server:
```powershell
npm run dev
```

**Expected Output:**
```
  VITE v5.3.1  ready in 234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

**If you see this, frontend is running! ✅**

**Do NOT close this terminal - frontend must stay running!**

---

## STEP 5: Test in Browser

### Open your browser and go to:
```
http://localhost:5173
```

You should see the **TaskFlow login page**.

---

# 🧪 TEST 1: LOGIN

## Test Login with Manager Account

### In the login page:
1. **Username**: `manager1`
2. **Password**: `password123`
3. Click **Login**

**Expected Result:**
- Login successful ✅
- Redirected to dashboard
- See "Welcome, Irfan" or similar greeting
- See 6 sample tasks displayed
- See dashboard statistics

**If login fails:**
- Check console for error (F12 → Console tab)
- Verify backend is running (check terminal window 1)
- Verify database was seeded (`npm run seed`)

---

# 🧪 TEST 2: VERIFY DASHBOARD DATA

## Check Dashboard Statistics

### You should see:
- **Total Tasks**: 6
- **Completed**: 2
- **In Progress**: 2
- **Pending**: 2
- **Overdue**: Some number
- **By Priority**: High, Medium, Low counts
- **Completion Rate**: ~33.33%

**What this proves:**
✅ Frontend can fetch data from backend
✅ Database contains seeded data
✅ API calls are working
✅ Token authentication is working

---

# 🧪 TEST 3: VIEW TASKS

## Check Task List

### You should see 6 tasks:
1. "Design Homepage Layout" - In Progress - High
2. "API Documentation Update" - Pending - Medium
3. "Database Migration Script" - Completed - High
4. "User Testing Session" - Pending - Medium
5. "Security Audit" - In Progress - High
6. "Mobile App Testing" - Completed - Low

**Click on any task card**
- Should show full details
- Should be able to see assignee name
- Should see due dates

**What this proves:**
✅ Data fetching works
✅ API authentication works
✅ Database queries work

---

# 🧪 TEST 4: CREATE NEW TASK

## Add a New Task

### Step 1: Click "+ Add Task" button
- A modal/form should open

### Step 2: Fill in the form:
```
Title: Test Task Created Today
Description: This task was created to test the integration
Status: Pending
Priority: High
Due Date: 2025-02-15
Assign To: Select any employee (e.g., Nidal)
```

### Step 3: Click "Create" or "Save"

**Expected Result:**
- Modal closes
- New task appears at top of list (or based on sort)
- Task shows with all the data you entered
- Task is saved to database

**To verify it's in database:**
1. Refresh the page (F5)
2. New task should still be there
3. This proves it was saved to PostgreSQL!

**If task doesn't appear:**
- Check browser console (F12) for errors
- Check backend console for error messages
- Verify user has manager role

---

# 🧪 TEST 5: UPDATE TASK STATUS

## Change a Task Status

### Step 1: Find the task "Test Task Created Today"

### Step 2: Change its status
- Click on task → Change status dropdown
- Change from "Pending" to "In Progress"
- Save changes

**Expected Result:**
- Status changes immediately
- Task is updated in database
- Refresh page - status still changed

**What this proves:**
✅ PUT requests work
✅ Database updates work
✅ Real-time data synchronization

---

# 🧪 TEST 6: UPDATE TASK PRIORITY

## Change Task Priority

### Step 1: Find any task

### Step 2: Change its priority
- Click task
- Change priority dropdown
- Save changes

**Expected Result:**
- Priority changes
- Persists after refresh

**What this proves:**
✅ Partial updates work
✅ Multiple fields can be updated

---

# 🧪 TEST 7: DELETE TASK

## Delete a Task

### Step 1: Find "Test Task Created Today"

### Step 2: Click delete button (trash icon)

### Step 3: Confirm deletion if prompted

**Expected Result:**
- Task disappears from list
- Refresh page (F5)
- Task is still gone
- Dashboard stats update (total tasks decreased)

**What this proves:**
✅ DELETE requests work
✅ Database deletes work
✅ Real-time updates work

---

# 🧪 TEST 8: FILTER TASKS

## Test Task Filtering

### Filter by Status:
1. Click filter dropdown
2. Select "Completed"
3. Should see only 2 completed tasks

**Expected Result:**
- Only tasks with status "completed" shown
- Count matches statistics

### Filter by Priority:
1. Reset filter
2. Select "High" priority
3. Should see high priority tasks

**Expected Result:**
- Only high priority tasks shown

**What this proves:**
✅ Filtering API works
✅ Query parameters work

---

# 🧪 TEST 9: SORT TASKS

## Test Task Sorting

### Sort by Due Date:
1. Click sort dropdown
2. Select "Due Date - Ascending"
3. Tasks should be ordered by due date

### Sort by Priority:
1. Click sort dropdown
2. Select "Priority - Descending"
3. High priority tasks appear first

**What this proves:**
✅ Sorting API works
✅ Multiple sort options work

---

# 🧪 TEST 10: VIEW EMPLOYEES

## Check Employee List

### In the app, find the Employees section

### You should see:
- **Nidal** - Frontend Developer - Development
- **Wasim** - Backend Developer - Development
- **Sanin** - QA Engineer - Quality Assurance

**Click on each employee**
- Should see full details
- Should see joined date
- Should see status (active/inactive)

**What this proves:**
✅ Employee data fetches from database
✅ API authentication works for different endpoints

---

# 🧪 TEST 11: CHANGE PASSWORD

## Test Password Change

### Step 1: Find Settings or Profile menu
- Usually in top right corner

### Step 2: Click "Change Password"

### Step 3: Fill in form:
```
Current Password: password123
New Password: newpassword456
Confirm Password: newpassword456
```

### Step 4: Click "Save"

**Expected Result:**
- Success message appears
- Password is changed in database

### Step 5: Test new password
1. Click Logout
2. Try to login with `manager1` / `newpassword456`
3. Should work!

**What this proves:**
✅ Backend password update works
✅ Password hashing works
✅ Changes persist in database

---

# 🧪 TEST 12: LOGOUT

## Test Logout

### Click Logout button
- Should redirect to login page
- Token should be removed from localStorage

**Verify token is removed:**
1. Open Developer Tools (F12)
2. Go to Application tab
3. Check Local Storage
4. `task_tracker_token` should be gone

**What this proves:**
✅ Session management works
✅ Security is properly implemented

---

# 🧪 TEST 13: LOGIN WITH EMPLOYEE

## Test Employee Account

### Step 1: Login with employee account:
```
Username: employee1
Password: password123
```

**Expected Result:**
- Employee can login
- Dashboard shows only THEIR tasks (not all tasks)
- Can't see "Add Task" button (employees can't create)
- Can't see "Employee Management" section

**What this proves:**
✅ Role-based access control works
✅ Data isolation works (employees see only their data)
✅ Permissions work correctly

---

# 🆘 TROUBLESHOOTING

## Problem: "Cannot reach server" or "Failed to fetch"

**Solution:**
1. Check backend is running: Look at terminal 1
2. Check backend console for errors
3. Verify port 5000 is open: `netstat -ano | findstr :5000`
4. Restart backend: Stop (Ctrl+C) and run `npm start`

---

## Problem: Login fails with "Invalid credentials"

**Solution:**
1. Verify credentials are exactly: `manager1` / `password123`
2. Check database was seeded: `npm run seed`
3. Check error in backend console
4. Verify PostgreSQL is running

---

## Problem: Tasks don't appear on dashboard

**Solution:**
1. Open browser console (F12)
2. Check for API errors
3. Check backend console for errors
4. Verify user logged in successfully
5. Try refresh (F5)
6. Check network tab in DevTools

---

## Problem: "Port 5173 already in use"

**Solution:**
1. Kill existing process: `Get-Process node | Stop-Process -Force`
2. Or use different port: Modify `vite.config.js`
3. Change `port: 5173` to `port: 5174`

---

## Problem: Database errors

**Solution:**
1. Verify PostgreSQL is running
2. Check .env file credentials
3. Run: `npm run migrate`
4. Run: `npm run seed`
5. Check PostgreSQL logs

---

# ✅ COMPLETE TEST SUMMARY

When all tests pass, you've verified:

✅ Backend server works
✅ Database connection works
✅ Authentication works
✅ JWT tokens work
✅ Frontend can fetch data
✅ CRUD operations work
✅ Filtering works
✅ Sorting works
✅ Role-based access works
✅ Data persists in database
✅ Password changes work
✅ Logout works

---

# 🎉 YOU'RE DONE TESTING!

If all tests pass, your integration is complete and working perfectly!

**Next Steps:**
- Phase 2: Input validation & error handling
- Phase 3: Testing (unit, integration, E2E)
- Phase 4: DevOps & deployment

---

# 📊 EXPECTED TEST RESULTS

| Test | Expected | Actual | Pass |
|------|----------|--------|------|
| Backend starts | Server on 5000 | | ☐ |
| Database seeds | 1 manager, 3 employees, 6 tasks | | ☐ |
| Frontend starts | App on 5173 | | ☐ |
| Manager login | Successful | | ☐ |
| Dashboard loads | 6 tasks visible | | ☐ |
| Create task | New task appears | | ☐ |
| Update task | Changes persist | | ☐ |
| Delete task | Task removed | | ☐ |
| Filter works | Correct tasks shown | | ☐ |
| Sort works | Correct order | | ☐ |
| View employees | 3 employees shown | | ☐ |
| Change password | Works & persists | | ☐ |
| Employee login | Can't create tasks | | ☐ |
| Logout | Token removed | | ☐ |

Print this out and check off each test as you complete it!

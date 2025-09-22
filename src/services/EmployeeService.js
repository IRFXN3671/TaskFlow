import { mockEmployees, mockUsers, mockCredentials, availableSkills } from '../data/mockData.js';

class EmployeeService {
    constructor() {
        this.employees = [...mockEmployees];
        this.users = [...mockUsers];
        this.credentials = {...mockCredentials};
        this.listeners = [];
    }

    // Get all employees
    getAllEmployees() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...this.employees]);
            }, 300);
        });
    }

    // Get only active employees
    getActiveEmployees() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.employees.filter(emp => emp.isActive));
            }, 200);
        });
    }

    // Get employee by ID
    getEmployeeById(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const employee = this.employees.find(emp => emp.id === id);
                if (employee) {
                    resolve({...employee});
                } else {
                    reject(new Error('Employee not found'));
                }
            }, 200);
        });
    }

    // Create new employee
    createEmployee(employeeData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                try {
                    // Generate unique ID
                    const newId = (Math.max(...this.employees.map(emp => parseInt(emp.id))) + 1).toString();
                    
                    // Generate username and use default password
                    const username = this.generateUsername(employeeData.name);
                    const defaultPassword = "password123";
                    
                    const newEmployee = {
                        id: newId,
                        name: employeeData.name,
                        email: employeeData.email,
                        position: employeeData.position,
                        department: employeeData.department,
                        username: username,
                        defaultPassword: defaultPassword,
                        isActive: true,
                        joinedDate: new Date().toISOString().split('T')[0],
                        lastLogin: null,
                        skills: employeeData.skills || []
                    };

                    // Add to employees array
                    this.employees.push(newEmployee);

                    // Add to users array
                    const newUser = {
                        id: newId,
                        username: username,
                        role: "employee",
                        name: employeeData.name
                    };
                    this.users.push(newUser);

                    // Add credentials
                    this.credentials[username] = defaultPassword;

                    this.notifyListeners();
                    resolve({...newEmployee});
                } catch (error) {
                    reject(new Error('Failed to create employee: ' + error.message));
                }
            }, 500);
        });
    }

    // Update employee
    updateEmployee(id, updates) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const employeeIndex = this.employees.findIndex(emp => emp.id === id);
                if (employeeIndex === -1) {
                    reject(new Error('Employee not found'));
                    return;
                }

                const updatedEmployee = {
                    ...this.employees[employeeIndex],
                    ...updates,
                    id: id // Ensure ID doesn't change
                };

                this.employees[employeeIndex] = updatedEmployee;

                // Update user data if name changed
                if (updates.name) {
                    const userIndex = this.users.findIndex(user => user.id === id);
                    if (userIndex !== -1) {
                        this.users[userIndex].name = updates.name;
                    }
                }

                this.notifyListeners();
                resolve({...updatedEmployee});
            }, 300);
        });
    }

    // Toggle employee active status
    toggleEmployeeStatus(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const employeeIndex = this.employees.findIndex(emp => emp.id === id);
                if (employeeIndex === -1) {
                    reject(new Error('Employee not found'));
                    return;
                }

                this.employees[employeeIndex].isActive = !this.employees[employeeIndex].isActive;
                this.notifyListeners();
                resolve({...this.employees[employeeIndex]});
            }, 200);
        });
    }

    // Delete employee
    deleteEmployee(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const employeeIndex = this.employees.findIndex(emp => emp.id === id);
                if (employeeIndex === -1) {
                    reject(new Error('Employee not found'));
                    return;
                }

                const employee = this.employees[employeeIndex];
                
                // Remove from employees
                this.employees.splice(employeeIndex, 1);
                
                // Remove from users
                const userIndex = this.users.findIndex(user => user.id === id);
                if (userIndex !== -1) {
                    this.users.splice(userIndex, 1);
                }

                // Remove credentials
                delete this.credentials[employee.username];

                this.notifyListeners();
                resolve(true);
            }, 300);
        });
    }

    // Reset employee password
    resetPassword(id) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const employeeIndex = this.employees.findIndex(emp => emp.id === id);
                if (employeeIndex === -1) {
                    reject(new Error('Employee not found'));
                    return;
                }

                const newPassword = "password123";
                const employee = this.employees[employeeIndex];
                
                employee.defaultPassword = newPassword;
                this.credentials[employee.username] = newPassword;

                this.notifyListeners();
                resolve({
                    username: employee.username,
                    password: newPassword
                });
            }, 300);
        });
    }

    // Get employee statistics
    getEmployeeStats() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const totalEmployees = this.employees.length;
                const activeEmployees = this.employees.filter(emp => emp.isActive).length;
                const inactiveEmployees = totalEmployees - activeEmployees;
                
                const departmentStats = this.employees.reduce((acc, emp) => {
                    acc[emp.department] = (acc[emp.department] || 0) + 1;
                    return acc;
                }, {});

                // Calculate skills statistics
                const skillsStats = {};
                this.employees.forEach(emp => {
                    if (emp.skills) {
                        emp.skills.forEach(skill => {
                            skillsStats[skill] = (skillsStats[skill] || 0) + 1;
                        });
                    }
                });

                resolve({
                    totalEmployees,
                    activeEmployees,
                    inactiveEmployees,
                    departmentStats,
                    skillsStats
                });
            }, 200);
        });
    }

    // Get available skills for autocomplete
    getAvailableSkills() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([...availableSkills]);
            }, 100);
        });
    }

    // Get all skills currently used by employees
    getUsedSkills() {
        return new Promise((resolve) => {
            setTimeout(() => {
                const usedSkills = new Set();
                this.employees.forEach(emp => {
                    if (emp.skills) {
                        emp.skills.forEach(skill => usedSkills.add(skill));
                    }
                });
                resolve(Array.from(usedSkills).sort());
            }, 100);
        });
    }

    // Helper methods
    generateUsername(name) {
        const baseName = name.toLowerCase().replace(/\s+/g, '');
        let username = baseName;
        let counter = 1;
        
        // Check if username already exists
        while (this.users.some(user => user.username === username) || 
               this.employees.some(emp => emp.username === username)) {
            username = `${baseName}${counter}`;
            counter++;
        }
        
        return username;
    }

    generateDefaultPassword() {
        return "password123";
    }

    // Subscription methods
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }

    notifyListeners() {
        this.listeners.forEach(listener => listener());
    }

    // Get current state for external access
    getCurrentState() {
        return {
            employees: [...this.employees],
            users: [...this.users],
            credentials: {...this.credentials}
        };
    }
}

const employeeService = new EmployeeService();

export { EmployeeService, employeeService };
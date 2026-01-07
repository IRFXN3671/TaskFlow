import { mockUsers, mockCredentials } from '../data/mockData.js';
import { employeeService } from './EmployeeService.js';

const STORAGE_TOKEN_KEY = "task_tracker_token";
const STORAGE_USER_KEY = "task_tracker_user";

class AuthService {
    constructor() {
        this.listeners = []
    }
    login(username, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Get current state from employee service (includes updated credentials)
                const currentState = employeeService.getCurrentState();
                const customCredentials = JSON.parse(localStorage.getItem('custom_credentials') || '{}');
                const allCredentials = { ...mockCredentials, ...currentState.credentials, ...customCredentials };
                const allUsers = [...mockUsers, ...currentState.users.filter(user => !mockUsers.find(u => u.id === user.id))];
                
                if (allCredentials[username] === password) {
                    const user = allUsers.find(u => u.username === username);
                    if (user) {
                        // Check if user is active (for employees)
                        if (user.role === 'employee') {
                            const employee = currentState.employees.find(emp => emp.username === username);
                            if (employee && !employee.isActive) {
                                reject(new Error("Account is inactive. Please contact your administrator."));
                                return;
                            }
                        }
                        
                        const token = this.generateMockToken(user);
                        localStorage.setItem(STORAGE_TOKEN_KEY, token);
                        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
                        this.notifyListeners();
                        resolve({
                            user: user,
                            token: token
                        });
                    } else {
                        reject(new Error("User not found"));
                    }
                } else {
                    reject(new Error("Invalid credentials"));
                }
            }, 1000);
        });
    }
    logout() {
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        localStorage.removeItem(STORAGE_USER_KEY);
        this.notifyListeners()
    }
    getCurrentUser() {
        const userStr = localStorage.getItem(STORAGE_USER_KEY);
        return userStr ? JSON.parse(userStr) : null
    }
    getToken() {
        return localStorage.getItem(STORAGE_TOKEN_KEY)
    }
    isAuthenticated() {
        const token = this.getToken();
        const user = this.getCurrentUser();
        return !!(token && user)
    }
    getAuthState() {
        const user = this.getCurrentUser();
        const token = this.getToken();
        return {
            user: user,
            token: token,
            isAuthenticated: !!(user && token)
        }
    }
    changePassword(currentPassword, newPassword) {
        return new Promise(async (resolve, reject) => {
            setTimeout(async () => {
                const user = this.getCurrentUser();
                if (!user) {
                    reject(new Error("User not authenticated"));
                    return;
                }

                console.log('Change password request for user:', user.username, user.role);

                // Get current credentials
                const currentState = employeeService.getCurrentState();
                const customCredentials = JSON.parse(localStorage.getItem('custom_credentials') || '{}');
                const allCredentials = { ...mockCredentials, ...currentState.credentials, ...customCredentials };

                console.log('Current credentials:', allCredentials);
                console.log('Current password check:', allCredentials[user.username] === currentPassword);

                // Verify current password
                if (allCredentials[user.username] !== currentPassword) {
                    reject(new Error("Current password is incorrect"));
                    return;
                }

                try {
                    // Update password based on user role
                    if (user.role === 'employee') {
                        console.log('Updating employee password via employee service');
                        // Use the employee service method to update password
                        await employeeService.changeEmployeePassword(user.username, newPassword);
                        console.log('Employee password updated successfully');
                    } else {
                        console.log('Updating manager password via localStorage');
                        // For managers, store password in localStorage
                        const customCredentials = JSON.parse(localStorage.getItem('custom_credentials') || '{}');
                        customCredentials[user.username] = newPassword;
                        localStorage.setItem('custom_credentials', JSON.stringify(customCredentials));
                        console.log('Manager password updated successfully');
                    }

                    this.notifyListeners();
                    resolve({ success: true, message: "Password changed successfully" });
                } catch (error) {
                    console.error('Password change error:', error);
                    reject(new Error("Failed to update password: " + error.message));
                }
            }, 500);
        });
    }

    // Update login method to check custom credentials for managers
    login(username, password) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Get current state from employee service (includes updated credentials)
                const currentState = employeeService.getCurrentState();
                const customCredentials = JSON.parse(localStorage.getItem('custom_credentials') || '{}');
                const allCredentials = { ...mockCredentials, ...currentState.credentials, ...customCredentials };
                const allUsers = [...mockUsers, ...currentState.users.filter(user => !mockUsers.find(u => u.id === user.id))];
                
                console.log('Login attempt:', { username, password });
                console.log('Available credentials:', allCredentials);
                
                if (allCredentials[username] === password) {
                    const user = allUsers.find(u => u.username === username);
                    if (user) {
                        // Check if user is active (for employees)
                        if (user.role === 'employee') {
                            const employee = currentState.employees.find(emp => emp.username === username);
                            if (employee && !employee.isActive) {
                                reject(new Error("Account is inactive. Please contact your administrator."));
                                return;
                            }
                        }
                        
                        const token = this.generateMockToken(user);
                        localStorage.setItem(STORAGE_TOKEN_KEY, token);
                        localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(user));
                        this.notifyListeners();
                        resolve({
                            user: user,
                            token: token
                        });
                    } else {
                        reject(new Error("User not found"));
                    }
                } else {
                    reject(new Error("Invalid credentials"));
                }
            }, 1000);
        });
    }

    generateMockToken(user) {
        return `mock_token_${user.id}_${Date.now()}`
    }
    notifyListeners() {
        this.listeners.forEach(listener => listener())
    }
    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1)
            }
        }
    }
}

const authService = new AuthService();

export { AuthService, authService };
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
                const allCredentials = { ...mockCredentials, ...currentState.credentials };
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
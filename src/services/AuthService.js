const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const STORAGE_TOKEN_KEY = "task_tracker_token";
const STORAGE_USER_KEY = "task_tracker_user";

class AuthService {
    constructor() {
        this.listeners = [];
    }

    async login(username, password) {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Login failed');
            }

            // Store token and user
            localStorage.setItem(STORAGE_TOKEN_KEY, data.token);
            localStorage.setItem(STORAGE_USER_KEY, JSON.stringify(data.user));
            this.notifyListeners();

            return {
                user: data.user,
                token: data.token
            };
        } catch (error) {
            throw error;
        }
    }
    logout() {
        localStorage.removeItem(STORAGE_TOKEN_KEY);
        localStorage.removeItem(STORAGE_USER_KEY);
        this.notifyListeners();
    }
    getCurrentUser() {
        const userStr = localStorage.getItem(STORAGE_USER_KEY);
        return userStr ? JSON.parse(userStr) : null;
    }

    getToken() {
        return localStorage.getItem(STORAGE_TOKEN_KEY);
    }

    isAuthenticated() {
        const token = this.getToken();
        const user = this.getCurrentUser();
        return !!(token && user);
    }

    getAuthState() {
        const user = this.getCurrentUser();
        const token = this.getToken();
        return {
            user: user,
            token: token,
            isAuthenticated: !!(user && token)
        };
    }

    async changePassword(currentPassword, newPassword) {
        try {
            const token = this.getToken();
            if (!token) {
                throw new Error("User not authenticated");
            }

            const response = await fetch(`${API_URL}/auth/change-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ currentPassword, newPassword })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to change password');
            }

            this.notifyListeners();
            return data;
        } catch (error) {
            throw error;
        }
    }
    notifyListeners() {
        this.listeners.forEach(listener => listener());
    }

    subscribe(listener) {
        this.listeners.push(listener);
        return () => {
            const index = this.listeners.indexOf(listener);
            if (index > -1) {
                this.listeners.splice(index, 1);
            }
        };
    }
}

const authService = new AuthService();

export { AuthService, authService };
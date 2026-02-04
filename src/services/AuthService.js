const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const STORAGE_TOKEN_KEY = "task_tracker_token";
const STORAGE_USER_KEY = "task_tracker_user";
const STORAGE_TOKEN_EXPIRY_KEY = "task_tracker_token_expiry";
const STORAGE_LAST_ACTIVITY_KEY = "task_tracker_last_activity";

// Session timeout settings (in milliseconds)
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes of inactivity
const TOKEN_CHECK_INTERVAL = 60 * 1000; // Check every minute

class AuthService {
    constructor() {
        this.listeners = [];
        this.timeoutCheckInterval = null;
        this.activityListeners = [];
        this.initializeActivityTracking();
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
            
            // Store token expiry time and last activity
            this.setTokenExpiry();
            this.updateLastActivity();
            
            // Start monitoring session timeout
            this.startSessionMonitoring();
            
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
        localStorage.removeItem(STORAGE_TOKEN_EXPIRY_KEY);
        localStorage.removeItem(STORAGE_LAST_ACTIVITY_KEY);
        this.stopSessionMonitoring();
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
        
        if (!token || !user) {
            return false;
        }
        
        // Check if token has expired
        if (this.isTokenExpired()) {
            this.logout();
            return false;
        }
        
        // Check if session has timed out due to inactivity
        if (this.isSessionTimedOut()) {
            this.logout();
            return false;
        }
        
        return true;
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

    // Token expiry management
    setTokenExpiry() {
        // Set expiry to 2 hours from now (matching JWT_EXPIRY)
        const expiryTime = Date.now() + (2 * 60 * 60 * 1000);
        localStorage.setItem(STORAGE_TOKEN_EXPIRY_KEY, expiryTime.toString());
    }

    isTokenExpired() {
        const expiryTime = localStorage.getItem(STORAGE_TOKEN_EXPIRY_KEY);
        if (!expiryTime) {
            return true;
        }
        return Date.now() > parseInt(expiryTime);
    }

    // Activity tracking
    updateLastActivity() {
        localStorage.setItem(STORAGE_LAST_ACTIVITY_KEY, Date.now().toString());
    }

    getLastActivity() {
        const lastActivity = localStorage.getItem(STORAGE_LAST_ACTIVITY_KEY);
        return lastActivity ? parseInt(lastActivity) : null;
    }

    isSessionTimedOut() {
        const lastActivity = this.getLastActivity();
        if (!lastActivity) {
            return true;
        }
        return Date.now() - lastActivity > SESSION_TIMEOUT;
    }

    // Activity listeners for user interaction
    initializeActivityTracking() {
        const events = ['mousedown', 'keydown', 'scroll', 'touchstart', 'click'];
        
        const activityHandler = () => {
            if (this.isAuthenticated()) {
                this.updateLastActivity();
            }
        };

        events.forEach(event => {
            window.addEventListener(event, activityHandler, true);
        });
    }

    // Session monitoring
    startSessionMonitoring() {
        if (this.timeoutCheckInterval) {
            clearInterval(this.timeoutCheckInterval);
        }

        this.timeoutCheckInterval = setInterval(() => {
            if (this.isTokenExpired() || this.isSessionTimedOut()) {
                console.log('Session expired, logging out...');
                this.logout();
            }
        }, TOKEN_CHECK_INTERVAL);
    }

    stopSessionMonitoring() {
        if (this.timeoutCheckInterval) {
            clearInterval(this.timeoutCheckInterval);
            this.timeoutCheckInterval = null;
        }
    }

    // Get remaining session time in milliseconds
    getRemainingSessionTime() {
        const lastActivity = this.getLastActivity();
        if (!lastActivity) {
            return 0;
        }
        const remaining = SESSION_TIMEOUT - (Date.now() - lastActivity);
        return Math.max(0, remaining);
    }
}

const authService = new AuthService();

export { AuthService, authService };
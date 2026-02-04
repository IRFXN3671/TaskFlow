import { authService } from './AuthService.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class EmployeeService {
    constructor() {
        this.listeners = [];
    }

    getAuthHeaders() {
        const token = authService.getToken();
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    async handleResponse(response) {
        // If unauthorized, token might be expired - logout
        if (response.status === 401) {
            authService.logout();
            throw new Error('Session expired. Please login again.');
        }
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'Request failed');
        }
        
        return data;
    }

    // Get all employees
    async getAllEmployees() {
        try {
            const response = await fetch(`${API_URL}/employees`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch employees');
            }

            return (data.data || []).map(emp => ({
                ...emp,
                isActive: emp.is_active,
                userId: emp.user_id,
                joinedDate: emp.joined_date,
                lastLogin: emp.last_login
            }));
        } catch (error) {
            console.error('Error fetching employees:', error);
            throw error;
        }
    }

    // Get only active employees
    async getActiveEmployees() {
        try {
            const response = await fetch(`${API_URL}/employees/active`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch active employees');
            }

            return (data.data || []).map(emp => ({
                ...emp,
                isActive: emp.is_active,
                userId: emp.user_id,
                joinedDate: emp.joined_date,
                lastLogin: emp.last_login
            }));
        } catch (error) {
            console.error('Error fetching active employees:', error);
            throw error;
        }
    }

    // Get employee by ID
    async getEmployeeById(id) {
        try {
            const response = await fetch(`${API_URL}/employees/${id}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Employee not found');
            }

            return {
                ...data.data,
                isActive: data.data.is_active,
                userId: data.data.user_id,
                joinedDate: data.data.joined_date,
                lastLogin: data.data.last_login
            };
        } catch (error) {
            console.error('Error fetching employee:', error);
            throw error;
        }
    }

    // Create new employee
    async createEmployee(employeeData) {
        try {
            const response = await fetch(`${API_URL}/employees`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    name: employeeData.name,
                    email: employeeData.email,
                    position: employeeData.position,
                    department: employeeData.department,
                    username: employeeData.username,
                    password: employeeData.password || 'password123',
                    skills: employeeData.skills || []
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to create employee');
            }

            this.notifyListeners();
            return data.data;
        } catch (error) {
            console.error('Error creating employee:', error);
            throw error;
        }
    }

    // Update employee
    async updateEmployee(id, updates) {
        try {
            const response = await fetch(`${API_URL}/employees/${id}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(updates)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to update employee');
            }

            this.notifyListeners();
            return data.data;
        } catch (error) {
            console.error('Error updating employee:', error);
            throw error;
        }
    }

    // Toggle employee active status
    async toggleEmployeeStatus(id) {
        try {
            const response = await fetch(`${API_URL}/employees/${id}/status`, {
                method: 'PATCH',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to toggle employee status');
            }

            this.notifyListeners();
            return data.data;
        } catch (error) {
            console.error('Error toggling employee status:', error);
            throw error;
        }
    }

    // Delete employee
    async deleteEmployee(id) {
        try {
            const response = await fetch(`${API_URL}/employees/${id}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to delete employee');
            }

            this.notifyListeners();
        } catch (error) {
            console.error('Error deleting employee:', error);
            throw error;
        }
    }

    // Reset employee password
    async resetPassword(id) {
        try {
            const response = await fetch(`${API_URL}/employees/${id}/reset-password`, {
                method: 'POST',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to reset password');
            }

            this.notifyListeners();
            return data;
        } catch (error) {
            console.error('Error resetting password:', error);
            throw error;
        }
    }

    // Get employee statistics
    async getEmployeeStats() {
        try {
            const response = await fetch(`${API_URL}/employees/stats`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Failed to fetch employee statistics');
            }

            return data.data || {};
        } catch (error) {
            console.error('Error fetching employee stats:', error);
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

const employeeService = new EmployeeService();

export { EmployeeService, employeeService };
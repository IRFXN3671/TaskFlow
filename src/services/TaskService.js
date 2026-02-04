import { authService } from './AuthService.js';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class TaskService {
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

    async getAllTasks(filters = {}, sort = { field: "dueDate", direction: "asc" }) {
        try {
            const params = new URLSearchParams();

            if (filters.search) {
                params.append('search', filters.search);
            }
            if (filters.status) {
                params.append('status', filters.status);
            }
            if (filters.priority) {
                params.append('priority', filters.priority);
            }
            if (filters.assigneeId) {
                params.append('assigneeId', filters.assigneeId);
            }

            const sortBy = sort.field === 'dueDate' ? 'due_date' : sort.field === 'createdAt' ? 'created_at' : sort.field;
            params.append('sortBy', sortBy);
            params.append('sortOrder', sort.direction.toUpperCase());

            const response = await fetch(`${API_URL}/tasks?${params}`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await this.handleResponse(response);

            // Transform backend response to match frontend format
            return (data.data || []).map(task => ({
                ...task,
                assigneeId: task.assignee_id,
                assigneeName: task.assignee_name || 'Unknown',
                createdAt: task.created_at,
                updatedAt: task.updated_at,
                dueDate: task.due_date
            }));
        } catch (error) {
            console.error('Error fetching tasks:', error);
            throw error;
        }
    }

    async createTask(taskData) {
        try {
            const response = await fetch(`${API_URL}/tasks`, {
                method: 'POST',
                headers: this.getAuthHeaders(),
                body: JSON.stringify({
                    title: taskData.title,
                    description: taskData.description,
                    status: taskData.status,
                    priority: taskData.priority,
                    dueDate: taskData.dueDate,
                    assigneeId: taskData.assigneeId
                })
            });

            const data = await this.handleResponse(response);

            this.notifyListeners();
            return data.data;
        } catch (error) {
            console.error('Error creating task:', error);
            throw error;
        }
    }

    async updateTask(taskId, taskData) {
        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}`, {
                method: 'PUT',
                headers: this.getAuthHeaders(),
                body: JSON.stringify(taskData)
            });

            const data = await this.handleResponse(response);

            this.notifyListeners();
            return data.data;
        } catch (error) {
            console.error('Error updating task:', error);
            throw error;
        }
    }

    async deleteTask(taskId) {
        try {
            const response = await fetch(`${API_URL}/tasks/${taskId}`, {
                method: 'DELETE',
                headers: this.getAuthHeaders()
            });

            const data = await this.handleResponse(response);

            this.notifyListeners();
        } catch (error) {
            console.error('Error deleting task:', error);
            throw error;
        }
    }

    async getDashboardStats(userId) {
        try {
            const response = await fetch(`${API_URL}/tasks/stats`, {
                method: 'GET',
                headers: this.getAuthHeaders()
            });

            const data = await this.handleResponse(response);

            return data.data || {};
        } catch (error) {
            console.error('Error fetching dashboard stats:', error);
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

const taskService = new TaskService();

export { TaskService, taskService };
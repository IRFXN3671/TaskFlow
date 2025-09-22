import { mockUsers, mockTasks } from '../data/mockData.js';

const STORAGE_KEY = "task_tracker_tasks";

class TaskService {
    constructor() {
        this.listeners = [];
        if (!localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mockTasks));
        }
    }

    getTasks() {
        const tasksStr = localStorage.getItem(STORAGE_KEY);
        return tasksStr ? JSON.parse(tasksStr) : [];
    }

    saveTasks(tasks) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        this.notifyListeners();
    }

    getAllTasks(filters = {}, sort = { field: "dueDate", direction: "asc" }) {
        return new Promise(resolve => {
            setTimeout(() => {
                let tasks = this.getTasks();
                
                if (filters.search) {
                    const searchLower = filters.search.toLowerCase();
                    tasks = tasks.filter(task => 
                        task.title.toLowerCase().includes(searchLower) ||
                        task.description.toLowerCase().includes(searchLower)
                    );
                }
                
                if (filters.status) {
                    tasks = tasks.filter(task => task.status === filters.status);
                }
                
                if (filters.priority) {
                    tasks = tasks.filter(task => task.priority === filters.priority);
                }
                
                if (filters.assigneeId) {
                    tasks = tasks.filter(task => task.assigneeId === filters.assigneeId);
                }
                
                if (sort) {
                    tasks.sort((a, b) => {
                        let aValue = a[sort.field];
                        let bValue = b[sort.field];
                        
                        if (sort.field === "priority") {
                            const priorityOrder = { low: 1, medium: 2, high: 3 };
                            aValue = priorityOrder[aValue];
                            bValue = priorityOrder[bValue];
                        }
                        
                        if (sort.field === "dueDate" || sort.field === "createdAt") {
                            aValue = new Date(aValue).getTime();
                            bValue = new Date(bValue).getTime();
                        }
                        
                        if (aValue < bValue) return sort.direction === "asc" ? -1 : 1;
                        if (aValue > bValue) return sort.direction === "asc" ? 1 : -1;
                        return 0;
                    });
                }
                
                resolve(tasks);
            }, 300);
        });
    }

    createTask(taskData) {
        return new Promise(resolve => {
            setTimeout(() => {
                const tasks = this.getTasks();
                const assignee = mockUsers.find(user => user.id === taskData.assigneeId);
                const newTask = {
                    ...taskData,
                    id: Date.now().toString(),
                    assigneeName: assignee?.name || "Unknown",
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                tasks.push(newTask);
                this.saveTasks(tasks);
                resolve(newTask);
            }, 500);
        });
    }

    updateTask(taskId, taskData) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const tasks = this.getTasks();
                const taskIndex = tasks.findIndex(task => task.id === taskId);
                
                if (taskIndex === -1) {
                    reject(new Error("Task not found"));
                    return;
                }
                
                const updatedTask = {
                    ...tasks[taskIndex],
                    ...taskData,
                    updatedAt: new Date().toISOString()
                };
                
                if (taskData.assigneeId) {
                    const assignee = mockUsers.find(user => user.id === taskData.assigneeId);
                    updatedTask.assigneeName = assignee?.name || "Unknown";
                }
                
                tasks[taskIndex] = updatedTask;
                this.saveTasks(tasks);
                resolve(updatedTask);
            }, 400);
        });
    }

    deleteTask(taskId) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                const tasks = this.getTasks();
                const taskIndex = tasks.findIndex(task => task.id === taskId);
                
                if (taskIndex === -1) {
                    reject(new Error("Task not found"));
                    return;
                }
                
                tasks.splice(taskIndex, 1);
                this.saveTasks(tasks);
                resolve();
            }, 300);
        });
    }

    getDashboardStats(userId) {
        return new Promise(resolve => {
            setTimeout(() => {
                let tasks = this.getTasks();
                
                if (userId) {
                    tasks = tasks.filter(task => task.assigneeId === userId);
                }
                
                const now = new Date();
                const overdueTasks = tasks.filter(task => 
                    new Date(task.dueDate) < now && task.status !== "completed"
                ).length;
                
                const tasksByPriority = tasks.reduce((acc, task) => {
                    acc[task.priority]++;
                    return acc;
                }, { low: 0, medium: 0, high: 0 });
                
                const tasksByAssignee = tasks.reduce((acc, task) => {
                    acc[task.assigneeName] = (acc[task.assigneeName] || 0) + 1;
                    return acc;
                }, {});
                
                const completedTasks = tasks.filter(task => task.status === "completed").length;
                const completionRate = tasks.length > 0 ? completedTasks / tasks.length * 100 : 0;
                
                const stats = {
                    totalTasks: tasks.length,
                    completedTasks: completedTasks,
                    pendingTasks: tasks.filter(task => task.status === "pending").length,
                    inProgressTasks: tasks.filter(task => task.status === "in-progress").length,
                    overdueTasks: overdueTasks,
                    tasksByPriority: tasksByPriority,
                    tasksByAssignee: tasksByAssignee,
                    completionRate: completionRate
                };
                
                resolve(stats);
            }, 400);
        });
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
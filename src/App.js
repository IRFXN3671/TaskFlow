import React from 'react';
import Login from './components/auth/Login.js';
import ChangePasswordModal from './components/auth/ChangePasswordModal.js';
import Header from './components/shared/Header.js';
import StatsCards from './components/dashboard/StatsCards.js';
import Chart from './components/dashboard/Chart.js';
import ManagerDashboard from './components/dashboard/ManagerDashboard.js';
import TaskFilters from './components/tasks/TaskFilters.js';
import TaskCard from './components/tasks/TaskCard.js';
import TaskModal from './components/tasks/TaskModal.js';
import { authService } from './services/AuthService.js';
import { taskService } from './services/TaskService.js';
import { Plus } from './components/icons/index.js';

const App = () => {
    const [user, setUser] = React.useState(null);
    const [tasks, setTasks] = React.useState([]);
    const [filteredTasks, setFilteredTasks] = React.useState([]);
    const [stats, setStats] = React.useState({});
    const [filters, setFilters] = React.useState({});
    const [sort, setSort] = React.useState({ field: "dueDate", direction: "asc" });
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingTask, setEditingTask] = React.useState(null);
    const [loading, setLoading] = React.useState(true);
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = React.useState(false);
    const [isChangingPassword, setIsChangingPassword] = React.useState(false);

    React.useEffect(() => {
        // Check if user is authenticated (includes token expiry and session timeout checks)
        if (authService.isAuthenticated()) {
            const currentUser = authService.getCurrentUser();
            setUser(currentUser);
            // Start session monitoring for auto-logout
            authService.startSessionMonitoring();
        } else {
            // Clear any stale data if session expired
            authService.logout();
        }
        setLoading(false);

        // Subscribe to auth changes (including automatic logout)
        const unsubscribe = authService.subscribe(() => {
            const currentUser = authService.getCurrentUser();
            if (!currentUser) {
                setUser(null);
                setTasks([]);
                setStats({});
            }
        });

        return () => {
            unsubscribe();
        };
    }, []);

    React.useEffect(() => {
        if (user) {
            loadTasks();
            loadStats();
        }
    }, [user, filters, sort]);

    const loadTasks = async () => {
        try {
            // For employees, add their user ID to filters to show only their tasks
            // For managers, show all tasks
            const taskFilters = user.role === "employee" 
                ? { ...filters, assigneeId: user.id }
                : filters;
            
            const tasksData = await taskService.getAllTasks(taskFilters, sort);
            setTasks(tasksData);
            setFilteredTasks(tasksData);
        } catch (error) {
            console.error("Error loading tasks:", error);
        }
    };

    const loadStats = async () => {
        try {
            const statsData = await taskService.getDashboardStats(user?.role === "employee" ? user.id : null);
            setStats(statsData);
        } catch (error) {
            console.error("Error loading stats:", error);
        }
    };

    const handleLogin = () => {
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
    };

    const handleLogout = () => {
        authService.logout();
        setUser(null);
        setTasks([]);
        setStats({});
    };

    const handleTaskSubmit = async (taskData) => {
        try {
            if (editingTask) {
                await taskService.updateTask(editingTask.id, taskData);
            } else {
                await taskService.createTask(taskData);
            }
            loadTasks();
            loadStats();
            setIsModalOpen(false);
            setEditingTask(null);
        } catch (error) {
            console.error("Error submitting task:", error);
        }
    };

    const handleTaskStatusChange = async (taskId, newStatus) => {
        try {
            await taskService.updateTask(taskId, { status: newStatus });
            loadTasks();
            loadStats();
        } catch (error) {
            console.error("Error updating task status:", error);
        }
    };

    const handleTaskEdit = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleTaskDelete = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            try {
                await taskService.deleteTask(taskId);
                loadTasks();
                loadStats();
            } catch (error) {
                console.error("Error deleting task:", error);
            }
        }
    };

    const handleNewTask = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleChangePassword = async (currentPassword, newPassword) => {
        setIsChangingPassword(true);
        try {
            await authService.changePassword(currentPassword, newPassword);
            alert("Password changed successfully!");
        } catch (error) {
            throw error; // Let the modal handle the error
        } finally {
            setIsChangingPassword(false);
        }
    };

    const handleOpenChangePasswordModal = () => {
        setIsChangePasswordModalOpen(true);
    };

    if (loading) {
        return React.createElement("div", {
            className: "min-h-screen bg-gray-50 flex items-center justify-center"
        }, React.createElement("div", {
            className: "text-lg text-gray-600"
        }, "Loading..."));
    }

    if (!user) {
        return React.createElement(Login, {
            onLogin: handleLogin
        });
    }

    const isManager = user.role === "manager";

    const priorityChartData = [
        { name: "High", value: stats.tasksByPriority?.high || 0, color: "#ef4444" },
        { name: "Medium", value: stats.tasksByPriority?.medium || 0, color: "#f59e0b" },
        { name: "Low", value: stats.tasksByPriority?.low || 0, color: "#10b981" }
    ];

    const statusChartData = [
        { name: "Pending", value: stats.pendingTasks || 0, color: "#6b7280" },
        { name: "In Progress", value: stats.inProgressTasks || 0, color: "#3b82f6" },
        { name: "Completed", value: stats.completedTasks || 0, color: "#10b981" }
    ];

    const assigneeChartData = Object.entries(stats.tasksByAssignee || {}).map(([name, value]) => ({
        name,
        value,
        color: `hsl(${Math.random() * 360}, 70%, 50%)`
    }));

    return React.createElement("div", {
        className: "min-h-screen bg-gray-50"
    }, [
        React.createElement(Header, {
            key: "header",
            user: user,
            onLogout: handleLogout,
            onChangePassword: handleOpenChangePasswordModal
        }),
        React.createElement("main", {
            key: "main",
            className: "max-w-7xl mx-auto px-6 py-8 space-y-8"
        }, 
        isManager ? 
            React.createElement(ManagerDashboard, {
                key: "manager-dashboard",
                user: user,
                tasks: tasks,
                filteredTasks: filteredTasks,
                stats: stats,
                filters: filters,
                sort: sort,
                onFiltersChange: setFilters,
                onSortChange: setSort,
                onNewTask: handleNewTask,
                onTaskStatusChange: handleTaskStatusChange,
                onTaskEdit: handleTaskEdit,
                onTaskDelete: handleTaskDelete
            })
        : [
            React.createElement(StatsCards, {
                key: "stats",
                stats: stats
            }),
            React.createElement("div", {
                key: "charts",
                className: "grid grid-cols-1 lg:grid-cols-2 gap-8"
            }, [
                React.createElement(Chart, {
                    key: "priority-chart",
                    data: priorityChartData,
                    type: "pie",
                    title: "Tasks by Priority"
                }),
                React.createElement(Chart, {
                    key: "status-chart",
                    data: statusChartData,
                    type: "pie",
                    title: "Task Status Distribution"
                })
            ]),
            React.createElement("div", {
                key: "tasks-section",
                className: "space-y-6"
            }, [
                React.createElement("div", {
                    key: "tasks-header",
                    className: "flex items-center justify-between"
                }, [
                    React.createElement("h2", {
                        key: "tasks-title",
                        className: "text-2xl font-bold text-gray-900"
                    }, "My Tasks")
                ]),
                React.createElement(TaskFilters, {
                    key: "filters",
                    filters: filters,
                    sort: sort,
                    onFiltersChange: setFilters,
                    onSortChange: setSort,
                    isManager: isManager
                }),
                React.createElement("div", {
                    key: "tasks-grid",
                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                }, filteredTasks.map(task => React.createElement(TaskCard, {
                    key: task.id,
                    task: task,
                    onStatusChange: handleTaskStatusChange,
                    onEdit: handleTaskEdit,
                    onDelete: handleTaskDelete,
                    canEdit: isManager || task.assigneeId === user.id,
                    canDelete: isManager
                })))
            ])
        ]),
        React.createElement(TaskModal, {
            key: "modal",
            task: editingTask,
            isOpen: isModalOpen,
            onClose: () => {
                setIsModalOpen(false);
                setEditingTask(null);
            },
            onSubmit: handleTaskSubmit,
            isManager: isManager
        }),
        React.createElement(ChangePasswordModal, {
            key: "change-password-modal",
            isOpen: isChangePasswordModalOpen,
            onClose: () => setIsChangePasswordModalOpen(false),
            onChangePassword: handleChangePassword,
            isLoading: isChangingPassword
        })
    ]);
};

export default App;
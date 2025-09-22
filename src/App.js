import React from 'react';
import Login from './components/auth/Login.js';
import Header from './components/shared/Header.js';
import StatsCards from './components/dashboard/StatsCards.js';
import Chart from './components/dashboard/Chart.js';
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

    React.useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    React.useEffect(() => {
        if (user) {
            loadTasks();
            loadStats();
        }
    }, [user, filters, sort]);

    const loadTasks = async () => {
        try {
            const tasksData = await taskService.getAllTasks(filters, sort);
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
            onLogout: handleLogout
        }),
        React.createElement("main", {
            key: "main",
            className: "max-w-7xl mx-auto px-6 py-8 space-y-8"
        }, [
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
                isManager && React.createElement(Chart, {
                    key: "assignee-chart",
                    data: assigneeChartData,
                    type: "bar",
                    title: "Tasks by Assignee"
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
                    }, "Tasks"),
                    isManager && React.createElement("button", {
                        key: "new-task-btn",
                        onClick: handleNewTask,
                        className: "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-colors"
                    }, [
                        React.createElement(Plus, {
                            key: "plus-icon",
                            className: "h-4 w-4"
                        }),
                        "New Task"
                    ])
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
        })
    ]);
};

export default App;
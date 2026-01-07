import React from 'react';
import { BarChart3, Users, Plus, User } from '../icons/index.js';
import StatsCards from './StatsCards.js';
import Chart from './Chart.js';
import TaskFilters from '../tasks/TaskFilters.js';
import TaskCard from '../tasks/TaskCard.js';
import EmployeeList from '../employees/EmployeeList.js';

const ManagerDashboard = ({
    user,
    tasks,
    filteredTasks,
    stats,
    filters,
    sort,
    onFiltersChange,
    onSortChange,
    onNewTask,
    onTaskStatusChange,
    onTaskEdit,
    onTaskDelete
}) => {
    const [activeTab, setActiveTab] = React.useState('analytics');

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

    // Get recent tasks (last 5)
    const recentTasks = tasks.slice().sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)).slice(0, 5);

    const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
        React.createElement("button", {
            onClick: () => onClick(id),
            className: `flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
                isActive 
                    ? 'bg-blue-600 text-white shadow-lg'
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
            }`
        }, [
            React.createElement(Icon, { key: "icon", className: "h-5 w-5" }),
            label
        ])
    );

    const AnalyticsView = () => (
        React.createElement("div", { className: "space-y-8" }, [
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
                    key: "assignee-chart",
                    data: assigneeChartData,
                    type: "pie",
                    title: "Tasks by Assignee"
                })
            ]),
            React.createElement("div", {
                key: "recent-tasks",
                className: "bg-white rounded-xl border border-gray-200 p-6"
            }, [
                React.createElement("div", {
                    key: "header",
                    className: "flex items-center justify-between mb-6"
                }, [
                    React.createElement("h3", {
                        key: "title",
                        className: "text-lg font-semibold text-gray-900"
                    }, "Recent Tasks"),
                    React.createElement("a", {
                        key: "view-all",
                        href: "#",
                        onClick: (e) => {
                            e.preventDefault();
                            setActiveTab('tasks');
                        },
                        className: "text-blue-600 hover:text-blue-700 text-sm font-medium"
                    }, "View all tasks")
                ]),
                React.createElement("div", {
                    key: "tasks-list",
                    className: "space-y-4"
                }, recentTasks.length > 0 ? recentTasks.map(task => 
                    React.createElement("div", {
                        key: task.id,
                        className: "flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    }, [
                        React.createElement("div", {
                            key: "task-info",
                            className: "flex-1"
                        }, [
                            React.createElement("h4", {
                                key: "title",
                                className: "font-medium text-gray-900"
                            }, task.title),
                            React.createElement("p", {
                                key: "assignee",
                                className: "text-sm text-gray-600 mt-1"
                            }, `Assigned to ${task.assigneeName}`)
                        ]),
                        React.createElement("div", {
                            key: "status-priority",
                            className: "flex items-center gap-3"
                        }, [
                            React.createElement("span", {
                                key: "status",
                                className: `px-3 py-1 rounded-full text-xs font-medium ${
                                    task.status === 'completed' ? 'bg-green-100 text-green-800' :
                                    task.status === 'in-progress' ? 'bg-blue-100 text-blue-800' :
                                    'bg-gray-100 text-gray-800'
                                }`
                            }, task.status === 'in-progress' ? 'in progress' : task.status),
                            React.createElement("span", {
                                key: "priority",
                                className: `px-2 py-1 rounded text-xs font-medium ${
                                    task.priority === 'high' ? 'bg-red-100 text-red-800' :
                                    task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-green-100 text-green-800'
                                }`
                            }, task.priority)
                        ])
                    ])
                ) : React.createElement("p", {
                    className: "text-center text-gray-500 py-8"
                }, "No recent tasks found"))
            ])
        ])
    );

    const TaskManagementView = () => (
        React.createElement("div", { className: "space-y-6" }, [
            React.createElement("div", {
                key: "header",
                className: "flex items-center justify-between"
            }, [
                React.createElement("div", {
                    key: "title-section",
                }, [
                    React.createElement("h2", {
                        key: "title",
                        className: "text-2xl font-bold text-gray-900"
                    }, "Team Tasks"),
                    React.createElement("p", {
                        key: "subtitle",
                        className: "text-gray-600 mt-1"
                    }, "Manage and assign tasks to your team")
                ]),
                React.createElement("button", {
                    key: "create-btn",
                    onClick: onNewTask,
                    className: "flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg hover:from-blue-700 hover:to-teal-700 transition-colors"
                }, [
                    React.createElement(Plus, {
                        key: "plus-icon",
                        className: "h-4 w-4"
                    }),
                    "Create Task"
                ])
            ]),
            React.createElement(TaskFilters, {
                key: "filters",
                filters: filters,
                sort: sort,
                onFiltersChange: onFiltersChange,
                onSortChange: onSortChange,
                isManager: true
            }),
            React.createElement("div", {
                key: "sort-header",
                className: "flex items-center justify-between bg-gray-50 px-4 py-2 rounded-lg"
            }, [
                React.createElement("span", {
                    key: "sort-label",
                    className: "text-sm text-gray-600"
                }, "Sort by:"),
                React.createElement("div", {
                    key: "sort-options",
                    className: "flex items-center gap-4"
                }, [
                    React.createElement("span", {
                        key: "due-date",
                        className: "text-sm font-medium text-blue-600"
                    }, "Due Date"),
                    React.createElement("span", {
                        key: "priority",
                        className: "text-sm text-gray-600"
                    }, "Priority"),
                    React.createElement("span", {
                        key: "status",
                        className: "text-sm text-gray-600"
                    }, "Status"),
                    React.createElement("span", {
                        key: "title",
                        className: "text-sm text-gray-600"
                    }, "Title")
                ])
            ]),
            React.createElement("div", {
                key: "tasks-grid",
                className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            }, filteredTasks.map(task => React.createElement(TaskCard, {
                key: task.id,
                task: task,
                onStatusChange: onTaskStatusChange,
                onEdit: onTaskEdit,
                onDelete: onTaskDelete,
                canEdit: true,
                canDelete: true
            })))
        ])
    );

    return React.createElement("div", { className: "space-y-6" }, [
        React.createElement("div", {
            key: "tabs",
            className: "flex gap-4"
        }, [
            React.createElement(TabButton, {
                key: "analytics-tab",
                id: "analytics",
                label: "Analytics Dashboard",
                icon: BarChart3,
                isActive: activeTab === "analytics",
                onClick: setActiveTab
            }),
            React.createElement(TabButton, {
                key: "tasks-tab",
                id: "tasks",
                label: "Task Management",
                icon: User,
                isActive: activeTab === "tasks",
                onClick: setActiveTab
            }),
            React.createElement(TabButton, {
                key: "employees-tab",
                id: "employees",
                label: "Employee Management",
                icon: Users,
                isActive: activeTab === "employees",
                onClick: setActiveTab
            })
        ]),
        React.createElement("div", {
            key: "content",
            className: "min-h-screen"
        }, activeTab === "analytics" ? React.createElement(AnalyticsView) : 
           activeTab === "tasks" ? React.createElement(TaskManagementView) :
           React.createElement(EmployeeList))
    ]);
};

export default ManagerDashboard;
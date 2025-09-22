import React from 'react';
import { ClipboardList, Calendar, Clock, Flag } from '../icons/index.js';

const TaskCard = ({task, onStatusChange, onEdit, onDelete, canEdit, canDelete}) => {
    const statusStyles = {
        pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
        "in-progress": "bg-blue-100 text-blue-800 border-blue-200",
        completed: "bg-green-100 text-green-800 border-green-200"
    };
    
    const priorityTextStyles = {
        low: "text-green-600",
        medium: "text-yellow-600",
        high: "text-red-600"
    };
    
    const priorityBgStyles = {
        low: "bg-green-50 border-green-200",
        medium: "bg-yellow-50 border-yellow-200",
        high: "bg-red-50 border-red-200"
    };
    
    const formatDate = (dateString) => new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
    
    const isOverdue = () => new Date(task.dueDate) < new Date() && task.status !== "completed";
    
    return React.createElement("div", {
        className: `bg-white rounded-xl shadow-sm border-2 transition-all duration-200 hover:shadow-md ${isOverdue() ? "border-red-200 bg-red-50/30" : "border-gray-100"}`,
    }, React.createElement("div", {
        className: "p-6",
    }, [
        React.createElement("div", {
            key: "header",
            className: "flex justify-between items-start mb-4",
        }, [
            React.createElement("div", {
                key: "title-section",
                className: "flex-1 mr-4",
            }, [
                React.createElement("h3", {
                    key: "title",
                    className: "text-lg font-semibold text-gray-900 mb-2",
                }, task.title),
                React.createElement("p", {
                    key: "description",
                    className: "text-gray-600 text-sm leading-relaxed",
                }, task.description)
            ]),
            React.createElement("div", {
                key: "priority",
                className: `px-3 py-1 rounded-full text-xs font-medium border ${priorityBgStyles[task.priority]}`,
            }, [
                React.createElement(Flag, {
                    key: "priority-icon",
                    className: `inline h-3 w-3 mr-1 ${priorityTextStyles[task.priority]}`
                }),
                React.createElement("span", {
                    key: "priority-text",
                    className: priorityTextStyles[task.priority],
                }, task.priority.charAt(0).toUpperCase() + task.priority.slice(1))
            ])
        ]),
        React.createElement("div", {
            key: "info",
            className: "space-y-3 mb-4",
        }, [
            React.createElement("div", {
                key: "assignee-due",
                className: "flex items-center gap-4 text-sm text-gray-600",
            }, [
                React.createElement("div", {
                    key: "assignee",
                    className: "flex items-center gap-2",
                }, [
                    React.createElement(ClipboardList, {
                        key: "assignee-icon",
                        className: "h-4 w-4"
                    }),
                    React.createElement("span", {
                        key: "assignee-name",
                    }, task.assigneeName)
                ]),
                React.createElement("div", {
                    key: "due-date",
                    className: `flex items-center gap-2 ${isOverdue() ? "text-red-600" : ""}`,
                }, [
                    React.createElement(Calendar, {
                        key: "due-icon",
                        className: "h-4 w-4"
                    }),
                    React.createElement("span", {
                        key: "due-text",
                    }, formatDate(task.dueDate)),
                    isOverdue() && React.createElement("span", {
                        key: "overdue",
                        className: "text-xs font-medium",
                    }, "(Overdue)")
                ])
            ]),
            React.createElement("div", {
                key: "updated",
                className: "flex items-center gap-2 text-xs text-gray-500",
            }, [
                React.createElement(Clock, {
                    key: "updated-icon",
                    className: "h-3 w-3"
                }),
                React.createElement("span", {
                    key: "updated-text",
                }, `Updated ${formatDate(task.updatedAt)}`)
            ])
        ]),
        React.createElement("div", {
            key: "actions",
            className: "flex items-center justify-between pt-4 border-t border-gray-100",
        }, [
            React.createElement("div", {
                key: "status-section",
                className: "flex items-center gap-2",
            }, [
                React.createElement("span", {
                    key: "status-label",
                    className: "text-sm text-gray-600",
                }, "Status:"),
                React.createElement("select", {
                    key: "status-select",
                    value: task.status,
                    onChange: (e) => onStatusChange(task.id, e.target.value),
                    className: `px-3 py-1 rounded-full text-xs font-medium border cursor-pointer ${statusStyles[task.status]} hover:opacity-80 transition-opacity`,
                }, [
                    React.createElement("option", {
                        key: "pending",
                        value: "pending",
                    }, "Pending"),
                    React.createElement("option", {
                        key: "in-progress",
                        value: "in-progress",
                    }, "In Progress"),
                    React.createElement("option", {
                        key: "completed",
                        value: "completed",
                    }, "Completed")
                ])
            ]),
            React.createElement("div", {
                key: "button-section",
                className: "flex items-center gap-2",
            }, [
                canEdit && React.createElement("button", {
                    key: "edit-button",
                    onClick: () => onEdit(task),
                    className: "px-3 py-1 text-sm font-medium text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-lg transition-colors",
                }, "Edit"),
                canDelete && React.createElement("button", {
                    key: "delete-button",
                    onClick: () => onDelete(task.id),
                    className: "px-3 py-1 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors",
                }, "Delete")
            ])
        ])
    ]));
};

export default TaskCard;
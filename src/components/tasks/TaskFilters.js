import React from 'react';
import { mockUsers } from '../../data/mockData.js';
import { Search, Filter, X, ChevronUp, ChevronDown } from '../icons/index.js';

const TaskFilters = ({filters, sort, onFiltersChange, onSortChange, isManager}) => {
    const employees = mockUsers.filter(user => user.role === "employee");
    
    const handleFilterChange = (key, value) => {
        onFiltersChange({
            ...filters,
            [key]: value || undefined
        });
    };
    
    const handleSortChange = (field) => {
        onSortChange({
            field: field,
            direction: sort.field === field && sort.direction === "asc" ? "desc" : "asc"
        });
    };
    
    const clearFilters = () => {
        onFiltersChange({});
    };
    
    const hasActiveFilters = Object.values(filters).some(value => value !== undefined && value !== "");
    
    return React.createElement("div", {
        className: "bg-white rounded-xl border border-gray-200 p-6 space-y-4",
    }, [
        React.createElement("div", {
            key: "search",
            className: "relative",
        }, [
            React.createElement(Search, {
                key: "search-icon",
                className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            }),
            React.createElement("input", {
                key: "search-input",
                type: "text",
                placeholder: "Search tasks by title or description...",
                value: filters.search || "",
                onChange: (e) => handleFilterChange("search", e.target.value),
                className: "w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            })
        ]),
        React.createElement("div", {
            key: "filters",
            className: "flex flex-wrap items-center gap-4",
        }, [
            React.createElement("div", {
                key: "status-filter",
                className: "flex items-center gap-2",
            }, [
                React.createElement(Filter, {
                    key: "status-icon",
                    className: "h-4 w-4 text-gray-500"
                }),
                React.createElement("select", {
                    key: "status-select",
                    value: filters.status || "",
                    onChange: (e) => handleFilterChange("status", e.target.value),
                    className: "px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                }, [
                    React.createElement("option", {
                        key: "all-status",
                        value: "",
                    }, "All Statuses"),
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
                key: "priority-filter",
                className: "flex items-center gap-2",
            }, React.createElement("select", {
                value: filters.priority || "",
                onChange: (e) => handleFilterChange("priority", e.target.value),
                className: "px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            }, [
                React.createElement("option", {
                    key: "all-priority",
                    value: "",
                }, "All Priorities"),
                React.createElement("option", {
                    key: "low",
                    value: "low",
                }, "Low Priority"),
                React.createElement("option", {
                    key: "medium",
                    value: "medium",
                }, "Medium Priority"),
                React.createElement("option", {
                    key: "high",
                    value: "high",
                }, "High Priority")
            ])),
            isManager && React.createElement("div", {
                key: "assignee-filter",
                className: "flex items-center gap-2",
            }, React.createElement("select", {
                value: filters.assigneeId || "",
                onChange: (e) => handleFilterChange("assigneeId", e.target.value),
                className: "px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent",
            }, [
                React.createElement("option", {
                    key: "all-employees",
                    value: "",
                }, "All Employees"),
                ...employees.map(employee => React.createElement("option", {
                    key: employee.id,
                    value: employee.id,
                }, employee.name))
            ])),
            React.createElement("div", {
                key: "sort-section",
                className: "flex items-center gap-2 ml-auto",
            }, [
                React.createElement("span", {
                    key: "sort-label",
                    className: "text-sm text-gray-600",
                }, "Sort by:"),
                ...[{
                    field: "dueDate",
                    label: "Due Date"
                }, {
                    field: "priority",
                    label: "Priority"
                }, {
                    field: "status",
                    label: "Status"
                }, {
                    field: "title",
                    label: "Title"
                }].map(({field, label}) => React.createElement("button", {
                    key: field,
                    onClick: () => handleSortChange(field),
                    className: `px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1 ${sort.field === field ? "bg-blue-100 text-blue-800 border border-blue-200" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`,
                }, [
                    label,
                    sort.field === field && (sort.direction === "asc" ? React.createElement(ChevronUp, {
                        key: "up",
                        className: "h-3 w-3"
                    }) : React.createElement(ChevronDown, {
                        key: "down", 
                        className: "h-3 w-3"
                    }))
                ]))
            ]),
            hasActiveFilters && React.createElement("button", {
                key: "clear",
                onClick: clearFilters,
                className: "px-3 py-2 text-sm font-medium text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1",
            }, [
                React.createElement(X, {
                    key: "clear-icon",
                    className: "h-3 w-3"
                }),
                "Clear"
            ])
        ])
    ]);
};

export default TaskFilters;
import React from 'react';
import { X, Save, Plus } from '../icons/index.js';
import { employeeService } from '../../services/EmployeeService.js';

const TaskModal = ({task, isOpen, onClose, onSubmit, isManager}) => {
    const [formData, setFormData] = React.useState({
        title: "",
        description: "",
        status: "pending",
        priority: "medium",
        dueDate: "",
        assigneeId: ""
    });
    const [loading, setLoading] = React.useState(false);
    const [activeEmployees, setActiveEmployees] = React.useState([]);
    const [loadingEmployees, setLoadingEmployees] = React.useState(false);
    
    React.useEffect(() => {
        setFormData(task ? {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            dueDate: task.dueDate,
            assigneeId: task.assigneeId
        } : {
            title: "",
            description: "",
            status: "pending",
            priority: "medium",
            dueDate: "",
            assigneeId: ""
        });
    }, [task]);

    // Load active employees when modal opens
    React.useEffect(() => {
        if (isOpen && isManager) {
            loadActiveEmployees();
        }
    }, [isOpen, isManager]);

    const loadActiveEmployees = async () => {
        try {
            setLoadingEmployees(true);
            const activeEmps = await employeeService.getActiveEmployees();
            setActiveEmployees(activeEmps);
        } catch (error) {
            console.error('Failed to load employees:', error);
            setActiveEmployees([]);
        } finally {
            setLoadingEmployees(false);
        }
    };
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error("Error submitting task:", error);
        } finally {
            setLoading(false);
        }
    };
    
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };
    
    if (!isOpen) return null;
    
    return React.createElement("div", {
        className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50",
    }, React.createElement("div", {
        className: "bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto",
    }, [
        React.createElement("div", {
            key: "header",
            className: "flex items-center justify-between p-6 border-b border-gray-100",
        }, [
            React.createElement("h2", {
                key: "title",
                className: "text-xl font-semibold text-gray-900",
            }, task ? "Edit Task" : "Create New Task"),
            React.createElement("button", {
                key: "close",
                onClick: onClose,
                className: "p-2 hover:bg-gray-100 rounded-lg transition-colors",
            }, React.createElement(X, {
                className: "h-5 w-5 text-gray-500"
            }))
        ]),
        React.createElement("form", {
            key: "form",
            onSubmit: handleSubmit,
            className: "p-6 space-y-6",
        }, [
            React.createElement("div", {
                key: "title-field",
            }, [
                React.createElement("label", {
                    key: "title-label",
                    htmlFor: "title",
                    className: "block text-sm font-medium text-gray-700 mb-2",
                }, "Task Title *"),
                React.createElement("input", {
                    key: "title-input",
                    type: "text",
                    id: "title",
                    name: "title",
                    value: formData.title,
                    onChange: handleInputChange,
                    required: true,
                    className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
                    placeholder: "Enter task title"
                })
            ]),
            React.createElement("div", {
                key: "description-field",
            }, [
                React.createElement("label", {
                    key: "description-label",
                    htmlFor: "description",
                    className: "block text-sm font-medium text-gray-700 mb-2",
                }, "Description *"),
                React.createElement("textarea", {
                    key: "description-input",
                    id: "description",
                    name: "description",
                    value: formData.description,
                    onChange: handleInputChange,
                    required: true,
                    rows: 4,
                    className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none",
                    placeholder: "Enter task description"
                })
            ]),
            React.createElement("div", {
                key: "status-priority-row",
                className: "grid grid-cols-1 md:grid-cols-2 gap-6",
            }, [
                React.createElement("div", {
                    key: "status-field",
                }, [
                    React.createElement("label", {
                        key: "status-label",
                        htmlFor: "status",
                        className: "block text-sm font-medium text-gray-700 mb-2",
                    }, "Status"),
                    React.createElement("select", {
                        key: "status-select",
                        id: "status",
                        name: "status",
                        value: formData.status,
                        onChange: handleInputChange,
                        className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
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
                    key: "priority-field",
                }, [
                    React.createElement("label", {
                        key: "priority-label",
                        htmlFor: "priority",
                        className: "block text-sm font-medium text-gray-700 mb-2",
                    }, "Priority"),
                    React.createElement("select", {
                        key: "priority-select",
                        id: "priority",
                        name: "priority",
                        value: formData.priority,
                        onChange: handleInputChange,
                        className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
                    }, [
                        React.createElement("option", {
                            key: "low",
                            value: "low",
                        }, "Low"),
                        React.createElement("option", {
                            key: "medium",
                            value: "medium",
                        }, "Medium"),
                        React.createElement("option", {
                            key: "high",
                            value: "high",
                        }, "High")
                    ])
                ])
            ]),
            React.createElement("div", {
                key: "date-assignee-row",
                className: "grid grid-cols-1 md:grid-cols-2 gap-6",
            }, [
                React.createElement("div", {
                    key: "date-field",
                }, [
                    React.createElement("label", {
                        key: "date-label",
                        htmlFor: "dueDate",
                        className: "block text-sm font-medium text-gray-700 mb-2",
                    }, "Due Date *"),
                    React.createElement("input", {
                        key: "date-input",
                        type: "date",
                        id: "dueDate",
                        name: "dueDate",
                        value: formData.dueDate,
                        onChange: handleInputChange,
                        required: true,
                        className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    })
                ]),
                React.createElement("div", {
                    key: "assignee-field",
                }, [
                    React.createElement("label", {
                        key: "assignee-label",
                        htmlFor: "assigneeId",
                        className: "block text-sm font-medium text-gray-700 mb-2",
                    }, isManager ? "Assign to *" : "Assigned to"),
                    React.createElement("select", {
                        key: "assignee-select",
                        id: "assigneeId",
                        name: "assigneeId",
                        value: formData.assigneeId,
                        onChange: handleInputChange,
                        required: true,
                        disabled: !isManager || loadingEmployees,
                        className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors disabled:bg-gray-50",
                    }, [
                        React.createElement("option", {
                            key: "placeholder",
                            value: "",
                        }, loadingEmployees ? "Loading employees..." : "Select an employee"),
                        ...activeEmployees.map(employee => React.createElement("option", {
                            key: employee.id,
                            value: employee.id,
                        }, `${employee.name} - ${employee.position}`))
                    ])
                ])
            ]),
            React.createElement("div", {
                key: "buttons",
                className: "flex items-center justify-end gap-4 pt-4 border-t border-gray-100",
            }, [
                React.createElement("button", {
                    key: "cancel",
                    type: "button",
                    onClick: onClose,
                    className: "px-6 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors",
                }, "Cancel"),
                React.createElement("button", {
                    key: "submit",
                    type: "submit",
                    disabled: loading,
                    className: "px-6 py-2 bg-gradient-to-r from-blue-600 to-teal-600 text-white text-sm font-medium rounded-lg hover:from-blue-700 hover:to-teal-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2",
                }, [
                    loading ? React.createElement("div", {
                        key: "spinner",
                        className: "w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
                    }) : (task ? React.createElement(Save, {
                        key: "save-icon",
                        className: "h-4 w-4"
                    }) : React.createElement(Plus, {
                        key: "plus-icon", 
                        className: "h-4 w-4"
                    })),
                    task ? "Update Task" : "Create Task"
                ])
            ])
        ])
    ]));
};

export default TaskModal;
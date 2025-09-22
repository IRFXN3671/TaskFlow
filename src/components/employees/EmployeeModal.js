import React from 'react';
import { X, User, Mail, Save } from '../icons/index.js';

const EmployeeModal = ({ 
    isOpen, 
    onClose, 
    onSave, 
    employee = null, 
    isLoading = false 
}) => {
    const [formData, setFormData] = React.useState({
        name: '',
        email: '',
        position: '',
        department: ''
    });
    const [errors, setErrors] = React.useState({});

    // Initialize form data when modal opens or employee changes
    React.useEffect(() => {
        if (isOpen) {
            if (employee) {
                setFormData({
                    name: employee.name || '',
                    email: employee.email || '',
                    position: employee.position || '',
                    department: employee.department || ''
                });
            } else {
                setFormData({
                    name: '',
                    email: '',
                    position: '',
                    department: ''
                });
            }
            setErrors({});
        }
    }, [isOpen, employee]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        if (!formData.position.trim()) {
            newErrors.position = 'Position is required';
        }

        if (!formData.department.trim()) {
            newErrors.department = 'Department is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSave(formData);
        }
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const departmentOptions = [
        'Development',
        'Quality Assurance',
        'Design',
        'Marketing',
        'Sales',
        'Human Resources',
        'Finance',
        'Operations'
    ];

    if (!isOpen) return null;

    return React.createElement("div", {
        className: "fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50",
        onClick: (e) => {
            if (e.target === e.currentTarget) {
                onClose();
            }
        }
    }, React.createElement("div", {
        className: "bg-white rounded-xl shadow-xl w-full max-w-md mx-4",
        onClick: (e) => e.stopPropagation()
    }, [
        // Header
        React.createElement("div", {
            key: "header",
            className: "flex items-center justify-between p-6 border-b border-gray-200"
        }, [
            React.createElement("div", {
                key: "title-section",
                className: "flex items-center gap-3"
            }, [
                React.createElement("div", {
                    key: "icon",
                    className: "w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                }, React.createElement(User, {
                    className: "h-5 w-5 text-blue-600"
                })),
                React.createElement("div", {
                    key: "title"
                }, [
                    React.createElement("h2", {
                        key: "main-title",
                        className: "text-xl font-semibold text-gray-900"
                    }, employee ? 'Edit Employee' : 'Add New Employee'),
                    React.createElement("p", {
                        key: "subtitle",
                        className: "text-sm text-gray-600"
                    }, employee ? 'Update employee information' : 'Enter employee details')
                ])
            ]),
            React.createElement("button", {
                key: "close-btn",
                onClick: onClose,
                className: "p-2 hover:bg-gray-100 rounded-lg transition-colors",
                disabled: isLoading
            }, React.createElement(X, {
                className: "h-5 w-5 text-gray-500"
            }))
        ]),

        // Form
        React.createElement("form", {
            key: "form",
            onSubmit: handleSubmit,
            className: "p-6 space-y-4"
        }, [
            // Name field
            React.createElement("div", {
                key: "name-field",
                className: "space-y-2"
            }, [
                React.createElement("label", {
                    key: "name-label",
                    className: "block text-sm font-medium text-gray-700"
                }, "Full Name *"),
                React.createElement("input", {
                    key: "name-input",
                    type: "text",
                    value: formData.name,
                    onChange: (e) => handleInputChange('name', e.target.value),
                    className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                    }`,
                    placeholder: "Enter employee's full name",
                    disabled: isLoading
                }),
                errors.name && React.createElement("p", {
                    key: "name-error",
                    className: "text-sm text-red-600"
                }, errors.name)
            ]),

            // Email field
            React.createElement("div", {
                key: "email-field",
                className: "space-y-2"
            }, [
                React.createElement("label", {
                    key: "email-label",
                    className: "block text-sm font-medium text-gray-700"
                }, "Email Address *"),
                React.createElement("div", {
                    key: "email-container",
                    className: "relative"
                }, [
                    React.createElement("input", {
                        key: "email-input",
                        type: "email",
                        value: formData.email,
                        onChange: (e) => handleInputChange('email', e.target.value),
                        className: `w-full pl-10 pr-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                            errors.email ? 'border-red-300' : 'border-gray-300'
                        }`,
                        placeholder: "employee@company.com",
                        disabled: isLoading
                    }),
                    React.createElement(Mail, {
                        key: "email-icon",
                        className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                    })
                ]),
                errors.email && React.createElement("p", {
                    key: "email-error",
                    className: "text-sm text-red-600"
                }, errors.email)
            ]),

            // Position field
            React.createElement("div", {
                key: "position-field",
                className: "space-y-2"
            }, [
                React.createElement("label", {
                    key: "position-label",
                    className: "block text-sm font-medium text-gray-700"
                }, "Position *"),
                React.createElement("input", {
                    key: "position-input",
                    type: "text",
                    value: formData.position,
                    onChange: (e) => handleInputChange('position', e.target.value),
                    className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.position ? 'border-red-300' : 'border-gray-300'
                    }`,
                    placeholder: "e.g., Frontend Developer, QA Engineer",
                    disabled: isLoading
                }),
                errors.position && React.createElement("p", {
                    key: "position-error",
                    className: "text-sm text-red-600"
                }, errors.position)
            ]),

            // Department field
            React.createElement("div", {
                key: "department-field",
                className: "space-y-2"
            }, [
                React.createElement("label", {
                    key: "department-label",
                    className: "block text-sm font-medium text-gray-700"
                }, "Department *"),
                React.createElement("select", {
                    key: "department-select",
                    value: formData.department,
                    onChange: (e) => handleInputChange('department', e.target.value),
                    className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                        errors.department ? 'border-red-300' : 'border-gray-300'
                    }`,
                    disabled: isLoading
                }, [
                    React.createElement("option", {
                        key: "default-option",
                        value: ""
                    }, "Select a department"),
                    ...departmentOptions.map(dept => 
                        React.createElement("option", {
                            key: dept,
                            value: dept
                        }, dept)
                    )
                ]),
                errors.department && React.createElement("p", {
                    key: "department-error",
                    className: "text-sm text-red-600"
                }, errors.department)
            ])
        ]),

        // Footer
        React.createElement("div", {
            key: "footer",
            className: "flex items-center justify-end gap-3 p-6 border-t border-gray-200"
        }, [
            React.createElement("button", {
                key: "cancel-btn",
                type: "button",
                onClick: onClose,
                className: "px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors",
                disabled: isLoading
            }, "Cancel"),
            React.createElement("button", {
                key: "save-btn",
                type: "submit",
                onClick: handleSubmit,
                className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed",
                disabled: isLoading
            }, [
                React.createElement(Save, {
                    key: "save-icon",
                    className: "h-4 w-4"
                }),
                isLoading ? 'Saving...' : (employee ? 'Update Employee' : 'Add Employee')
            ])
        ])
    ]));
};

export default EmployeeModal;
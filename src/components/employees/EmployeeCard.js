import React from 'react';
import { User, Mail, Calendar, Shield, MoreVertical, Key } from '../icons/index.js';

const EmployeeCard = ({ 
    employee, 
    onToggleStatus, 
    onEdit, 
    onDelete, 
    onResetPassword 
}) => {
    const [isMenuOpen, setIsMenuOpen] = React.useState(false);
    const menuRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatLastLogin = (dateString) => {
        if (!dateString) return 'Never logged in';
        const date = new Date(dateString);
        const now = new Date();
        const diffInDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
        
        if (diffInDays === 0) return 'Today';
        if (diffInDays === 1) return 'Yesterday';
        if (diffInDays < 7) return `${diffInDays} days ago`;
        return formatDate(dateString);
    };

    return React.createElement("div", {
        className: `bg-white rounded-xl border ${employee.isActive ? 'border-gray-200' : 'border-red-200 bg-red-50'} p-6 hover:shadow-lg transition-all duration-200`
    }, [
        // Header with avatar and status
        React.createElement("div", {
            key: "header",
            className: "flex items-start justify-between mb-4"
        }, [
            React.createElement("div", {
                key: "avatar-info",
                className: "flex items-center gap-3"
            }, [
                React.createElement("div", {
                    key: "avatar",
                    className: `w-12 h-12 rounded-full ${employee.isActive ? 'bg-blue-100' : 'bg-gray-300'} flex items-center justify-center`
                }, React.createElement(User, {
                    className: `h-6 w-6 ${employee.isActive ? 'text-blue-600' : 'text-gray-500'}`
                })),
                React.createElement("div", {
                    key: "basic-info"
                }, [
                    React.createElement("h3", {
                        key: "name",
                        className: `font-semibold text-lg ${employee.isActive ? 'text-gray-900' : 'text-gray-600'}`
                    }, employee.name),
                    React.createElement("p", {
                        key: "position",
                        className: `text-sm ${employee.isActive ? 'text-gray-600' : 'text-gray-500'}`
                    }, employee.position)
                ])
            ]),
            React.createElement("div", {
                key: "menu-section",
                className: "flex items-center gap-2"
            }, [
                React.createElement("span", {
                    key: "status-badge",
                    className: `px-3 py-1 rounded-full text-xs font-medium ${
                        employee.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                    }`
                }, employee.isActive ? 'Active' : 'Inactive'),
                React.createElement("div", {
                    key: "menu",
                    className: "relative",
                    ref: menuRef
                }, [
                    React.createElement("button", {
                        key: "menu-button",
                        onClick: () => setIsMenuOpen(!isMenuOpen),
                        className: "p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    }, React.createElement(MoreVertical, {
                        className: "h-4 w-4 text-gray-500"
                    })),
                    isMenuOpen && React.createElement("div", {
                        key: "menu-dropdown",
                        className: "absolute right-0 top-full mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10"
                    }, [
                        React.createElement("button", {
                            key: "edit",
                            onClick: () => {
                                onEdit(employee);
                                setIsMenuOpen(false);
                            },
                            className: "w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        }, [
                            React.createElement(User, { key: "edit-icon", className: "h-4 w-4" }),
                            "Edit Employee"
                        ]),
                        React.createElement("button", {
                            key: "toggle-status",
                            onClick: () => {
                                onToggleStatus(employee.id);
                                setIsMenuOpen(false);
                            },
                            className: "w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        }, [
                            React.createElement(Shield, { key: "status-icon", className: "h-4 w-4" }),
                            employee.isActive ? 'Deactivate' : 'Activate'
                        ]),
                        React.createElement("button", {
                            key: "reset-password",
                            onClick: () => {
                                onResetPassword(employee.id);
                                setIsMenuOpen(false);
                            },
                            className: "w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        }, [
                            React.createElement(Key, { key: "password-icon", className: "h-4 w-4" }),
                            "Reset Password"
                        ]),
                        React.createElement("hr", { key: "divider", className: "my-1" }),
                        React.createElement("button", {
                            key: "delete",
                            onClick: () => {
                                onDelete(employee.id);
                                setIsMenuOpen(false);
                            },
                            className: "w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        }, [
                            React.createElement("span", { key: "delete-icon", className: "h-4 w-4" }, "🗑️"),
                            "Delete Employee"
                        ])
                    ])
                ])
            ])
        ]),

        // Employee details
        React.createElement("div", {
            key: "details",
            className: "space-y-3"
        }, [
            React.createElement("div", {
                key: "email",
                className: "flex items-center gap-2 text-sm"
            }, [
                React.createElement(Mail, {
                    key: "mail-icon",
                    className: `h-4 w-4 ${employee.isActive ? 'text-gray-400' : 'text-gray-300'}`
                }),
                React.createElement("span", {
                    key: "email-text",
                    className: employee.isActive ? 'text-gray-600' : 'text-gray-500'
                }, employee.email)
            ]),
            React.createElement("div", {
                key: "department",
                className: "flex items-center gap-2 text-sm"
            }, [
                React.createElement("div", {
                    key: "dept-icon",
                    className: `h-4 w-4 rounded ${employee.isActive ? 'bg-purple-100' : 'bg-gray-200'} flex items-center justify-center`
                }, React.createElement("span", {
                    className: `text-xs ${employee.isActive ? 'text-purple-600' : 'text-gray-400'}`
                }, "D")),
                React.createElement("span", {
                    key: "dept-text",
                    className: employee.isActive ? 'text-gray-600' : 'text-gray-500'
                }, employee.department)
            ]),
            React.createElement("div", {
                key: "joined",
                className: "flex items-center gap-2 text-sm"
            }, [
                React.createElement(Calendar, {
                    key: "calendar-icon",
                    className: `h-4 w-4 ${employee.isActive ? 'text-gray-400' : 'text-gray-300'}`
                }),
                React.createElement("span", {
                    key: "joined-text",
                    className: employee.isActive ? 'text-gray-600' : 'text-gray-500'
                }, `Joined ${formatDate(employee.joinedDate)}`)
            ])
        ]),

        // Footer with login info and username
        React.createElement("div", {
            key: "footer",
            className: "mt-4 pt-4 border-t border-gray-100"
        }, [
            React.createElement("div", {
                key: "login-info",
                className: "flex items-center justify-between text-xs"
            }, [
                React.createElement("div", {
                    key: "credentials",
                    className: "flex flex-col gap-1"
                }, [
                    React.createElement("span", {
                        key: "username-label",
                        className: employee.isActive ? 'text-gray-500' : 'text-gray-400'
                    }, "Username:"),
                    React.createElement("span", {
                        key: "username-value",
                        className: `font-mono font-medium ${employee.isActive ? 'text-gray-700' : 'text-gray-500'}`
                    }, employee.username)
                ]),
                React.createElement("div", {
                    key: "last-login",
                    className: "text-right"
                }, [
                    React.createElement("div", {
                        key: "last-login-label",
                        className: employee.isActive ? 'text-gray-500' : 'text-gray-400'
                    }, "Last Login:"),
                    React.createElement("div", {
                        key: "last-login-value",
                        className: `font-medium ${employee.isActive ? 'text-gray-700' : 'text-gray-500'}`
                    }, formatLastLogin(employee.lastLogin))
                ])
            ])
        ])
    ]);
};

export default EmployeeCard;
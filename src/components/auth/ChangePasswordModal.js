import React from 'react';
import { X, Key, AlertCircle, CheckCircle } from '../icons/index.js';

const ChangePasswordModal = ({ isOpen, onClose, onChangePassword, isLoading = false }) => {
    const [formData, setFormData] = React.useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = React.useState({});
    const [showPasswords, setShowPasswords] = React.useState({
        current: false,
        new: false,
        confirm: false
    });

    React.useEffect(() => {
        if (isOpen) {
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
            setErrors({});
            setShowPasswords({
                current: false,
                new: false,
                confirm: false
            });
        }
    }, [isOpen]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.currentPassword.trim()) {
            newErrors.currentPassword = 'Current password is required';
        }

        if (!formData.newPassword.trim()) {
            newErrors.newPassword = 'New password is required';
        } else if (formData.newPassword.length < 6) {
            newErrors.newPassword = 'New password must be at least 6 characters';
        }

        if (!formData.confirmPassword.trim()) {
            newErrors.confirmPassword = 'Please confirm your new password';
        } else if (formData.newPassword !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (formData.currentPassword === formData.newPassword && formData.currentPassword.trim()) {
            newErrors.newPassword = 'New password must be different from current password';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validateForm()) {
            try {
                await onChangePassword(formData.currentPassword, formData.newPassword);
                onClose();
            } catch (error) {
                setErrors({ submit: error.message });
            }
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

    const togglePasswordVisibility = (field) => {
        setShowPasswords(prev => ({
            ...prev,
            [field]: !prev[field]
        }));
    };

    const getPasswordStrength = (password) => {
        if (!password) return { strength: 0, label: '', color: '' };
        
        let strength = 0;
        if (password.length >= 6) strength++;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;

        if (strength <= 2) return { strength, label: 'Weak', color: 'bg-red-500' };
        if (strength <= 4) return { strength, label: 'Medium', color: 'bg-yellow-500' };
        return { strength, label: 'Strong', color: 'bg-green-500' };
    };

    const passwordStrength = getPasswordStrength(formData.newPassword);

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
                }, React.createElement(Key, {
                    className: "h-5 w-5 text-blue-600"
                })),
                React.createElement("div", {
                    key: "title"
                }, [
                    React.createElement("h2", {
                        key: "main-title",
                        className: "text-xl font-semibold text-gray-900"
                    }, "Change Password"),
                    React.createElement("p", {
                        key: "subtitle",
                        className: "text-sm text-gray-600"
                    }, "Update your account password")
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
            // Submit error
            errors.submit && React.createElement("div", {
                key: "submit-error",
                className: "p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2"
            }, [
                React.createElement(AlertCircle, {
                    key: "error-icon",
                    className: "h-4 w-4 text-red-500 flex-shrink-0"
                }),
                React.createElement("span", {
                    key: "error-text",
                    className: "text-sm text-red-700"
                }, errors.submit)
            ]),

            // Current password field
            React.createElement("div", {
                key: "current-password-field",
                className: "space-y-2"
            }, [
                React.createElement("label", {
                    key: "current-password-label",
                    className: "block text-sm font-medium text-gray-700"
                }, "Current Password *"),
                React.createElement("div", {
                    key: "current-password-container",
                    className: "relative"
                }, [
                    React.createElement("input", {
                        key: "current-password-input",
                        type: showPasswords.current ? "text" : "password",
                        value: formData.currentPassword,
                        onChange: (e) => handleInputChange('currentPassword', e.target.value),
                        className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 ${
                            errors.currentPassword ? 'border-red-300' : 'border-gray-300'
                        }`,
                        placeholder: "Enter your current password",
                        disabled: isLoading
                    }),
                    React.createElement("button", {
                        key: "current-password-toggle",
                        type: "button",
                        onClick: () => togglePasswordVisibility('current'),
                        className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600",
                        disabled: isLoading
                    }, showPasswords.current ? "🙈" : "👁️")
                ]),
                errors.currentPassword && React.createElement("p", {
                    key: "current-password-error",
                    className: "text-sm text-red-600"
                }, errors.currentPassword)
            ]),

            // New password field
            React.createElement("div", {
                key: "new-password-field",
                className: "space-y-2"
            }, [
                React.createElement("label", {
                    key: "new-password-label",
                    className: "block text-sm font-medium text-gray-700"
                }, "New Password *"),
                React.createElement("div", {
                    key: "new-password-container",
                    className: "relative"
                }, [
                    React.createElement("input", {
                        key: "new-password-input",
                        type: showPasswords.new ? "text" : "password",
                        value: formData.newPassword,
                        onChange: (e) => handleInputChange('newPassword', e.target.value),
                        className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 ${
                            errors.newPassword ? 'border-red-300' : 'border-gray-300'
                        }`,
                        placeholder: "Enter your new password",
                        disabled: isLoading
                    }),
                    React.createElement("button", {
                        key: "new-password-toggle",
                        type: "button",
                        onClick: () => togglePasswordVisibility('new'),
                        className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600",
                        disabled: isLoading
                    }, showPasswords.new ? "🙈" : "👁️")
                ]),
                
                // Password strength indicator
                formData.newPassword && React.createElement("div", {
                    key: "password-strength",
                    className: "space-y-2"
                }, [
                    React.createElement("div", {
                        key: "strength-bar",
                        className: "flex items-center gap-2"
                    }, [
                        React.createElement("div", {
                            key: "bar-container",
                            className: "flex-1 bg-gray-200 rounded-full h-2"
                        }, React.createElement("div", {
                            className: `h-2 rounded-full transition-all duration-300 ${passwordStrength.color}`,
                            style: { width: `${(passwordStrength.strength / 6) * 100}%` }
                        })),
                        React.createElement("span", {
                            key: "strength-label",
                            className: `text-xs font-medium ${
                                passwordStrength.strength <= 2 ? 'text-red-600' :
                                passwordStrength.strength <= 4 ? 'text-yellow-600' : 'text-green-600'
                            }`
                        }, passwordStrength.label)
                    ])
                ]),
                
                errors.newPassword && React.createElement("p", {
                    key: "new-password-error",
                    className: "text-sm text-red-600"
                }, errors.newPassword)
            ]),

            // Confirm password field
            React.createElement("div", {
                key: "confirm-password-field",
                className: "space-y-2"
            }, [
                React.createElement("label", {
                    key: "confirm-password-label",
                    className: "block text-sm font-medium text-gray-700"
                }, "Confirm New Password *"),
                React.createElement("div", {
                    key: "confirm-password-container",
                    className: "relative"
                }, [
                    React.createElement("input", {
                        key: "confirm-password-input",
                        type: showPasswords.confirm ? "text" : "password",
                        value: formData.confirmPassword,
                        onChange: (e) => handleInputChange('confirmPassword', e.target.value),
                        className: `w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 ${
                            errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                        }`,
                        placeholder: "Confirm your new password",
                        disabled: isLoading
                    }),
                    React.createElement("button", {
                        key: "confirm-password-toggle",
                        type: "button",
                        onClick: () => togglePasswordVisibility('confirm'),
                        className: "absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600",
                        disabled: isLoading
                    }, showPasswords.confirm ? "🙈" : "👁️")
                ]),
                
                // Password match indicator
                formData.confirmPassword && React.createElement("div", {
                    key: "password-match",
                    className: "flex items-center gap-2"
                }, [
                    React.createElement(CheckCircle, {
                        key: "match-icon",
                        className: `h-4 w-4 ${
                            formData.newPassword === formData.confirmPassword 
                                ? 'text-green-500' 
                                : 'text-gray-300'
                        }`
                    }),
                    React.createElement("span", {
                        key: "match-text",
                        className: `text-xs ${
                            formData.newPassword === formData.confirmPassword 
                                ? 'text-green-600' 
                                : 'text-gray-500'
                        }`
                    }, formData.newPassword === formData.confirmPassword ? 'Passwords match' : 'Passwords do not match')
                ]),
                
                errors.confirmPassword && React.createElement("p", {
                    key: "confirm-password-error",
                    className: "text-sm text-red-600"
                }, errors.confirmPassword)
            ]),

            // Password requirements
            React.createElement("div", {
                key: "password-requirements",
                className: "p-3 bg-gray-50 rounded-lg"
            }, [
                React.createElement("p", {
                    key: "requirements-title",
                    className: "text-xs font-medium text-gray-700 mb-2"
                }, "Password Requirements:"),
                React.createElement("ul", {
                    key: "requirements-list",
                    className: "text-xs text-gray-600 space-y-1"
                }, [
                    React.createElement("li", {
                        key: "req-1",
                        className: "flex items-center gap-2"
                    }, [
                        React.createElement("span", {
                            key: "check-1",
                            className: formData.newPassword.length >= 6 ? 'text-green-500' : 'text-gray-400'
                        }, "✓"),
                        "At least 6 characters"
                    ]),
                    React.createElement("li", {
                        key: "req-2",
                        className: "flex items-center gap-2"
                    }, [
                        React.createElement("span", {
                            key: "check-2",
                            className: formData.currentPassword !== formData.newPassword || !formData.newPassword ? 'text-green-500' : 'text-red-500'
                        }, formData.currentPassword !== formData.newPassword || !formData.newPassword ? "✓" : "✗"),
                        "Different from current password"
                    ])
                ])
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
                React.createElement(Key, {
                    key: "save-icon",
                    className: "h-4 w-4"
                }),
                isLoading ? 'Changing...' : 'Change Password'
            ])
        ])
    ]));
};

export default ChangePasswordModal;
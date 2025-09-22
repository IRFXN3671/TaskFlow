import React from 'react';
import { authService } from '../../services/AuthService.js';
import { User, LogIn, AlertCircle } from '../icons/index.js';

const Login = ({onLogin}) => {
    const [username, setUsername] = React.useState("")
    const [password, setPassword] = React.useState("")
    const [error, setError] = React.useState("")
    const [loading, setLoading] = React.useState(false)
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            await authService.login(username, password);
            onLogin();
        } catch (err) {
            setError(err instanceof Error ? err.message : "Login failed");
        } finally {
            setLoading(false);
        }
    };
    
    const demoAccounts = [{
        username: "manager1",
        role: "Manager",
        name: "Sarah Johnson"
    }, {
        username: "employee1",
        role: "Employee",
        name: "Mike Chen"
    }, {
        username: "employee2",
        role: "Employee",
        name: "Emily Davis"
    }, {
        username: "employee3",
        role: "Employee",
        name: "Alex Rodriguez"
    }];
    
    const selectDemoAccount = (demoUsername) => {
        setUsername(demoUsername);
        setPassword("password123");
    };
    
    return React.createElement("div", {
        className: "min-h-screen bg-gradient-to-br from-blue-50 via-white to-teal-50 flex items-center justify-center p-4",
    }, React.createElement("div", {
        className: "w-full max-w-md",
    }, [
        React.createElement("div", {
            key: "login-form",
            className: "bg-white rounded-2xl shadow-xl p-8 border border-gray-100",
        }, [
            React.createElement("div", {
                key: "header",
                className: "text-center mb-8",
            }, [
                React.createElement("div", {
                    key: "icon",
                    className: "w-16 h-16 bg-gradient-to-r from-blue-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4",
                }, React.createElement(User, {
                    className: "h-8 w-8 text-white"
                })),
                React.createElement("h1", {
                    key: "title",
                    className: "text-2xl font-bold text-gray-900 mb-2",
                }, "Task Tracker"),
                React.createElement("p", {
                    key: "subtitle",
                    className: "text-gray-600",
                }, "Sign in to manage your tasks")
            ]),
            error && React.createElement("div", {
                key: "error",
                className: "mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3",
            }, [
                React.createElement(AlertCircle, {
                    key: "error-icon",
                    className: "h-5 w-5 text-red-500 flex-shrink-0"
                }),
                React.createElement("span", {
                    key: "error-text",
                    className: "text-red-700 text-sm",
                }, error)
            ]),
            React.createElement("form", {
                key: "form",
                onSubmit: handleSubmit,
                className: "space-y-6",
            }, [
                React.createElement("div", {
                    key: "username-field",
                }, [
                    React.createElement("label", {
                        key: "username-label",
                        htmlFor: "username",
                        className: "block text-sm font-medium text-gray-700 mb-2",
                    }, "Username"),
                    React.createElement("input", {
                        key: "username-input",
                        type: "text",
                        id: "username",
                        value: username,
                        onChange: (e) => setUsername(e.target.value),
                        className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
                        placeholder: "Enter your username",
                        required: true
                    })
                ]),
                React.createElement("div", {
                    key: "password-field",
                }, [
                    React.createElement("label", {
                        key: "password-label",
                        htmlFor: "password",
                        className: "block text-sm font-medium text-gray-700 mb-2",
                    }, "Password"),
                    React.createElement("input", {
                        key: "password-input",
                        type: "password",
                        id: "password",
                        value: password,
                        onChange: (e) => setPassword(e.target.value),
                        className: "w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors",
                        placeholder: "Enter your password",
                        required: true
                    })
                ]),
                React.createElement("button", {
                    key: "submit-button",
                    type: "submit",
                    disabled: loading,
                    className: "w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-teal-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2",
                }, loading ? React.createElement("div", {
                    className: "w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"
                }) : [
                    React.createElement(LogIn, {
                        key: "login-icon",
                        className: "h-5 w-5"
                    }),
                    "Sign In"
                ])
            ])
        ]),
        React.createElement("div", {
            key: "demo-accounts",
            className: "mt-6 bg-white rounded-2xl shadow-lg p-6 border border-gray-100",
        }, [
            React.createElement("h3", {
                key: "demo-title",
                className: "text-lg font-semibold text-gray-900 mb-4",
            }, "Demo Accounts"),
            React.createElement("p", {
                key: "demo-subtitle",
                className: "text-sm text-gray-600 mb-4",
            }, "Click on any account to auto-fill credentials:"),
            React.createElement("div", {
                key: "demo-list",
                className: "space-y-2",
            }, demoAccounts.map(account => React.createElement("button", {
                key: account.username,
                onClick: () => selectDemoAccount(account.username),
                className: "w-full text-left p-3 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group",
            }, React.createElement("div", {
                className: "flex justify-between items-center",
            }, [
                React.createElement("div", {
                    key: "account-info",
                }, [
                    React.createElement("div", {
                        key: "account-name",
                        className: "font-medium text-gray-900",
                    }, account.name),
                    React.createElement("div", {
                        key: "account-username",
                        className: "text-sm text-gray-600",
                    }, `@${account.username}`)
                ]),
                React.createElement("span", {
                    key: "account-role",
                    className: `px-2 py-1 text-xs rounded-full ${account.role === "Manager" ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"}`,
                }, account.role)
            ])))),
            React.createElement("p", {
                key: "password-hint",
                className: "text-xs text-gray-500 mt-4",
            }, [
                "Default password for all accounts: ",
                React.createElement("code", {
                    key: "password-code",
                    className: "bg-gray-100 px-2 py-1 rounded",
                }, "password123")
            ])
        ])
    ]));
};

export default Login;
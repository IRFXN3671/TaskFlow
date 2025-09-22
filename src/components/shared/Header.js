import React from 'react';
import { User, LogOut } from '../icons/index.js';

const Header = ({user, onLogout}) => {
    return React.createElement("header", {
        className: "bg-white border-b border-gray-200 px-6 py-4",
    }, React.createElement("div", {
        className: "flex items-center justify-between",
    }, [
        React.createElement("div", {
            key: "title-section",
        }, [
            React.createElement("h1", {
                key: "title",
                className: "text-2xl font-bold text-gray-900",
            }, "TaskFlow"),
            React.createElement("p", {
                key: "welcome",
                className: "text-sm text-gray-600",
            }, `Welcome back, ${user.name}`)
        ]),
        React.createElement("div", {
            key: "user-section",
            className: "flex items-center gap-4",
        }, [
            React.createElement("div", {
                key: "user-info",
                className: "flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50 border border-gray-200",
            }, [
                React.createElement("div", {
                    key: "user-avatar",
                    className: `p-2 rounded-full ${user.role === "manager" ? "bg-orange-100" : "bg-blue-100"}`,
                }, React.createElement(User, {
                    className: `h-4 w-4 ${user.role === "manager" ? "text-orange-600" : "text-blue-600"}`
                })),
                React.createElement("div", {
                    key: "user-details",
                }, [
                    React.createElement("div", {
                        key: "user-name",
                        className: "text-sm font-medium text-gray-900",
                    }, user.name),
                    React.createElement("div", {
                        key: "user-role",
                        className: `text-xs px-2 py-1 rounded-full ${user.role === "manager" ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"}`,
                    }, user.role.charAt(0).toUpperCase() + user.role.slice(1))
                ])
            ]),
            React.createElement("button", {
                key: "logout",
                onClick: onLogout,
                className: "flex items-center gap-2 px-4 py-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors",
            }, [
                React.createElement(LogOut, {
                    key: "logout-icon",
                    className: "h-4 w-4"
                }),
                React.createElement("span", {
                    key: "logout-text",
                    className: "text-sm font-medium",
                }, "Logout")
            ])
        ])
    ]));
};

export default Header;
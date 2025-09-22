import React from 'react';
import { User, LogOut, Key, ChevronDown } from '../icons/index.js';

const Header = ({user, onLogout, onChangePassword}) => {
    const [isProfileMenuOpen, setIsProfileMenuOpen] = React.useState(false);
    const menuRef = React.useRef(null);

    React.useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsProfileMenuOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleChangePassword = () => {
        setIsProfileMenuOpen(false);
        onChangePassword();
    };

    const handleLogout = () => {
        setIsProfileMenuOpen(false);
        onLogout();
    };

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
                key: "profile-menu",
                className: "relative",
                ref: menuRef
            }, [
                React.createElement("button", {
                    key: "profile-button",
                    onClick: () => setIsProfileMenuOpen(!isProfileMenuOpen),
                    className: "flex items-center gap-3 px-4 py-2 rounded-lg bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-colors",
                }, [
                    React.createElement("div", {
                        key: "user-avatar",
                        className: `p-2 rounded-full ${user.role === "manager" ? "bg-orange-100" : "bg-blue-100"}`,
                    }, React.createElement(User, {
                        className: `h-4 w-4 ${user.role === "manager" ? "text-orange-600" : "text-blue-600"}`
                    })),
                    React.createElement("div", {
                        key: "user-details",
                        className: "text-left"
                    }, [
                        React.createElement("div", {
                            key: "user-name",
                            className: "text-sm font-medium text-gray-900",
                        }, user.name),
                        React.createElement("div", {
                            key: "user-role",
                            className: `text-xs px-2 py-1 rounded-full ${user.role === "manager" ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"}`,
                        }, user.role.charAt(0).toUpperCase() + user.role.slice(1))
                    ]),
                    React.createElement(ChevronDown, {
                        key: "chevron",
                        className: `h-4 w-4 text-gray-400 transition-transform duration-200 ${isProfileMenuOpen ? 'rotate-180' : ''}`
                    })
                ]),
                
                // Profile dropdown menu
                isProfileMenuOpen && React.createElement("div", {
                    key: "dropdown-menu",
                    className: "absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50"
                }, [
                    // User details section
                    React.createElement("div", {
                        key: "user-info",
                        className: "px-4 py-3 border-b border-gray-100"
                    }, [
                        React.createElement("div", {
                            key: "profile-info",
                            className: "flex items-center gap-3"
                        }, [
                            React.createElement("div", {
                                key: "large-avatar",
                                className: `w-10 h-10 rounded-full ${user.role === "manager" ? "bg-orange-100" : "bg-blue-100"} flex items-center justify-center`,
                            }, React.createElement(User, {
                                className: `h-5 w-5 ${user.role === "manager" ? "text-orange-600" : "text-blue-600"}`
                            })),
                            React.createElement("div", {
                                key: "profile-details",
                            }, [
                                React.createElement("div", {
                                    key: "profile-name",
                                    className: "font-medium text-gray-900",
                                }, user.name),
                                React.createElement("div", {
                                    key: "profile-username",
                                    className: "text-sm text-gray-600",
                                }, `@${user.username}`),
                                React.createElement("div", {
                                    key: "profile-role",
                                    className: `text-xs px-2 py-1 rounded-full mt-1 inline-block ${user.role === "manager" ? "bg-orange-100 text-orange-800" : "bg-blue-100 text-blue-800"}`,
                                }, user.role.charAt(0).toUpperCase() + user.role.slice(1))
                            ])
                        ])
                    ]),
                    
                    // Menu items
                    React.createElement("div", {
                        key: "menu-items",
                        className: "py-2"
                    }, [
                        React.createElement("button", {
                            key: "change-password",
                            onClick: handleChangePassword,
                            className: "w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        }, [
                            React.createElement(Key, {
                                key: "key-icon",
                                className: "h-4 w-4 text-gray-400"
                            }),
                            React.createElement("span", {
                                key: "change-password-text",
                            }, "Change Password")
                        ]),
                        React.createElement("hr", {
                            key: "divider",
                            className: "my-2"
                        }),
                        React.createElement("button", {
                            key: "logout",
                            onClick: handleLogout,
                            className: "w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-3 transition-colors"
                        }, [
                            React.createElement(LogOut, {
                                key: "logout-icon",
                                className: "h-4 w-4"
                            }),
                            React.createElement("span", {
                                key: "logout-text",
                            }, "Sign Out")
                        ])
                    ])
                ])
            ])
        ])
    ]));
};

export default Header;
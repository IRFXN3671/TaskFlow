import React from 'react';
import { Users, Plus, Search, Filter, X } from '../icons/index.js';
import EmployeeCard from './EmployeeCard.js';
import EmployeeModal from './EmployeeModal.js';
import { employeeService } from '../../services/EmployeeService.js';

const EmployeeList = () => {
    const [employees, setEmployees] = React.useState([]);
    const [filteredEmployees, setFilteredEmployees] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isModalOpen, setIsModalOpen] = React.useState(false);
    const [editingEmployee, setEditingEmployee] = React.useState(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');
    const [statusFilter, setStatusFilter] = React.useState('all'); // 'all', 'active', 'inactive'
    const [departmentFilter, setDepartmentFilter] = React.useState('all');
    const [skillsFilter, setSkillsFilter] = React.useState([]);
    const [stats, setStats] = React.useState({});

    // Load employees on component mount
    React.useEffect(() => {
        loadEmployees();
        loadStats();
        
        // Subscribe to employee changes
        const unsubscribe = employeeService.subscribe(() => {
            loadEmployees();
            loadStats();
        });

        return unsubscribe;
    }, []);

    // Filter employees when search or filter changes
    React.useEffect(() => {
        filterEmployees();
    }, [employees, searchTerm, statusFilter, departmentFilter, skillsFilter]);

    const loadEmployees = async () => {
        try {
            setIsLoading(true);
            const employeeData = await employeeService.getAllEmployees();
            setEmployees(employeeData);
        } catch (error) {
            console.error('Failed to load employees:', error);
            alert('Failed to load employees. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const employeeStats = await employeeService.getEmployeeStats();
            setStats(employeeStats);
        } catch (error) {
            console.error('Failed to load employee stats:', error);
        }
    };

    const filterEmployees = () => {
        let filtered = [...employees];

        // Search filter
        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(emp => 
                emp.name.toLowerCase().includes(term) ||
                emp.email.toLowerCase().includes(term) ||
                emp.position.toLowerCase().includes(term) ||
                emp.department.toLowerCase().includes(term) ||
                (emp.skills && emp.skills.some(skill => 
                    skill.toLowerCase().includes(term)
                ))
            );
        }

        // Status filter
        if (statusFilter === 'active') {
            filtered = filtered.filter(emp => emp.isActive === true);
        } else if (statusFilter === 'inactive') {
            filtered = filtered.filter(emp => emp.isActive === false);
        }

        // Department filter
        if (departmentFilter !== 'all') {
            filtered = filtered.filter(emp => emp.department === departmentFilter);
        }

        // Skills filter (changed from .every to .some for AND logic)
        if (skillsFilter.length > 0) {
            filtered = filtered.filter(emp => 
                emp.skills && skillsFilter.some(skill => 
                    emp.skills.includes(skill)
                )
            );
        }

        setFilteredEmployees(filtered);
    };

    const handleAddEmployee = () => {
        setEditingEmployee(null);
        setIsModalOpen(true);
    };

    const handleEditEmployee = (employee) => {
        setEditingEmployee(employee);
        setIsModalOpen(true);
    };

    const handleSaveEmployee = async (employeeData) => {
        try {
            setIsSubmitting(true);
            
            if (editingEmployee) {
                await employeeService.updateEmployee(editingEmployee.id, employeeData);
            } else {
                const newEmployee = await employeeService.createEmployee(employeeData);
                alert(`Employee added successfully!\n\nLogin Credentials:\nUsername: ${newEmployee.username}\nPassword: ${newEmployee.defaultPassword}\n\nPlease save these credentials securely.`);
            }
            
            setIsModalOpen(false);
            setEditingEmployee(null);
        } catch (error) {
            console.error('Failed to save employee:', error);
            alert('Failed to save employee. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleToggleStatus = async (employeeId) => {
        try {
            await employeeService.toggleEmployeeStatus(employeeId);
        } catch (error) {
            console.error('Failed to toggle employee status:', error);
            alert('Failed to update employee status. Please try again.');
        }
    };

    const handleResetPassword = async (employeeId) => {
        if (!confirm('Are you sure you want to reset this employee\'s password? This will generate a new default password.')) {
            return;
        }

        try {
            const result = await employeeService.resetPassword(employeeId);
            alert(`Password reset successfully!\n\nNew Login Credentials:\nUsername: ${result.username}\nPassword: ${result.password}\n\nPlease provide these credentials to the employee securely.`);
        } catch (error) {
            console.error('Failed to reset password:', error);
            alert('Failed to reset password. Please try again.');
        }
    };

    const handleDeleteEmployee = async (employeeId) => {
        const employee = employees.find(emp => emp.id === employeeId);
        if (!confirm(`Are you sure you want to delete ${employee?.name}? This action cannot be undone.`)) {
            return;
        }

        try {
            await employeeService.deleteEmployee(employeeId);
        } catch (error) {
            console.error('Failed to delete employee:', error);
            alert('Failed to delete employee. Please try again.');
        }
    };

    const getDepartments = () => {
        const departments = [...new Set(employees.map(emp => emp.department))];
        return departments.sort();
    };

    const getAllSkills = () => {
        const allSkills = new Set();
        employees.forEach(emp => {
            if (emp.skills) {
                emp.skills.forEach(skill => allSkills.add(skill));
            }
        });
        return Array.from(allSkills).sort();
    };

    const addSkillFilter = (skill) => {
        if (!skillsFilter.includes(skill)) {
            setSkillsFilter(prev => [...prev, skill]);
        }
    };

    const removeSkillFilter = (skill) => {
        setSkillsFilter(prev => prev.filter(s => s !== skill));
    };

    const clearAllFilters = () => {
        setSearchTerm('');
        setStatusFilter('all');
        setDepartmentFilter('all');
        setSkillsFilter([]);
    };

    return React.createElement("div", { className: "space-y-6" }, [
        // Header with stats
        React.createElement("div", {
            key: "header",
            className: "bg-white rounded-xl border border-gray-200 p-6"
        }, [
            React.createElement("div", {
                key: "title-section",
                className: "flex items-center justify-between mb-6"
            }, [
                React.createElement("div", {
                    key: "title",
                    className: "flex items-center gap-3"
                }, [
                    React.createElement("div", {
                        key: "icon",
                        className: "w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center"
                    }, React.createElement(Users, {
                        className: "h-5 w-5 text-blue-600"
                    })),
                    React.createElement("div", {
                        key: "text"
                    }, [
                        React.createElement("h2", {
                            key: "main-title",
                            className: "text-2xl font-bold text-gray-900"
                        }, "Employee Management"),
                        React.createElement("p", {
                            key: "subtitle",
                            className: "text-gray-600 mt-1"
                        }, "Manage your team members and their access")
                    ])
                ]),
                React.createElement("button", {
                    key: "add-btn",
                    onClick: handleAddEmployee,
                    className: "flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                }, [
                    React.createElement(Plus, {
                        key: "plus-icon",
                        className: "h-4 w-4"
                    }),
                    "Add Employee"
                ])
            ]),

            // Stats cards
            React.createElement("div", {
                key: "stats",
                className: "grid grid-cols-1 md:grid-cols-4 gap-4"
            }, [
                React.createElement("div", {
                    key: "total",
                    className: "bg-blue-50 rounded-lg p-4"
                }, [
                    React.createElement("div", {
                        key: "total-number",
                        className: "text-2xl font-bold text-blue-600"
                    }, stats.totalEmployees || 0),
                    React.createElement("div", {
                        key: "total-label",
                        className: "text-sm text-blue-600 font-medium"
                    }, "Total Employees")
                ]),
                React.createElement("div", {
                    key: "active",
                    className: "bg-green-50 rounded-lg p-4"
                }, [
                    React.createElement("div", {
                        key: "active-number",
                        className: "text-2xl font-bold text-green-600"
                    }, stats.activeEmployees || 0),
                    React.createElement("div", {
                        key: "active-label",
                        className: "text-sm text-green-600 font-medium"
                    }, "Active Employees")
                ]),
                React.createElement("div", {
                    key: "inactive",
                    className: "bg-red-50 rounded-lg p-4"
                }, [
                    React.createElement("div", {
                        key: "inactive-number",
                        className: "text-2xl font-bold text-red-600"
                    }, stats.inactiveEmployees || 0),
                    React.createElement("div", {
                        key: "inactive-label",
                        className: "text-sm text-red-600 font-medium"
                    }, "Inactive Employees")
                ]),
                React.createElement("div", {
                    key: "departments",
                    className: "bg-purple-50 rounded-lg p-4"
                }, [
                    React.createElement("div", {
                        key: "dept-number",
                        className: "text-2xl font-bold text-purple-600"
                    }, Object.keys(stats.departmentStats || {}).length),
                    React.createElement("div", {
                        key: "dept-label",
                        className: "text-sm text-purple-600 font-medium"
                    }, "Departments")
                ])
            ])
        ]),

        // Filters and search
        React.createElement("div", {
            key: "filters",
            className: "bg-white rounded-xl border border-gray-200 p-4"
        }, [
            React.createElement("div", {
                key: "filter-row",
                className: "flex flex-col md:flex-row gap-4"
            }, [
                // Search
                React.createElement("div", {
                    key: "search",
                    className: "flex-1 relative"
                }, [
                    React.createElement("input", {
                        key: "search-input",
                        type: "text",
                        value: searchTerm,
                        onChange: (e) => setSearchTerm(e.target.value),
                        placeholder: "Search employees, skills...",
                        className: "w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    }),
                    React.createElement(Search, {
                        key: "search-icon",
                        className: "absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"
                    })
                ]),

                // Status filter
                React.createElement("select", {
                    key: "status-filter",
                    value: statusFilter,
                    onChange: (e) => setStatusFilter(e.target.value),
                    className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }, [
                    React.createElement("option", { key: "all", value: "all" }, "All Status"),
                    React.createElement("option", { key: "active", value: "active" }, "Active Only"),
                    React.createElement("option", { key: "inactive", value: "inactive" }, "Inactive Only")
                ]),

                // Department filter
                React.createElement("select", {
                    key: "dept-filter",
                    value: departmentFilter,
                    onChange: (e) => setDepartmentFilter(e.target.value),
                    className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }, [
                    React.createElement("option", { key: "all-dept", value: "all" }, "All Departments"),
                    ...getDepartments().map(dept => 
                        React.createElement("option", { key: dept, value: dept }, dept)
                    )
                ]),

                // Skills filter dropdown
                React.createElement("select", {
                    key: "skills-filter",
                    value: "",
                    onChange: (e) => {
                        if (e.target.value) {
                            addSkillFilter(e.target.value);
                            e.target.value = "";
                        }
                    },
                    className: "px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                }, [
                    React.createElement("option", { key: "filter-by-skill", value: "" }, "Filter by Skill"),
                    ...getAllSkills().filter(skill => !skillsFilter.includes(skill)).map(skill => 
                        React.createElement("option", { key: skill, value: skill }, skill)
                    )
                ])
            ]),

            // Active skill filters display
            skillsFilter.length > 0 && React.createElement("div", {
                key: "active-skill-filters",
                className: "mt-3 flex flex-wrap items-center gap-2"
            }, [
                React.createElement("span", {
                    key: "filter-label",
                    className: "text-sm text-gray-600 font-medium"
                }, "Skills:"),
                ...skillsFilter.map(skill =>
                    React.createElement("span", {
                        key: skill,
                        className: "inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full"
                    }, [
                        React.createElement("span", { key: "skill-text" }, skill),
                        React.createElement("button", {
                            key: "remove-skill",
                            onClick: () => removeSkillFilter(skill),
                            className: "text-blue-600 hover:text-blue-800 ml-1"
                        }, React.createElement(X, { className: "h-3 w-3" }))
                    ])
                ),
                React.createElement("button", {
                    key: "clear-all",
                    onClick: clearAllFilters,
                    className: "text-xs text-gray-500 hover:text-gray-700 underline"
                }, "Clear all filters")
            ])
        ]),

        // Employee grid
        React.createElement("div", {
            key: "employee-grid"
        }, isLoading 
            ? React.createElement("div", {
                className: "flex items-center justify-center py-12"
            }, React.createElement("div", {
                className: "text-gray-500"
            }, "Loading employees..."))
            : filteredEmployees.length === 0 
                ? React.createElement("div", {
                    className: "bg-white rounded-xl border border-gray-200 p-12 text-center"
                }, [
                    React.createElement(Users, {
                        key: "no-employees-icon",
                        className: "h-12 w-12 text-gray-400 mx-auto mb-4"
                    }),
                    React.createElement("h3", {
                        key: "no-employees-title",
                        className: "text-lg font-medium text-gray-900 mb-2"
                    }, searchTerm || statusFilter !== 'all' || departmentFilter !== 'all' || skillsFilter.length > 0 ? "No employees found" : "No employees yet"),
                    React.createElement("p", {
                        key: "no-employees-desc",
                        className: "text-gray-600"
                    }, searchTerm || statusFilter !== 'all' || departmentFilter !== 'all' || skillsFilter.length > 0
                        ? "Try adjusting your search or filters" 
                        : "Add your first employee to get started"),
                    !searchTerm && statusFilter === 'all' && departmentFilter === 'all' && skillsFilter.length === 0 && React.createElement("button", {
                        key: "add-first-btn",
                        onClick: handleAddEmployee,
                        className: "mt-4 flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mx-auto"
                    }, [
                        React.createElement(Plus, {
                            key: "plus-icon",
                            className: "h-4 w-4"
                        }),
                        "Add First Employee"
                    ])
                ])
                : React.createElement("div", {
                    className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                }, filteredEmployees.map(employee => 
                    React.createElement(EmployeeCard, {
                        key: employee.id,
                        employee: employee,
                        onToggleStatus: handleToggleStatus,
                        onEdit: handleEditEmployee,
                        onDelete: handleDeleteEmployee,
                        onResetPassword: handleResetPassword
                    })
                ))
        ),

        // Employee Modal
        React.createElement(EmployeeModal, {
            key: "employee-modal",
            isOpen: isModalOpen,
            onClose: () => setIsModalOpen(false),
            onSave: handleSaveEmployee,
            employee: editingEmployee,
            isLoading: isSubmitting
        })
    ]);
};

export default EmployeeList;
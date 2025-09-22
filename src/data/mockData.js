const mockUsers = [{
    id: "1",
    username: "manager1",
    role: "manager",
    name: "Irfan"
}, {
    id: "2",
    username: "employee1",
    role: "employee",
    name: "Nidal"
}, {
    id: "3",
    username: "employee2",
    role: "employee",
    name: "Wasim"
}, {
    id: "4",
    username: "employee3",
    role: "employee",
    name: "Sanin"
}];

const mockTasks = [{
    id: "1",
    title: "Design Homepage Layout",
    description: "Create wireframes and mockups for the new homepage design",
    status: "in-progress",
    priority: "high",
    dueDate: "2025-02-01",
    assigneeId: "2",
    assigneeName: "Nidal",
    createdAt: "2025-01-15T10:00:00Z",
    updatedAt: "2025-01-16T14:30:00Z"
}, {
    id: "2",
    title: "API Documentation Update",
    description: "Update the API documentation with latest endpoints",
    status: "pending",
    priority: "medium",
    dueDate: "2025-01-28",
    assigneeId: "3",
    assigneeName: "Wasim",
    createdAt: "2025-01-14T09:00:00Z",
    updatedAt: "2025-01-14T09:00:00Z"
}, {
    id: "3",
    title: "Database Migration Script",
    description: "Create migration scripts for the new user roles table",
    status: "completed",
    priority: "high",
    dueDate: "2025-01-20",
    assigneeId: "4",
    assigneeName: "Sanin",
    createdAt: "2025-01-12T11:00:00Z",
    updatedAt: "2025-01-18T16:00:00Z"
}, {
    id: "4",
    title: "User Testing Session",
    description: "Conduct user testing for the new dashboard interface",
    status: "pending",
    priority: "medium",
    dueDate: "2025-02-05",
    assigneeId: "2",
    assigneeName: "Nidal",
    createdAt: "2025-01-16T13:00:00Z",
    updatedAt: "2025-01-16T13:00:00Z"
}, {
    id: "5",
    title: "Security Audit",
    description: "Perform comprehensive security audit of the authentication system",
    status: "in-progress",
    priority: "high",
    dueDate: "2025-01-25",
    assigneeId: "3",
    assigneeName: "Wasim",
    createdAt: "2025-01-13T15:00:00Z",
    updatedAt: "2025-01-17T10:00:00Z"
}, {
    id: "6",
    title: "Mobile App Testing",
    description: "Test mobile responsiveness across different devices",
    status: "completed",
    priority: "low",
    dueDate: "2025-01-22",
    assigneeId: "4",
    assigneeName: "Sanin",
    createdAt: "2025-01-11T08:00:00Z",
    updatedAt: "2025-01-19T12:00:00Z"
}];

const mockCredentials = {
    manager1: "password123",
    employee1: "password123",
    employee2: "password123",
    employee3: "password123"
};

export { mockUsers, mockTasks, mockCredentials };
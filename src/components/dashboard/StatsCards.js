import React from 'react';
import { ClipboardList, CheckCircle, Clock, AlertCircle } from '../icons/index.js';

const StatsCards = ({stats}) => {
    const cards = [{
        title: "Total Tasks",
        value: stats.totalTasks,
        icon: ClipboardList,
        color: "bg-blue-500",
        bgColor: "bg-blue-50",
        textColor: "text-blue-700"
    }, {
        title: "Completed",
        value: stats.completedTasks,
        icon: CheckCircle,
        color: "bg-green-500",
        bgColor: "bg-green-50",
        textColor: "text-green-700"
    }, {
        title: "In Progress",
        value: stats.inProgressTasks,
        icon: Clock,
        color: "bg-yellow-500",
        bgColor: "bg-yellow-50",
        textColor: "text-yellow-700"
    }, {
        title: "Overdue",
        value: stats.overdueTasks,
        icon: AlertCircle,
        color: "bg-red-500",
        bgColor: "bg-red-50",
        textColor: "text-red-700"
    }];
    
    return React.createElement("div", {
        className: "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6",
    }, cards.map((card, index) => React.createElement("div", {
        key: index,
        className: `${card.bgColor} rounded-xl border border-gray-200 p-6 transition-all duration-200 hover:scale-105`,
    }, [
        React.createElement("div", {
            key: "content",
            className: "flex items-center justify-between",
        }, [
            React.createElement("div", {
                key: "text",
            }, [
                React.createElement("p", {
                    key: "title",
                    className: `text-sm font-medium ${card.textColor} mb-1`,
                }, card.title),
                React.createElement("p", {
                    key: "value",
                    className: "text-3xl font-bold text-gray-900",
                }, card.value)
            ]),
            React.createElement("div", {
                key: "icon",
                className: `p-3 rounded-lg ${card.color}`,
            }, React.createElement(card.icon, {
                className: "h-6 w-6 text-white"
            }))
        ]),
        card.title === "Completed" && stats.totalTasks > 0 && React.createElement("div", {
            key: "progress",
            className: "mt-4",
        }, [
            React.createElement("div", {
                key: "progress-header",
                className: "flex items-center justify-between text-sm",
            }, [
                React.createElement("span", {
                    key: "progress-label",
                    className: card.textColor,
                }, "Completion Rate"),
                React.createElement("span", {
                    key: "progress-value",
                    className: "font-medium text-gray-900",
                }, `${Math.round(stats.completionRate)}%`)
            ]),
            React.createElement("div", {
                key: "progress-bar",
                className: "mt-2 bg-gray-200 rounded-full h-2",
            }, React.createElement("div", {
                className: `h-2 rounded-full transition-all duration-500 ${card.color}`,
                style: {
                    width: `${stats.completionRate}%`
                }
            }))
        ])
    ])));
};

export default StatsCards;
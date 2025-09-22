import React from 'react';

const Chart = ({data, type, title}) => {
    if (type === "bar") {
        const maxValue = Math.max(...data.map(item => item.value));
        
        return React.createElement("div", {
            className: "bg-white rounded-xl border border-gray-200 p-6",
        }, [
            React.createElement("h3", {
                key: "title",
                className: "text-lg font-semibold text-gray-900 mb-6",
            }, title),
            React.createElement("div", {
                key: "bars",
                className: "space-y-4",
            }, data.map((item, index) => React.createElement("div", {
                key: index,
                className: "flex items-center gap-4",
            }, [
                React.createElement("div", {
                    key: "label",
                    className: "w-20 text-sm text-gray-600 text-right",
                }, item.name),
                React.createElement("div", {
                    key: "bar",
                    className: "flex-1 bg-gray-100 rounded-full h-8 flex items-center px-2",
                }, React.createElement("div", {
                    className: "h-6 rounded-full flex items-center justify-end pr-2 text-white text-sm font-medium transition-all duration-500",
                    style: {
                        backgroundColor: item.color,
                        width: `${item.value / maxValue * 100}%`,
                        minWidth: item.value > 0 ? "2rem" : "0"
                    },
                }, item.value > 0 && item.value))
            ])))
        ]);
    }
    
    if (type === "pie") {
        const total = data.reduce((sum, item) => sum + item.value, 0);
        let cumulativeOffset = 0;
        
        return React.createElement("div", {
            className: "bg-white rounded-xl border border-gray-200 p-6",
        }, [
            React.createElement("h3", {
                key: "title",
                className: "text-lg font-semibold text-gray-900 mb-6",
            }, title),
            React.createElement("div", {
                key: "chart",
                className: "flex flex-col lg:flex-row items-center gap-6",
            }, [
                React.createElement("div", {
                    key: "pie",
                    className: "relative",
                }, [
                    React.createElement("svg", {
                        key: "svg",
                        width: "200",
                        height: "200",
                        viewBox: "0 0 200 200",
                        className: "transform -rotate-90",
                    }, data.map((item, index) => {
                        const percentage = item.value / total * 100;
                        const dashArray = `${percentage} ${100 - percentage}`;
                        const dashOffset = -cumulativeOffset;
                        const circle = React.createElement("circle", {
                            key: index,
                            cx: "100",
                            cy: "100",
                            r: "40",
                            fill: "transparent",
                            stroke: item.color,
                            strokeWidth: "20",
                            strokeDasharray: dashArray,
                            strokeDashoffset: dashOffset,
                            className: "transition-all duration-500",
                            pathLength: "100"
                        });
                        cumulativeOffset += percentage;
                        return circle;
                    })),
                    React.createElement("div", {
                        key: "center",
                        className: "absolute inset-0 flex items-center justify-center",
                    }, React.createElement("div", {
                        className: "text-center",
                    }, [
                        React.createElement("div", {
                            key: "total-value",
                            className: "text-2xl font-bold text-gray-900",
                        }, total),
                        React.createElement("div", {
                            key: "total-label",
                            className: "text-sm text-gray-600",
                        }, "Total")
                    ]))
                ]),
                React.createElement("div", {
                    key: "legend",
                    className: "space-y-2",
                }, data.map((item, index) => React.createElement("div", {
                    key: index,
                    className: "flex items-center gap-3",
                }, [
                    React.createElement("div", {
                        key: "color",
                        className: "w-4 h-4 rounded-full",
                        style: {
                            backgroundColor: item.color
                        }
                    }),
                    React.createElement("span", {
                        key: "text",
                        className: "text-sm text-gray-700",
                    }, `${item.name}: ${item.value} (${total > 0 ? Math.round(item.value / total * 100) : 0}%)`)
                ])))
            ])
        ]);
    }
    
    return null;
};

export default Chart;
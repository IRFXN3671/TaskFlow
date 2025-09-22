import React from 'react';

const Z = (name, paths) => (props) => 
  React.createElement("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "2",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    ...props
  }, paths.map((path, index) => 
    React.createElement(path[0], { ...path[1], key: index })
  ));

// Icons
export const AlertCircle = Z("AlertCircle", [["circle", { cx: "12", cy: "12", r: "10" }], ["line", { x1: "12", y1: "8", x2: "12", y2: "12" }], ["line", { x1: "12", y1: "16", x2: "12.01", y2: "16" }]]);
export const BarChart3 = Z("BarChart3", [["path", { d: "M3 3v18h18" }], ["rect", { width: "4", height: "7", x: "7", y: "10" }], ["rect", { width: "4", height: "12", x: "15", y: "5" }]]);
export const Bell = Z("Bell", [["path", { d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" }], ["path", { d: "m13.73 21a2 2 0 0 1-3.46 0" }]]);
export const Calendar = Z("Calendar", [["rect", { width: "18", height: "18", x: "3", y: "4", rx: "2", ry: "2" }], ["line", { x1: "16", y1: "2", x2: "16", y2: "6" }], ["line", { x1: "8", y1: "2", x2: "8", y2: "6" }], ["line", { x1: "3", y1: "10", x2: "21", y2: "10" }]]);
export const CheckCircle = Z("CheckCircle", [["path", { d: "M22 11.08V12a10 10 0 1 1-5.93-9.14" }], ["polyline", { points: "22,4 12,14.01 9,11.01" }]]);
export const ChevronDown = Z("ChevronDown", [["polyline", { points: "6,9 12,15 18,9" }]]);
export const ChevronUp = Z("ChevronUp", [["polyline", { points: "18,15 12,9 6,15" }]]);
export const ClipboardList = Z("ClipboardList", [["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1" }], ["path", { d: "M6 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" }], ["path", { d: "M10 11h6" }], ["path", { d: "M10 15h6" }], ["path", { d: "m8 11 1.5 1.5L13 9" }]]);
export const Clock = Z("Clock", [["circle", { cx: "12", cy: "12", r: "10" }], ["polyline", { points: "12,6 12,12 16,14" }]]);
export const Filter = Z("Filter", [["polygon", { points: "22,3 2,3 10,12.46 10,19 14,21 14,12.46" }]]);
export const Flag = Z("Flag", [["path", { d: "M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" }], ["line", { x1: "4", y1: "22", x2: "4", y2: "15" }]]);
export const LogIn = Z("LogIn", [["path", { d: "m15 3 4 4-4 4" }], ["path", { d: "M2 17h12" }], ["path", { d: "m2 21 4-4-4-4" }]]);
export const LogOut = Z("LogOut", [["path", { d: "M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" }], ["polyline", { points: "16,17 21,12 16,7" }], ["line", { x1: "21", y1: "12", x2: "9", y2: "12" }]]);
export const Plus = Z("Plus", [["line", { x1: "12", y1: "5", x2: "12", y2: "19" }], ["line", { x1: "5", y1: "12", x2: "19", y2: "12" }]]);
export const Save = Z("Save", [["path", { d: "M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" }], ["polyline", { points: "17,21 17,13 7,13 7,21" }], ["polyline", { points: "7,3 7,8 15,8" }]]);
export const Search = Z("Search", [["circle", { cx: "11", cy: "11", r: "8" }], ["path", { d: "m21 21-4.35-4.35" }]]);
export const TrendingUp = Z("TrendingUp", [["polyline", { points: "22,7 13.5,15.5 8.5,10.5 2,17" }], ["polyline", { points: "16,7 22,7 22,13" }]]);
export const User = Z("User", [["path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }], ["circle", { cx: "12", cy: "7", r: "4" }]]);
export const Users = Z("Users", [["path", { d: "M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" }], ["circle", { cx: "9", cy: "7", r: "4" }], ["path", { d: "m22 21-2-2" }], ["path", { d: "M16 3.13a4 4 0 0 1 0 7.75" }]]);
export const X = Z("X", [["line", { x1: "18", y1: "6", x2: "6", y2: "18" }], ["line", { x1: "6", y1: "6", x2: "18", y2: "18" }]]);
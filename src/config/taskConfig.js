// Task Priority Configuration
export const PRIORITY_CONFIG = {
	LOW: {
		bgcolor: "success.100",
		color: "success.800",
		label: "Low Priority",
	},
	MEDIUM: {
		bgcolor: "warning.100",
		color: "warning.800",
		label: "Medium Priority",
	},
	HIGH: {
		bgcolor: "error.100",
		color: "error.800",
		label: "High Priority",
	},
};

// Tag Color Configuration
export const TAG_COLORS = [
	{ bgcolor: "primary.100", color: "primary.800" },
	{ bgcolor: "secondary.100", color: "secondary.800" },
	{ bgcolor: "info.100", color: "info.800" },
	{ bgcolor: "success.100", color: "success.800" },
	{ bgcolor: "warning.100", color: "warning.800" },
];

// Column Status Configuration
export const COLUMN_CONFIG = {
	TODO: {
		id: "TODO",
		title: "To Do",
		color: "grey.100",
		borderColor: "grey.200",
		hoverColor: "grey.50",
		limit: 10,
	},
	DOING: {
		id: "DOING",
		title: "In Progress",
		color: "primary.50",
		borderColor: "primary.200",
		hoverColor: "primary.50",
		limit: 5,
	},
	DONE: {
		id: "DONE",
		title: "Done",
		color: "success.50",
		borderColor: "success.200",
		hoverColor: "success.50",
		limit: Infinity,
	},
};

// Sprint Configuration
export const SPRINT_CONFIG = {
	defaultDuration: 2, // Default sprint duration in weeks
	minDuration: 1, // Minimum sprint duration in weeks
	maxDuration: 4, // Maximum sprint duration in weeks
	year: 2025, // Target year for sprints
};

// Task Status Options
export const TASK_STATUS = {
	TODO: "TODO",
	DOING: "DOING",
	DONE: "DONE",
};

// Default Task Configuration
export const DEFAULT_TASK = {
	title: "",
	description: "",
	priority: "MEDIUM",
	status: TASK_STATUS.TODO,
	estimatedEffort: "1",
	actualEffort: "0",
	tags: [],
	position: 1,
	teamId: "",
	assigneeId: "",
	sprintId: null,
	dueDate: new Date().toISOString().split("T")[0],
};

// Column Order
export const COLUMN_ORDER = ["TODO", "DOING", "DONE"];

// Column Titles
export const COLUMN_TITLES = {
	TODO: "To Do",
	DOING: "In Progress",
	DONE: "Done",
};

// Default number of months to look ahead for opportunities
export const DEFAULT_MONTHS_AHEAD = 6;

// Get default start date (first day of current month)
export const getDefaultStartDate = () => {
	const date = new Date();
	date.setDate(1); // First day of current month
	return date;
};

// Get default end date (last day of month X months from now)
export const getDefaultEndDate = (monthsAhead = DEFAULT_MONTHS_AHEAD) => {
	const date = new Date();
	date.setMonth(date.getMonth() + monthsAhead); // Add X months
	date.setDate(0); // Set to last day of month
	return date;
};

// Format date for API requests
export const formatDateForApi = (date) => {
	if (!date) return "";
	const month = date.getMonth() + 1;
	const day = date.getDate();
	const year = date.getFullYear();
	return `${month}/${day}/${year}`;
};

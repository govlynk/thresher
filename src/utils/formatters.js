export const formatCurrency = (amount) => {
	if (!amount) return "N/A";
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
		minimumFractionDigits: 0,
		maximumFractionDigits: 0,
	}).format(amount);
};

export const formatShortDate = (dateString) => {
	if (!dateString) return "N/A";
	try {
		return new Date(dateString).toLocaleDateString(undefined, {
			month: "2-digit",
			day: "2-digit",
		});
	} catch (error) {
		console.error("Error formatting short date:", error);
		return "Invalid Date";
	}
};

export const formatDate = (dateString) => {
	if (!dateString) return "N/A";
	try {
		return new Date(dateString).toLocaleDateString(undefined, {
			year: "numeric",
			month: "long",
			day: "numeric",
		});
	} catch (error) {
		console.error("Error formatting date:", error);
		return "Invalid Date";
	}
};

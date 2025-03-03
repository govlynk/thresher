export const getCompanyStoragePath = (companyId, path = "") => {
	if (!companyId) throw new Error("Company ID is required");

	// Normalize the path and ensure proper structure
	const normalizedPath = path ? path.replace(/^\/+|\/+$/g, "").replace(/\/+$/g, "") : "";
	const basePath = `company/${companyId}`;

	// For directory creation, preserve the trailing slash if it was in the original path
	const shouldAddTrailingSlash = path && path.endsWith("/");
	const finalPath = normalizedPath ? `${basePath}/${normalizedPath}` : basePath;
	return shouldAddTrailingSlash ? `${finalPath}/` : finalPath;
};

export const validateStoragePath = (path) => {
	if (!path.startsWith("company/")) {
		throw new Error("Invalid storage path: must start with company/");
	}
	return path;
};

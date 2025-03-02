export const getCompanyStoragePath = (companyId, path = "") => {
	if (!companyId) throw new Error("Company ID is required");

	// Construct the path without company prefix since it's added by the S3 structure
	const normalizedPath = path ? path.replace(/^\/+|\/+$/g, "") : "";
	return normalizedPath;
};

export const validateStoragePath = (path) => {
	// No need to validate company prefix since it's handled by S3 structure
	return path;
};

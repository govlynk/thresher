import { uploadData, getUrl, remove, list } from "aws-amplify/storage";
import { getCompanyStoragePath } from "../utils/storage/storageUtils";
import { useState, useCallback } from "react";
import { useGlobalStore } from "../stores/globalStore";

export function useStorageManager(companyId) {
	const [files, setFiles] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { activeCompanyId } = useGlobalStore();

	// Validate company access
	const validateCompanyAccess = () => {
		if (!companyId) {
			throw new Error("Company ID is required");
		}
		if (companyId !== activeCompanyId) {
			throw new Error("Unauthorized access to company files");
		}
	};

	const listFiles = useCallback(
		async (path = "") => {
			try {
				validateCompanyAccess();
				setLoading(true);
				setError(null);

				const storagePath = getCompanyStoragePath(companyId, path);
				const result = await list({
					prefix: storagePath,
					options: {
						accessLevel: "private",
					},
				});

				// Process files to show relative paths without the company prefix
				const processedFiles = result.items
					.filter((item) => item.key !== storagePath) // Filter out the current directory entry
					.map((item) => {
						const relativePath = item.key.replace(storagePath ? `${storagePath}/` : storagePath, "");
						return {
							key: item.key,
							name: relativePath.split("/")[0], // Get the first segment of the relative path
							size: item.size,
							lastModified: item.lastModified,
							isFolder: item.size === 0 && item.key.endsWith("/"),
						};
					});

				setFiles(processedFiles);
			} catch (err) {
				console.error("Error listing files:", err);
				setError(err.message || "Failed to list files");
			} finally {
				setLoading(false);
			}
		},
		[companyId, activeCompanyId]
	);

	const uploadFile = async (file, path = "") => {
		try {
			validateCompanyAccess();
			setError(null);

			const key = getCompanyStoragePath(companyId, path ? `${path}/${file.name}` : file.name);
			await uploadData({
				key,
				data: file,
				options: {
					accessLevel: "private",
					contentType: file.type,
				},
			});
		} catch (err) {
			console.error("Error uploading file:", err);
			setError(err.message || "Failed to upload file");
			throw err;
		}
	};

	const downloadFile = async (file) => {
		try {
			validateCompanyAccess();
			setError(null);

			const url = await getUrl({
				key: file.key,
				options: {
					accessLevel: "private",
					download: true,
				},
			});

			// Create a temporary link to download the file
			const link = document.createElement("a");
			link.href = url.url;
			link.download = file.name;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (err) {
			console.error("Error downloading file:", err);
			setError(err.message || "Failed to download file");
			throw err;
		}
	};

	const deleteFile = async (file) => {
		try {
			validateCompanyAccess();
			setError(null);

			await remove({
				key: file.key,
				options: {
					accessLevel: "private",
				},
			});
		} catch (err) {
			console.error("Error deleting file:", err);
			setError(err.message || "Failed to delete file");
			throw err;
		}
	};

	const getFileUrl = async (key) => {
		try {
			validateCompanyAccess();

			const result = await getUrl({
				key,
				options: {
					accessLevel: "private",
					validateObjectExistence: true,
				},
			});
			return result.url;
		} catch (err) {
			console.error("Error getting file URL:", err);
			throw err;
		}
	};

	return {
		files,
		loading,
		error,
		uploadFile,
		downloadFile,
		deleteFile,
		listFiles,
		getFileUrl,
	};
}

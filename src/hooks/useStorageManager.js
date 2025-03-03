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
					.filter((item) => {
						// Filter out the current directory entry and empty entries
						if (item.key === storagePath || !item.key) return false;

						// Get the relative path from the current directory
						const relativePath = item.key.replace(storagePath ? `${storagePath}/` : storagePath, "");
						if (!relativePath) return false;

						// Only show immediate children of the current directory
						const parts = relativePath.split("/");
						return parts[0] !== "" && (parts.length === 1 || (parts.length === 2 && parts[1] === ""));
					})
					.map((item) => {
						const relativePath = item.key.replace(storagePath ? `${storagePath}/` : storagePath, "");
						const name = relativePath.split("/")[0];

						// In S3, directories are virtual and represented by the "/" suffix
						const isFolder =
							item.key.endsWith("/") || result.items.some((other) => other.key.startsWith(item.key + "/"));

						return {
							key: item.key,
							name,
							size: isFolder ? 0 : item.size,
							lastModified: item.lastModified,
							isFolder,
						};
					});

				return processedFiles;
			} catch (err) {
				console.error("Error listing files:", err);
				setError(err.message || "Failed to list files");
				return [];
			} finally {
				setLoading(false);
			}
		},
		[companyId, activeCompanyId]
	);

	const createDirectory = async (path, directoryName) => {
		try {
			validateCompanyAccess();
			setError(null);

			// Normalize directory name (allow letters, numbers, hyphens, and underscores)
			const normalizedName = directoryName.trim().replace(/[^a-zA-Z0-9-_]/g, "-");
			if (!normalizedName) {
				throw new Error("Invalid directory name");
			}

			// Construct the directory path with a trailing slash
			const dirPath = path ? `${path}/${normalizedName}/` : `${normalizedName}/`;
			const key = getCompanyStoragePath(companyId, dirPath);

			console.log("Creating directory with key:", key);

			try {
				// Create an empty object with a trailing slash to represent a directory in S3
				await uploadData({
					key,
					data: new Blob([""]),
					options: {
						accessLevel: "private",
						contentType: "application/x-directory",
					},
				});
			} catch (uploadError) {
				console.error("Error in uploadData:", uploadError);
				throw uploadError;
			}

			// Verify the directory was created by listing it
			const result = await list({
				prefix: key,
				options: {
					accessLevel: "private",
				},
			});

			console.log("Directory creation verification:", result);

			if (!result.items.some((item) => item.key === key)) {
				throw new Error("Failed to verify directory creation");
			}

			await listFiles(path); // Refresh the file list after creating directory
			return key;
		} catch (err) {
			console.error("Error creating directory:", err);
			setError(err.message || "Failed to create directory");
			throw err;
		}
	};

	const deleteDirectory = async (path) => {
		try {
			validateCompanyAccess();
			setError(null);

			// List all files in the directory
			const storagePath = getCompanyStoragePath(companyId, path);
			const result = await list({
				prefix: storagePath,
				options: {
					accessLevel: "private",
				},
			});

			// Delete all files in the directory
			await Promise.all(
				result.items.map((item) =>
					remove({
						key: item.key,
						options: {
							accessLevel: "private",
						},
					})
				)
			);
		} catch (err) {
			console.error("Error deleting directory:", err);
			setError(err.message || "Failed to delete directory");
			throw err;
		}
	};

	const uploadFile = async (path = "", file) => {
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

	const downloadFile = async (key) => {
		try {
			validateCompanyAccess();
			setError(null);

			const url = await getUrl({
				key,
				options: {
					accessLevel: "private",
					download: true,
				},
			});

			// Create a temporary link to download the file
			const link = document.createElement("a");
			link.href = url.url;
			link.download = key.split("/").pop();
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (err) {
			console.error("Error downloading file:", err);
			setError(err.message || "Failed to download file");
			throw err;
		}
	};

	const deleteFile = async (key) => {
		try {
			validateCompanyAccess();
			setError(null);

			await remove({
				key,
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
		loading,
		error,
		uploadFile,
		downloadFile,
		deleteFile,
		listFiles,
		getFileUrl,
		createDirectory,
		deleteDirectory,
	};
}

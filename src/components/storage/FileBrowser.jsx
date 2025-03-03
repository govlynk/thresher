import React, { useState, useEffect, useCallback, useMemo } from "react";
import {
	Paper,
	Box,
	Typography,
	Button,
	IconButton,
	LinearProgress,
	Alert,
	Breadcrumbs,
	Link,
	Dialog,
	DialogContent,
	DialogTitle,
	DialogActions,
	TextField,
	CircularProgress,
} from "@mui/material";
import {
	Upload,
	FolderPlus,
	File,
	Trash2,
	Download,
	Eye,
	Image as ImageIcon,
	FileText,
	Home,
	ChevronRight,
} from "lucide-react";
import { FileList } from "./FileList";
import { FileUploadDialog } from "./FileUploadDialog";
import { FilePreview } from "./FilePreview";
import { useStorageManager } from "../../hooks/useStorageManager";

export function FileBrowser({ companyId }) {
	const [files, setFiles] = useState([]);
	const [currentPath, setCurrentPath] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [createDirDialogOpen, setCreateDirDialogOpen] = useState(false);
	const [newDirName, setNewDirName] = useState("");
	const [previewFile, setPreviewFile] = useState(null);
	const { uploadFile, downloadFile, deleteFile, listFiles, getFileUrl, createDirectory, deleteDirectory } =
		useStorageManager(companyId);

	const refreshFiles = useCallback(
		async (path = currentPath) => {
			try {
				setLoading(true);
				setError(null);
				const files = await listFiles(path);
				// Filter out the current directory and parent directory entries
				const processedFiles = files.filter((file) => file.name !== "." && file.name !== ".." && file.name !== "");
				setFiles(processedFiles);
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		},
		[listFiles, currentPath]
	);

	useEffect(() => {
		refreshFiles();
	}, [currentPath, refreshFiles]);

	const handleNavigate = useCallback(
		(folderName) => {
			const newPath = currentPath ? `${currentPath}/${folderName}` : folderName;
			setCurrentPath(newPath);
		},
		[currentPath]
	);

	const handleUpload = useCallback(
		async (event) => {
			const files = event.target.files;
			if (!files.length) return;

			try {
				setLoading(true);
				setError(null);

				for (const file of files) {
					await uploadFile(currentPath, file);
				}

				await refreshFiles();
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		},
		[uploadFile, currentPath, refreshFiles]
	);

	const handleDownload = useCallback(
		async (file) => {
			try {
				setError(null);
				await downloadFile(file.key);
			} catch (err) {
				setError(err.message);
			}
		},
		[downloadFile]
	);

	const handleDelete = useCallback(
		async (file) => {
			if (!window.confirm(`Are you sure you want to delete ${file.name}?`)) {
				return;
			}

			try {
				setLoading(true);
				setError(null);

				if (file.isFolder) {
					await deleteDirectory(file.key);
					// If we're in the directory being deleted, go up one level
					const currentDir = currentPath.split("/").pop();
					if (currentDir === file.name) {
						const parentPath = currentPath.split("/").slice(0, -1).join("/");
						setCurrentPath(parentPath);
					} else {
						await refreshFiles();
					}
				} else {
					await deleteFile(file.key);
					await refreshFiles();
				}
			} catch (err) {
				setError(err.message);
			} finally {
				setLoading(false);
			}
		},
		[deleteDirectory, deleteFile, currentPath, refreshFiles]
	);

	const handleCreateDirectory = useCallback(async () => {
		if (!newDirName.trim()) {
			setError("Please enter a directory name");
			return;
		}

		try {
			setLoading(true);
			setError(null);
			await createDirectory(currentPath, newDirName.trim());
			setCreateDirDialogOpen(false);
			setNewDirName("");
			await refreshFiles();
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	}, [createDirectory, currentPath, newDirName, refreshFiles]);

	const handlePreview = useCallback(
		async (file) => {
			try {
				setError(null);
				const url = await getFileUrl(file.key);
				setPreviewFile({ ...file, url });
			} catch (err) {
				setError(err.message);
			}
		},
		[getFileUrl]
	);

	const handleBreadcrumbClick = useCallback(
		(index) => {
			if (index === -1) {
				setCurrentPath("");
			} else {
				const pathParts = currentPath.split("/");
				setCurrentPath(pathParts.slice(0, index + 1).join("/"));
			}
		},
		[currentPath]
	);

	const breadcrumbs = useMemo(() => {
		if (!currentPath) return [];
		return currentPath.split("/");
	}, [currentPath]);

	return (
		<Paper sx={{ p: 3 }}>
			{loading && <LinearProgress sx={{ mb: 2 }} />}

			{error && (
				<Alert severity='error' sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}

			<Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
				<Box>
					<Breadcrumbs sx={{ mb: 2 }}>
						<Link component='button' variant='body1' onClick={() => setCurrentPath("")} underline='hover'>
							Root
						</Link>
						{breadcrumbs.map((path, index) => {
							const fullPath = breadcrumbs.slice(0, index + 1).join("/");
							return (
								<Link
									key={fullPath}
									component='button'
									variant='body1'
									onClick={() => handleBreadcrumbClick(index)}
									underline='hover'
								>
									{path}
								</Link>
							);
						})}
					</Breadcrumbs>
				</Box>
				<Box sx={{ display: "flex", gap: 2 }}>
					<Button variant='outlined' startIcon={<FolderPlus />} onClick={() => setCreateDirDialogOpen(true)}>
						New Folder
					</Button>
					<Button variant='contained' startIcon={<Upload />} component='label'>
						Upload Files
						<input type='file' hidden multiple onChange={handleUpload} />
					</Button>
				</Box>
			</Box>

			{loading ? (
				<Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
					<CircularProgress />
				</Box>
			) : (
				<FileList
					files={files}
					onNavigate={handleNavigate}
					onDownload={handleDownload}
					onDelete={handleDelete}
					onPreview={handlePreview}
				/>
			)}

			<Dialog open={createDirDialogOpen} onClose={() => setCreateDirDialogOpen(false)}>
				<DialogTitle>Create New Folder</DialogTitle>
				<DialogContent>
					<TextField
						autoFocus
						margin='dense'
						label='Folder Name'
						fullWidth
						value={newDirName}
						onChange={(e) => setNewDirName(e.target.value)}
						onKeyPress={(e) => {
							if (e.key === "Enter") {
								handleCreateDirectory();
							}
						}}
					/>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setCreateDirDialogOpen(false)}>Cancel</Button>
					<Button onClick={handleCreateDirectory} variant='contained' disabled={!newDirName.trim()}>
						Create
					</Button>
				</DialogActions>
			</Dialog>

			<FilePreview file={previewFile} onClose={() => setPreviewFile(null)} />
		</Paper>
	);
}

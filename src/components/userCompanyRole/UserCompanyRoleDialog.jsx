import React, { useEffect, useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Alert,
	CircularProgress,
} from "@mui/material";
import { useUserCompanyRoleStore } from "../../stores/userCompanyRoleStore";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

// Define access level roles separately from company roles
const ACCESS_LEVELS = {
	ADMIN: "System Administrator",
	COMPANY_ADMIN: "Company Administrator",
	MANAGER: "Company Manager",
	MEMBER: "Company Member",
};

const initialFormState = {
	userId: "",
	companyId: "",
	accessLevel: "MEMBER", // Changed from roleId to accessLevel for clarity
	status: "ACTIVE",
};

export function UserCompanyRoleDialog({ open, onClose, role = null, companyId }) {
	const { addUserCompanyRole, updateUserCompanyRole } = useUserCompanyRoleStore();
	const [formData, setFormData] = useState(initialFormState);
	const [users, setUsers] = useState([]);
	const [companies, setCompanies] = useState([]);
	const [selectedCompany, setSelectedCompany] = useState(null);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);

	// Fetch initial data when dialog opens
	useEffect(() => {
		if (open) {
			fetchUsers();
			if (!companyId) {
				fetchCompanies();
			} else {
				fetchCompany(companyId);
			}
		}
	}, [open, companyId]);

	// Set form data when role or companyId changes
	useEffect(() => {
		if (role) {
			setFormData({
				userId: role.userId || "",
				companyId: role.companyId || companyId || "",
				accessLevel: role.roleId || "MEMBER",
				status: role.status || "ACTIVE",
			});
			if (role.companyId) {
				fetchCompany(role.companyId);
			}
		} else {
			setFormData({
				...initialFormState,
				companyId: companyId || "",
			});
			if (companyId) {
				fetchCompany(companyId);
			}
		}
	}, [role, companyId]);

	const fetchUsers = async () => {
		setLoading(true);
		try {
			const response = await client.models.User.list();
			if (!response?.data) {
				throw new Error("Failed to fetch users");
			}
			setUsers(response.data);
			setError(null);
		} catch (err) {
			console.error("Error fetching users:", err);
			setError(err.message || "Failed to load users");
		} finally {
			setLoading(false);
		}
	};

	const fetchCompany = async (id) => {
		if (!id) return;

		setLoading(true);
		try {
			const response = await client.models.Company.get({ id });
			if (!response?.data) {
				throw new Error("Failed to fetch company");
			}
			setSelectedCompany(response.data);
			setCompanies([response.data]); // Ensure company is in the list for the select
			setError(null);
		} catch (err) {
			console.error("Error fetching company:", err);
			setError(err.message || "Failed to load company");
		} finally {
			setLoading(false);
		}
	};

	const fetchCompanies = async () => {
		setLoading(true);
		try {
			const response = await client.models.Company.list();
			if (!response?.data) {
				throw new Error("Failed to fetch companies");
			}
			setCompanies(response.data);
			setError(null);
		} catch (err) {
			console.error("Error fetching companies:", err);
			setError(err.message || "Failed to load companies");
		} finally {
			setLoading(false);
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));

		// If company changes, fetch the new company details
		if (name === "companyId" && value) {
			fetchCompany(value);
		}

		setError(null);
	};

	const validateForm = () => {
		if (!formData.userId) {
			setError("Please select a user");
			return false;
		}
		if (!formData.companyId) {
			setError("Please select a company");
			return false;
		}
		if (!formData.accessLevel) {
			setError("Please select an access level");
			return false;
		}
		return true;
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		setLoading(true);
		try {
			const roleData = {
				userId: formData.userId,
				companyId: formData.companyId,
				roleId: formData.accessLevel,
				status: formData.status,
			};

			if (role?.id) {
				await updateUserCompanyRole(role.id, roleData);
			} else {
				await addUserCompanyRole(roleData);
			}

			setError(null);
			onClose();
		} catch (err) {
			console.error("Error saving role:", err);
			setError(err.message || "Failed to save role. Please try again.");
		} finally {
			setLoading(false);
		}
	};

	if (loading && !users.length && !selectedCompany) {
		return (
			<Dialog open={open} onClose={onClose}>
				<DialogContent>
					<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
						<CircularProgress />
					</Box>
				</DialogContent>
			</Dialog>
		);
	}

	return (
		<Dialog
			open={open}
			onClose={onClose}
			maxWidth='sm'
			fullWidth
			PaperProps={{
				sx: {
					bgcolor: "background.paper",
					color: "text.primary",
				},
			}}
		>
			<DialogTitle>{role ? "Edit Access Level" : "Add New Access Level"}</DialogTitle>
			<DialogContent>
				<Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
					{error && (
						<Alert severity='error' sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

					<FormControl fullWidth required disabled={loading}>
						<InputLabel>User</InputLabel>
						<Select name='userId' value={formData.userId} onChange={handleChange} label='User'>
							{users.map((user) => (
								<MenuItem key={user.id} value={user.id}>
									{user.name} ({user.email})
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl fullWidth required disabled={loading || !!companyId}>
						<InputLabel>Company</InputLabel>
						<Select
							name='companyId'
							value={formData.companyId}
							onChange={handleChange}
							label='Company'
							disabled={!!companyId}
						>
							{companies.map((company) => (
								<MenuItem key={company.id} value={company.id}>
									{company.legalBusinessName}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{selectedCompany && (
						<Alert severity='info' sx={{ mb: 2 }}>
							Selected Company: {selectedCompany.legalBusinessName}
							{selectedCompany.dbaName && ` (DBA: ${selectedCompany.dbaName})`}
						</Alert>
					)}

					<FormControl fullWidth required disabled={loading}>
						<InputLabel>Access Level</InputLabel>
						<Select name='accessLevel' value={formData.accessLevel} onChange={handleChange} label='Access Level'>
							{Object.entries(ACCESS_LEVELS).map(([value, label]) => (
								<MenuItem key={value} value={value}>
									{label}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl fullWidth disabled={loading}>
						<InputLabel>Status</InputLabel>
						<Select name='status' value={formData.status} onChange={handleChange} label='Status'>
							<MenuItem value='ACTIVE'>Active</MenuItem>
							<MenuItem value='INACTIVE'>Inactive</MenuItem>
						</Select>
					</FormControl>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={loading}>
					Cancel
				</Button>
				<Button onClick={handleSubmit} variant='contained' color='primary' disabled={loading}>
					{loading ? "Saving..." : role ? "Save Changes" : "Add Access Level"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

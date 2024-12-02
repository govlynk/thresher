import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Box,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Autocomplete,
	Chip,
	Alert,
} from "@mui/material";
import { useCompanyStore } from "../stores/companyStore";
import { useUserStore } from "../stores/userStore";
import { useUserCompanyRoleStore } from "../stores/userCompanyRoleStore";
import { useAuthStore } from "../stores/authStore";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

const initialFormState = {
	cognitoId: "",
	email: "",
	name: "",
	phone: "",
	status: "ACTIVE",
	selectedCompanies: [],
};

export const UserDialog = ({ open, onClose, editUser = null }) => {
	const [formData, setFormData] = useState(initialFormState);
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const { companies, fetchCompanies } = useCompanyStore();
	const { addUser, updateUser } = useUserStore();
	const { addUserCompanyRole, removeUserCompanyRole } = useUserCompanyRoleStore();
	const currentUser = useAuthStore((state) => state.user);
	const [userCompanyRoles, setUserCompanyRoles] = useState([]);
	const [companyDetails, setCompanyDetails] = useState([]);

	// Fetch companies and user company roles
	useEffect(() => {
		const loadData = async () => {
			if (open) {
				setLoading(true);
				try {
					await fetchCompanies();
					if (editUser?.id) {
						await fetchUserCompanyRoles(editUser.id);
					}
				} catch (err) {
					console.error("Error loading data:", err);
					setError("Failed to load data");
				} finally {
					setLoading(false);
				}
			}
		};
		loadData();
	}, [open, editUser?.id, fetchCompanies]);

	const fetchUserCompanyRoles = async (userId) => {
		try {
			console.log("UserDialog: Fetching company roles for user:", userId);
			const response = await client.models.UserCompanyRole.list({
				filter: { userId: { eq: userId } },
			});

			if (response?.data) {
				setUserCompanyRoles(response.data);

				// Fetch full company details for each role
				const companiesData = await Promise.all(
					response.data.map(async (role) => {
						const companyResponse = await client.models.Company.get({ id: role.companyId });
						return {
							...companyResponse.data,
							roleId: role.roleId,
							userCompanyRoleId: role.id,
						};
					})
				);

				console.log("UserDialog: Fetched company details:", companiesData);
				setCompanyDetails(companiesData);
				setFormData((prev) => ({
					...prev,
					selectedCompanies: companiesData,
				}));
			}
		} catch (err) {
			console.error("Error fetching user company roles:", err);
			setError("Failed to fetch user's company associations");
		}
	};

	useEffect(() => {
		if (editUser) {
			setFormData({
				cognitoId: editUser.cognitoId || "",
				email: editUser.email || "",
				name: editUser.name || "",
				phone: editUser.phone || "",
				status: editUser.status || "ACTIVE",
				selectedCompanies: companyDetails,
			});
		} else {
			setFormData(initialFormState);
		}
	}, [editUser, companyDetails]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setError(null);
	};

	const handleCompanyChange = (event, newValue) => {
		console.log("UserDialog: Company selection changed:", newValue);
		setFormData((prev) => ({
			...prev,
			selectedCompanies: newValue || [],
		}));
	};

	const validateForm = () => {
		if (!formData.email?.trim()) {
			setError("Email is required");
			return false;
		}
		if (!formData.name?.trim()) {
			setError("Name is required");
			return false;
		}
		return true;
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;

		setLoading(true);
		try {
			const userData = {
				cognitoId: formData.cognitoId || currentUser?.sub,
				email: formData.email.trim(),
				name: formData.name.trim(),
				phone: formData.phone?.trim() || null,
				status: formData.status,
				lastLogin: new Date().toISOString(),
			};

			let savedUser;
			if (editUser) {
				savedUser = await updateUser(editUser.id, userData);
			} else {
				savedUser = await addUser(userData);
			}

			// Handle company associations
			const currentCompanyIds = formData.selectedCompanies.map((c) => c.id);
			const existingCompanyIds = userCompanyRoles.map((role) => role.companyId);

			// Remove associations that are no longer selected
			const toRemove = userCompanyRoles.filter((role) => !currentCompanyIds.includes(role.companyId));
			for (const role of toRemove) {
				await removeUserCompanyRole(role.id);
			}

			// Add new associations
			const toAdd = currentCompanyIds.filter((id) => !existingCompanyIds.includes(id));
			for (const companyId of toAdd) {
				await addUserCompanyRole({
					userId: savedUser.id,
					companyId,
					roleId: "MEMBER",
					status: "ACTIVE",
				});
			}

			onClose();
		} catch (err) {
			console.error("Error saving user:", err);
			setError(err.message || "Failed to save user");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
			<DialogTitle>{editUser ? "Edit User" : "Add New User"}</DialogTitle>
			<DialogContent>
				<Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
					{error && (
						<Alert severity='error' sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}
					<TextField
						fullWidth
						label='Email'
						name='email'
						type='email'
						value={formData.email}
						onChange={handleChange}
						required
						error={!formData.email && Boolean(error)}
						disabled={loading}
					/>
					<TextField
						fullWidth
						label='Name'
						name='name'
						value={formData.name}
						onChange={handleChange}
						required
						error={!formData.name && Boolean(error)}
						disabled={loading}
					/>
					<TextField
						fullWidth
						label='Phone'
						name='phone'
						value={formData.phone}
						onChange={handleChange}
						disabled={loading}
					/>
					<FormControl fullWidth disabled={loading}>
						<InputLabel>Status</InputLabel>
						<Select name='status' value={formData.status} onChange={handleChange} label='Status'>
							<MenuItem value='ACTIVE'>Active</MenuItem>
							<MenuItem value='INACTIVE'>Inactive</MenuItem>
						</Select>
					</FormControl>

					<Autocomplete
						multiple
						options={companies}
						getOptionLabel={(option) => option.legalBusinessName || ""}
						value={formData.selectedCompanies}
						onChange={handleCompanyChange}
						disabled={loading}
						renderInput={(params) => (
							<TextField {...params} label='Associated Companies' placeholder='Select companies' />
						)}
						renderTags={(value, getTagProps) =>
							value.map((company, index) => {
								const { key, ...otherProps } = getTagProps({ index });
								return (
									<Chip
										key={company.id}
										label={company.legalBusinessName}
										{...otherProps}
										disabled={loading}
									/>
								);
							})
						}
						isOptionEqualToValue={(option, value) => option.id === value.id}
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={loading}>
					Cancel
				</Button>
				<Button onClick={handleSubmit} variant='contained' disabled={loading}>
					{loading ? "Saving..." : editUser ? "Save Changes" : "Add User"}
				</Button>
			</DialogActions>
		</Dialog>
	);
};

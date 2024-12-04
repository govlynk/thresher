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
	Alert,
	CircularProgress,
} from "@mui/material";
import { useUserStore } from "../../stores/userStore";
import { useAuthStore } from "../../stores/authStore";
import { UserRegistrationForm } from "./UserRegistrationForm";

const initialFormState = {
	cognitoId: "",
	email: "",
	name: "",
	phone: "",
	status: "ACTIVE",
	accessLevel: "",
	companyRole: "",
};

export function UserCreationDialog({ open, onClose, contactData }) {
	const [formData, setFormData] = useState(initialFormState);
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const { addUser } = useUserStore();
	const currentUser = useAuthStore((state) => state.user);

	useEffect(() => {
		if (contactData) {
			setFormData({
				...initialFormState,
				email: contactData.contactEmail || "",
				name: `${contactData.firstName} ${contactData.lastName}`,
				phone: contactData.contactMobilePhone || contactData.contactBusinessPhone || "",
			});
		}
	}, [contactData]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setErrors((prev) => ({
			...prev,
			[name]: "",
		}));
	};

	const handleRegistrationChange = (updates) => {
		setFormData((prev) => ({
			...prev,
			...updates,
		}));
		setErrors((prev) => ({
			...prev,
			accessLevel: "",
			companyRole: "",
		}));
	};

	const validateForm = () => {
		const newErrors = {};
		if (!formData.email?.trim()) newErrors.email = "Email is required";
		if (!formData.name?.trim()) newErrors.name = "Name is required";
		if (!formData.accessLevel) newErrors.accessLevel = "Access level is required";
		if (!formData.companyRole) newErrors.companyRole = "Company role is required";

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
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
				accessLevel: formData.accessLevel,
				roleId: formData.companyRole,
			};

			await addUser(userData);
			onClose();
		} catch (err) {
			console.error("Error creating user:", err);
			setErrors((prev) => ({
				...prev,
				submit: err.message || "Failed to create user",
			}));
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
			<DialogTitle>Create User Account</DialogTitle>
			<DialogContent>
				<Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
					{errors.submit && (
						<Alert severity='error' sx={{ mb: 2 }}>
							{errors.submit}
						</Alert>
					)}

					<TextField
						fullWidth
						label='Cognito ID'
						name='cognitoId'
						value={formData.cognitoId}
						onChange={handleChange}
						helperText='Optional - Enter if user already exists in Cognito'
					/>

					<TextField
						fullWidth
						label='Email'
						name='email'
						type='email'
						value={formData.email}
						onChange={handleChange}
						required
						error={Boolean(errors.email)}
						helperText={errors.email}
						disabled={loading}
					/>

					<TextField
						fullWidth
						label='Name'
						name='name'
						value={formData.name}
						onChange={handleChange}
						required
						error={Boolean(errors.name)}
						helperText={errors.name}
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

					<UserRegistrationForm
						onChange={handleRegistrationChange}
						values={{
							accessLevel: formData.accessLevel,
							companyRole: formData.companyRole,
						}}
						errors={{
							accessLevel: errors.accessLevel,
							companyRole: errors.companyRole,
						}}
					/>
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={loading}>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					variant='contained'
					disabled={loading}
					startIcon={loading ? <CircularProgress size={20} /> : null}
				>
					{loading ? "Creating..." : "Create User"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

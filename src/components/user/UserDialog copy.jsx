import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Box,
	Alert,
	CircularProgress,
} from "@mui/material";
import { UserRegistrationForm } from "./UserRegistrationForm-wrong";
import { useUserStore } from "../../stores/userStore";

const initialFormState = {
	cognitoId: "",
	email: "",
	name: "",
	phone: "",
	status: "ACTIVE",
	accessLevel: "",
	companyRole: "",
	contactId: null,
};

export function UserDialog({ open, onClose, contactData }) {
	const [formData, setFormData] = useState(initialFormState);
	const [errors, setErrors] = useState({});
	const [loading, setLoading] = useState(false);
	const { addUser } = useUserStore();

	useEffect(() => {
		if (contactData) {
			setFormData((prev) => ({
				...prev,
				email: contactData.contactEmail || "",
				name: `${contactData.firstName} ${contactData.lastName}`,
				phone: contactData.contactMobilePhone || contactData.contactBusinessPhone || "",
				contactId: contactData.id,
			}));
		} else {
			setFormData(initialFormState);
		}
	}, [contactData]);

	const validateForm = () => {
		const errors = {};

		if (!formData.email?.trim()) {
			errors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			errors.email = "Invalid email format";
		}

		if (!formData.name?.trim()) {
			errors.name = "Name is required";
		}

		if (!formData.accessLevel) {
			errors.accessLevel = "Access level is required";
		}

		if (!formData.companyRole) {
			errors.companyRole = "Company role is required";
		}

		return Object.keys(errors).length > 0 ? errors : null;
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setErrors((prev) => ({
			...prev,
			[name]: "",
			submit: "",
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
			submit: "",
		}));
	};

	const handleSubmit = async () => {
		const validationErrors = validateForm(formData);
		if (validationErrors) {
			setErrors(validationErrors);
			return;
		}

		setLoading(true);
		try {
			await addUser(formData);
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
						disabled={loading}
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

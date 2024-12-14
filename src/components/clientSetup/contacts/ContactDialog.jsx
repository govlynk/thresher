import React, { useState } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Button,
	Typography,
	Box,
	Grid,
	Alert,
	useTheme,
} from "@mui/material";

// Define access levels separately from company roles
const ACCESS_LEVELS = {
	COMPANY_ADMIN: "Company Administrator",
	MANAGER: "Company Manager",
	MEMBER: "Company Member",
	GOVLYNK_ADMIN: "Govlynk Administrator",
	GOVLYNK_MEMBER: "Govlynk Member",
	GOVLYNK_USER: "Govlynk User",
};

const COMPANY_ROLES = [
	{ id: "Executive", name: "Executive" },
	{ id: "Sales", name: "Sales" },
	{ id: "Marketing", name: "Marketing" },
	{ id: "Finance", name: "Finance" },
	{ id: "Risk", name: "Risk" },
	{ id: "Technology", name: "Technology" },
];

export function ContactDialog({ open, onClose, onSave }) {
	const theme = useTheme();
	const [errors, setErrors] = useState({});

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		role: "",
		accessLevel: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSave = () => {
		onSave(formData);
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose} fullWidth maxWidth='sm'>
			<DialogTitle>Add Contact</DialogTitle>
			<DialogContent>
				<Grid container spacing={2}>
					<Grid item xs={12} sm={6}>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
							<TextField
								fullWidth
								label='Cognito Id'
								name='cognitoId'
								value={formData.cognitoId}
								onChange={handleChange}
								helperText='Optional - Enter if user already exists in Cognito'
							/>
							<TextField
								fullWidth
								label='First Name'
								name='firstName'
								value={formData.firstName}
								onChange={handleChange}
								error={!!errors.firstName}
								helperText={errors.firstName}
								required
							/>
							<TextField
								fullWidth
								label='Last Name'
								name='lastName'
								value={formData.lastName}
								onChange={handleChange}
								error={!!errors.lastName}
								helperText={errors.lastName}
								required
							/>
							<TextField
								fullWidth
								label='Email'
								name='contactEmail'
								type='email'
								value={formData.contactEmail}
								onChange={handleChange}
								error={!!errors.contactEmail}
								helperText={errors.contactEmail}
								required
							/>
							<TextField
								fullWidth
								label='Mobile Phone'
								name='contactMobilePhone'
								value={formData.contactMobilePhone}
								onChange={handleChange}
							/>
						</Box>
					</Grid>
					<Grid item xs={12} sm={6}>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
							<FormControl fullWidth>
								<InputLabel>Role</InputLabel>
								<Select name='role' value={formData.role} onChange={handleChange}>
									{COMPANY_ROLES.map((role) => (
										<MenuItem key={role.id} value={role.id}>
											{role.name}
										</MenuItem>
									))}
								</Select>
							</FormControl>
							<FormControl fullWidth>
								<InputLabel>Access Level</InputLabel>
								<Select name='accessLevel' value={formData.accessLevel} onChange={handleChange}>
									{Object.entries(ACCESS_LEVELS).map(([key, value]) => (
										<MenuItem key={key} value={key}>
											{value}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</Box>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSave} variant='contained' color='primary'>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}

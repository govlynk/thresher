import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Grid,
	Alert,
	CircularProgress,
} from "@mui/material";

const ROLES = [
	"Decision Maker",
	"Business Development",
	"Sales",
	"Marketing",
	"Finance",
	"Engineering",
	"Contracts",
	"Consultant",
	"Negotiator",
	"SME",
	"Other",
];

export function TeamMemberDialog({ open, onClose, team, member, onUpdate }) {
	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		email: "",
		phone: "",
		role: "",
		title: "",
		department: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (member) {
			setFormData({
				firstName: member.contact?.firstName || "",
				lastName: member.contact?.lastName || "",
				email: member.contact?.contactEmail || "",
				phone: member.contact?.contactMobilePhone || "",
				role: member.role || "",
				title: member.contact?.title || "",
				department: member.contact?.department || "",
			});
		} else {
			setFormData({
				firstName: "",
				lastName: "",
				email: "",
				phone: "",
				role: "",
				title: "",
				department: "",
			});
		}
	}, [member, open]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setError(null);
	};

	const validateForm = () => {
		if (!formData.firstName?.trim()) return "First name is required";
		if (!formData.lastName?.trim()) return "Last name is required";
		if (!formData.email?.trim()) return "Email is required";
		if (!formData.role?.trim()) return "Role is required";
		return null;
	};

	const handleSubmit = async () => {
		const validationError = validateForm();
		if (validationError) {
			setError(validationError);
			return;
		}

		setLoading(true);
		try {
			if (member) {
				await onUpdate("updateMember", { id: member.id, ...formData });
			} else {
				await onUpdate("addMember", formData);
			}
			onClose();
		} catch (err) {
			setError(err.message || "Failed to save team member");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
			<DialogTitle>{member ? "Edit Team Member" : "Add New Team Member"}</DialogTitle>
			<DialogContent>
				{error && (
					<Alert severity='error' sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				<Grid container spacing={2} sx={{ mt: 1 }}>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							label='First Name'
							name='firstName'
							value={formData.firstName}
							onChange={handleChange}
							required
							disabled={loading}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							label='Last Name'
							name='lastName'
							value={formData.lastName}
							onChange={handleChange}
							required
							disabled={loading}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							label='Email'
							name='email'
							type='email'
							value={formData.email}
							onChange={handleChange}
							required
							disabled={loading}
						/>
					</Grid>
					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							label='Phone'
							name='phone'
							value={formData.phone}
							onChange={handleChange}
							disabled={loading}
						/>
					</Grid>

					<Grid item xs={12} sm={6}>
						<FormControl fullWidth required disabled={loading}>
							<InputLabel>Role</InputLabel>
							<Select name='role' value={formData.role} onChange={handleChange} label='Role'>
								{ROLES.map((role) => (
									<MenuItem key={role} value={role}>
										{role}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>

					<Grid item xs={12} sm={6}>
						<TextField
							fullWidth
							label='Title'
							name='title'
							value={formData.title}
							onChange={handleChange}
							disabled={loading}
						/>
					</Grid>

					<Grid item xs={12}>
						<TextField
							fullWidth
							label='Department'
							name='department'
							value={formData.department}
							onChange={handleChange}
							disabled={loading}
						/>
					</Grid>
				</Grid>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose} disabled={loading}>
					Cancel
				</Button>
				<Button
					onClick={handleSubmit}
					variant='contained'
					disabled={loading}
					startIcon={loading && <CircularProgress size={20} />}
				>
					{loading ? "Saving..." : member ? "Save Changes" : "Add Member"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

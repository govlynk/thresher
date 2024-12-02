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
	Grid,
	CircularProgress,
} from "@mui/material";
import { useContactStore } from "../../stores/contactStore";
import { useUserCompanyStore } from "../../stores/userCompanyStore";

export function ContactDialog({ open, onClose, contact }) {
	const { addContact, updateContact } = useContactStore();
	const { getActiveCompany } = useUserCompanyStore();
	const activeCompany = getActiveCompany();

	const [formData, setFormData] = useState({
		firstName: "",
		lastName: "",
		title: "",
		department: "",
		contactEmail: "",
		contactMobilePhone: "",
		contactBusinessPhone: "",
		notes: "",
	});
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (contact) {
			setFormData({
				firstName: contact.firstName || "",
				lastName: contact.lastName || "",
				title: contact.title || "",
				department: contact.department || "",
				contactEmail: contact.contactEmail || "",
				contactMobilePhone: contact.contactMobilePhone || "",
				contactBusinessPhone: contact.contactBusinessPhone || "",
				notes: contact.notes || "",
			});
		} else {
			setFormData({
				firstName: "",
				lastName: "",
				title: "",
				department: "",
				contactEmail: "",
				contactMobilePhone: "",
				contactBusinessPhone: "",
				notes: "",
			});
		}
	}, [contact]);

	const validateEmail = (email) => {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	};

	const validatePhone = (phone) => {
		return !phone || /^\+?[\d\s-]{10,}$/.test(phone);
	};

	const validateForm = () => {
		if (!formData.firstName.trim()) {
			setError("First name is required");
			return false;
		}
		if (!formData.lastName.trim()) {
			setError("Last name is required");
			return false;
		}
		if (!formData.contactEmail.trim()) {
			setError("Email is required");
			return false;
		}
		if (!validateEmail(formData.contactEmail)) {
			setError("Invalid email format");
			return false;
		}
		if (!validatePhone(formData.contactMobilePhone)) {
			setError("Invalid mobile phone format");
			return false;
		}
		if (!validatePhone(formData.contactBusinessPhone)) {
			setError("Invalid business phone format");
			return false;
		}
		return true;
	};

	const handleSubmit = async () => {
		if (!validateForm()) return;
		if (!activeCompany?.id) {
			setError("No active company selected");
			return;
		}

		setLoading(true);
		try {
			const contactData = {
				...formData,
				companyId: activeCompany.id,
				dateLastContacted: new Date().toISOString(),
			};

			if (contact?.id) {
				await updateContact(contact.id, contactData);
			} else {
				await addContact(contactData);
			}

			onClose();
		} catch (err) {
			console.error("Error saving contact:", err);
			setError(err.message || "Failed to save contact");
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
		setError(null);
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth='md' fullWidth aria-labelledby='contact-dialog-title'>
			<DialogTitle id='contact-dialog-title'>{contact ? "Edit Contact" : "Add New Contact"}</DialogTitle>
			<DialogContent>
				<Box sx={{ mt: 2 }}>
					{error && (
						<Alert severity='error' sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

					<Grid container spacing={2}>
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								label='First Name'
								name='firstName'
								value={formData.firstName}
								onChange={handleChange}
								required
								disabled={loading}
								inputProps={{ "aria-label": "First Name" }}
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
								inputProps={{ "aria-label": "Last Name" }}
							/>
						</Grid>

						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								label='Email'
								name='contactEmail'
								type='email'
								value={formData.contactEmail}
								onChange={handleChange}
								required
								disabled={loading}
								inputProps={{ "aria-label": "Email" }}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								label='Mobile Phone'
								name='contactMobilePhone'
								value={formData.contactMobilePhone}
								onChange={handleChange}
								disabled={loading}
								inputProps={{ "aria-label": "Mobile Phone" }}
							/>
						</Grid>

						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								label='Business Phone'
								name='contactBusinessPhone'
								value={formData.contactBusinessPhone}
								onChange={handleChange}
								disabled={loading}
								inputProps={{ "aria-label": "Business Phone" }}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								label='Title'
								name='title'
								value={formData.title}
								onChange={handleChange}
								disabled={loading}
								inputProps={{ "aria-label": "Title" }}
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
								inputProps={{ "aria-label": "Department" }}
							/>
						</Grid>

						<Grid item xs={12}>
							<TextField
								fullWidth
								label='Notes'
								name='notes'
								value={formData.notes}
								onChange={handleChange}
								multiline
								rows={3}
								disabled={loading}
								inputProps={{ "aria-label": "Notes" }}
							/>
						</Grid>
					</Grid>
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
					{loading ? "Saving..." : contact ? "Save Changes" : "Add Contact"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

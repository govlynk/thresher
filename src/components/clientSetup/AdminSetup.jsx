import React, { useState, useEffect } from "react";
import {
	Box,
	TextField,
	Button,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Grid,
	Divider,
	Chip,
	useTheme,
} from "@mui/material";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Define access levels separately from company roles
const ACCESS_LEVELS = {
	COMPANY_ADMIN: "Company Administrator",
	MANAGER: "Company Manager",
	MEMBER: "Company Member",
	GOVLYNK_ADMIN: "Govlynk Administrator",
	GOVLYNK_CONSULTANT: "Govlynk Consultant",
	GOVLYNK_USER: "Govlynk User",
};

const COMPANY_ROLES = [
	{ id: "Executive", name: "Executive" },
	{ id: "Sales", name: "Sales" },
	{ id: "Marketing", name: "Marketing" },
	{ id: "Finance", name: "Finance" },
	{ id: "Risk", name: "Risk" },
	{ id: "Technology", name: "Technology" },
	{ id: "Engineering", name: "Engineering" },
	{ id: "Operations", name: "Operations" },
	{ id: "HumanResources", name: "Human Resources" },
	{ id: "Legal", name: "Legal" },
	{ id: "Contracting", name: "Contracting" },
	{ id: "Servicing", name: "Servicing" },
	{ id: "Other", name: "Other" },
];

export function AdminSetup({ onSubmit, onBack, companyData }) {
	const theme = useTheme();
	const [formData, setFormData] = useState({
		cognitoId: "",
		firstName: "",
		lastName: "",
		title: "",
		department: "",
		contactEmail: "",
		contactMobilePhone: "",
		contactBusinessPhone: "",
		workAddressStreetLine1: companyData?.shippingAddressStreetLine1 || "",
		workAddressStreetLine2: companyData?.shippingAddressStreetLine2 || "",
		workAddressCity: companyData?.shippingAddressCity || "",
		workAddressStateCode: companyData?.shippingAddressStateCode || "",
		workAddressZipCode: companyData?.shippingAddressZipCode || "",
		workAddressCountryCode: companyData?.shippingAddressCountryCode || "USA",
		notes: "",
		accessLevel: "COMPANY_ADMIN",
		roleId: "", // New field for company role
	});
	const [errors, setErrors] = useState({});

	useEffect(() => {
		if (companyData?.shippingAddressCity) {
			setFormData((prev) => ({
				...prev,
				workAddressStreetLine1: companyData.shippingAddressStreetLine1 || "",
				workAddressStreetLine2: companyData.shippingAddressStreetLine2 || "",
				workAddressCity: companyData.shippingAddressCity || "",
				workAddressStateCode: companyData.shippingAddressStateCode || "",
				workAddressZipCode: companyData.shippingAddressZipCode || "",
				workAddressCountryCode: companyData.shippingAddressCountryCode || "USA",
			}));
		}
	}, [companyData]);

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

	const validateForm = () => {
		const newErrors = {};
		if (!formData.firstName) newErrors.firstName = "First name is required";
		if (!formData.lastName) newErrors.lastName = "Last name is required";
		if (!formData.contactEmail) newErrors.contactEmail = "Email is required";
		if (!formData.accessLevel) newErrors.accessLevel = "Access level is required";
		if (!formData.roleId) newErrors.roleId = "Company role is required";

		// Basic email validation
		if (formData.contactEmail && !/\S+@\S+\.\S+/.test(formData.contactEmail)) {
			newErrors.contactEmail = "Invalid email format";
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const handleSubmit = () => {
		if (validateForm()) {
			onSubmit(formData);
		}
	};

	return (
		<Box>
			<Typography variant='h6' sx={{ mb: 1 }}>
				Company Administrator Setup
			</Typography>
			<Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
				Setting up admin access for {companyData?.legalBusinessName}
			</Typography>

			<Grid container spacing={3}>
				<Grid item xs={12} md={6}>
					<Typography variant='subtitle2' sx={{ mb: 2, color: "primary.main" }}>
						Personal Information
					</Typography>
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
						<TextField
							fullWidth
							label='Business Phone'
							name='contactBusinessPhone'
							value={formData.contactBusinessPhone}
							onChange={handleChange}
						/>
					</Box>
				</Grid>

				<Grid item xs={12} md={6}>
					<Typography variant='subtitle2' sx={{ mb: 2, color: "primary.main" }}>
						Company Position
					</Typography>
					<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
						<FormControl fullWidth error={!!errors.accessLevel} required>
							<InputLabel>Access Level</InputLabel>
							<Select
								name='accessLevel'
								value={formData.accessLevel}
								onChange={handleChange}
								label='Access Level'
							>
								{Object.entries(ACCESS_LEVELS).map(([value, label]) => (
									<MenuItem key={value} value={value}>
										{label}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<FormControl fullWidth error={!!errors.roleId} required>
							<InputLabel>Company Role</InputLabel>
							<Select name='roleId' value={formData.roleId} onChange={handleChange} label='Company Role'>
								{COMPANY_ROLES.map((role) => (
									<MenuItem key={role.id} value={role.id}>
										{role.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
						<TextField fullWidth label='Title' name='title' value={formData.title} onChange={handleChange} />
						<TextField
							fullWidth
							label='Department'
							name='department'
							value={formData.department}
							onChange={handleChange}
						/>
					</Box>
				</Grid>

				<Grid item xs={12}>
					<Typography variant='subtitle2' sx={{ mb: 2, color: "primary.main" }}>
						Work Address
					</Typography>
					<Grid container spacing={2}>
						<Grid item xs={12}>
							<TextField
								fullWidth
								label='Street Address Line 1'
								name='workAddressStreetLine1'
								value={formData.workAddressStreetLine1}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12}>
							<TextField
								fullWidth
								label='Street Address Line 2'
								name='workAddressStreetLine2'
								value={formData.workAddressStreetLine2}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12} sm={6}>
							<TextField
								fullWidth
								label='City'
								name='workAddressCity'
								value={formData.workAddressCity}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField
								fullWidth
								label='State'
								name='workAddressStateCode'
								value={formData.workAddressStateCode}
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField
								fullWidth
								label='ZIP Code'
								name='workAddressZipCode'
								value={formData.workAddressZipCode}
								onChange={handleChange}
							/>
						</Grid>
					</Grid>
				</Grid>
			</Grid>

			<Divider sx={{ my: 4 }} />

			<Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
				<Button onClick={onBack} startIcon={<ArrowLeft />}>
					Back
				</Button>
				<Button variant='contained' onClick={handleSubmit} endIcon={<ArrowRight />}>
					Continue
				</Button>
			</Box>
		</Box>
	);
}

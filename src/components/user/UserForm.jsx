import React, { useState, useEffect } from "react";
import { TextField, Box, FormControl, InputLabel, Select, MenuItem, Autocomplete, Chip, Alert } from "@mui/material";
import { useCompanyStore } from "../../stores/companyStore";
import { useAuthStore } from "../../stores/authStore";

export function UserForm({ formData, errors, onChange, disabled }) {
	const { companies, fetchCompanies } = useCompanyStore();
	const [error, setError] = useState(null);
	const [loading, setLoading] = useState(false);
	const currentUser = useAuthStore((state) => state.user);

	// Convert errors object to array of strings
	const getErrorMessages = () => {
		if (!errors) return null;
		if (typeof errors === "string") return errors;
		if (typeof errors === "object") {
			return Object.values(errors).filter(Boolean).join(", ");
		}
		return null;
	};

	useEffect(() => {
		const loadData = async () => {
			if (open) {
				setLoading(true);
				try {
					await fetchCompanies();
					if (currentUser?.id) {
						await fetchUserCompanyAccesss(editUser.id);
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
	}, [open, currentUser, fetchCompanies]);

	const handleChange = (e) => {
		const { name, value } = e.target;
		onChange(name, value);
	};

	const handleCompanyChange = (event, newValue) => {
		console.log("UserDialog: Company selection changed:", newValue);
		setFormData((prev) => ({
			...prev,
			selectedCompanies: newValue || [],
		}));
	};

	return (
		<Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
			{getErrorMessages() && (
				<Alert severity='error' sx={{ mb: 2 }}>
					{getErrorMessages()}
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
				error={!formData.email && Boolean(error)}
				disabled={disabled}
			/>
			<TextField
				fullWidth
				label='Name'
				name='name'
				value={formData.name}
				onChange={handleChange}
				required
				error={!formData.name && Boolean(error)}
				disabled={disabled}
			/>
			<TextField
				fullWidth
				label='Phone'
				name='phone'
				value={formData.phone}
				onChange={handleChange}
				disabled={disabled}
			/>
			<FormControl fullWidth disabled={disabled}>
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
				disabled={disabled}
				renderInput={(params) => (
					<TextField {...params} label='Associated Companies' placeholder='Select companies' />
				)}
				renderTags={(value, getTagProps) =>
					value.map((company, index) => {
						const { key, ...otherProps } = getTagProps({ index });
						return <Chip key={company.id} label={company.legalBusinessName} {...otherProps} disabled={loading} />;
					})
				}
				isOptionEqualToValue={(option, value) => option.id === value.id}
			/>
		</Box>
	);
}

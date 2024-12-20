import React from "react";
import { Box, TextField, Alert, FormControl, InputLabel, Select, MenuItem } from "@mui/material";

const ACCESS_LEVELS = {
	COMPANY_ADMIN: "Company Administrator",
	MANAGER: "Company Manager",
	MEMBER: "Company Member",
	GOVLYNK_ADMIN: "Govlynk Administrator",
	GOVLYNK_USER: "Govlynk User",
};

export function UserForm({ formData, onChange, errors = {}, disabled = false }) {
	const handleChange = (e) => {
		const { name, value } = e.target;
		onChange(name, value);
	};

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
			{errors.submit && (
				<Alert severity='error' sx={{ mb: 2 }}>
					{errors.submit}
				</Alert>
			)}

			<TextField
				fullWidth
				label='Cognito ID'
				name='cognitoId'
				value={formData.cognitoId || ""}
				onChange={handleChange}
				disabled={disabled}
				helperText='Optional - Enter if user already exists in Cognito'
			/>

			<TextField
				fullWidth
				label='Email'
				name='email'
				type='email'
				value={formData.email || ""}
				onChange={handleChange}
				required
				error={Boolean(errors?.email)}
				helperText={errors?.email}
				disabled={disabled}
			/>

			<TextField
				fullWidth
				label='Name'
				name='name'
				value={formData.name || ""}
				onChange={handleChange}
				required
				error={Boolean(errors?.name)}
				helperText={errors?.name}
				disabled={disabled}
			/>

			<TextField
				fullWidth
				label='Phone'
				name='phone'
				value={formData.phone || ""}
				onChange={handleChange}
				disabled={disabled}
			/>

			<FormControl fullWidth required error={Boolean(errors?.accessLevel)} disabled={disabled}>
				<InputLabel>Access Level</InputLabel>
				<Select name='accessLevel' value={formData.accessLevel || ""} onChange={handleChange} label='Access Level'>
					{Object.entries(ACCESS_LEVELS).map(([value, label]) => (
						<MenuItem key={value} value={value}>
							{label}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			<FormControl fullWidth disabled={disabled}>
				<InputLabel>Status</InputLabel>
				<Select name='status' value={formData.status || "ACTIVE"} onChange={handleChange} label='Status'>
					<MenuItem value='ACTIVE'>Active</MenuItem>
					<MenuItem value='INACTIVE'>Inactive</MenuItem>
				</Select>
			</FormControl>
		</Box>
	);
}

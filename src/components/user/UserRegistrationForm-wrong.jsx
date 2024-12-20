import React from "react";
import { Grid, TextField, FormControl, InputLabel, Select, MenuItem, FormHelperText } from "@mui/material";

const ACCESS_LEVELS = {
	COMPANY_ADMIN: "Company Administrator",
	MANAGER: "Manager",
	MEMBER: "Member",
	GOVLYNK_ADMIN: "Govlynk Administrator",
	GOVLYNK_CONSULTANT: "Govlynk Consultant",
	GOVLYNK_USER: "Govlynk User",
};

const COMPANY_ROLES = [
	{ id: "Executive", name: "Executive" },
	{ id: "Sales", name: "Sales" },
	{ id: "Marketing", name: "Marketing" },
	{ id: "Finance", name: "Finance" },
	{ id: "Technology", name: "Technology" },
	{ id: "Engineering", name: "Engineering" },
	{ id: "Operations", name: "Operations" },
	{ id: "Legal", name: "Legal" },
	{ id: "Contracting", name: "Contracting" },
];

const ACCESS_LEVEL_ROLE_RECOMMENDATIONS = {
	COMPANY_ADMIN: ["Executive", "Operations"],
	MANAGER: ["Sales", "Marketing", "Finance", "Technology", "Engineering"],
	MEMBER: COMPANY_ROLES.map((role) => role.id),
	GOVLYNK_ADMIN: ["Executive", "Technology"],
	GOVLYNK_CONSULTANT: ["Contracting", "Legal", "Finance", "Sales", "Marketing"],
	GOVLYNK_USER: COMPANY_ROLES.map((role) => role.id),
};

export function UserRegistrationForm({ formData, errors, onChange, disabled }) {
	const handleChange = (name, value) => {
		if (name === "accessLevel") {
			// Reset company role if not valid for new access level
			const validRoles = ACCESS_LEVEL_ROLE_RECOMMENDATIONS[value] || [];
			const currentRole = formData.companyRole;
			onChange("accessLevel", value);
			if (!validRoles.includes(currentRole)) {
				onChange("companyRole", "");
			}
		} else {
			onChange(name, value);
		}
	};

	const getValidRoles = () => {
		return ACCESS_LEVEL_ROLE_RECOMMENDATIONS[formData.accessLevel] || [];
	};

	return (
		<Grid container spacing={2}>
			<Grid item xs={12}>
				<TextField
					fullWidth
					label='Email'
					name='email'
					value={formData.email || ""}
					onChange={(e) => handleChange("email", e.target.value)}
					error={Boolean(errors?.email)}
					helperText={errors?.email}
					disabled={disabled}
				/>
			</Grid>

			<Grid item xs={12}>
				<FormControl fullWidth error={Boolean(errors?.accessLevel)} disabled={disabled}>
					<InputLabel>Access Level</InputLabel>
					<Select
						value={formData.accessLevel || ""}
						onChange={(e) => handleChange("accessLevel", e.target.value)}
						label='Access Level'
					>
						{Object.entries(ACCESS_LEVELS).map(([key, label]) => (
							<MenuItem key={key} value={key}>
								{label}
							</MenuItem>
						))}
					</Select>
					{errors?.accessLevel && <FormHelperText>{errors.accessLevel}</FormHelperText>}
				</FormControl>
			</Grid>

			<Grid item xs={12}>
				<FormControl fullWidth error={Boolean(errors?.companyRole)} disabled={disabled}>
					<InputLabel>Company Role</InputLabel>
					<Select
						value={formData.companyRole || ""}
						onChange={(e) => handleChange("companyRole", e.target.value)}
						label='Company Role'
					>
						{COMPANY_ROLES.filter((role) => getValidRoles().includes(role.id)).map((role) => (
							<MenuItem key={role.id} value={role.id}>
								{role.name}
							</MenuItem>
						))}
					</Select>
					{errors?.companyRole && <FormHelperText>{errors.companyRole}</FormHelperText>}
				</FormControl>
			</Grid>
		</Grid>
	);
}

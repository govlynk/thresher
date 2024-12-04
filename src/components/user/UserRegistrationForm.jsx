import React, { useState } from "react";
import { Box, FormControl, InputLabel, Select, MenuItem, Alert, Typography, FormHelperText } from "@mui/material";

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

// Map of recommended company roles for each access level
const ACCESS_LEVEL_ROLE_RECOMMENDATIONS = {
	COMPANY_ADMIN: ["Executive", "Operations"],
	MANAGER: ["Sales", "Marketing", "Finance", "Technology", "Engineering"],
	MEMBER: COMPANY_ROLES.map((role) => role.id),
	GOVLYNK_ADMIN: ["Executive", "Technology"],
	GOVLYNK_CONSULTANT: ["Contracting", "Legal", "Finance", "Sales", "Marketing", "Finance"],
	GOVLYNK_USER: COMPANY_ROLES.map((role) => role.id),
};

export function UserRegistrationForm({ onChange, values, errors }) {
	const [localErrors, setLocalErrors] = useState({});

	const handleAccessLevelChange = (event) => {
		const newAccessLevel = event.target.value;
		onChange({
			accessLevel: newAccessLevel,
			companyRole:
				values.companyRole && ACCESS_LEVEL_ROLE_RECOMMENDATIONS[newAccessLevel].includes(values.companyRole)
					? values.companyRole
					: "",
		});
		validateFields({ ...values, accessLevel: newAccessLevel });
	};

	const handleCompanyRoleChange = (event) => {
		const newRole = event.target.value;
		onChange({
			...values,
			companyRole: newRole,
		});
		validateFields({ ...values, companyRole: newRole });
	};

	const validateFields = (fields) => {
		const newErrors = {};

		if (!fields.accessLevel) {
			newErrors.accessLevel = "Access level is required";
		}

		if (!fields.companyRole) {
			newErrors.companyRole = "Company role is required";
		} else if (
			fields.accessLevel &&
			!ACCESS_LEVEL_ROLE_RECOMMENDATIONS[fields.accessLevel].includes(fields.companyRole)
		) {
			newErrors.companyRole = "Selected role is not recommended for this access level";
		}

		setLocalErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const getRecommendedRoles = () => {
		if (!values.accessLevel) return COMPANY_ROLES;
		return COMPANY_ROLES.filter((role) => ACCESS_LEVEL_ROLE_RECOMMENDATIONS[values.accessLevel].includes(role.id));
	};

	return (
		<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
			<FormControl fullWidth error={Boolean(errors?.accessLevel || localErrors.accessLevel)}>
				<InputLabel required>Access Level</InputLabel>
				<Select value={values.accessLevel || ""} onChange={handleAccessLevelChange} label='Access Level'>
					{Object.entries(ACCESS_LEVELS).map(([value, label]) => (
						<MenuItem key={value} value={value}>
							{label}
						</MenuItem>
					))}
				</Select>
				{(errors?.accessLevel || localErrors.accessLevel) && (
					<FormHelperText error>{errors?.accessLevel || localErrors.accessLevel}</FormHelperText>
				)}
			</FormControl>

			<FormControl fullWidth error={Boolean(errors?.companyRole || localErrors.companyRole)}>
				<InputLabel required>Company Role</InputLabel>
				<Select
					value={values.companyRole || ""}
					onChange={handleCompanyRoleChange}
					label='Company Role'
					disabled={!values.accessLevel}
				>
					{getRecommendedRoles().map((role) => (
						<MenuItem key={role.id} value={role.id}>
							{role.name}
						</MenuItem>
					))}
				</Select>
				{(errors?.companyRole || localErrors.companyRole) && (
					<FormHelperText error>{errors?.companyRole || localErrors.companyRole}</FormHelperText>
				)}
			</FormControl>

			{values.accessLevel && values.companyRole && !localErrors.companyRole && (
				<Alert severity='info' sx={{ mt: 1 }}>
					<Typography variant='body2'>
						Selected combination: {ACCESS_LEVELS[values.accessLevel]} with{" "}
						{COMPANY_ROLES.find((r) => r.id === values.companyRole)?.name} role
					</Typography>
				</Alert>
			)}
		</Box>
	);
}

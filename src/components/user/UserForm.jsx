import React, { useState, useEffect } from "react";
import { Box, TextField, Alert, Autocomplete } from "@mui/material";
import { useGlobalStore } from "../../stores/globalStore";

const initialFormState = {
	cognitoId: "",
	email: "",
	name: "",
	phone: "",
	status: "ACTIVE",
	selectedCompanies: [],
};

export function UserForm({ formData = initialFormState, onChange, errors = {}, disabled = false }) {
	const [isInitialized, setIsInitialized] = useState(false);
	const [companies, setCompanies] = useState([]);
	const { activeCompanyId } = useGlobalStore();

	useEffect(() => {
		if (!isInitialized) {
			setIsInitialized(true);
		}
	}, []);

	const handleChange = (e) => {
		const { name, value } = e.target;
		onChange(name, value || "");
	};

	const handleCompanyChange = (event, newValue) => {
		onChange("selectedCompanies", newValue || []);
	};

	const getErrorMessages = () => {
		if (!errors) return null;
		return Object.values(errors).filter(Boolean).join(", ");
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

			<Autocomplete
				multiple
				options={companies}
				getOptionLabel={(option) => option.name}
				value={formData.selectedCompanies || []}
				onChange={handleCompanyChange}
				renderInput={(params) => (
					<TextField
						{...params}
						label='Companies'
						error={Boolean(errors?.companies)}
						helperText={errors?.companies}
					/>
				)}
				disabled={disabled}
			/>
		</Box>
	);
}

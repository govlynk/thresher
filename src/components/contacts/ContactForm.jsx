import React from "react";
import { Grid, TextField, Typography } from "@mui/material";

export function ContactForm({ formData, errors, onChange, disabled }) {
	const handleChange = (e) => {
		const { name, value } = e.target;
		onChange(name, value);
	};

	return (
		<Grid container spacing={2}>
			<Grid item xs={12} sm={6}>
				<TextField
					fullWidth
					label='First Name'
					name='firstName'
					value={formData.firstName || ""}
					onChange={handleChange}
					error={Boolean(errors?.firstName)}
					helperText={errors?.firstName}
					disabled={disabled}
					required
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextField
					fullWidth
					label='Last Name'
					name='lastName'
					value={formData.lastName || ""}
					onChange={handleChange}
					error={Boolean(errors?.lastName)}
					helperText={errors?.lastName}
					disabled={disabled}
					required
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					label='Email'
					name='contactEmail'
					value={formData.contactEmail || ""}
					onChange={handleChange}
					error={Boolean(errors?.contactEmail)}
					helperText={errors?.contactEmail}
					disabled={disabled}
					required
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextField
					fullWidth
					label='Mobile Phone'
					name='contactMobilePhone'
					value={formData.contactMobilePhone || ""}
					onChange={handleChange}
					disabled={disabled}
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextField
					fullWidth
					label='Business Phone'
					name='contactBusinessPhone'
					value={formData.contactBusinessPhone || ""}
					onChange={handleChange}
					disabled={disabled}
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextField
					fullWidth
					label='Title'
					name='title'
					value={formData.title || ""}
					onChange={handleChange}
					disabled={disabled}
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextField
					fullWidth
					label='Department'
					name='department'
					value={formData.department || ""}
					onChange={handleChange}
					disabled={disabled}
				/>
			</Grid>
			<Grid item xs={12}>
				<Typography variant='subtitle2' sx={{ mb: 1 }}>
					Work Address
				</Typography>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					label='Street Address Line 1'
					name='workAddressStreetLine1'
					value={formData.workAddressStreetLine1 || ""}
					onChange={handleChange}
					disabled={disabled}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					label='Street Address Line 2'
					name='workAddressStreetLine2'
					value={formData.workAddressStreetLine2 || ""}
					onChange={handleChange}
					disabled={disabled}
				/>
			</Grid>
			<Grid item xs={12} sm={6}>
				<TextField
					fullWidth
					label='City'
					name='workAddressCity'
					value={formData.workAddressCity || ""}
					onChange={handleChange}
					disabled={disabled}
				/>
			</Grid>
			<Grid item xs={12} sm={3}>
				<TextField
					fullWidth
					label='State'
					name='workAddressStateCode'
					value={formData.workAddressStateCode || ""}
					onChange={handleChange}
					disabled={disabled}
				/>
			</Grid>
			<Grid item xs={12} sm={3}>
				<TextField
					fullWidth
					label='ZIP Code'
					name='workAddressZipCode'
					value={formData.workAddressZipCode || ""}
					onChange={handleChange}
					disabled={disabled}
				/>
			</Grid>
			<Grid item xs={12}>
				<TextField
					fullWidth
					label='Notes'
					name='notes'
					value={formData.notes || ""}
					onChange={handleChange}
					multiline
					rows={3}
					disabled={disabled}
				/>
			</Grid>
		</Grid>
	);
}

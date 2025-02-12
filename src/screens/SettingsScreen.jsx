import React, { useState, useEffect } from "react";
import { Box, Paper, Typography, TextField, Button, Alert, Snackbar, Grid } from "@mui/material";
import { generateClient } from "aws-amplify/api";
import { useGlobalStore } from "../stores/globalStore";

const client = generateClient();

export function SettingsScreen() {
	const { activeCompanyId } = useGlobalStore();
	const [company, setCompany] = useState(null);
	const [searchId, setSearchId] = useState("");
	const [loading, setLoading] = useState(false);
	const [success, setSuccess] = useState(false);
	const [error, setError] = useState(null);

	// Fetch current company settings
	useEffect(() => {
		async function fetchCompany() {
			try {
				if (activeCompanyId) {
					const companyData = await client.models.Company.get({ id: activeCompanyId });
					setCompany(companyData);
					setSearchId(companyData.searchId || "");
				}
			} catch (err) {
				console.error("Error fetching company:", err);
				setError(err.message || "Failed to fetch company settings");
			}
		}
		fetchCompany();
	}, [activeCompanyId]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true);
		setError(null);

		try {
			// Only update if we have a company and it has changed
			if (company && company.searchId !== searchId) {
				const updatedCompany = {
					id: activeCompanyId,
					searchId: searchId || null, // Ensure null if empty
					_version: company._version,
					_lastChangedAt: company._lastChangedAt,
					_deleted: company._deleted,
				};

				await client.models.Company.update(updatedCompany);

				// Update local state
				setCompany({
					...company,
					searchId: searchId,
				});
				setSuccess(true);
			}
		} catch (err) {
			console.error("Error updating settings:", err);
			setError(err.message || "Failed to update settings");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h4' gutterBottom>
				Application Settings
			</Typography>

			<Paper sx={{ p: 3, mt: 3 }}>
				<form onSubmit={handleSubmit}>
					<Grid container spacing={3}>
						<Grid item xs={12}>
							<Typography variant='h6' gutterBottom>
								Opportunity Search Settings
							</Typography>
						</Grid>

						<Grid item xs={12} md={6}>
							<TextField
								fullWidth
								label='Search ID'
								value={searchId}
								onChange={(e) => setSearchId(e.target.value)}
								helperText='Enter the HigherGov Search ID for opportunity filtering'
							/>
						</Grid>

						<Grid item xs={12}>
							<Button variant='contained' color='primary' type='submit' disabled={loading}>
								{loading ? "Saving..." : "Save Settings"}
							</Button>
						</Grid>
					</Grid>
				</form>
			</Paper>

			<Snackbar open={success} autoHideDuration={6000} onClose={() => setSuccess(false)}>
				<Alert severity='success'>Settings updated successfully</Alert>
			</Snackbar>

			<Snackbar open={!!error} autoHideDuration={6000} onClose={() => setError(null)}>
				<Alert severity='error'>{error}</Alert>
			</Snackbar>
		</Box>
	);
}

export default SettingsScreen;

import React, { useState, useEffect } from "react";
import { Box, Typography, Alert } from "@mui/material";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "../stores/globalStore";
import CompanyHeader from "../components/company/CompanyHeader";
import CompanyDetailsGrid from "../components/company/CompanyDetailsGrid";

const client = generateClient({
	authMode: "userPool",
});

export default function SAMRegistrationScreen() {
	const [company, setCompany] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { activeCompanyId } = useGlobalStore.getState();

	useEffect(() => {
		async function fetchCompany() {
			if (!activeCompanyId) {
				setError("No active company selected");
				return;
			}

			setLoading(true);
			try {
				const response = await client.models.Company.get({ id: activeCompanyId });
				console.log("Company response:", response);
				setCompany(response.data);
				setError(null);
			} catch (err) {
				console.error("Error fetching company:", err);
				setError(err.message || "Failed to fetch company");
			} finally {
				setLoading(false);
			}
		}

		fetchCompany();
	}, [activeCompanyId]);

	if (!activeCompanyId) {
		return (
			<Box sx={{ p: 3 }}>
				<Typography color='error'>No active company selected</Typography>
			</Box>
		);
	}

	if (loading) {
		return (
			<Box sx={{ p: 3 }}>
				<Typography>Loading...</Typography>
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ p: 3 }}>
				<Typography color='error'>{error}</Typography>
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h4' sx={{ mb: 4, fontWeight: "bold" }}>
				Company Registration Details
			</Typography>
			{company && (
				<>
					<CompanyHeader company={company} />
					<CompanyDetailsGrid company={company} />
				</>
			)}
		</Box>
	);
}

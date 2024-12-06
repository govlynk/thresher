import React from "react";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import { useOpportunityStore } from "../../stores/opportunityStore";
import { useUserCompanyStore } from "../../stores/userCompanyStore";

export function OpportunitySearch() {
	const { fetchOpportunities, loading, error, lastRetrievedDate } = useOpportunityStore();
	const { getActiveCompany } = useUserCompanyStore();
	const activeCompany = getActiveCompany();

	React.useEffect(() => {
		const fetchData = async () => {
			if (activeCompany?.naicsCode) {
				const NAICS = activeCompany?.naicsCode;
				const ncode = Array.isArray(NAICS) && NAICS.length > 1 ? NAICS.join(",") : NAICS;
				const date = new Date();
				const endDate = `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
				const startDate = lastRetrievedDate
					? new Date(lastRetrievedDate).toLocaleDateString()
					: `${date.getMonth() - 2}/01/${date.getFullYear()}`;
				const limit = 10;

				const searchParams = {
					ncode: `naics=${ncode}`,
					postedFrom: `postedFrom=${startDate}`,
					postedTo: `postedTo=${endDate}`,
					ptype: `ptype=${["p", "o", "k"]}`,
					limit: `limit=${limit}`,
				};

				try {
					await fetchOpportunities(searchParams);
				} catch (err) {
					console.error("Error in opportunity search:", err);
				}
			}
		};

		fetchData();
	}, [activeCompany?.naicsCode]);

	if (!activeCompany?.naicsCode?.length) {
		return (
			<Alert severity='info' sx={{ mt: 2 }}>
				No NAICS codes found for this company. NAICS codes are required to search for opportunities.
			</Alert>
		);
	}

	if (error) {
		return (
			<Alert severity='error' sx={{ mt: 2 }}>
				{error}
			</Alert>
		);
	}

	return (
		<Box sx={{ mb: 3 }}>
			{lastRetrievedDate && (
				<Typography variant='caption' color='text.secondary'>
					Last updated: {new Date(lastRetrievedDate).toLocaleString()}
				</Typography>
			)}
		</Box>
	);
}

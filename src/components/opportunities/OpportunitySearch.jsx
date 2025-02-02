import { useEffect, useMemo, useCallback } from "react";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import { useOpportunityQuery } from "../../utils/opportunityApi";
import { useGlobalStore } from "../../stores/globalStore";
import { useUserCompanyStore } from "../../stores/userCompanyStore";
import { useOpportunityStore } from "../../stores/opportunityStore";
import { getDefaultStartDate, getDefaultEndDate, formatDateForApi } from "../../utils/opportunityDateUtils";

export function OpportunitySearch() {
	console.log("OpportunitySearch - Component Render");

	const { activeCompanyId } = useGlobalStore();
	const { userCompanies } = useUserCompanyStore();
	const { setOpportunities } = useOpportunityStore();
	const activeCompany = userCompanies.find((c) => c.id === activeCompanyId);

	// Construct search parameters
	const searchParams = useMemo(() => {
		if (!activeCompany?.naicsCode?.length) {
			return null;
		}

		const startDate = getDefaultStartDate();
		const endDate = getDefaultEndDate();

		return {
			naicsCode: activeCompany.naicsCode.join(","),
			postedFrom: formatDateForApi(startDate),
			postedTo: formatDateForApi(endDate),
			limit: "100",
		};
	}, [activeCompany]);

	const { data, isLoading, error, dataUpdatedAt, refetch } = useOpportunityQuery(searchParams);

	const updateOpportunities = useCallback(
		(newData) => {
			setOpportunities(newData || []);
		},
		[setOpportunities]
	);

	// Update opportunities in store when data changes
	useEffect(() => {
		if (data) {
			updateOpportunities(data);
		}
	}, [data, updateOpportunities]);

	if (!activeCompanyId) {
		return (
			<Alert severity='warning' sx={{ mt: 2 }}>
				Please select a company to view opportunities
			</Alert>
		);
	}

	if (!activeCompany?.naicsCode?.length) {
		return (
			<Alert severity='info' sx={{ mt: 2 }}>
				No NAICS codes found for this company. NAICS codes are required to search for opportunities.
			</Alert>
		);
	}

	if (isLoading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
				<CircularProgress size={24} />
			</Box>
		);
	}

	if (error) {
		return (
			<Alert severity='error' sx={{ mt: 2 }}>
				{error?.message || "Failed to fetch opportunities"}
			</Alert>
		);
	}

	return (
		<Box sx={{ mb: 3 }}>
			{dataUpdatedAt && (
				<Typography variant='caption' color='text.secondary'>
					Last updated: {new Date(dataUpdatedAt).toLocaleString()}
				</Typography>
			)}
		</Box>
	);
}

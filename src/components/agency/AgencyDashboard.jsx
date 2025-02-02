import React, { useState } from "react";
import { Box, Grid, Paper, CircularProgress, Alert, Button } from "@mui/material";
import { Target, Trash2 } from "lucide-react";
import { AgencySelector } from "./AgencySelector";
import { ContractSpendingChart } from "./charts/ContractSpendingChart";
import { IdvSpendingChart } from "./charts/IdvSpendingChart";
import { ObligationsByCategoryChart } from "./charts/ObligationsByCategoryChart";
import { AgencyTreemap } from "./charts/AgencyTreemap";
import { AwardMetrics } from "./AwardMetrics";
import { AgencyOverview } from "./AgencyOverview";
import { useAgencyData } from "../../hooks/useAgencyData";
import { FiscalYearFilter } from "./filters/FiscalYearFilter";
import { useGlobalStore } from "../../stores/globalStore";
import { useTargetAgencyStore } from "../../stores/targetAgencyStore";

import { useEffect, useMemo } from "react";
import { useAgencies } from "../../hooks/useAgencies";

function AgencyDashboard({ initialAgencyCode }) {
	const [selectedAgency, setSelectedAgency] = useState(null);
	const [fiscalYear, setFiscalYear] = useState(new Date().getFullYear());
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState(null);
	const [fetchError, setFetchError] = useState(null);
	const { activeCompanyId } = useGlobalStore();
	const {
		agencies: targetAgencies,
		fetchTargetAgencies,
		addTargetAgency,
		removeTargetAgency,
	} = useTargetAgencyStore();
	const { data: agencies } = useAgencies();

	// Fetch target agencies when component mounts
	useEffect(() => {
		if (activeCompanyId) {
			fetchTargetAgencies(activeCompanyId).catch((err) => {
				setFetchError(err.message || "Failed to fetch target agencies");
			});
		}
	}, [activeCompanyId, fetchTargetAgencies]);

	// Check if current agency is targeted
	const isTargeted = useMemo(() => {
		return selectedAgency && targetAgencies.some((agency) => agency.agencyId === selectedAgency.toptier_code);
	}, [selectedAgency, targetAgencies]);
	const handleSaveTargetAgency = async () => {
		if (!selectedAgency || !activeCompanyId) return;

		setSaving(true);
		setSaveError(null);

		try {
			await addTargetAgency({
				agencyId: selectedAgency.toptier_code,
				toptier_code: selectedAgency.toptier_code,
				name: selectedAgency.agency_name,
				mission: data?.agency_overview?.mission,
				about: data?.agency_overview?.about,
				abbreviation: data?.agency_overview?.abbreviation,
				subtier_agency_count: data?.agency_overview?.subtier_agency_count,
				icon_filename:
					"https://www.usaspending.gov/graphics/agency/" + data?.agency_overview?.icon_filename || null,
				website: data?.agency_overview?.website,
				congressional_justification_url: data?.agency_overview?.congressional_justification_url,
				companyId: activeCompanyId,
			});

			alert("Agency saved successfully!");
		} catch (err) {
			console.error("Error saving target agency:", err);
			setSaveError(err.message || "Failed to save target agency");
		} finally {
			setSaving(false);
		}
	};

	const handleRemoveTargetAgency = async () => {
		if (!selectedAgency) return;

		setSaving(true);
		setSaveError(null);

		try {
			const targetAgency = targetAgencies.find((agency) => agency.agencyId === selectedAgency.toptier_code);

			if (targetAgency) {
				await removeTargetAgency(targetAgency.id);
				alert("Agency removed from targets successfully!");
			}
		} catch (err) {
			console.error("Error removing target agency:", err);
			setSaveError(err.message || "Failed to remove target agency");
		} finally {
			setSaving(false);
		}
	};

	// Set initial agency when provided
	useEffect(() => {
		if (initialAgencyCode && agencies) {
			const agency = agencies?.find((a) => a.toptier_code === initialAgencyCode);
			if (agency) {
				setSelectedAgency(agency);
			}
		}
	}, [initialAgencyCode, agencies]);

	const { data, isLoading, error } = useAgencyData(selectedAgency?.toptier_code, fiscalYear);
	// console.log("Agency data:", data);
	// console.log("Budgetary resources:", data?.budgetary_resources);

	if (error) {
		return (
			<Alert severity='error' sx={{ mb: 3 }}>
				{error.message || "Failed to load agency data"}
			</Alert>
		);
	}

	return (
		<Box>
			<Box sx={{ mb: 4, display: "flex", gap: 2 }}>
				<AgencySelector value={selectedAgency} onChange={setSelectedAgency} />
				<FiscalYearFilter value={fiscalYear} onChange={setFiscalYear} />
				{selectedAgency && (
					<Button
						variant='contained'
						startIcon={isTargeted ? <Trash2 /> : <Target />}
						onClick={isTargeted ? handleRemoveTargetAgency : handleSaveTargetAgency}
						color={isTargeted ? "error" : "primary"}
						disabled={saving}
					>
						{saving ? "Processing..." : isTargeted ? "Remove Target Agency" : "Save as Target Agency"}
					</Button>
				)}
			</Box>

			{saveError && (
				<Alert severity='error' sx={{ mb: 3 }}>
					{saveError}
				</Alert>
			)}

			{isLoading ? (
				<Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
					<CircularProgress />
				</Box>
			) : selectedAgency ? (
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<AgencyOverview data={data?.agency_overview} />
					</Grid>
					<Grid item xs={12}>
						<AwardMetrics awardCounts={data?.award_counts} budgetaryResources={data?.budgetary_resources} />
					</Grid>
					<Grid item xs={12} md={6}>
						<Paper sx={{ p: 3, height: "400px" }}>
							<ContractSpendingChart data={data?.contract_spending} />
						</Paper>
					</Grid>

					<Grid item xs={12} md={6}>
						<Paper sx={{ p: 3, height: "400px" }}>
							<IdvSpendingChart data={data?.idv_spending} />
						</Paper>
					</Grid>

					<Grid item xs={12} md={6}>
						<Paper sx={{ p: 3, height: "400px" }}>
							<ObligationsByCategoryChart data={data?.obligations_by_category} />
						</Paper>
					</Grid>
					<Grid item xs={12} md={6}>
						<Paper sx={{ p: 3, height: "400px" }}>
							<AgencyTreemap fiscalYear={fiscalYear} />
						</Paper>
					</Grid>
				</Grid>
			) : (
				<Alert severity='info'>Please select an agency to view detailed analysis</Alert>
			)}
		</Box>
	);
}

export default AgencyDashboard;

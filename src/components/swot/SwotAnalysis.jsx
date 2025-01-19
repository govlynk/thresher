import React, { useEffect } from "react";
import { Box, Typography, Grid, Alert, CircularProgress, useTheme, Button } from "@mui/material";
import { Save } from "lucide-react";
import { useSwotStore } from "../../stores/swotStore";
import { useGlobalStore } from "../../stores/globalStore";
import { SwotSection } from "./SwotSection";

const useBeforeUnload = (hasUnsavedChanges) => {
	useEffect(() => {
		const handleBeforeUnload = (e) => {
			if (hasUnsavedChanges) {
				e.preventDefault();
				e.returnValue = "";
			}
		};

		window.addEventListener("beforeunload", handleBeforeUnload);
		return () => window.removeEventListener("beforeunload", handleBeforeUnload);
	}, [hasUnsavedChanges]);
};

export default function SwotAnalysis() {
	const theme = useTheme();
	const { activeCompanyId } = useGlobalStore();
	const { swotData, loading, error, success, fetchSwotAnalysis, saveSwotAnalysis, resetSuccess } = useSwotStore();
	const [localData, setLocalData] = React.useState(null);
	const hasUnsavedChanges = React.useMemo(() => {
		if (!localData || !swotData) return false;
		return JSON.stringify(localData) !== JSON.stringify(swotData);
	}, [localData, swotData]);

	useBeforeUnload(hasUnsavedChanges);

	useEffect(() => {
		if (activeCompanyId) {
			fetchSwotAnalysis(activeCompanyId);
		}
	}, [activeCompanyId, fetchSwotAnalysis]);

	useEffect(() => {
		if (swotData) {
			setLocalData(swotData);
		}
	}, [swotData]);

	const handleAdd = (section) => (item) => {
		setLocalData((prev) => ({
			...(prev || {}),
			strengths: prev?.strengths || [],
			weaknesses: prev?.weaknesses || [],
			opportunities: prev?.opportunities || [],
			threats: prev?.threats || [],
			companyId: activeCompanyId,
			[section]: [...(prev?.[section] || []), item],
		}));
	};

	const handleRemove = (section) => (index) => {
		setLocalData((prev) => ({
			...(prev || {}),
			strengths: prev?.strengths || [],
			weaknesses: prev?.weaknesses || [],
			opportunities: prev?.opportunities || [],
			threats: prev?.threats || [],
			companyId: activeCompanyId,
			[section]: (prev?.[section] || []).filter((_, i) => i !== index),
		}));
	};

	const handleSave = async () => {
		if (!localData) return;
		await saveSwotAnalysis(localData);
	};

	if (!activeCompanyId) {
		return (
			<Alert severity='warning' sx={{ m: 2 }}>
				Please select a company to manage SWOT analysis
			</Alert>
		);
	}

	if (loading && !swotData) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h4' sx={{ mb: 4, fontWeight: "bold" }}>
				SWOT Analysis
			</Typography>

			<Box sx={{ display: "flex", justifyContent: "flex-end", mb: 3 }}>
				<Button
					variant='contained'
					startIcon={<Save />}
					onClick={handleSave}
					disabled={!hasUnsavedChanges || loading}
				>
					{loading ? "Saving..." : "Save Changes"}
				</Button>
			</Box>

			{error && (
				<Alert severity='error' sx={{ mb: 3 }}>
					{error}
				</Alert>
			)}

			{success && (
				<Alert severity='success' onClose={resetSuccess} sx={{ mb: 3 }}>
					SWOT analysis saved successfully!
				</Alert>
			)}

			<Grid container spacing={3}>
				<Grid item xs={12} md={6}>
					<SwotSection
						title='Strengths'
						items={localData?.strengths}
						onAdd={handleAdd("strengths")}
						onRemove={handleRemove("strengths")}
						color={theme.palette.success.main}
					/>
				</Grid>

				<Grid item xs={12} md={6}>
					<SwotSection
						title='Weaknesses'
						items={localData?.weaknesses}
						onAdd={handleAdd("weaknesses")}
						onRemove={handleRemove("weaknesses")}
						color={theme.palette.error.main}
					/>
				</Grid>

				<Grid item xs={12} md={6}>
					<SwotSection
						title='Opportunities'
						items={localData?.opportunities}
						onAdd={handleAdd("opportunities")}
						onRemove={handleRemove("opportunities")}
						color={theme.palette.primary.main}
					/>
				</Grid>

				<Grid item xs={12} md={6}>
					<SwotSection
						title='Threats'
						items={localData?.threats}
						onAdd={handleAdd("threats")}
						onRemove={handleRemove("threats")}
						color={theme.palette.warning.main}
					/>
				</Grid>
			</Grid>
		</Box>
	);
}

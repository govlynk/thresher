import React, { useEffect } from "react";
import {
	Box,
	Paper,
	Typography,
	TextField,
	IconButton,
	Grid,
	Button,
	Alert,
	CircularProgress,
	Chip,
} from "@mui/material";
import { Plus, X, Save } from "lucide-react";
import { useSwotStore } from "../../stores/swotStore";
import { useGlobalStore } from "../../stores/globalStore";

const SwotSection = ({ title, items, onAdd, onRemove, color }) => (
	<Paper
		sx={{
			p: 3,
			height: "100%",
			borderTop: 3,
			borderColor: color,
		}}
	>
		<Typography variant='h6' gutterBottom>
			{title}
		</Typography>

		<Box sx={{ mb: 2 }}>
			<TextField
				fullWidth
				placeholder={`Add new ${title.toLowerCase()}`}
				size='small'
				onKeyPress={(e) => {
					if (e.key === "Enter" && e.target.value.trim()) {
						onAdd(e.target.value.trim());
						e.target.value = "";
					}
				}}
			/>
			<Button startIcon={<Plus size={20} />} onClick={onAdd} sx={{ mt: 1 }}>
				Add Item
			</Button>
		</Box>

		<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
			{Array.isArray(items) &&
				items.map((item, index) => (
					<Chip
						key={index}
						label={item}
						onDelete={() => onRemove(index)}
						sx={{
							bgcolor: `${color}15`,
							borderColor: color,
							"&:hover": {
								bgcolor: `${color}25`,
							},
						}}
					/>
				))}
		</Box>
	</Paper>
);

export default function SwotAnalysis() {
	const { activeCompanyId } = useGlobalStore();
	const { swotData, loading, error, success, fetchSwotAnalysis, saveSwotAnalysis, resetSuccess } = useSwotStore();
	console.log("Swot Data", swotData);
	useEffect(() => {
		if (activeCompanyId) {
			fetchSwotAnalysis(activeCompanyId);
		}
	}, [activeCompanyId, fetchSwotAnalysis]);

	const handleAdd = (section) => (item) => {
		const updatedData = {
			...(swotData || {}),
			strengths: swotData?.strengths || [],
			weaknesses: swotData?.weaknesses || [],
			opportunities: swotData?.opportunities || [],
			threats: swotData?.threats || [],
			companyId: activeCompanyId,
			[section]: [...(swotData?.[section] || []), item],
		};
		saveSwotAnalysis(updatedData);
	};

	const handleRemove = (section) => (index) => {
		const updatedData = {
			...(swotData || {}),
			strengths: swotData?.strengths || [],
			weaknesses: swotData?.weaknesses || [],
			opportunities: swotData?.opportunities || [],
			threats: swotData?.threats || [],
			companyId: activeCompanyId,
			[section]: (swotData?.[section] || []).filter((_, i) => i !== index),
		};
		saveSwotAnalysis(updatedData);
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
						items={swotData?.strengths}
						onAdd={handleAdd("strengths")}
						onRemove={handleRemove("strengths")}
						color='success.main'
					/>
				</Grid>

				<Grid item xs={12} md={6}>
					<SwotSection
						title='Weaknesses'
						items={swotData?.weaknesses}
						onAdd={handleAdd("weaknesses")}
						onRemove={handleRemove("weaknesses")}
						color='error.main'
					/>
				</Grid>

				<Grid item xs={12} md={6}>
					<SwotSection
						title='Opportunities'
						items={swotData?.opportunities}
						onAdd={handleAdd("opportunities")}
						onRemove={handleRemove("opportunities")}
						color='primary.main'
					/>
				</Grid>

				<Grid item xs={12} md={6}>
					<SwotSection
						title='Threats'
						items={swotData?.threats}
						onAdd={handleAdd("threats")}
						onRemove={handleRemove("threats")}
						color='warning.main'
					/>
				</Grid>
			</Grid>
		</Box>
	);
}

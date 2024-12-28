import React, { useState, useEffect } from "react";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import { useRegulationStore } from "../stores/regulation/regulationStore";
import { useDocumentStore } from "../stores/regulation/documentationStore";
import { useGlobalStore } from "../stores/globalStore";
import { RegulationTabs } from "../components/regulation/RegulationTabs";
import { RegulationDetails } from "../components/regulation/RegulationDetails";
import { DocumentDownload } from "../components/regulation/DocumentDownload";

export default function RegulationManagement() {
	const { activeCompanyId, activeCompanyData, getActiveCompany } = useGlobalStore();
	const [selectedRegulation, setSelectedRegulation] = useState(null);
	const { regulations, loading, error, fetchRegulations } = useRegulationStore();
	const { documents, fetchDocuments } = useDocumentStore();

	// Debug logging
	useEffect(() => {
		console.log("RegulationManagement - Mount");
		console.log("Initial activeCompanyId:", activeCompanyId);
		console.log("Initial activeCompanyData:", activeCompanyData);
		console.log("getActiveCompany():", getActiveCompany());
	}, []);

	// Debug company changes
	useEffect(() => {
		console.log("Company Changed:");
		console.log("activeCompanyId:", activeCompanyId);
		console.log("activeCompanyData:", activeCompanyData);
		console.log("getActiveCompany():", getActiveCompany());
	}, [activeCompanyId, activeCompanyData]);

	useEffect(() => {
		if (activeCompanyData?.uei) {
			console.log("Fetching regulations for UEI:", activeCompanyData.uei);
			fetchRegulations();
			fetchDocuments();
		} else {
			console.log("No UEI available:", {
				activeCompanyData,
				activeCompanyId,
				getActiveCompany: getActiveCompany(),
			});
		}
	}, [activeCompanyData, fetchRegulations, fetchDocuments]);

	if (!activeCompanyId) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='warning'>Please select a company to view FAR certifications</Alert>
			</Box>
		);
	}

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='error'>{error}</Alert>
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
				<Typography variant='h4' sx={{ fontWeight: "bold" }}>
					Federal Acquisition Regulations
				</Typography>
				<DocumentDownload pdfLinks={documents} />
			</Box>

			<Box sx={{ display: "flex", gap: 3 }}>
				<RegulationTabs
					regulations={regulations || []}
					selectedRegulation={selectedRegulation}
					onRegulationSelect={setSelectedRegulation}
				/>

				{selectedRegulation ? (
					<RegulationDetails regulation={selectedRegulation} />
				) : (
					<Box sx={{ flex: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
						<Typography variant='body1' color='text.secondary'>
							Select a regulation to view details
						</Typography>
					</Box>
				)}
			</Box>
		</Box>
	);
}

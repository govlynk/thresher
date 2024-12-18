import React, { useEffect, useState } from "react";
import { Box, Paper, List, Typography, CircularProgress, Alert, Button } from "@mui/material";
import { useRegulationStore } from "../stores/regulation/regulationStore";
import { useDocumentStore } from "../stores/regulation/documentationStore";
import { useGlobalStore } from "../stores/globalStore";
import { RegulationList } from "../components/regulation/RegulationList";
import { RegulationDetails } from "../components/regulation/RegulationDetails";
import { DocumentDownload } from "../components/regulation/DocumentDownload";
import { Book, Download } from "lucide-react";

export default function RegulationManagement() {
	const [selectedRegulation, setSelectedRegulation] = useState(null);
	const { regulations, loading, error, fetchRegulations } = useRegulationStore();
	const { fetchDocuments } = useDocumentStore();
	const activeCompany = useGlobalStore((state) => state.getActiveCompany());

	useEffect(() => {
		if (activeCompany?.id) {
			fetchRegulations();
			fetchDocuments();
		}
	}, [activeCompany?.id]);

	const handleDownloadPdfs = () => {
		if (pdfLinks?.farPDF) {
			window.open(pdfLinks.farPDF, "_blank");
		}
		if (pdfLinks?.farAndDfarsPDF) {
			window.open(pdfLinks.farAndDfarsPDF, "_blank");
		}
	};

	if (!activeCompany) {
		return (
			<Alert severity='warning' sx={{ m: 2 }}>
				Please select a company to view FAR certifications
			</Alert>
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
			<Alert severity='error' sx={{ m: 2 }}>
				{error}
			</Alert>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			<Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
				<Typography variant='h4' sx={{ fontWeight: "bold" }}>
					Federal Acquisition Regulations
				</Typography>
				<Button variant='contained' startIcon={<Download />} onClick={handleDownloadPdfs}>
					Download PDFs
				</Button>
			</Box>

			<Box sx={{ display: "flex", gap: 3 }}>
				<Paper sx={{ width: 300, flexShrink: 0 }}>
					<List>
						{regulations.map((regulation) => (
							<ListItem
								key={regulation.provisionId}
								button
								selected={selectedFar?.provisionId === regulation.provisionId}
								onClick={() => setSelectedRegulation(regulation)}
							>
								<ListItemText
									primary={regulation.provisionId}
									secondary={`${regulation.answers.length} certifications`}
								/>
							</ListItem>
						))}
					</List>
				</Paper>

				<Box sx={{ flexGrow: 1 }}>
					{selectedRegulation ? (
						<RegulationDetails regulation={selectedRegulation} />
					) : (
						<Paper sx={{ p: 3, textAlign: "center" }}>
							<Book size={48} />
							<Typography variant='h6' sx={{ mt: 2 }}>
								Select a Regulation provision to view details
							</Typography>
						</Paper>
					)}
				</Box>
			</Box>
		</Box>
	);
}

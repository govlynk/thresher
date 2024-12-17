import React from "react";
import { Box, Typography, Paper, Divider, Alert } from "@mui/material";
import { AboutReview } from "./review/AboutReview";
import { CapabilitiesReview } from "./review/CapabilitiesReview";
import { CompetitiveReview } from "./review/CompetitiveReview";
import { MissionVisionReview } from "./review/MissionVisionReview";
import { PastPerformanceReview } from "./review/PastPerformanceReview";
import { CertificationsReview } from "./review/CertificationsReview";

export function ReviewSection({ formData = {}, performances = [], certifications = [] }) {
	// Validate required fields
	const missingFields = [];
	if (!formData.aboutUs?.trim()) missingFields.push("About Us");
	if (!formData.keyCapabilities?.length) missingFields.push("Key Capabilities");
	if (!formData.competitiveAdvantage?.trim()) missingFields.push("Competitive Advantage");
	if (!formData.mission?.trim()) missingFields.push("Mission Statement");
	if (!formData.vision?.trim()) missingFields.push("Vision Statement");
	if (!performances?.length) missingFields.push("Past Performance");

	return (
		<Box>
			<Typography variant='h6' gutterBottom>
				Review Capability Statement
			</Typography>

			{missingFields.length > 0 && (
				<Alert severity='warning' sx={{ mb: 3 }}>
					The following sections are missing information: {missingFields.join(", ")}
				</Alert>
			)}

			<Paper sx={{ p: 3, mb: 3 }}>
				<AboutReview aboutUs={formData.aboutUs} keywords={formData.keywords} />
				<Divider sx={{ my: 2 }} />

				<CapabilitiesReview capabilities={formData.keyCapabilities || []} />
				<Divider sx={{ my: 2 }} />

				<CompetitiveReview competitiveAdvantage={formData.competitiveAdvantage} />
				<Divider sx={{ my: 2 }} />

				<MissionVisionReview mission={formData.mission} vision={formData.vision} />
				<Divider sx={{ my: 2 }} />

				<PastPerformanceReview performances={performances} />
				<Divider sx={{ my: 2 }} />

				<CertificationsReview certifications={certifications} />
			</Paper>
		</Box>
	);
}

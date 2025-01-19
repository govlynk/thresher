import React from "react";
import { Box, Chip } from "@mui/material";
import { FileText } from "lucide-react";
import InfoCard from "../InfoCard";

export default function CompanyPscSection({ company }) {
	if (!company.pscCode?.length) return null;

	return (
		<InfoCard title='Product & Service Codes' icon={FileText}>
			<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
				{company.pscCode.map((code, index) => (
					<Chip
						key={index}
						label={`${code} - ${company.pscDescription?.[index] || "No description"}`}
						variant='outlined'
						sx={{ borderRadius: 1 }}
					/>
				))}
			</Box>
		</InfoCard>
	);
}

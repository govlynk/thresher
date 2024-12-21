import React from "react";
import { Box, Chip } from "@mui/material";
import { Award } from "lucide-react";
import InfoCard from "../InfoCard";

export default function CompanyNaicsSection({ company }) {
	console.log("CompanyNaicsSection - naics", company.naicsCode);
	return (
		<InfoCard title='NAICS Codes' icon={Award}>
			<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
				{company.naicsCode.map((code, index) => (
					<Chip
						key={index}
						label={code}
						variant='outlined'
						color={code === company.primaryNaics ? "primary" : "default"}
					/>
				))}
			</Box>
		</InfoCard>
	);
}

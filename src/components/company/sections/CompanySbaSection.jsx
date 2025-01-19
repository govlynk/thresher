import React from "react";
import { Box, Chip, Typography } from "@mui/material";
import { Award } from "lucide-react";
import InfoCard from "../InfoCard";
import { formatDate } from "../../../utils/formatters";

export default function CompanySbaSection({ company }) {
	if (!company.sbaBusinessTypeDesc?.length) return null;

	return (
		<InfoCard title='SBA Certifications' icon={Award}>
			<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
				{company.sbaBusinessTypeDesc.map((desc, index) => (
					<Box key={index} sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
						<Chip label={desc} variant='outlined' color='primary' sx={{ alignSelf: "flex-start" }} />
						<Typography variant='body2' color='text.secondary'>
							Entry Date: {formatDate(company.sbaCertificationEntryDate?.[index])}
						</Typography>
						{company.sbaCertificationExitDate?.[index] && (
							<Typography variant='body2' color='text.secondary'>
								Exit Date: {formatDate(company.sbaCertificationExitDate[index])}
							</Typography>
						)}
					</Box>
				))}
			</Box>
		</InfoCard>
	);
}

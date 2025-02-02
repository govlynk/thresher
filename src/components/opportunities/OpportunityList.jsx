import React from "react";
import { Grid, Typography, Box, CircularProgress, useTheme } from "@mui/material";
import { OpportunityCard } from "./OpportunityCard";

export function OpportunityList({ opportunities = [], type = "new" }) {
	const theme = useTheme();

	if (!opportunities.length) {
		return (
			<Typography
				color='text.secondary'
				align='center'
				sx={{
					py: 8,
					px: 2,
					bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.50",
					borderRadius: 2,
					border: `1px dashed ${theme.palette.divider}`,
				}}
			>
				No opportunities found.
			</Typography>
		);
	}

	return (
		<Grid container spacing={3} sx={{ px: 2 }}>
			{opportunities.map((opportunity) => (
				<Grid item xs={12} md={6} lg={4} key={opportunity.noticeId}>
					<OpportunityCard opportunity={opportunity} type={type} />
				</Grid>
			))}
		</Grid>
	);
}

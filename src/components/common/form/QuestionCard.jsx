import React from "react";
import { Paper, Box, Typography, Collapse } from "@mui/material";

export function QuestionCard({ children, title, subtitle, expanded = true }) {
	return (
		<Paper
			sx={{
				p: 3,
				mb: 3,
				borderRadius: 2,
				boxShadow: (theme) =>
					theme.palette.mode === "dark" ? "0 4px 20px rgba(0,0,0,0.25)" : "0 4px 20px rgba(0,0,0,0.05)",
			}}
		>
			<Collapse in={expanded}>
				<Box>{children}</Box>
			</Collapse>
		</Paper>
	);
}

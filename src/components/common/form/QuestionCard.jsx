import React from "react";
import { Paper, Box, Typography, Collapse } from "@mui/material";
import { motion } from "framer-motion";

const MotionPaper = motion(Paper);

export function QuestionCard({ children, title, subtitle, expanded = true }) {
	return (
		<MotionPaper
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ duration: 0.3 }}
			sx={{
				p: 3,
				mb: 3,
				borderRadius: 2,
				boxShadow: (theme) =>
					theme.palette.mode === "dark" ? "0 4px 20px rgba(0,0,0,0.25)" : "0 4px 20px rgba(0,0,0,0.05)",
			}}
		>
			<Box sx={{ mb: subtitle ? 2 : 3 }}>
				<Typography variant='h6' gutterBottom>
					{title}
				</Typography>
				{subtitle && (
					<Typography variant='body2' color='text.secondary'>
						{subtitle}
					</Typography>
				)}
			</Box>

			<Collapse in={expanded}>
				<Box>{children}</Box>
			</Collapse>
		</MotionPaper>
	);
}

import React from "react";
import { Box, TextField, Typography } from "@mui/material";

export function AboutSection({ aboutUs, keywords, onAboutUsChange, onKeywordsChange }) {
	return (
		<Box>
			<Typography variant='h6' gutterBottom>
				About Us
			</Typography>
			<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
				Provide a comprehensive overview of your company, including your core business areas and expertise.
			</Typography>
			<TextField
				fullWidth
				multiline
				rows={6}
				value={aboutUs}
				onChange={(e) => onAboutUsChange(e.target.value)}
				placeholder="Describe your company's background, expertise, and core business areas..."
				helperText={`${aboutUs.length}/2000 characters`}
				inputProps={{ maxLength: 2000 }}
			/>
			<TextField
				fullWidth
				multiline
				rows={6}
				value={keywords}
				onChange={(e) => onKeywordsChange(e.target.value)}
				placeholder="Describe your company's keywords..."
				helperText={`${keywords.length}/200 characters`}
				inputProps={{ maxLength: 200 }}
			/>
		</Box>
	);
}

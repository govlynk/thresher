import React from "react";
import { Box, TextField, Typography } from "@mui/material";

export function AboutSection({ aboutUs, keywords, onAboutUsChange, onKeywordsChange }) {
	return (
		<Box>
			<Box sx={{ mb: 4 }}>
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
			</Box>
			<Box sx={{ mb: 4 }}>
				<Typography variant='h6' gutterBottom>
					Keywords
				</Typography>
				<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
					Provide a set of keywords that describe your company and its products or services.
				</Typography>
				<TextField
					fullWidth
					value={keywords}
					onChange={(e) => onKeywordsChange(e.target.value)}
					placeholder="Describe your company's keywords..."
					helperText={`${keywords.length}/200 characters`}
					inputProps={{ maxLength: 200 }}
				/>
			</Box>
		</Box>
	);
}

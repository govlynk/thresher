import React from "react";
import { Box, Typography } from "@mui/material";
import { RichTextQuestion } from "../../common/form/questionTypes/RichTextQuestion";

export function AboutSection({ value, onChange }) {
	const handleChange = (fieldId, content) => {
		// Since we're using RichTextQuestion, content will already be in the correct format
		onChange(content);
	};

	return (
		<Box>
			<Typography variant='h6' gutterBottom>
				About Us
			</Typography>
			<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
				Provide a comprehensive overview of your company, including your core business areas and expertise.
			</Typography>
			<RichTextQuestion
				question={{
					id: "aboutUs",
					title: "About Us",
					required: true,
					placeholder: "Describe your company's background, expertise, and core business areas...",
					minHeight: 300,
					minLength: 100,
					maxLength: 2000,
				}}
				value={value}
				onChange={handleChange}
			/>
		</Box>
	);
}

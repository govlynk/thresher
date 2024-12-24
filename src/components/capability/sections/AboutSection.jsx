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
			<RichTextQuestion
				question={{
					id: "aboutUs",
					title: "About Us",
					required: false,
					instructions:
						"Provide a short overview of your company, including your core business areas and expertise.",
					placeholder: "Company background, expertise, and core business areas...",
					minHeight: 300,
					maxLength: 2000,
				}}
				value={value}
				onChange={handleChange}
			/>
		</Box>
	);
}

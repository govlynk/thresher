import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { RichTextQuestion } from "../../common/form/questionTypes/RichTextQuestion";

export function CompetitiveSection({ value, onChange }) {
	const handleChange = (fieldId, content) => {
		// Since we're using RichTextQuestion, content will already be in the correct format
		onChange(content);
	};

	return (
		<Box>
			<RichTextQuestion
				question={{
					id: "advantage",
					title: "Competitive Advantage",
					instructions:
						"Describe what sets your company apart from competitors and your unique value proposition.",
					required: false,
					placeholder: "Describe your company's competitive advantages...",
					minHeight: 300,
					maxLength: 2000,
				}}
				value={value}
				onChange={handleChange}
			/>
		</Box>
	);
}

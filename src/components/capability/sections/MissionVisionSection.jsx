import React from "react";
import { Box, TextField, Typography } from "@mui/material";
import { RichTextQuestion } from "../../common/form/questionTypes/RichTextQuestion";

export function MissionVisionSection({ mission, vision, onMissionChange, onVisionChange }) {
	const handleMissionChange = (fieldId, content) => {
		// Since we're using RichTextQuestion, content will already be in the correct format
		onMissionChange(content);
	};
	const handleVisionChange = (fieldId, content) => {
		// Since we're using RichTextQuestion, content will already be in the correct format
		onVisionChange(content);
	};

	return (
		<Box>
			<Box sx={{ mb: 4 }}>
				<RichTextQuestion
					question={{
						id: "mission",
						title: "Mission Statement",
						instructions: "Define your company's purpose and primary objectives.",
						required: false,
						placeholder: "Describe your company's mission...",
						minHeight: 300,
						maxLength: 2000,
					}}
					value={mission}
					onChange={handleMissionChange}
				/>
			</Box>

			<Box>
				<RichTextQuestion
					question={{
						id: "vision",
						title: "Vision Statement",
						instructions: "Describe your company's aspirations and future goals.",
						required: false,
						placeholder: "Describe your company's vision...",
						minHeight: 300,
						maxLength: 2000,
					}}
					value={vision}
					onChange={handleVisionChange}
				/>
			</Box>
		</Box>
	);
}

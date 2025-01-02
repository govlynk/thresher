import React from "react";
import { Box, Typography, Rating, FormHelperText, IconButton } from "@mui/material";
import { Star, Info } from "lucide-react";

export function RatingQuestion({ question, value = {}, onChange }) {
	const handleRatingChange = (category, newValue) => {
		onChange(question.id, {
			...value,
			[category]: newValue,
		});
	};

	return (
		<Box sx={{ width: "100%" }}>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
				<Typography variant='h6'>
					{question.title}
					{question.required && <span style={{ color: "error.main" }}> *</span>}
				</Typography>
				<IconButton size='small' onClick={() => onInfoClick?.(question)}>
					<Info size={20} />
				</IconButton>
			</Box>

			<Typography variant='body1' sx={{ mb: 3, color: "text.secondary" }}>
				{question.question}
			</Typography>

			{question.categories.map((category) => (
				<Box key={category} sx={{ mb: 2 }}>
					<Typography variant='subtitle1' gutterBottom>
						{category}
					</Typography>
					<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
						<Rating
							value={value[category] || 0}
							onChange={(_, newValue) => handleRatingChange(category, newValue)}
							max={question.maxRating || 5}
							icon={<Star fill='currentColor' />}
							emptyIcon={<Star />}
							sx={{
								"& .MuiRating-icon": {
									color: "primary.main",
								},
							}}
						/>
						{value[category] && question.labels && (
							<Typography variant='body2' color='text.secondary'>
								{question.labels[value[category]]}
							</Typography>
						)}
					</Box>
				</Box>
			))}

			{question.helpText && <FormHelperText>{question.helpText}</FormHelperText>}
		</Box>
	);
}

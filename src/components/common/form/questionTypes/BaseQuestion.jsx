import React from "react";
import { Box, Typography, FormHelperText } from "@mui/material";

export function BaseQuestion({ title, question, required, error, children }) {
	return (
		<Box sx={{ mb: 3 }}>
			<Typography variant='h6' gutterBottom>
				{title}
				{required && <span style={{ color: "error.main" }}> *</span>}
			</Typography>

			{description && (
				<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
					{question}
				</Typography>
			)}

			{children}

			{error && <FormHelperText error>{error}</FormHelperText>}
		</Box>
	);
}

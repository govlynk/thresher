import React from "react";
import { Box, Typography, FormHelperText } from "@mui/material";

export function FormField({ question, error, children }) {
	return (
		<Box sx={{ mb: 2 }}>
			{question.title && (
				<Typography variant='h6' gutterBottom sx={{ display: "flex", alignItems: "center" }}>
					{question.title}
					{question.required && (
						<Typography component='span' color='error' sx={{ ml: 0.5 }}>
							*
						</Typography>
					)}
				</Typography>
			)}

			{question.instructions && (
				<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
					{question.instructions}
					{question.required && <span style={{ color: "error.main" }}> *</span>}
				</Typography>
			)}

			{children}

			{(error || question.helperText) && (
				<FormHelperText error={!!error}>{error || question.helperText}</FormHelperText>
			)}
		</Box>
	);
}

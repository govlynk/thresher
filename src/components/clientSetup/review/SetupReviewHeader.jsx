import React from "react";
import { Box, Typography } from "@mui/material";
import { ClipboardCheck } from "lucide-react";

export function SetupReviewHeader() {
	return (
		<Box sx={{ mb: 4 }}>
			<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
				<ClipboardCheck size={24} />
				<Box>
					<Typography variant='h5' gutterBottom>
						Setup Review
					</Typography>
					<Typography variant='body2' color='text.secondary'>
						Review and confirm your company setup details before finalizing
					</Typography>
				</Box>
			</Box>
		</Box>
	);
}

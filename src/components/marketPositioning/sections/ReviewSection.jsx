import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";

export function ReviewSection({ formData }) {
	return (
		<Box>
			<Typography variant='h6' gutterBottom>
				Review Strategic Positioining
			</Typography>

			<Paper sx={{ p: 3, mb: 3 }}>
				<Typography variant='h6' gutterBottom>
					About Us
				</Typography>
				<Typography paragraph>{formData.aboutUs}</Typography>
				<Divider sx={{ my: 2 }} />

				<Typography variant='h6' gutterBottom>
					Key Capabilities
				</Typography>
				<Box component='ul' sx={{ pl: 2 }}>
					{formData.keyCapabilities.map((capability, index) => (
						<Typography component='li' key={index} paragraph>
							{capability}
						</Typography>
					))}
				</Box>
				<Divider sx={{ my: 2 }} />

				<Typography variant='h6' gutterBottom>
					Competitive Advantage
				</Typography>
				<Typography paragraph>{formData.competitiveAdvantage}</Typography>
				<Divider sx={{ my: 2 }} />

				<Typography variant='h6' gutterBottom>
					Mission
				</Typography>
				<Typography paragraph>{formData.mission}</Typography>
				<Typography variant='h6' gutterBottom>
					Vision
				</Typography>
				<Typography paragraph>{formData.vision}</Typography>
				<Divider sx={{ my: 2 }} />
			</Paper>
		</Box>
	);
}

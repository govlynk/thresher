import React from "react";
import { Box, Typography, Paper, Divider } from "@mui/material";
import { RichTextEditor } from "../../common/form/RichTextEditor/RichTextEditor";

export function ReviewSection({ formData }) {
	return (
		<Box>
			<Typography variant='h6' gutterBottom>
				Review Strategic Positioning
			</Typography>

			<Paper sx={{ p: 3, mb: 3 }}>
				<Typography variant='h6' gutterBottom>
					About Us
				</Typography>
				<Box sx={{ mb: 3 }}>
					<RichTextEditor value={formData.aboutUs} readOnly minHeight={200} />
				</Box>
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
				<Box sx={{ mb: 3 }}>
					<RichTextEditor value={formData.competitiveAdvantage} readOnly minHeight={200} />
				</Box>
				<Divider sx={{ my: 2 }} />

				<Typography variant='h6' gutterBottom>
					Mission
				</Typography>
				<Box sx={{ mb: 3 }}>
					<RichTextEditor value={formData.mission} readOnly minHeight={200} />
				</Box>

				<Typography variant='h6' gutterBottom>
					Vision
				</Typography>
				<Box sx={{ mb: 3 }}>
					<RichTextEditor value={formData.vision} readOnly minHeight={200} />
				</Box>
			</Paper>
		</Box>
	);
}

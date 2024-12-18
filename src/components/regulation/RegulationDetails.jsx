import React from "react";
import { Paper, Typography, Box, Chip, Divider, List, ListItem, ListItemText, Alert } from "@mui/material";
import { AlertCircle, CheckCircle, XCircle } from "lucide-react";

export function RegulationDetails({ far }) {
	return (
		<Paper sx={{ p: 3 }}>
			<Typography variant='h5' gutterBottom>
				{far.provisionId}
			</Typography>

			<Divider sx={{ my: 2 }} />

			<List>
				{far.answers.map((answer, index) => (
					<ListItem
						key={answer.id}
						sx={{
							flexDirection: "column",
							alignItems: "flex-start",
							bgcolor: "background.default",
							borderRadius: 1,
							mb: 2,
							p: 2,
						}}
					>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
							{answer.answer.toLowerCase() === "yes" ? (
								<CheckCircle color='success' size={20} />
							) : (
								<XCircle color='error' size={20} />
							)}
							<Typography variant='subtitle1' color='text.secondary'>
								Response: {answer.answer}
							</Typography>
						</Box>

						<Typography variant='body1' sx={{ mb: 1 }}>
							{answer.question}
						</Typography>

						{answer.section && (
							<Chip label={`Section ${answer.section}`} size='small' color='primary' variant='outlined' />
						)}
					</ListItem>
				))}
			</List>

			<Box sx={{ mt: 3 }}>
				<Alert severity='info' icon={<AlertCircle />}>
					<Typography variant='subtitle2'>Guidance</Typography>
					<Typography variant='body2'>
						Review these certifications carefully. Ensure all responses accurately reflect your company's current
						status and capabilities. Contact your legal team or compliance officer if you need to update any
						responses.
					</Typography>
				</Alert>
			</Box>
		</Paper>
	);
}

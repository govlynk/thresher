import React from "react";
import {
	Paper,
	Typography,
	Box,
	Chip,
	Divider,
	List,
	ListItem,
	ListItemIcon,
	ListItemText,
	Alert,
	useTheme,
} from "@mui/material";
import { AlertCircle, CheckCircle2, XCircle, Info } from "lucide-react";

export function RegulationDetails({ regulation }) {
	const theme = useTheme();
	const provisionId = regulation.provisionId?.split(" ").slice(1).join(" ") || "";

	const getAnswerIcon = (answer) => {
		const answerText = answer.answerText?.toLowerCase();
		if (answerText === "yes") {
			return <CheckCircle2 color={theme.palette.success.main} />;
		}
		if (answerText === "no") {
			return <XCircle color={theme.palette.error.main} />;
		}
		return <AlertCircle color={theme.palette.warning.main} />;
	};

	return (
		<Paper sx={{ p: 3 }}>
			<Box sx={{ mb: 3 }}>
				<Typography variant='h5' gutterBottom>
					{regulation.provisionId}
				</Typography>
				<Chip label={regulation.type || "FAR"} color='primary' size='small' variant='outlined' />
			</Box>

			<Divider sx={{ my: 2 }} />

			<List>
				{regulation.listOfAnswers.map((answer, index) => (
					<ListItem
						key={index}
						sx={{
							flexDirection: "column",
							alignItems: "flex-start",
							bgcolor: theme.palette.background.default,
							borderRadius: 1,
							mb: 2,
							p: 2,
						}}
					>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1, width: "100%", mb: 1 }}>
							<ListItemIcon sx={{ minWidth: "auto" }}>{getAnswerIcon(answer)}</ListItemIcon>
							<Typography variant='subtitle1' color='text.secondary'>
								Response: {answer.answerText}
							</Typography>
						</Box>

						<Typography variant='body1' sx={{ mb: 1 }}>
							{answer.questionText}
						</Typography>

						{answer.section && (
							<Chip
								label={`Section ${answer.section}`}
								size='small'
								color='primary'
								variant='outlined'
								component='a'
								href={`https://www.acquisition.gov/far/${provisionId}`}
								target='_blank'
								rel='noopener noreferrer'
								clickable
								sx={{
									textDecoration: "none",
									"&:hover": {
										textDecoration: "none",
									},
								}}
							/>
						)}
					</ListItem>
				))}
			</List>

			<Box sx={{ mt: 3 }}>
				<Alert
					severity='info'
					icon={<Info />}
					sx={{
						"& .MuiAlert-icon": {
							alignItems: "center",
						},
					}}
				>
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

import React, { useState } from "react";
import { Box, Button, TextField, Typography, Alert, Card, Divider, Chip, Stack, useTheme } from "@mui/material";
import { ArrowLeft, ArrowRight, Users } from "lucide-react";

export function TeamSetupScreen({ onSubmit, onBack, setupData }) {
	const theme = useTheme();
	const [formData, setFormData] = useState({
		name: `${setupData.company.legalBusinessName} Team`,
		description: `Default team for ${setupData.company.legalBusinessName}`,
	});
	const [error, setError] = useState(null);

	const handleSubmit = () => {
		if (!formData.name.trim()) {
			setError("Team name is required");
			return;
		}
		console.log("****Team setup data:", formData);
		// Pass the complete setup data along with the new team data
		onSubmit(formData);
	};

	return (
		<Box>
			<Typography variant='h6' sx={{ mb: 3 }}>
				Team Setup
			</Typography>

			<Card sx={{ p: 3, mb: 3 }}>
				<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
					<Users size={24} />
					<Typography variant='h6'>Default Team Configuration</Typography>
				</Box>

				<Typography variant='body2' color='text.secondary' sx={{ mb: 3 }}>
					Create a default team for your organization. This team will include you as the initial team member with
					your assigned role.
				</Typography>

				{error && (
					<Alert severity='error' sx={{ mb: 3 }}>
						{error}
					</Alert>
				)}

				<Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
					<TextField
						fullWidth
						label='Team Name'
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						required
						error={!!error && !formData.name.trim()}
						helperText={error && !formData.name.trim() ? "Team name is required" : ""}
					/>

					<TextField
						fullWidth
						label='Description'
						value={formData.description}
						onChange={(e) => setFormData({ ...formData, description: e.target.value })}
						multiline
						rows={3}
					/>
				</Box>

				<Divider sx={{ my: 3 }} />

				<Box>
					<Typography variant='subtitle2' gutterBottom>
						Initial Team Member
					</Typography>
					<Card variant='outlined' sx={{ p: 2, bgcolor: theme.palette.grey[50] }}>
						<Stack spacing={2}>
							<Box>
								<Typography variant='caption' display='block' color='text.secondary' gutterBottom>
									Name
								</Typography>
								<Typography>
									{setupData.user.firstName} {setupData.user.lastName}
								</Typography>
							</Box>
							<Box>
								<Typography variant='caption' display='block' color='text.secondary' gutterBottom>
									Email
								</Typography>
								<Typography>{setupData.user.contactEmail}</Typography>
							</Box>
							<Box>
								<Typography variant='caption' display='block' color='text.secondary' gutterBottom>
									Role
								</Typography>
								<Box sx={{ mt: 0.5 }}>
									<Chip label={setupData.user.roleId} size='small' color='primary' />
								</Box>
							</Box>
						</Stack>
					</Card>
				</Box>
			</Card>

			<Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
				<Button onClick={onBack} startIcon={<ArrowLeft />}>
					Back
				</Button>
				<Button variant='contained' onClick={handleSubmit} endIcon={<ArrowRight />}>
					Continue
				</Button>
			</Box>
		</Box>
	);
}

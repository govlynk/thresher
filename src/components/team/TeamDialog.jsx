import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	Box,
	Alert,
	CircularProgress,
} from "@mui/material";
import { useTeamStore } from "../../stores/teamStore";
import { useUserCompanyStore } from "../../stores/userCompanyStore";
import { useSprintStore } from "../../stores/sprintStore";
import { useGlobalStore } from "../../stores/globalStore";

export function TeamDialog({ open, onClose, team }) {
	const { activeCompanyId } = useGlobalStore();
	const { addTeam, updateTeam } = useTeamStore();
	const { generateSprints } = useSprintStore();
	const { getActiveCompany } = useUserCompanyStore();
	const [loading, setLoading] = useState(false);
	const [formData, setFormData] = useState({
		name: "",
		description: "",
	});
	const [error, setError] = useState(null);

	useEffect(() => {
		if (team) {
			setFormData({
				name: team.name || "",
				description: team.description || "",
			});
		} else {
			setFormData({
				name: "",
				description: "",
			});
		}
	}, [team]);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setError(null);
		setLoading(true);

		try {
			if (!formData.name.trim()) {
				throw new Error("Team name is required");
			}

			const activeCompany = getActiveCompany();
			if (!activeCompanyId) {
				throw new Error("No active company selected");
			}

			const teamData = {
				...formData,
				companyId: activeCompanyId,
			};

			if (team) {
				const updatedTeam = await updateTeam(team.id, teamData);
				return updatedTeam;
			} else {
				// Create new team and generate sprints
				const newTeam = await addTeam(teamData);

				// Generate sprints for the new team
				try {
					await generateSprints(newTeam.id);
				} catch (err) {
					console.error("Error generating sprints:", err);
					// Don't throw error here - team was still created successfully
				}

				return newTeam;
			}
			onClose();
		} catch (err) {
			console.error("Error saving team:", err);
			setError(err.message || "Failed to save team");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
			<form onSubmit={handleSubmit}>
				<DialogTitle>{team ? "Edit Team" : "Create New Team"}</DialogTitle>
				<DialogContent>
					<Box sx={{ mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
						{error && (
							<Alert severity='error' sx={{ mb: 2 }}>
								{error}
							</Alert>
						)}
						<TextField
							label='Team Name'
							value={formData.name}
							onChange={(e) => setFormData({ ...formData, name: e.target.value })}
							required
							disabled={loading}
							error={!!error && !formData.name.trim()}
							helperText={error && !formData.name.trim() ? "Team name is required" : ""}
						/>
						<TextField
							label='Description'
							value={formData.description}
							onChange={(e) => setFormData({ ...formData, description: e.target.value })}
							multiline
							rows={3}
							disabled={loading}
						/>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose} disabled={loading}>
						Cancel
					</Button>
					<Button type='submit' variant='contained' disabled={loading}>
						{loading ? (
							<>
								<CircularProgress size={20} sx={{ mr: 1 }} />
								Saving...
							</>
						) : team ? (
							"Save Changes"
						) : (
							"Create Team"
						)}
					</Button>
				</DialogActions>
			</form>
		</Dialog>
	);
}

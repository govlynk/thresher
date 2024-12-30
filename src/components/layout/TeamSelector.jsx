import React, { useEffect } from "react";
import { FormControl, Select, MenuItem, Box, CircularProgress, Alert } from "@mui/material";
import { Users } from "lucide-react";
import { useTeamStore } from "../../stores/teamStore";
import { useGlobalStore } from "../../stores/globalStore";

export function TeamSelector() {
	const { teams, loading, error, fetchTeams } = useTeamStore();
	const { activeCompanyId, activeTeamId, setActiveTeam } = useGlobalStore();

	// Fetch teams when company changes
	useEffect(() => {
		if (activeCompanyId) {
			fetchTeams(activeCompanyId);
		}
	}, [activeCompanyId, fetchTeams]);

	// Set first team as default when teams load and no team is selected
	useEffect(() => {
		if (teams.length > 0 && !activeTeamId) {
			setActiveTeam(teams[0].id);
		}
	}, [teams, activeTeamId, setActiveTeam]);

	if (loading) {
		return (
			<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
				<CircularProgress size={20} />
			</Box>
		);
	}

	if (error) {
		return (
			<Alert severity='error' sx={{ maxWidth: 300 }}>
				{error}
			</Alert>
		);
	}

	if (!teams?.length) {
		return null;
	}

	const handleTeamChange = (event) => {
		const newTeamId = event.target.value;
		setActiveTeam(newTeamId);
	};

	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
			<Users size={20} />
			<FormControl size='small' sx={{ minWidth: 200 }}>
				<Select
					value={activeTeamId || ""}
					onChange={handleTeamChange}
					displayEmpty
					sx={{
						bgcolor: "background.paper",
						"& .MuiSelect-select": {
							py: 1,
						},
					}}
				>
					{teams.map((team) => (
						<MenuItem key={team.id} value={team.id}>
							{team.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
}

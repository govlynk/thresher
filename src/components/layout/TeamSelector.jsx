import React from "react";
import { FormControl, Select, MenuItem, Box, CircularProgress } from "@mui/material";
import { Users } from "lucide-react";
import { useTeamStore } from "../../stores/teamStore";
import { useGlobalStore } from "../../stores/globalStore";

export function TeamSelector() {
	const { teams, loading, fetchTeams } = useTeamStore();
	const { activeCompanyId, activeTeamId, setActiveTeam } = useGlobalStore();

	React.useEffect(() => {
		if (activeCompanyId) {
			fetchTeams(activeCompanyId);
		}
	}, [activeCompanyId, fetchTeams]);

	// Set first team as default when teams load and no team is selected
	React.useEffect(() => {
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

	if (!teams?.length) {
		return null;
	}

	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
			<Users size={20} />
			<FormControl size='small' sx={{ minWidth: 200 }}>
				<Select
					value={activeTeamId || ""}
					onChange={(e) => setActiveTeam(e.target.value)}
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

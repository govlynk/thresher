import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { TeamList } from "../components/team/TeamList";
import { useTeamStore } from "../stores/teamStore";
import { useGlobalStore } from "../stores/globalStore";

export default function TeamScreen() {
	const { fetchTeams } = useTeamStore();
	const { activeCompanyId } = useGlobalStore.getState();

	useEffect(() => {
		if (activeCompanyId) {
			fetchTeams(activeCompanyId);
		}
	}, [activeCompanyId, fetchTeams]);

	return (
		<Box sx={{ p: 3 }}>
			<TeamList />
		</Box>
	);
}

import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { TeamList } from "../components/team/TeamList";
import { useTeamStore } from "../stores/teamStore";
import { useGlobalStore } from "../stores/globalStore";

const TeamScreen = () => {
	const { fetchTeams } = useTeamStore();
	const { activeCompanyId } = useGlobalStore();

	useEffect(() => {
		if (activeCompanyId) {
			fetchTeams(activeCompanyId);
		}
	}, [activeCompanyId, fetchTeams]);

	return (
		<Box
			sx={{
				p: 3,
				height: "calc(100vh - 64px)", // Subtract header height
				width: "100%",
				maxWidth: "100%",
				overflow: "hidden",
			}}
		>
			<TeamList />
		</Box>
	);
};

export default TeamScreen;

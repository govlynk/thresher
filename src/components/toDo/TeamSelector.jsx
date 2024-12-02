import React from "react";
import { FormControl, Select, MenuItem, Box, Typography } from "@mui/material";
import { Users } from "lucide-react";

export function TeamSelector({ teams, selectedTeamId, onTeamChange }) {
	if (!teams || teams.length <= 1) return null;

	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
			<Users size={20} />
			<FormControl size='small' sx={{ minWidth: 200 }}>
				<Select value={selectedTeamId || "all"} onChange={(e) => onTeamChange(e.target.value)} displayEmpty>
					<MenuItem value='all'>--All Teams--</MenuItem>
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

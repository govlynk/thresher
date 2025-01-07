import React from "react";
import { FormControl, Select, MenuItem, Box, CircularProgress, Alert } from "@mui/material";
import { Users } from "lucide-react";
import { useTeamStore } from "../../stores/teamStore";
import { useGlobalStore } from "../../stores/globalStore";

export function TeamSelector() {
	const { teams, loading, error } = useTeamStore();
	const { activeTeamId, setActiveTeam } = useGlobalStore();

	const handleTeamChange = (event) => {
		setActiveTeam(event.target.value);
	};

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

	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
			<Users size={20} />
			<FormControl size='small' sx={{ minWidth: 200 }}>
				<Select
					value={activeTeamId || ""}
					onChange={handleTeamChange}
					displayEmpty
					MenuProps={{
						PaperProps: {
							sx: {
								bgcolor: "grey.900",
								borderRadius: 1,
								boxShadow: (theme) => theme.shadows[4],
								"& .MuiMenuItem-root": {
									color: "common.white",
									"&:hover": {
										bgcolor: "grey.800",
									},
									"&.Mui-selected": {
										bgcolor: "grey.800",
										"&:hover": {
											bgcolor: "grey.700",
										},
									},
								},
							},
						},
					}}
					sx={{
						color: "common.white",
						".MuiOutlinedInput-notchedOutline": {
							borderColor: "grey.700",
						},
						"&:hover .MuiOutlinedInput-notchedOutline": {
							borderColor: "grey.600",
						},
						"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
							borderColor: "primary.main",
						},
						".MuiSvgIcon-root": {
							color: "common.white",
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

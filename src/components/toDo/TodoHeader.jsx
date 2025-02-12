import React, { useEffect } from "react";
import { AppBar, Toolbar, Typography, Button, IconButton, Box, Chip, useTheme, Tooltip } from "@mui/material";
import { Plus, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { useGlobalStore } from "../../stores/globalStore";
import { useSprintStore } from "../../stores/sprintStore";
import { useTeamStore } from "../../stores/teamStore";

export function TodoHeader({ onAddClick, onSprintClick, onClose }) {
	const theme = useTheme();
	const { sprints, activeSprint, setActiveSprint, generateSprints } = useSprintStore();
	const { activeTeamId } = useGlobalStore();
	const { teams } = useTeamStore();
	const currentTeam = teams.find((team) => team.id === activeTeamId);
	const currentSprintIndex = activeSprint ? sprints.findIndex((s) => s.id === activeSprint.id) : -1;

	useEffect(() => {
		const initializeSprints = async () => {
			if (!activeTeamId) {
				return;
			}

			if (!sprints || sprints.length === 0) {
				try {
					await generateSprints(activeTeamId);
				} catch (err) {
					console.error("Error generating sprints:", err);
				}
			}
		};

		initializeSprints();
	}, [activeTeamId]);

	const getDaysRemaining = () => {
		if (!activeSprint) return 0;
		const endDate = new Date(activeSprint.endDate);
		const today = new Date();
		return Math.max(0, differenceInDays(endDate, today));
	};

	const handlePreviousSprint = () => {
		if (currentSprintIndex > 0 && sprints.length > 0) {
			setActiveSprint(sprints[currentSprintIndex - 1].id);
		}
	};

	const handleNextSprint = () => {
		if (currentSprintIndex < sprints.length - 1 && sprints.length > 0) {
			setActiveSprint(sprints[currentSprintIndex + 1].id);
		}
	};

	const handleSprintClick = () => {
		if (activeSprint) {
			onSprintClick?.();
			onClose?.();
		}
	};

	return (
		<AppBar
			position='static'
			elevation={0}
			sx={{
				bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.50",
				borderBottom: 1,
				borderColor: "divider",
				color: "text.primary",
				transition: "all 0.3s ease",
			}}
		>
			<Toolbar sx={{ gap: 2, flexWrap: "wrap" }}>
				<Typography variant='h6' sx={{ flexGrow: { xs: 1, sm: 0 } }}>
					Tasks
				</Typography>

				<Box
					sx={{
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						gap: 1,
						flex: 1,
						order: { xs: 3, sm: 2 },
						my: { xs: 1, sm: 0 },
						mx: "auto",
						maxWidth: 400,
					}}
				>
					<Tooltip title={currentSprintIndex <= 0 ? "No earlier sprints" : "Previous Sprint"}>
						<span>
							<IconButton
								onClick={handlePreviousSprint}
								disabled={!activeSprint || currentSprintIndex <= 0}
								size='small'
							>
								<ChevronLeft />
							</IconButton>
						</span>
					</Tooltip>

					<Box
						onClick={handleSprintClick}
						sx={{
							flex: 1,
							minWidth: 200,
							cursor: !activeTeamId ? "not-allowed" : activeSprint ? "pointer" : "default",
							textAlign: "center",
							"&:hover": {
								"& .MuiTypography-root": {
									color: activeSprint ? "primary.main" : "inherit",
								},
							},
							px: 2,
						}}
					>
						<Typography variant='subtitle1' sx={{ transition: "color 0.2s ease" }}>
							{!activeTeamId
								? "Select a team to view sprints"
								: !currentTeam
								? "Team not found"
								: activeSprint?.name || "No active sprint"}
						</Typography>
						{activeSprint && (
							<Box
								sx={{
									display: "flex",
									alignItems: "center",
									justifyContent: "space-between",
									width: "100%",
								}}
							>
								<Chip
									size='small'
									label={activeSprint.status}
									sx={{
										minWidth: 80,
										textTransform: "capitalize",
										bgcolor:
											activeSprint.status === "active"
												? "success.main"
												: activeSprint.status === "completed"
												? "default"
												: "warning.main",
										color: "white",
									}}
									color={
										activeSprint.status === "active"
											? "success"
											: activeSprint.status === "completed"
											? "default"
											: "warning"
									}
								/>
								{activeSprint.status !== "completed" && (
									<Box
										sx={{
											display: "flex",
											alignItems: "center",
											gap: 0.5,
											ml: "auto",
										}}
									>
										<Calendar size={14} />
										<Typography variant='caption' sx={{ fontWeight: 500 }}>
											{getDaysRemaining()} days left
										</Typography>
									</Box>
								)}
							</Box>
						)}
					</Box>

					<Tooltip title={currentSprintIndex >= sprints.length - 1 ? "No later sprints" : "Next Sprint"}>
						<span>
							<IconButton
								onClick={handleNextSprint}
								disabled={!activeSprint || currentSprintIndex >= sprints.length - 1}
								size='small'
							>
								<ChevronRight />
							</IconButton>
						</span>
					</Tooltip>
				</Box>

				<Button
					variant='contained'
					size='small'
					startIcon={<Plus size={16} />}
					onClick={onAddClick}
					sx={{
						order: { xs: 2, sm: 3 },
						px: 2,
						minWidth: 120,
						bgcolor: theme.palette.mode === "dark" ? "primary.dark" : "primary.main",
						"&:hover": {
							bgcolor: theme.palette.mode === "dark" ? "primary.main" : "primary.dark",
						},
					}}
					disabled={!activeTeamId}
				>
					Add Task
				</Button>
			</Toolbar>
		</AppBar>
	);
}

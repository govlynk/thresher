import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Alert, Container, Tabs, Tab, useTheme } from "@mui/material";
import { Plus, Repeat2 } from "lucide-react";
import { useSprintStore } from "../stores/sprintStore";
import { useTodoStore } from "../stores/todoStore";
import { useTeamStore } from "../stores/teamStore";
import { useGlobalStore } from "../stores/globalStore";
import { SprintDialog } from "../components/sprint/SprintDialog";
import { SprintBoard } from "../components/sprint/SprintBoard";

export default function SprintScreen() {
	const theme = useTheme();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editSprint, setEditSprint] = useState(null);
	const [activeTab, setActiveTab] = useState(0);
	const { sprints, loading, error, fetchSprints, createSprint, updateSprint, moveTaskBetweenSprints } =
		useSprintStore();
	const { todos, updateTodo } = useTodoStore();
	const { activeCompanyId, activeTeamId } = useGlobalStore();

	// Fetch sprints when team changes or component mounts
	useEffect(() => {
		if (activeTeamId) {
			fetchSprints(activeTeamId);
			return () => {
				// Cleanup subscription when component unmounts
				useSprintStore.getState().cleanup();
			};
		}
	}, [activeTeamId, fetchSprints]);

	const handleCreateSprint = async (sprintData) => {
		try {
			const newSprint = await createSprint({
				...sprintData,
				teamId: activeTeamId,
			});
			// Refresh sprints list after creating new sprint
			await fetchSprints(activeTeamId);
			return newSprint;
		} catch (err) {
			console.error("Error creating sprint:", err);
			throw err;
		}
	};

	const handleEditSprint = (sprint) => {
		setEditSprint(sprint);
		setDialogOpen(true);
	};

	const handleUpdateSprint = async (sprintData) => {
		try {
			const updatedSprint = await updateSprint(sprintData.id, sprintData);
			// Refresh sprints list after updating sprint
			await fetchSprints(activeTeamId);
			return updatedSprint;
		} catch (err) {
			console.error("Error updating sprint:", err);
			throw err;
		}
	};

	const handleTaskMove = async (taskId, newStatus, sprintId) => {
		try {
			const updatedTodo = await updateTodo(taskId, { status: newStatus });
			if (sprintId) {
				await moveTaskBetweenSprints(taskId, null, sprintId);
			}
			return updatedTodo;
		} catch (err) {
			console.error("Error moving task:", err);
			throw err;
		}
	};

	// Filter and sort sprints by status and date
	const activeSprints = sprints
		.filter((sprint) => sprint.status === "ACTIVE")
		.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

	const planningSprints = sprints
		.filter((sprint) => sprint.status === "PLANNING")
		.sort((a, b) => new Date(b.startDate) - new Date(a.startDate));

	const completedSprints = sprints
		.filter((sprint) => sprint.status === "COMPLETED")
		.sort((a, b) => new Date(b.endDate) - new Date(a.endDate));

	if (!activeTeamId) {
		return (
			<Container maxWidth={false}>
				<Box sx={{ p: 4 }}>
					<Alert severity='warning'>Please select a team to manage sprints</Alert>
				</Box>
			</Container>
		);
	}

	return (
		<Container maxWidth={false} sx={{ p: 4 }}>
			{/* Header */}
			<Box
				sx={{
					display: "flex",
					justifyContent: "space-between",
					alignItems: "center",
					mb: 4,
				}}
			>
				<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
					<Repeat2 size={28} color={theme.palette.primary.main} />
					<Typography variant='h4' fontWeight='bold'>
						Sprints
					</Typography>
				</Box>
				<Button
					variant='contained'
					startIcon={<Plus />}
					onClick={() => {
						setEditSprint(null);
						setDialogOpen(true);
					}}
					sx={{
						borderRadius: "24px",
						px: 3,
					}}
				>
					New Sprint
				</Button>
			</Box>

			{error && (
				<Alert severity='error' sx={{ mb: 3 }}>
					{error}
				</Alert>
			)}

			{/* Tabs */}
			<Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
				<Tab label={`Active Sprints (${activeSprints.length})`} />
				<Tab label={`Planning (${planningSprints.length})`} />
				<Tab label={`Completed Sprints (${completedSprints.length})`} />
			</Tabs>

			{/* Sprint Boards */}
			<Box>
				{activeTab === 0 ? (
					activeSprints.map((sprint) => (
						<SprintBoard
							key={sprint.id}
							sprint={sprint}
							tasks={todos.filter((todo) => todo.sprintId === sprint.id)}
							onEditSprint={handleEditSprint}
							onTaskMove={handleTaskMove}
						/>
					))
				) : activeTab === 1 ? (
					planningSprints.map((sprint) => (
						<SprintBoard
							key={sprint.id}
							sprint={sprint}
							tasks={todos.filter((todo) => todo.sprintId === sprint.id)}
							onEditSprint={handleEditSprint}
							onTaskMove={handleTaskMove}
						/>
					))
				) : (
					completedSprints.map((sprint) => (
							<SprintBoard
								key={sprint.id}
								sprint={sprint}
								tasks={todos.filter((todo) => todo.sprintId === sprint.id)}
								onEditSprint={handleEditSprint}
								onTaskMove={handleTaskMove}
							/>
					))
				)}
			</Box>

			{/* Sprint Dialog */}
			<SprintDialog
				open={dialogOpen}
				onClose={() => {
					setDialogOpen(false);
					setEditSprint(null);
				}}
				onSave={editSprint ? handleUpdateSprint : handleCreateSprint}
				editSprint={editSprint}
			/>
		</Container>
	);
}

import { useState, useEffect, memo } from "react";
import { Box, Container, Alert, useTheme } from "@mui/material";
import { TodoHeader } from "../components/toDo/TodoHeader";
import { TodoDialog } from "../components/toDo/TodoDialog";
import { SprintModal } from "../components/toDo/SprintModal";
import { KanbanBoard } from "../components/toDo/KanbanBoard";
import { useGlobalStore } from "../stores/globalStore";
import { useTodoStore } from "../stores/todoStore";
import { useSprintStore } from "../stores/sprintStore";

function ToDoScreen() {
	const theme = useTheme();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [sprintModalOpen, setSprintModalOpen] = useState(false);
	const [selectedTodo, setSelectedTodo] = useState(null);
	const { activeCompanyId, activeTeamId } = useGlobalStore();
	const { fetchTodos } = useTodoStore();
	const { sprints, activeSprint, fetchSprints, generateSprints } = useSprintStore();

	useEffect(() => {
		const initializeData = async () => {
			// Only proceed if we have both company and team IDs
			if (!activeCompanyId) {
				return;
			}

			try {
				// Fetch sprints only if we have a specific team selected
				if (activeTeamId) {
					// First try to fetch existing sprints
					await fetchSprints(activeTeamId);

					// If no sprints exist, generate them
					const { sprints } = useSprintStore.getState();
					if (!sprints || sprints.length === 0) {
						console.log("No sprints found, generating new sprints...");
						await generateSprints(activeTeamId);
					}
				}

				// Always fetch todos as they can be filtered by team
				await fetchTodos();
			} catch (err) {
				console.error("Error initializing data:", err);
			}
		};

		initializeData();
	}, [activeCompanyId, activeTeamId, fetchSprints, fetchTodos]);

	// Handle team changes
	useEffect(() => {
		if (activeTeamId) {
			const fetchTeamSprints = async () => {
				try {
					await fetchSprints(activeTeamId);
				} catch (err) {
					console.error("Error fetching sprints for team:", err);
				}
			};

			fetchTeamSprints();
		}
	}, [activeTeamId, fetchSprints]);

	const handleAddClick = () => {
		setSelectedTodo(null);
		setDialogOpen(true);
	};

	const handleEditClick = (todo) => {
		setSelectedTodo(todo);
		setDialogOpen(true);
	};

	const handleSprintClick = () => {
		if (activeSprint) {
			setSprintModalOpen(true);
		}
	};

	if (!activeCompanyId) {
		return (
			<Container maxWidth={false}>
				<Box sx={{ p: 4 }}>
					<Alert severity='warning'>Please select a company to manage tasks</Alert>
				</Box>
			</Container>
		);
	}

	return (
		<Container
			maxWidth={false}
			disableGutters
			sx={{
				minHeight: "100vh",
				display: "flex",
				flexDirection: "column",
				bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.50",
				transition: "background-color 0.3s ease",
			}}
		>
			<TodoHeader
				onAddClick={handleAddClick}
				onSprintClick={handleSprintClick}
				onClose={() => setSprintModalOpen(false)}
			/>

			<Box
				sx={{
					flex: 1,
					p: { xs: 1, sm: 2, md: 3 },
					overflowX: "auto",
					overflowY: "hidden",
				}}
			>
				<KanbanBoard onEditTodo={handleEditClick} />
			</Box>

			<TodoDialog open={dialogOpen} onClose={() => setDialogOpen(false)} todo={selectedTodo} />

			{sprintModalOpen && activeSprint && (
				<SprintModal
					sprint={activeSprint}
					onClose={() => {
						setSprintModalOpen(false);
						fetchTodos(); // Refresh todos after sprint update
					}}
				/>
			)}
		</Container>
	);
}

export default memo(ToDoScreen);

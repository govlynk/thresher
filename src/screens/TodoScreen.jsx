import { useState, useEffect, memo, Suspense } from "react";
import { Box, Container, Alert, useTheme } from "@mui/material";
import { TodoHeader } from "../components/toDo/TodoHeader";
import { TodoDialog } from "../components/toDo/TodoDialog";
import { SprintModal } from "../components/toDo/SprintModal";
import { KanbanBoard } from "../components/toDo/KanbanBoard";
import { CircularProgress } from "@mui/material";
import { useGlobalStore } from "../stores/globalStore";
import { useTodoStore } from "../stores/todoStore";
import { useSprintStore } from "../stores/sprintStore";

function ToDoScreen() {
	const theme = useTheme();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [sprintModalOpen, setSprintModalOpen] = useState(false);
	const [selectedTodo, setSelectedTodo] = useState(null);
	const [isInitialized, setIsInitialized] = useState(false);
	const { activeCompanyId, activeTeamId } = useGlobalStore();
	const { fetchTodos } = useTodoStore();
	const { fetchSprints, activeSprint, error: sprintsError } = useSprintStore();

	// Single effect for initialization
	useEffect(() => {
		let mounted = true;
		let intervalId = null;

		const initializeData = async () => {
			if (!activeCompanyId || !activeTeamId) {
				setIsInitialized(false);
				return;
			}

			try {
				await Promise.all([fetchSprints(activeTeamId), fetchTodos()]);

				if (mounted) {
					setIsInitialized(true);
				}
			} catch (err) {
				console.error("Error initializing data:", err);
				if (mounted) {
					setIsInitialized(false);
				}
			}
		};

		// Initial load
		initializeData();

		// Set up sprint status check interval
		intervalId = setInterval(() => {
			if (activeTeamId) {
				fetchSprints(activeTeamId).catch((err) => console.error("Error checking sprint status:", err));
			}
		}, 60 * 60 * 1000); // Check every hour

		// Cleanup function
		return () => {
			mounted = false;
			if (intervalId) {
				clearInterval(intervalId);
			}
		};
	}, [activeCompanyId, activeTeamId]); // Only re-run if company or team changes

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

	if (!isInitialized) {
		return (
			<Container maxWidth={false}>
				<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "50vh" }}>
					<CircularProgress />
				</Box>
			</Container>
		);
	}

	if (sprintsError) {
		return (
			<Container maxWidth={false}>
				<Box sx={{ p: 4 }}>
					<Alert severity='error'>{sprintsError}. Please try refreshing the page.</Alert>
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

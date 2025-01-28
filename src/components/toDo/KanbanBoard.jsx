import { useEffect, useState, useCallback, useMemo } from "react";
import {
	DndContext,
	DragOverlay,
	closestCenter,
	defaultDropAnimationSideEffects,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { TodoCard } from "./TodoCard";
import { TodoDialog } from "./TodoDialog";
import { Box, CircularProgress } from "@mui/material";
import { useTodoStore } from "../../stores/todoStore";
import { useTeamStore } from "../../stores/teamStore";
import { useGlobalStore } from "../../stores/globalStore";
import { useSprintStore } from "../../stores/sprintStore";

const columns = ["TODO", "DOING", "DONE"];

const COLUMNS = {
	TODO: "To Do",
	DOING: "In Progress",
	DONE: "Done",
};

export function KanbanBoard({ onEditTodo, title }) {
	const { teams } = useTeamStore();
	const { activeTeamId } = useGlobalStore();
	const [editTodo, setEditTodo] = useState(null);
	const { todos, moveTodo, removeTodo, columnLimits, activeId, setActiveId, loading, error, cleanup, fetchTodos } =
		useTodoStore();
	const { activeSprint } = useSprintStore();

	// Filter todos and enrich with assignee data
	const sprintTodos = useMemo(() => {
		const filteredTodos = activeSprint ? todos.filter((todo) => todo.sprintId === activeSprint.id) : todos;

		return filteredTodos.map((todo) => {
			const team = teams.find((t) => t.id === todo.teamId);
			const member = team?.members?.find((m) => m.contact?.id === todo.assigneeId);
			return {
				...todo,
				assignee: member?.contact || null,
			};
		});
	}, [todos, activeSprint, teams]);

	const activeTodo = activeId ? sprintTodos.find((todo) => todo.id === activeId) : null;

	const handleEditTodo = useCallback((todo) => {
		setEditTodo(todo);
	}, []);

	useEffect(() => {
		// Initialize todos
		fetchTodos();

		return () => {
			cleanup();
		};
	}, [cleanup, fetchTodos]);

	useEffect(() => {
		const handleTeamChange = () => {
			fetchTodos();
		};

		window.addEventListener("teamChanged", handleTeamChange);
		return () => window.removeEventListener("teamChanged", handleTeamChange);
	}, [activeTeamId, fetchTodos]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragStart = (event) => {
		setActiveId(event.active.id);
		document.body.style.cursor = "grabbing";
	};

	const handleDragEnd = (event) => {
		const { active, over } = event;
		document.body.style.cursor = "";
		setActiveId(null);

		if (!over || !active || !over.id) {
			return;
		}

		const activeContainer = active.data?.current?.status;
		const overContainer =
			over.data?.current?.type === "column" ? over.data.current.status : over.data?.current?.status;

		if (!activeContainer || !overContainer) {
			return;
		}

		const activeItems = sprintTodos.filter((t) => t.status === activeContainer);
		const overItems = sprintTodos.filter((t) => t.status === overContainer);

		const activeIndex = activeItems.findIndex((t) => t.id === active.id);
		const overIndex =
			over.data?.current?.type === "column" ? overItems.length : overItems.findIndex((t) => t.id === over.id);

		if (activeContainer === overContainer) {
			// Same container - just reorder
			if (activeIndex !== overIndex) {
				const newItems = [...activeItems];
				const [movedItem] = newItems.splice(activeIndex, 1);
				newItems.splice(overIndex, 0, movedItem);

				// Update positions for all affected items
				newItems.forEach((item, index) => {
					moveTodo(item.id, item.status, index);
				});
			}
		} else {
			// Different container - update status and position
			if (overItems.length >= columnLimits[overContainer]) {
				return;
			}

			const newPosition = over.data?.current?.type === "column" ? overItems.length : overIndex;

			moveTodo(active.id, overContainer, newPosition);
		}
	};

	const handleDragCancel = () => {
		setActiveId(null);
		document.body.style.cursor = "";
	};

	const todosByStatus = Object.keys(COLUMNS).reduce((acc, status) => {
		// Ensure todos are unique per status and properly sorted
		const statusTodos = sprintTodos.filter((todo) => todo?.status?.toUpperCase() === status);
		acc[status] =
			Array.from(new Set(statusTodos.map((t) => t.id)))
				.map((id) => statusTodos.find((t) => t.id === id))
				.sort((a, b) => a.position - b.position) || [];
		return acc;
	}, {});

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 400 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return <Box sx={{ textAlign: "center", color: "error.main", py: 4 }}>Error: {error}</Box>;
	}

	return (
		<Box sx={{ display: "flex", gap: 3, height: "100%", overflow: "hidden" }}>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragStart={handleDragStart}
				onDragEnd={handleDragEnd}
				onDragCancel={handleDragCancel}
			>
				<Box sx={{ flex: 1, display: "flex", gap: 3 }}>
					{Object.keys(COLUMNS).map((status) => (
						<KanbanColumn
							key={status}
							id={status}
							status={status}
							title={COLUMNS[status]}
							todos={todosByStatus[status] || []}
							onEditTodo={handleEditTodo}
							activeId={activeId}
							onDeleteTodo={removeTodo}
							teams={teams}
						/>
					))}
				</Box>

				<DragOverlay
					dropAnimation={{
						duration: 300,
						easing: "cubic-bezier(0.2, 0, 0, 1)",
						sideEffects: defaultDropAnimationSideEffects({
							styles: {
								active: {
									opacity: "0.4",
								},
							},
						}),
					}}
				>
					{activeTodo && <TodoCard todo={activeTodo} isDragging onEdit={handleEditTodo} onDelete={removeTodo} />}
				</DragOverlay>
				{editTodo && <TodoDialog open={true} onClose={() => setEditTodo(null)} todo={editTodo} />}
			</DndContext>
		</Box>
	);
}

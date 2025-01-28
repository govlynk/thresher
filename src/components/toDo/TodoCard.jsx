import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Chip, IconButton, Paper, Typography } from "@mui/material";
import { GripVertical, Clock, Timer, Edit, User, Trash2 } from "lucide-react";
import { memo } from "react";
import { PRIORITY_CONFIG, TAG_COLORS } from "../../config/taskConfig";
import { useKanbanStore } from "../../stores/kanbanStore";

const TodoCard = memo(function TodoCard({ todo, isDragging, onEdit, onDelete, index, status }) {
	const activeId = useKanbanStore((state) => state.activeId);
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging: isCurrentlyDragging,
		over,
	} = useSortable({
		id: todo.id,
		data: {
			type: "task",
			todo,
			status,
			index,
		},
	});

	// Hide the original card if it's being dragged
	if (isCurrentlyDragging && todo.id === activeId) {
		return null;
	}

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isCurrentlyDragging ? 0.3 : 1,
	};

	return (
		<Box sx={{ position: "relative", mb: 1 }}>
			{/* Drop indicator line */}
			{over?.id === todo.id && (
				<Box
					sx={{
						position: "absolute",
						left: 0,
						right: 0,
						top: -2,
						height: 4,
						bgcolor: "primary.main",
						borderRadius: 4,
						zIndex: 2,
					}}
				/>
			)}
			<Paper
				ref={setNodeRef}
				style={style}
				elevation={isDragging ? 8 : 1}
				sx={{
					p: 2,
					transition: "all 0.2s ease-out",
					cursor: isDragging ? "grabbing" : "grab",
					transform: isDragging ? "scale(1.05) rotate(2deg)" : "none",
					position: "relative",
					zIndex: isDragging ? 1200 : 1,
					"&:hover": {
						transform: "translateY(-4px)",
						boxShadow: 2,
					},
				}}
			>
				<Box sx={{ display: "flex", gap: 1 }}>
					<IconButton
						size='small'
						{...attributes}
						{...listeners}
						sx={{
							mt: 0.5,
							opacity: 0,
							transition: "opacity 0.2s",
							"&:hover": { bgcolor: "grey.100", background: "transparent" },
							".MuiPaper-root:hover &": { opacity: 1 },
						}}
					>
						<GripVertical size={16} />
					</IconButton>

					<Box sx={{ flex: 1, position: "relative" }}>
						<Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
							<Typography variant='subtitle2' color='text.primary'>
								{todo.title}
							</Typography>
							<Box sx={{ display: "flex", gap: 0.5 }}>
								<Chip
									label={todo.priority}
									size='small'
									sx={{
										bgcolor: PRIORITY_CONFIG[todo.priority].bgcolor,
										color: PRIORITY_CONFIG[todo.priority].color,
										height: 20,
										fontSize: "0.75rem",
									}}
								/>
								<Box
									sx={{
										display: "flex",
										gap: 0.5,
										opacity: 0,
										transition: "opacity 0.2s",
										".MuiPaper-root:hover &": { opacity: 1 },
									}}
								>
									<IconButton
										size='small'
										onClick={(e) => {
											e.stopPropagation();
											onEdit?.(todo);
										}}
										sx={{
											p: 0.5,
											"&:hover": { bgcolor: "grey.100", background: "transparent" },
										}}
									>
										<Edit size={16} />
									</IconButton>
									<IconButton
										size='small'
										onClick={(e) => {
											e.stopPropagation();
											if (window.confirm("Are you sure you want to delete this task?")) {
												onDelete(todo.id);
											}
										}}
										sx={{
											p: 0.5,
											color: "text.secondary",
											"&:hover": {
												color: "error.main",
												bgcolor: "transparent",
											},
										}}
									>
										<Trash2 size={16} />
									</IconButton>
								</Box>
							</Box>
						</Box>

						{/* Assignee */}
						<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
							<User size={16} style={{ opacity: 0.7 }} />
							<Typography variant='caption' color='text.secondary'>
								{todo.assignee?.firstName} {todo.assignee?.lastName}
							</Typography>
						</Box>

						<Typography variant='body2' color='text.secondary' sx={{ mb: 1.5 }}>
							{todo.description}
						</Typography>

						<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
							<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
								<Clock size={16} />
								<Typography variant='caption' color='text.secondary'>
									Est: {todo.estimatedEffort}h
								</Typography>
							</Box>
							<Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
								<Timer size={16} />
								<Typography variant='caption' color='text.secondary'>
									Act: {todo.actualEffort}h
								</Typography>
							</Box>
						</Box>

						{todo.tags.length > 0 && (
							<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mt: 1 }}>
								{todo.tags.map((tag, index) => (
									<Chip
										key={tag}
										label={tag}
										size='small'
										sx={{
											height: 20,
											fontSize: "0.75rem",
											bgcolor: TAG_COLORS[index % TAG_COLORS.length].bgcolor,
											color: TAG_COLORS[index % TAG_COLORS.length].color,
										}}
									/>
								))}
							</Box>
						)}
					</Box>
				</Box>
			</Paper>
		</Box>
	);
});

export { TodoCard };

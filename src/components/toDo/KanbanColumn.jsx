import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { TodoCard } from "./TodoCard";
import { EmptyColumn } from "./EmptyColumn";

export function KanbanColumn({ status, title, todos = [], onEditTodo, activeId }) {
	const { setNodeRef, isOver } = useDroppable({
		id: status,
		data: {
			type: "column",
			status: status,
		},
	});

	const isActiveContainer = todos.some((todo) => todo.id === activeId);

	return (
		<Box
			sx={{
				width: "100%",
				maxWidth: 350,
				transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
				transform: isOver ? "scale(1.02)" : "none",
			}}
		>
			<Paper
				ref={setNodeRef}
				sx={{
					p: 2,
					height: "100%",
					bgcolor: isOver ? "action.hover" : "background.default",
					borderRadius: 2,
					minHeight: 200,
					transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
					outline: isOver ? "2px dashed" : isActiveContainer ? "2px solid" : "none",
					outlineColor: "primary.main",
					boxShadow: isOver ? 4 : 1,
				}}
			>
				<Typography
					variant='h6'
					sx={{
						mb: 2,
						fontWeight: 600,
						p: 1,
						borderRadius: 1,
						bgcolor: "background.paper",
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						transition: "all 0.2s ease",
						boxShadow: isOver ? 1 : 0,
					}}
				>
					{title}
					<Typography
						component='span'
						sx={{
							ml: 1,
							px: 1.5,
							py: 0.5,
							borderRadius: "12px",
							bgcolor: isOver ? "primary.main" : "grey.200",
							color: isOver ? "primary.contrastText" : "text.secondary",
							fontSize: "0.875rem",
							fontWeight: 500,
							transition: "all 0.2s ease",
						}}
					>
						{todos.length}
					</Typography>
				</Typography>

				<Box
					sx={{
						minHeight: 100,
						transition: "background-color 0.2s ease",
						p: 1,
						borderRadius: 1,
						bgcolor: isOver ? "action.hover" : "transparent",
						position: "relative",
						"&::after": isOver
							? {
									content: '""',
									position: "absolute",
									left: 8,
									right: 8,
									bottom: 8,
									height: 2,
									bgcolor: "primary.main",
									borderRadius: 1,
							  }
							: {},
					}}
				>
					<SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
						{todos
							.sort((a, b) => a.position - b.position)
							.map((todo, index) => (
								<TodoCard
									key={todo.id}
									todo={todo}
									onEdit={onEditTodo}
									isDragging={todo.id === activeId}
									index={index}
									status={status}
								/>
							))}
						{todos.length === 0 && <EmptyColumn status={status} />}
					</SortableContext>
				</Box>
			</Paper>
		</Box>
	);
}

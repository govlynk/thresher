import React, { useState } from "react";
import { Box, Container } from "@mui/material";
import { TodoDialog } from "../components/toDo/TodoDialog";
import { TodoHeader } from "../components/toDo/TodoHeader";
import { KanbanBoard } from "../components/toDo/KanbanBoard";

function TodoScreen() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editTodo, setEditTodo] = useState(null);

	const handleAddClick = () => {
		setEditTodo(null);
		setDialogOpen(true);
	};

	const handleEditClick = (todo) => {
		setEditTodo(todo);
		setDialogOpen(true);
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
		setEditTodo(null);
	};

	return (
		<Container maxWidth={false} disableGutters>
			<Box sx={{ p: 4, width: "100%" }}>
				<TodoHeader onAddClick={handleAddClick} />
				<KanbanBoard onEditTodo={handleEditClick} />
				<TodoDialog open={dialogOpen} onClose={handleCloseDialog} editTodo={editTodo} />
			</Box>
		</Container>
	);
}

export default TodoScreen;

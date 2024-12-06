// src/components/kanban/KanbanBoard.jsx
import React from "react";
import { Box, Typography, Alert, CircularProgress } from "@mui/material";
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import { KanbanColumn } from "./KanbanColumn";
import { BOARD_CONFIGS } from "../../config/kanbanConfig";

export function KanbanBoard({ type, items = [], onItemMove, onItemUpdate, loading = false, error = null }) {
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 5 },
		}),
		useSensor(KeyboardSensor)
	);

	const boardConfig = BOARD_CONFIGS[type];
	if (!boardConfig) {
		return <Alert severity='error'>Invalid board type</Alert>;
	}

	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (!over || active.id === over.id) return;
		onItemMove?.(active.id, over.id);
	};

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return <Alert severity='error'>{error}</Alert>;
	}

	return (
		<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
			<Box
				sx={{
					display: "flex",
					overflowX: "auto",
					gap: 2,
					p: 2,
					minHeight: "calc(100vh - 200px)",
				}}
			>
				<SortableContext items={Object.keys(boardConfig.columns)} strategy={horizontalListSortingStrategy}>
					{Object.entries(boardConfig.columns).map(([key, column]) => (
						<KanbanColumn
							key={column.id}
							id={column.id}
							title={column.title}
							items={items.filter((item) => item.status === column.id)}
							color={column.color}
							limit={column.limit}
							onItemUpdate={onItemUpdate}
						/>
					))}
				</SortableContext>
			</Box>
		</DndContext>
	);
}

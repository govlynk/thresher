import React, { useState } from "react";
import {
	FormControl,
	FormLabel,
	FormControlLabel,
	Box,
	TextField,
	Typography,
	List,
	ListItem,
	ListItemText,
	IconButton,
	Button,
	Paper,
} from "@mui/material";
import { FormField } from "../FormField";
import { Plus, X, GripVertical } from "lucide-react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableCapability({ capability, onRemove, id }) {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<Paper ref={setNodeRef} style={style} sx={{ mb: 1 }}>
			<ListItem
				secondaryAction={
					<IconButton edge='end' onClick={onRemove}>
						<X size={18} />
					</IconButton>
				}
			>
				<Box {...attributes} {...listeners} sx={{ cursor: "grab", mr: 2 }}>
					<GripVertical size={20} />
				</Box>
				<ListItemText primary={capability} />
			</ListItem>
		</Paper>
	);
}

export function SortableListQuestion({ question, value, onChange }) {
	const [newCapability, setNewCapability] = useState("");
	const [inputValue, setInputValue] = useState("");

	// Update handleAdd function
	const handleAdd = () => {
		if (inputValue.trim()) {
			onChange([...(Array.isArray(value) ? value : []), inputValue.trim()]);
			setInputValue("");
		}
	};

	const handleRemove = (index) => {
		const newValue = Array.isArray(value) ? [...value] : [];
		newValue.splice(index, 1);
		onChange(newValue);
	};

	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (active.id !== over.id) {
			const oldIndex = value.findIndex((item) => item === active.id);
			const newIndex = value.findIndex((item) => item === over.id);
			const newItems = [...value];
			newItems.splice(oldIndex, 1);
			newItems.splice(newIndex, 0, value[oldIndex]);
			onChange(newItems);
		}
	};

	const handleChange = (e) => {
		onChange(question.id, e.target.value);
	};

	const validateContent = () => {
		if (question.required && (!value || value === "{}")) {
			return "This field is required";
		}

		return null;
	};

	const error = validateContent();

	return (
		<Box sx={{ width: "100%" }}>
			<FormField question={question} error={error} helperText={question.helpText}>
				<Box sx={{ mb: 3 }}>
					<TextField
						fullWidth
						value={inputValue}
						onChange={(e) => setInputValue(e.target.value)}
						onKeyPress={(e) => {
							if (e.key === "Enter") {
								handleAdd();
							}
						}}
					/>
					<Button startIcon={<Plus size={20} />} onClick={handleAdd} sx={{ mt: 1 }}>
						Add Capability
					</Button>
				</Box>
				<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
					<SortableContext items={value} strategy={verticalListSortingStrategy}>
						<List>
							{value.map((capability, index) => (
								<SortableCapability
									key={capability}
									id={capability}
									capability={capability}
									onRemove={() => handleRemove(index)}
								/>
							))}
						</List>
					</SortableContext>
				</DndContext>
			</FormField>
			{question.helpText && (
				<Typography variant='body2' color='text.secondary' sx={{ mt: 2 }}>
					{question.helpText}
				</Typography>
			)}
		</Box>
	);
}

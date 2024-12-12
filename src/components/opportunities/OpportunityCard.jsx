import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Box, Paper, Typography, Chip, IconButton } from "@mui/material";
import { Calendar, Building2, DollarSign, GripVertical, Users } from "lucide-react";

export function OpportunityCard({ opportunity }) {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: opportunity.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	const formatDate = (date) => {
		if (!date) return "N/A";
		return new Date(date).toLocaleDateString();
	};

	const formatCurrency = (amount) => {
		if (!amount) return "N/A";
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
			maximumFractionDigits: 0,
		}).format(amount);
	};

	return (
		<Paper
			ref={setNodeRef}
			style={style}
			sx={{
				p: 2,
				mb: 2,
				opacity: isDragging ? 0.5 : 1,
				cursor: isDragging ? "grabbing" : "grab",
				"&:hover": {
					boxShadow: 3,
					transform: "translateY(-2px)",
				},
			}}
		>
			<Box sx={{ display: "flex", gap: 1, mb: 2 }}>
				<Box {...attributes} {...listeners} sx={{ cursor: "inherit", color: "text.secondary" }}>
					<GripVertical size={20} />
				</Box>
				<Typography variant='subtitle1' sx={{ fontWeight: 500 }}>
					{opportunity.title}
				</Typography>
			</Box>

			<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
					<Building2 size={16} />
					<Typography variant='body2' color='text.secondary'>
						{opportunity.department}
					</Typography>
				</Box>

				{opportunity.dueDate && (
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<Calendar size={16} />
						<Typography variant='body2' color='text.secondary'>
							Due: {formatDate(opportunity.dueDate)}
						</Typography>
					</Box>
				)}

				{opportunity.estimatedValue && (
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<DollarSign size={16} />
						<Typography variant='body2' color='text.secondary'>
							{formatCurrency(opportunity.estimatedValue)}
						</Typography>
					</Box>
				)}

				{opportunity.assignee && (
					<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
						<Users size={16} />
						<Typography variant='body2' color='text.secondary'>
							{opportunity.assignee.name}
						</Typography>
					</Box>
				)}
			</Box>

			{opportunity.tags?.length > 0 && (
				<Box sx={{ display: "flex", gap: 0.5, mt: 2, flexWrap: "wrap" }}>
					{opportunity.tags.map((tag, index) => (
						<Chip key={index} label={tag} size='small' variant='outlined' />
					))}
				</Box>
			)}
		</Paper>
	);
}

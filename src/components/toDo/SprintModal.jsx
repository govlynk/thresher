import { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Button,
	IconButton,
	Typography,
	MenuItem,
} from "@mui/material";
import { X } from "lucide-react";
import { useKanbanStore } from "../../stores/kanbanStore";
import { format } from "date-fns";

export function SprintModal({ sprint, onClose }) {
	const { updateSprint } = useKanbanStore();
	const [formData, setFormData] = useState({
		name: "",
		goal: "",
		status: "",
	});

	useEffect(() => {
		if (sprint) {
			setFormData({
				name: sprint.name,
				goal: sprint.goal,
				status: sprint.status,
			});
		}
	}, [sprint]);

	const handleSubmit = (e) => {
		e.preventDefault();
		updateSprint(sprint.id, formData);
		onClose();
	};

	return (
		<Dialog open={true} onClose={onClose} maxWidth='sm' fullWidth>
			<DialogTitle sx={{ m: 0, p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
				<Typography variant='h6'>Edit Sprint</Typography>
				<IconButton onClick={onClose} size='small' sx={{ color: "text.secondary" }}>
					<X size={20} />
				</IconButton>
			</DialogTitle>

			<DialogContent dividers>
				<form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
					<TextField
						label='Sprint Name'
						value={formData.name}
						onChange={(e) => setFormData({ ...formData, name: e.target.value })}
						required
						fullWidth
					/>

					<TextField
						label='Sprint Goal'
						value={formData.goal}
						onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
						multiline
						rows={3}
						fullWidth
					/>

					<TextField
						select
						label='Status'
						value={formData.status}
						onChange={(e) => setFormData({ ...formData, status: e.target.value })}
						fullWidth
					>
						<MenuItem value='planning'>Planning</MenuItem>
						<MenuItem value='active'>Active</MenuItem>
						<MenuItem value='completed'>Completed</MenuItem>
					</TextField>

					<Typography variant='body2' color='text.secondary' sx={{ pt: 1 }}>
						Sprint Period: {format(new Date(sprint.startDate), "MMM d")} -{" "}
						{format(new Date(sprint.endDate), "MMM d, yyyy")}
					</Typography>
				</form>
			</DialogContent>

			<DialogActions sx={{ p: 2 }}>
				<Button onClick={onClose} color='inherit'>
					Cancel
				</Button>
				<Button onClick={handleSubmit} variant='contained'>
					Save Changes
				</Button>
			</DialogActions>
		</Dialog>
	);
}

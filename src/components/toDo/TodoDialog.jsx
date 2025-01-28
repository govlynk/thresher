import { useState, useEffect } from "react";
import {
	Box,
	Button,
	Chip,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	FormControl,
	Stack,
	Select,
	TextField,
	MenuItem,
	InputLabel,
	Alert,
	Divider,
	Typography,
} from "@mui/material";
import { Tag, X, AlertCircle } from "lucide-react";
import { useTodoStore } from "../../stores/todoStore";
import { useGlobalStore } from "../../stores/globalStore";
import { useSprintStore } from "../../stores/sprintStore";
import { useTeamStore } from "../../stores/teamStore";
import { DEFAULT_TASK, TASK_STATUS, PRIORITY_CONFIG } from "../../config/taskConfig";

export function TodoDialog({ open, onClose, todo = null }) {
	const { activeUserData } = useGlobalStore();
	const { teams } = useTeamStore();
	const { activeTeamId } = useGlobalStore();
	const { addTodo, updateTodo } = useTodoStore();
	const { sprints, activeSprint } = useSprintStore();
	const [tagInput, setTagInput] = useState("");
	const [error, setError] = useState(null);

	const [formData, setFormData] = useState({ ...DEFAULT_TASK, sprintId: activeSprint?.id || null });

	useEffect(() => {
		if (todo) {
			setFormData({
				...DEFAULT_TASK,
				title: todo.title || "",
				description: todo.description || "",
				priority: todo.priority || "MEDIUM",
				status: todo.status || "TODO",
				estimatedEffort: todo.estimatedEffort?.toString() || "1",
				actualEffort: todo.actualEffort?.toString() || "0",
				tags: Array.isArray(todo.tags) ? todo.tags : [],
				position: todo.position || 1,
				teamId: todo.teamId || activeTeamId || "",
				assigneeId: todo.assigneeId || "",
				sprintId: todo.sprintId || activeSprint?.id || null,
				dueDate: new Date(todo.dueDate).toISOString().split("T")[0],
			});
		} else {
			setFormData({
				...DEFAULT_TASK,
				teamId: activeTeamId || "",
				assigneeId: "",
				sprintId: activeSprint?.id || null,
			});
		}
	}, [todo, activeSprint?.id, activeTeamId, activeUserData?.userId]);

	// Get team members for selected team
	const currentTeam = teams.find((team) => team.id === formData.teamId);
	const teamMembers = currentTeam?.members || [];

	// Validate assignee exists in current team
	useEffect(() => {
		if (formData.teamId && formData.assigneeId) {
			const isValidAssignee = teamMembers.some((member) => member.contact?.id === formData.assigneeId);
			if (!isValidAssignee) {
				setFormData((prev) => ({ ...prev, assigneeId: "" }));
			}
		}
	}, [formData.teamId, formData.assigneeId, teamMembers]);

	const validateForm = () => {
		if (!formData.title.trim()) {
			setError("Title is required");
			return false;
		}
		if (!formData.description.trim()) {
			setError("Description is required");
			return false;
		}
		if (!formData.dueDate) {
			setError("Due date is required");
			return false;
		}
		if (!activeUserData?.userId) {
			setError("User information is missing. Please sign in again.");
			return false;
		}
		if (!formData.teamId) {
			setError("Please select a team");
			return false;
		}
		if (!formData.assigneeId) {
			setError("Please select an assignee");
			return false;
		}
		return true;
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (!validateForm()) return;

		console.log("Submitting todo with data:", formData);

		try {
			const todoData = {
				title: formData.title.trim(),
				description: formData.description.trim(),
				tags: formData.tags || [],
				estimatedEffort: parseFloat(formData.estimatedEffort || "0"),
				actualEffort: parseFloat(formData.actualEffort || "0"),
				dueDate: new Date(formData.dueDate).toISOString(),
				status: formData.status || "todo",
				priority: formData.priority || "MEDIUM",
				position: formData.position || 0,
				assigneeId: formData.assigneeId,
				teamId: formData.teamId,
				sprintId: formData.sprintId,
			};

			if (todo) {
				updateTodo(todo.id, todoData);
			} else {
				addTodo(todoData);
			}

			onClose();
		} catch (error) {
			console.error("Error saving todo:", error);
			setError(error.message || "Failed to save todo");
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
		setError(null);
	};

	const handleAddTag = (e) => {
		if (e.key === "Enter" && tagInput.trim()) {
			e.preventDefault();
			const newTag = tagInput.trim().toLowerCase();
			if (!formData.tags.includes(newTag)) {
				setFormData((prev) => ({
					...prev,
					tags: [...prev.tags, newTag],
				}));
			}
			setTagInput("");
		}
	};

	const handleRemoveTag = (tagToRemove) => {
		setFormData((prev) => ({
			...prev,
			tags: prev.tags.filter((tag) => tag !== tagToRemove),
		}));
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth='sm' fullWidth>
			<DialogTitle sx={{ pb: 1 }}>
				<Typography variant='h6' component='div'>
					{todo ? "Edit Task" : "Add New Task"}
				</Typography>
				{error && (
					<Alert severity='error' icon={<AlertCircle size={20} />} sx={{ mt: 1 }}>
						{error}
					</Alert>
				)}
			</DialogTitle>

			<DialogContent dividers sx={{ p: 3 }}>
				<Stack spacing={3}>
					<Typography variant='subtitle2' color='text.secondary'>
						Assignment
					</Typography>

					<FormControl fullWidth>
						<InputLabel>Team</InputLabel>
						<Select required name='teamId' value={formData.teamId || ""} onChange={handleChange} label='Team'>
							{teams.map((team) => (
								<MenuItem key={team.id} value={team.id}>
									{team.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<FormControl fullWidth>
						<InputLabel>Assignee</InputLabel>
						<Select
							required
							name='assigneeId'
							value={formData.assigneeId || ""}
							onChange={handleChange}
							label='Assignee'
							disabled={!formData.teamId}
						>
							{teamMembers.map((member) => (
								<MenuItem key={member.id} value={member.contact?.id}>
									{member.contact?.firstName} {member.contact?.lastName}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<Divider sx={{ my: 2 }} />

					<Typography variant='subtitle2' color='text.secondary'>
						Task Details
					</Typography>

					<Stack component='form' onSubmit={handleSubmit} spacing={2}>
						<TextField
							label='Title'
							name='title'
							value={formData.title}
							onChange={handleChange}
							required
							fullWidth
							error={error === "Title is required"}
						/>

						<TextField
							label='Description'
							name='description'
							value={formData.description}
							onChange={handleChange}
							multiline
							rows={3}
							fullWidth
							error={error === "Description is required"}
						/>

						<Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
							<FormControl fullWidth>
								<InputLabel>Priority</InputLabel>
								<Select
									name='priority'
									value={formData.priority || "MEDIUM"}
									onChange={handleChange}
									label='Priority'
								>
									<MenuItem value='LOW'>Low</MenuItem>
									<MenuItem value='MEDIUM'>Medium</MenuItem>
									<MenuItem value='HIGH'>High</MenuItem>
								</Select>
							</FormControl>

							<FormControl fullWidth>
								<InputLabel>Status</InputLabel>
								<Select name='status' value={formData.status || "TODO"} onChange={handleChange} label='Status'>
									<MenuItem value={TASK_STATUS.TODO}>To Do</MenuItem>
									<MenuItem value={TASK_STATUS.DOING}>In Progress</MenuItem>
									<MenuItem value={TASK_STATUS.DONE}>Done</MenuItem>
								</Select>
							</FormControl>
						</Box>

						<TextField
							fullWidth
							type='date'
							label='Due Date'
							name='dueDate'
							value={formData.dueDate}
							onChange={handleChange}
							InputLabelProps={{ shrink: true }}
							required
							error={error === "Due date is required"}
						/>

						<Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 3 }}>
							<TextField
								type='number'
								label='Estimated Hours'
								name='estimatedEffort'
								value={formData.estimatedEffort || ""}
								onChange={handleChange}
								inputProps={{ min: 0, step: 0.5 }}
								fullWidth
							/>

							<TextField
								type='number'
								label='Actual Hours'
								name='actualEffort'
								value={formData.actualEffort || ""}
								onChange={handleChange}
								inputProps={{ min: 0, step: 0.5 }}
								fullWidth
							/>
						</Box>

						<Divider sx={{ my: 2 }} />

						<FormControl fullWidth>
							<InputLabel>Sprint</InputLabel>
							<Select name='sprintId' value={formData.sprintId || ""} onChange={handleChange} label='Sprint'>
								{sprints.map((sprint) => (
									<MenuItem key={sprint.id} value={sprint.id}>
										{sprint.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>

						<TextField
							fullWidth
							label='Add Tags'
							value={tagInput}
							onChange={(e) => setTagInput(e.target.value)}
							onKeyDown={handleAddTag}
							placeholder='Press Enter to add tags'
							helperText='Press Enter to add multiple tags'
							InputProps={{
								startAdornment: <Tag size={16} style={{ marginRight: 8, opacity: 0.5 }} />,
							}}
						/>

						{formData.tags && formData.tags.length > 0 && (
							<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
								{formData.tags.map((tag, index) => (
									<Chip
										key={`${tag}-${index}`}
										icon={<Tag size={14} />}
										label={tag}
										onDelete={() => handleRemoveTag(tag)}
										deleteIcon={<X size={14} />}
										color='secondary'
										variant='outlined'
										sx={{
											bgcolor: "background.paper",
											color: "text.primary",
											"& .MuiChip-icon": {
												color: "inherit",
											},
										}}
									/>
								))}
							</Box>
						)}
					</Stack>
				</Stack>
			</DialogContent>

			<DialogActions sx={{ p: 3, gap: 2 }}>
				<Button onClick={onClose} color='inherit'>
					Cancel
				</Button>
				<Button type='submit' variant='contained' onClick={handleSubmit}>
					{todo ? "Save Changes" : "Create Task"}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

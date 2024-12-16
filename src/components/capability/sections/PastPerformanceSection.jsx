// src/components/capability/sections/PastPerformanceSection.jsx
import React, { useState } from "react";
import {
	Box,
	Button,
	TextField,
	Typography,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	List,
	ListItem,
	Grid,
	IconButton,
	Paper,
} from "@mui/material";
import { Plus, Edit, Trash2 } from "lucide-react";

const initialFormData = {
	projectName: "",
	description: "",
	client: "",
	contractValue: "",
	startDate: new Date().toISOString().split("T")[0],
	endDate: "",
};

export function PastPerformanceSection({ value = [], onChange }) {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editIndex, setEditIndex] = useState(-1);
	const [formData, setFormData] = useState(initialFormData);

	const handleAddClick = () => {
		setEditIndex(-1);
		setFormData(initialFormData);
		setDialogOpen(true);
	};

	const handleEditClick = (index) => {
		setEditIndex(index);
		setFormData({
			projectName: performances[index]?.projectName || "",
			description: performances[index]?.description || "",
			client: performances[index]?.client || "",
			contractValue: performances[index]?.contractValue || "",
			startDate: performances[index]?.startDate || "",
			endDate: performances[index]?.endDate || "",
		});
		setDialogOpen(true);
	};

	const handleDeleteClick = (index) => {
		onChange(value.filter((_, i) => i !== index));
	};

	const handleSave = () => {
		const newValue = [...value];
		if (editIndex === -1) {
			newValue.push(formData);
		} else {
			newValue[editIndex] = formData;
		}
		onChange(newValue);
		setDialogOpen(false);
		setFormData(initialFormData);
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	return (
		<Box>
			<Typography variant='h6' gutterBottom>
				Past Performance
			</Typography>
			<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
				List your significant past projects and contract performance.
			</Typography>

			<Button startIcon={<Plus size={20} />} onClick={handleAddClick} variant='contained' sx={{ mb: 3 }}>
				Add Past Performance
			</Button>

			<List>
				{value.map((performance, index) => (
					<Paper key={index} sx={{ mb: 2, p: 2 }}>
						<ListItem
							disablePadding
							secondaryAction={
								<Box>
									<IconButton onClick={() => handleEditClick(index)}>
										<Edit size={18} />
									</IconButton>
									<IconButton onClick={() => handleDeleteClick(index)}>
										<Trash2 size={18} />
									</IconButton>
								</Box>
							}
						>
							<Box>
								<Typography variant='subtitle1'>{performance.projectName}</Typography>
								<Box component='div' sx={{ mt: 1 }}>
									<Typography variant='body2' component='div'>
										{performance.description}
									</Typography>
									<Typography variant='body2' component='div'>
										Client: {performance.client}
									</Typography>
									<Typography variant='body2' component='div'>
										Value: {performance.contractValue}
									</Typography>
									<Typography variant='body2' component='div'>
										Start Date: {performance.startDate}
									</Typography>
									<Typography variant='body2' component='div'>
										End Date: {performance.endDate}
									</Typography>
								</Box>
							</Box>
						</ListItem>
					</Paper>
				))}
			</List>

			<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth='md' fullWidth>
				<DialogTitle>{editIndex === -1 ? "Add Past Performance" : "Edit Past Performance"}</DialogTitle>
				<DialogContent>
					<Box sx={{ pt: 2 }}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									fullWidth
									label='Project Name'
									name='projectName'
									value={formData.projectName}
									onChange={handleChange}
									required
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									label='Client'
									name='client'
									value={formData.client}
									onChange={handleChange}
									required
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label='Contract Value'
									name='contractValue'
									type='number'
									value={formData.contractValue}
									onChange={handleChange}
									InputProps={{
										startAdornment: "$",
									}}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label='Start Date'
									name='startDate'
									type='date'
									value={formData.startDate}
									onChange={handleChange}
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label='End Date'
									name='endDate'
									type='date'
									value={formData.endDate}
									onChange={handleChange}
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									label='Description'
									name='description'
									value={formData.description}
									onChange={handleChange}
									multiline
									rows={4}
								/>
							</Grid>
						</Grid>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDialogOpen(false)}>Cancel</Button>
					<Button onClick={handleSave} variant='contained'>
						Save
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

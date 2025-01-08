import React, { useState, useEffect } from "react";
import {
	Box,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	TextField,
	Grid,
	IconButton,
	Card,
	CardContent,
	Typography,
	Alert,
	CircularProgress,
} from "@mui/material";
import { Plus, Edit, Trash2 } from "lucide-react";
import { usePastPerformanceStore } from "../../stores/pastPerformanceStore";
import { useGlobalStore } from "../../stores/globalStore";

export function PastPerformanceForm() {
	const { activeCompanyId } = useGlobalStore();
	const { entries, loading, error, fetchEntries, addEntry, updateEntry, deleteEntry } = usePastPerformanceStore();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editId, setEditId] = useState(null);
	const [formData, setFormData] = useState({
		projectName: "",
		contractNumber: "",
		client: "",
		description: "",
		contractValue: "",
		periodStart: "",
		periodEnd: "",
		pointOfContactName: "",
		pointOfContactEmail: "",
		pointOfContactPhone: "",
	});

	useEffect(() => {
		if (activeCompanyId) {
			fetchEntries(activeCompanyId);
		}
	}, [activeCompanyId, fetchEntries]);

	const handleAdd = () => {
		setEditId(null);
		setFormData({
			projectName: "",
			contractNumber: "",
			client: "",
			description: "",
			contractValue: "",
			periodStart: "",
			periodEnd: "",
			pointOfContactName: "",
			pointOfContactEmail: "",
			pointOfContactPhone: "",
		});
		setDialogOpen(true);
	};

	const handleEdit = (entry) => {
		setEditId(entry.id);
		setFormData(entry);
		setDialogOpen(true);
	};

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this entry?")) {
			try {
				await deleteEntry(id);
			} catch (err) {
				console.error("Failed to delete entry:", err);
			}
		}
	};

	const handleSave = async () => {
		try {
			if (editId) {
				await updateEntry(editId, formData);
			} else {
				await addEntry({
					...formData,
					companyId: activeCompanyId,
				});
			}
			setDialogOpen(false);
		} catch (err) {
			console.error("Failed to save entry:", err);
		}
	};

	const formatCurrency = (value) => {
		if (!value) return "";
		return new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
			minimumFractionDigits: 0,
		}).format(value);
	};

	if (!activeCompanyId) {
		return <Alert severity='warning'>Please select a company first</Alert>;
	}

	return (
		<Box>
			<Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<Typography variant='h5'>Past Performance</Typography>
				<Button startIcon={<Plus />} variant='contained' onClick={handleAdd} disabled={loading}>
					Add Performance
				</Button>
			</Box>

			{error && (
				<Alert severity='error' sx={{ mb: 3 }}>
					{error}
				</Alert>
			)}

			{loading && !dialogOpen ? (
				<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
					<CircularProgress />
				</Box>
			) : (
				<Grid container spacing={2}>
					{entries.map((entry) => (
						<Grid item xs={12} md={6} key={entry.id}>
							<Card>
								<CardContent>
									<Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
										<Typography variant='h6'>{entry.projectName}</Typography>
										<Box>
											<IconButton onClick={() => handleEdit(entry)} size='small'>
												<Edit size={18} />
											</IconButton>
											<IconButton onClick={() => handleDelete(entry.id)} size='small' color='error'>
												<Trash2 size={18} />
											</IconButton>
										</Box>
									</Box>

									<Typography variant='body2' color='text.secondary' gutterBottom>
										Contract #: {entry.contractNumber}
									</Typography>
									<Typography variant='body2' color='text.secondary' gutterBottom>
										Client: {entry.client}
									</Typography>
									<Typography variant='body2' color='text.secondary' gutterBottom>
										Value: {formatCurrency(entry.contractValue)}
									</Typography>
									<Typography variant='body2' color='text.secondary' gutterBottom>
										Period: {entry.periodStart} to {entry.periodEnd}
									</Typography>
									<Typography variant='body2' paragraph>
										{entry.description}
									</Typography>

									<Box sx={{ mt: 2 }}>
										<Typography variant='subtitle2'>Point of Contact</Typography>
										<Typography variant='body2'>{entry.pointOfContactName}</Typography>
										<Typography variant='body2'>{entry.pointOfContactEmail}</Typography>
										<Typography variant='body2'>{entry.pointOfContactPhone}</Typography>
									</Box>
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			)}

			<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth='md' fullWidth>
				<DialogTitle>{editId ? "Edit Performance" : "Add Performance"}</DialogTitle>
				<DialogContent>
					<Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
						<Grid container spacing={2}>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label='Project Name'
									value={formData.projectName}
									onChange={(e) => setFormData({ ...formData, projectName: e.target.value })}
									required
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label='Contract Number'
									value={formData.contractNumber}
									onChange={(e) => setFormData({ ...formData, contractNumber: e.target.value })}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label='Client'
									value={formData.client}
									onChange={(e) => setFormData({ ...formData, client: e.target.value })}
									required
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label='Contract Value'
									type='number'
									value={formData.contractValue}
									onChange={(e) => setFormData({ ...formData, contractValue: e.target.value })}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label='Period Start'
									type='date'
									value={formData.periodStart}
									onChange={(e) => setFormData({ ...formData, periodStart: e.target.value })}
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label='Period End'
									type='date'
									value={formData.periodEnd}
									onChange={(e) => setFormData({ ...formData, periodEnd: e.target.value })}
									InputLabelProps={{ shrink: true }}
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									label='Description'
									multiline
									rows={3}
									value={formData.description}
									onChange={(e) => setFormData({ ...formData, description: e.target.value })}
								/>
							</Grid>

							<Grid item xs={12}>
								<Typography variant='subtitle2' sx={{ mb: 2 }}>
									Point of Contact
								</Typography>
							</Grid>

							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label='Name'
									value={formData.pointOfContactName}
									onChange={(e) => setFormData({ ...formData, pointOfContactName: e.target.value })}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label='Email'
									type='email'
									value={formData.pointOfContactEmail}
									onChange={(e) => setFormData({ ...formData, pointOfContactEmail: e.target.value })}
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label='Phone'
									value={formData.pointOfContactPhone}
									onChange={(e) => setFormData({ ...formData, pointOfContactPhone: e.target.value })}
								/>
							</Grid>
						</Grid>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDialogOpen(false)} disabled={loading}>
						Cancel
					</Button>
					<Button onClick={handleSave} variant='contained' disabled={loading}>
						{loading ? "Saving..." : editId ? "Save Changes" : "Add Entry"}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

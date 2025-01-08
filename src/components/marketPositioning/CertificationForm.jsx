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
import { useCertificationStore } from "../../stores/certificationStore";
import { useGlobalStore } from "../../stores/globalStore";

export function CertificationForm() {
	const { activeCompanyId } = useGlobalStore();
	const {
		certifications,
		loading,
		error,
		fetchCertifications,
		addCertification,
		updateCertification,
		deleteCertification,
	} = useCertificationStore();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editId, setEditId] = useState(null);
	const [formData, setFormData] = useState({
		name: "",
		issuer: "",
		dateObtained: "",
		expirationDate: "",
		description: "",
	});

	useEffect(() => {
		if (activeCompanyId) {
			fetchCertifications(activeCompanyId);
		}
	}, [activeCompanyId, fetchCertifications]);

	const handleAdd = () => {
		setEditId(null);
		setFormData({
			name: "",
			issuer: "",
			dateObtained: "",
			expirationDate: "",
			description: "",
		});
		setDialogOpen(true);
	};

	const handleEdit = (cert) => {
		setEditId(cert.id);
		setFormData({
			name: cert.name,
			issuer: cert.issuer,
			dateObtained: cert.dateObtained,
			expirationDate: cert.expirationDate || "",
			description: cert.description || "",
		});
		setDialogOpen(true);
	};

	const handleDelete = async (id) => {
		if (window.confirm("Are you sure you want to delete this certification?")) {
			try {
				await deleteCertification(id);
			} catch (err) {
				console.error("Failed to delete certification:", err);
			}
		}
	};

	const handleSave = async () => {
		try {
			if (editId) {
				await updateCertification(editId, formData);
			} else {
				await addCertification({
					...formData,
					companyId: activeCompanyId,
				});
			}
			setDialogOpen(false);
		} catch (err) {
			console.error("Failed to save certification:", err);
		}
	};

	if (!activeCompanyId) {
		return <Alert severity='warning'>Please select a company first</Alert>;
	}

	return (
		<Box>
			<Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<Typography variant='h5'>Certifications</Typography>
				<Button startIcon={<Plus />} variant='contained' onClick={handleAdd} disabled={loading}>
					Add Certification
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
					{certifications.map((cert) => (
						<Grid item xs={12} md={6} key={cert.id}>
							<Card>
								<CardContent>
									<Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
										<Typography variant='h6'>{cert.name}</Typography>
										<Box>
											<IconButton onClick={() => handleEdit(cert)} size='small'>
												<Edit size={18} />
											</IconButton>
											<IconButton onClick={() => handleDelete(cert.id)} size='small' color='error'>
												<Trash2 size={18} />
											</IconButton>
										</Box>
									</Box>

									<Typography variant='body2' color='text.secondary' gutterBottom>
										Issuer: {cert.issuer}
									</Typography>
									<Typography variant='body2' color='text.secondary' gutterBottom>
										Obtained: {new Date(cert.dateObtained).toLocaleDateString()}
									</Typography>
									{cert.expirationDate && (
										<Typography variant='body2' color='text.secondary' gutterBottom>
											Expires: {new Date(cert.expirationDate).toLocaleDateString()}
										</Typography>
									)}
									{cert.description && (
										<Typography variant='body2' sx={{ mt: 1 }}>
											{cert.description}
										</Typography>
									)}
								</CardContent>
							</Card>
						</Grid>
					))}
				</Grid>
			)}

			<Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth='md' fullWidth>
				<DialogTitle>{editId ? "Edit Certification" : "Add Certification"}</DialogTitle>
				<DialogContent>
					<Box sx={{ pt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
						<Grid container spacing={2}>
							<Grid item xs={12}>
								<TextField
									fullWidth
									label='Certification Name'
									value={formData.name}
									onChange={(e) => setFormData({ ...formData, name: e.target.value })}
									required
								/>
							</Grid>
							<Grid item xs={12}>
								<TextField
									fullWidth
									label='Issuing Organization'
									value={formData.issuer}
									onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
									required
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label='Date Obtained'
									type='date'
									value={formData.dateObtained}
									onChange={(e) => setFormData({ ...formData, dateObtained: e.target.value })}
									InputLabelProps={{ shrink: true }}
									required
								/>
							</Grid>
							<Grid item xs={12} sm={6}>
								<TextField
									fullWidth
									label='Expiration Date'
									type='date'
									value={formData.expirationDate}
									onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
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
						</Grid>
					</Box>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDialogOpen(false)} disabled={loading}>
						Cancel
					</Button>
					<Button
						onClick={handleSave}
						variant='contained'
						disabled={loading || !formData.name || !formData.issuer || !formData.dateObtained}
					>
						{loading ? "Saving..." : editId ? "Save Changes" : "Add Certification"}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

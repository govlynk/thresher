import React, { useState, useEffect } from "react";
import {
	Box,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Typography,
	Chip,
	CircularProgress,
} from "@mui/material";
import { generateClient } from "aws-amplify/data";

const client = generateClient({
	authMode: "userPool",
});

const ROLES = [
	"Executive",
	"Sales",
	"Marketing",
	"Finance",
	"Risk",
	"Technology",
	"Engineering",
	"Operations",
	"HumanResources",
	"Legal",
	"Contracting",
	"Servicing",
	"Other",
];

export function TeamMemberDialog({ open, onClose, activeCompanyId }) {
	const [selectedRole, setSelectedRole] = useState("");
	const [selectedContacts, setSelectedContacts] = useState([]);
	const [contacts, setContacts] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	console.log(activeCompanyId);
	useEffect(() => {
		if (activeCompanyId) {
			setLoading(true);
			fetchContacts(activeCompanyId)
				.then((data) => {
					setContacts(data);
					setLoading(false);
				})
				.catch((err) => {
					console.error("Error fetching contacts:", err);
					setError("Failed to fetch contacts");
					setLoading(false);
				});
		}
	}, [activeCompanyId]);

	const fetchContacts = async (companyId) => {
		try {
			const response = await client.models.Contact.list({
				filter: { companyId: { eq: companyId } },
			});
			return response.data;
			console.log(response.data);
		} catch (err) {
			console.error("Error fetching contacts:", err);
			throw err;
		}
	};

	const handleAddContact = (contactId) => {
		const contact = contacts.find((c) => c.id === contactId);
		if (contact && !selectedContacts.some((c) => c.id === contactId)) {
			setSelectedContacts((prev) => [...prev, contact]);
		}
	};

	const handleRemoveContact = (contactId) => {
		setSelectedContacts((prev) => prev.filter((c) => c.id !== contactId));
	};

	const handleSave = () => {
		// Handle save logic here
		onClose();
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
			<DialogTitle>Add Team Members</DialogTitle>
			<DialogContent>
				<Box sx={{ mb: 3 }}>
					<FormControl fullWidth sx={{ mb: 2 }}>
						<InputLabel>Select Contact</InputLabel>
						<Select value='' onChange={(e) => handleAddContact(e.target.value)} label='Select Contact'>
							{contacts.map((contact) => (
								<MenuItem key={contact.id} value={contact.id}>
									{contact.firstName} {contact.lastName}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<FormControl fullWidth sx={{ mb: 2 }}>
						<InputLabel>Role</InputLabel>
						<Select value={selectedRole} onChange={(e) => setSelectedRole(e.target.value)} label='Role'>
							{ROLES.map((role) => (
								<MenuItem key={role} value={role}>
									{role}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{selectedContacts.length > 0 && (
						<Box sx={{ mb: 2 }}>
							<Typography variant='subtitle2' sx={{ mb: 1 }}>
								Selected Contacts:
							</Typography>
							<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
								{selectedContacts.map((contact) => (
									<Chip
										key={contact.id}
										label={`${contact.firstName} ${contact.lastName}`}
										onDelete={() => handleRemoveContact(contact.id)}
									/>
								))}
							</Box>
						</Box>
					)}

					{loading && (
						<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
							<CircularProgress />
						</Box>
					)}

					{error && (
						<Typography color='error' sx={{ mt: 2 }}>
							{error}
						</Typography>
					)}
				</Box>
			</DialogContent>
			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button onClick={handleSave} variant='contained' color='primary'>
					Save
				</Button>
			</DialogActions>
		</Dialog>
	);
}

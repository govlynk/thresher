import React, { useState, useEffect } from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	Box,
	List, 
	ListItemButton,
	ListItemText, 
	Checkbox,
	Chip,
	TextField,
	InputAdornment,
	CircularProgress,
	Alert,
	Typography,
	FormControl,
	Select,
	MenuItem,
} from "@mui/material";
import { Search, UserPlus } from "lucide-react";
import { useContactStore } from "../../stores/contactStore";
import { useTeamMemberStore } from "../../stores/teamMemberStore";

const ROLES = [
	"Decision Maker",
	"Business Development",
	"Sales",
	"Marketing",
	"Finance",
	"Engineering",
	"Contracts",
	"Consultant",
	"Negotiator",
	"SME",
	"Other",
];

export function TeamMemberDialog({ open, onClose, team }) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedContacts, setSelectedContacts] = useState([]);
	const { contacts, fetchContacts, loading: contactsLoading } = useContactStore();
	const { addTeamMember, loading: addingMember } = useTeamMemberStore();
	const [loading, setLoading] = useState(false); 
	const [error, setError] = useState(null);

	// Fetch contacts when dialog opens
	useEffect(() => {
		if (open && team?.companyId) {
			fetchContacts(team.companyId);
		}
	}, [open, team?.companyId, fetchContacts]);

	// Reset state when dialog opens/closes
	useEffect(() => {
		if (open) {
			setSelectedContacts([]);
			setSearchTerm("");
			setError(null);
		}
	}, [open]);

	// Filter contacts based on search and existing team members
	const filteredContacts = contacts.filter((contact) => {
		const searchStr = searchTerm.toLowerCase();
		const isMatch =
			contact.firstName.toLowerCase().includes(searchStr) ||
			contact.lastName.toLowerCase().includes(searchStr) ||
			contact.contactEmail?.toLowerCase().includes(searchStr);

		// Exclude existing team members
		const isNotMember =
			!(Array.isArray(team?.members) && team.members.some((m) => m.contactId === contact.id));

		return isMatch && isNotMember;
	});

	const handleToggleContact = (contact) => {
		const exists = selectedContacts.some(c => c.id === contact.id);
		if (exists) {
			setSelectedContacts(prev => prev.filter(c => c.id !== contact.id));
		} else {
			setSelectedContacts(prev => [...prev, { id: contact.id, role: ROLES[0] }]);
		}
	};

	const handleRoleChange = (contactId, newRole) => {
		setSelectedContacts(prev => prev.map(contact => 
			contact.id === contactId ? { ...contact, role: newRole } : contact
		));
	};

	const handleSave = async () => {
		if (selectedContacts.length === 0) {
			setError("Please select at least one contact");
			return;
		}

		if (!team?.id) {
			setError("No team selected");
			return;
		}

		setLoading(true);
		try {
			for (const contact of selectedContacts) {
				if (!contact.role) {
					throw new Error(`Please select a role for all team members`);
				}

				await addTeamMember({
					teamId: team.id,
					contactId: contact.id,
					role: contact.role,
				});
			}

			onClose();
		} catch (err) {
			console.error("Error saving team member(s):", err);
			setError(err.message || "Failed to save team member(s)");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
			<DialogTitle>
				<Typography variant="h6">Add Team Members</Typography>
				<Typography variant="subtitle2" color="text.secondary">
					Select contacts to add to the team
				</Typography>
			</DialogTitle>

			<DialogContent>
				<Box sx={{ mb: 3 }}>
					{error && (
						<Alert severity='error' sx={{ mb: 2 }}>
							{error}
						</Alert>
					)}

					<TextField
						fullWidth
						placeholder='Search contacts...'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position="start">
									<Search size={20} />
								</InputAdornment>
							),
						}}
						sx={{ mb: 2 }}
					/>

					{contactsLoading ? (
						<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
							<CircularProgress />
						</Box>
					) : (
						<List sx={{ maxHeight: 400, overflow: "auto" }}>
							{filteredContacts.length > 0 ? (
								filteredContacts.map((contact) => (
									<ListItemButton
										key={contact.id}
										onClick={() => handleToggleContact(contact)}
										selected={selectedContacts.some(c => c.id === contact.id)}
										sx={{
											borderRadius: 1,
											mb: 1,
											"&:hover": {
												bgcolor: "action.hover",
											},
										}}
									>
										<Box sx={{ width: '100%' }}>
											<Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
												<Box sx={{ display: 'flex', alignItems: 'center' }}>
													<Checkbox
														checked={selectedContacts.some(c => c.id === contact.id)}
														onChange={() => handleToggleContact(contact)}
														onClick={(e) => e.stopPropagation()}
													/>
													<ListItemText
														primary={`${contact.firstName} ${contact.lastName}`}
														secondary={contact.contactEmail || contact.contactMobilePhone || "No contact info"}
													/>
												</Box>
												<Chip
													label={contact.title || "No title"}
													size='small'
													variant='outlined'
												/>
											</Box>
											
											{selectedContacts.some(c => c.id === contact.id) && (
												<Box sx={{ pl: 6 }}>
													<FormControl fullWidth size="small">
														<Select
															value={selectedContacts.find(c => c.id === contact.id)?.role || ""}
															onChange={(e) => handleRoleChange(contact.id, e.target.value)}
															onClick={(e) => e.stopPropagation()}
														>
															{ROLES.map((role) => (
																<MenuItem key={role} value={role}>
																	{role}
																</MenuItem>
															))}
														</Select>
													</FormControl>
												</Box>
											)}
										</Box>
									</ListItemButton>
								))
							) : (
								<Typography color='text.secondary' align='center'>
									No contacts available to add
								</Typography>
							)}
						</List>
					)}
				</Box>
			</DialogContent>

			<DialogActions>
				<Button onClick={onClose}>Cancel</Button>
				<Button
					onClick={handleSave}
					variant='contained'
					disabled={loading || selectedContacts.length === 0}
					startIcon={loading ? <CircularProgress size={20} /> : <UserPlus size={20} />}
				>
					{loading ? "Saving..." : `Add ${selectedContacts.length} Member${selectedContacts.length !== 1 ? 's' : ''}`}
				</Button>
			</DialogActions>
		</Dialog>
	);
}
import React, { useState, useEffect } from "react";
import {
	Alert,
	Box,
	Button,
	Checkbox,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Typography,
	Chip,
	TextField,
	InputAdornment,
	CircularProgress,
} from "@mui/material";
import { Search, UserPlus } from "lucide-react";
import { useContactStore } from "../../stores/contactStore";
import { useTeamMemberStore } from "../../stores/teamMemberStore";

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

export function TeamMemberDialog({ open, onClose, team }) {
	const [selectedRole, setSelectedRole] = useState("");
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedContactIds, setSelectedContactIds] = useState([]);
	const { contacts, fetchContacts, loading: contactsLoading } = useContactStore();
	const { addTeamMember, loading: addingMember } = useTeamMemberStore();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(() => {
		if (team?.companyId) {
			fetchContacts(team.companyId);
		}
	}, [team?.companyId, fetchContacts]);

	// Reset state when dialog opens/closes
	useEffect(() => {
		setSelectedContactIds([]);
		setSelectedRole("");
		setSearchTerm("");
		setError(null);
	}, [open]);

	const filteredContacts = contacts.filter((contact) => {
		const searchStr = searchTerm.toLowerCase();
		const isMatch =
			contact.firstName.toLowerCase().includes(searchStr) ||
			contact.lastName.toLowerCase().includes(searchStr) ||
			contact.contactEmail?.toLowerCase().includes(searchStr);

		// Safely check if contact is already a team member
		const isNotMember = !(
			Array.isArray(team?.members) && team.members.some((member) => member.contactId === contact.id)
		);
		return isMatch && isNotMember;
	});

	const handleToggleContact = (contactId) => {
		setSelectedContactIds((prev) =>
			prev.includes(contactId) ? prev.filter((id) => id !== contactId) : [...prev, contactId]
		);
	};

	const handleSave = async () => {
		console.log("TeamMemberDialog: Starting save with:", {
			selectedRole,
			selectedContactIds,
			team,
		});

		if (!selectedRole) {
			setError("Please select a role");
			return;
		}

		if (selectedContactIds.length === 0) {
			setError("Please select at least one contact");
			return;
		}

		if (!team?.id) {
			setError("No team selected");
			return;
		}

		setLoading(true);
		try {
			for (const contactId of selectedContactIds) {
				console.log("TeamMemberDialog: Adding member:", { contactId, role: selectedRole });
				await addTeamMember({
					teamId: team.id,
					contactId,
					role: selectedRole,
				});
			}

			console.log("TeamMemberDialog: Successfully added all members");
			onClose();
		} catch (err) {
			console.error("Error adding team members:", err);
			setError(err.message || "Failed to add team members");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
			<DialogTitle sx={{ pb: 0 }}>
				<Typography variant='h5' component='div'>
					{`Add Members to ${team?.name || "Team"}`}
				</Typography>
				<Typography variant='body2' color='text.secondary'>
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

					<TextField
						fullWidth
						placeholder='Search contacts...'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						InputProps={{
							startAdornment: (
								<InputAdornment position='start'>
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
									<ListItem
										key={contact.id}
										sx={{
											borderRadius: 1,
											mb: 1,
											"&:hover": {
												bgcolor: "action.hover",
											},
										}}
									>
										<Checkbox
											checked={selectedContactIds.includes(contact.id)}
											onChange={() => handleToggleContact(contact.id)}
										/>
										<ListItemText
											primary={`${contact.firstName} ${contact.lastName}`}
											secondary={contact.contactEmail || contact.contactMobilePhone || "No contact info"}
										/>
										<ListItemSecondaryAction>
											<Chip
												label={contact.title || "No title"}
												size='small'
												variant='outlined'
												sx={{ mr: 1 }}
											/>
										</ListItemSecondaryAction>
									</ListItem>
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
					disabled={loading || selectedContactIds.length === 0}
					startIcon={loading ? <CircularProgress size={20} /> : <UserPlus size={20} />}
				>
					Add Selected Members
				</Button>
			</DialogActions>
		</Dialog>
	);
}

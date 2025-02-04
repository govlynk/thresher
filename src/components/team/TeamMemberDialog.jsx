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
	InputLabel,
	CircularProgress,
	Alert,
	Typography,
	FormControl,
	Select,
	MenuItem,
	Divider,
} from "@mui/material";
import { Search, UserPlus } from "lucide-react";
import { useContactStore } from "../../stores/contactStore";
import { useTeamMemberStore } from "../../stores/teamMemberStore";
import { useGlobalStore } from "../../stores/globalStore";

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
	const { activeUserData } = useGlobalStore();
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [showCreateContact, setShowCreateContact] = useState(false);

	// Check user authorization
	const isAuthorized = activeUserData?.groups?.some((group) =>
		["GOVLYNK_ADMIN", "GOVLYNK_USER", "COMPANY_ADMIN"].includes(group)
	);

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
			(contact.firstName?.toLowerCase() || "").includes(searchStr) ||
			(contact.lastName?.toLowerCase() || "").includes(searchStr) ||
			(contact.contactEmail?.toLowerCase() || "").includes(searchStr);

		// Exclude existing team members
		const isNotMember = !team?.members?.some((m) => m.contactId === contact.id);

		return isMatch && isNotMember;
	});

	// Get current user's contact directly from activeUserData
	const currentUserContact = contacts.find((contact) => contact.id === activeUserData?.contactId);

	// Check if user can be added as GovLynk member
	const canAddAsGovLynkMember =
		activeUserData?.groups?.includes("GOVLYNK_ADMIN") || activeUserData?.groups?.includes("GOVLYNK_USER");

	const handleToggleContact = (contact) => {
		const exists = selectedContacts.some((c) => c.id === contact.id);
		if (exists) {
			setSelectedContacts((prev) => prev.filter((c) => c.id !== contact.id));
		} else {
			setSelectedContacts((prev) => [
				...prev,
				{
					id: contact.id,
					role: ROLES[0],
					workload: 100,
				},
			]);
		}
	};

	const handleRoleChange = (contactId, newRole) => {
		setSelectedContacts((prev) =>
			prev.map((contact) => (contact.id === contactId ? { ...contact, role: newRole } : contact))
		);
	};

	const handleAddGovLynkUser = async () => {
		if (!activeUserData || !team?.id) return;

		// Check if user is already a member
		// const isMember = team.members?.some((member) => member.contact && member.contact.id === activeUserData.contactId);

		// if (isMember) {
		// 	setError("You are already a member of this team");
		// 	return;
		// }

		// Verify user data
		if (!activeUserData.contactId) {
			setError("Missing required user information");
			return;
		}

		// Verify user is authorized
		if (!isAuthorized) {
			setError("You are not authorized to add team members");
			return;
		}

		setLoading(true);
		try {
			await addTeamMember({
				teamId: team.id,
				contactId: activeUserData.contactId,
				role: "Consultant",
				isGovLynkUser: true,
				workload: 100,
			});

			onClose();
		} catch (err) {
			console.error("Error adding GovLynk user:", err);
			setError(err.message || "Failed to add GovLynk user");
		} finally {
			setLoading(false);
		}
	};

	const handleSave = async () => {
		if (!isAuthorized) {
			setError("You are not authorized to add team members");
			return;
		}

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

				const memberData = {
					teamId: team.id,
					contactId: contact.id,
					role: selectedContacts.find((c) => c.id === contact.id)?.role,
					isGovLynkUser: false,
					workload: selectedContacts.find((c) => c.id === contact.id)?.workload || 100,
				};

				await addTeamMember(memberData);
			}

			onClose();
		} catch (err) {
			console.error("Error saving team member(s):", err);
			setError(err.message || "Failed to save team member(s)");
		} finally {
			setLoading(false);
		}
	};

	if (!isAuthorized) {
		return (
			<Dialog open={open} onClose={onClose}>
				<DialogContent>
					<Alert severity='error'>You must be a GovLynk Admin or User to add team members.</Alert>
				</DialogContent>
				<DialogActions>
					<Button onClick={onClose}>Close</Button>
				</DialogActions>
			</Dialog>
		);
	}

	return (
		<Dialog open={open} onClose={onClose} maxWidth='md' fullWidth>
			<DialogTitle>
				<Typography component='div' variant='h6'>
					Add Team Members
				</Typography>
				<Typography component='div' variant='subtitle2' color='text.secondary'>
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
						<Box>
							{/* Company Contacts Section */}
							<Typography variant='subtitle2' color='text.secondary' gutterBottom>
								Company Contacts
							</Typography>
							<List sx={{ maxHeight: 300, overflow: "auto", mb: 2 }}>
								{filteredContacts.length > 0 ? (
									filteredContacts.map((contact) => (
										<ListItemButton
											key={contact.id}
											onClick={() => handleToggleContact(contact)}
											selected={selectedContacts.some((c) => c.id === contact.id)}
											sx={{
												borderRadius: 1,
												mb: 1,
												"&:hover": {
													bgcolor: "action.hover",
												},
											}}
										>
											<Box sx={{ width: "100%" }}>
												<Box
													sx={{
														display: "flex",
														justifyContent: "space-between",
														alignItems: "center",
														mb: 1,
													}}
												>
													<Box sx={{ display: "flex", alignItems: "center" }}>
														<Checkbox
															checked={selectedContacts.some((c) => c.id === contact.id)}
															onChange={() => handleToggleContact(contact)}
															onClick={(e) => e.stopPropagation()}
														/>
														<ListItemText
															primary={`${contact.firstName} ${contact.lastName}`}
															secondary={
																contact.contactEmail || contact.contactMobilePhone || "No contact info"
															}
														/>
													</Box>
													<Chip label={contact.title || "No title"} size='small' variant='outlined' />
												</Box>

												{selectedContacts.some((c) => c.id === contact.id) && (
													<Box sx={{ pl: 6, display: "flex", gap: 2 }}>
														<FormControl fullWidth size='small'>
															<InputLabel id='demo-simple-select-label'>Role</InputLabel>
															<Select
																label='role'
																value={selectedContacts.find((c) => c.id === contact.id)?.role || ""}
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
														<FormControl sx={{ width: 150 }} size='small'>
															<TextField
																type='number'
																label='Time Available'
																value={
																	selectedContacts.find((c) => c.id === contact.id)?.workload || 100
																}
																onChange={(e) => {
																	const value = Math.max(
																		0,
																		Math.min(100, parseInt(e.target.value) || 0)
																	);
																	setSelectedContacts((prev) =>
																		prev.map((c) =>
																			c.id === contact.id ? { ...c, workload: value } : c
																		)
																	);
																}}
																onClick={(e) => e.stopPropagation()}
																InputProps={{
																	endAdornment: <InputAdornment position='end'>%</InputAdornment>,
																}}
																inputProps={{
																	min: 0,
																	max: 100,
																	step: 5,
																}}
															/>
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

							{/* Separator */}
							<Divider sx={{ my: 2 }}>
								<Chip label='Current User' />
							</Divider>

							{/* Current User Section */}
							{currentUserContact ? (
								<ListItemButton
									onClick={() =>
										!team?.members?.some((m) => m.contactId === currentUserContact.id) &&
										handleToggleContact(currentUserContact)
									}
									selected={selectedContacts.some((c) => c.id === currentUserContact.id)}
									disabled={team?.members?.some((m) => m.contactId === currentUserContact.id)}
									sx={{
										borderRadius: 1,
										bgcolor: "action.selected",
										opacity: team?.members?.some((m) => m.contactId === currentUserContact.id) ? 0.5 : 1,
									}}
								>
									<Box sx={{ width: "100%" }}>
										<Box
											sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}
										>
											<Box sx={{ display: "flex", alignItems: "center" }}>
												<Checkbox
													checked={selectedContacts.some((c) => c.id === activeUserData?.contactId)}
													onChange={() => handleToggleContact(currentUserContact)}
													onClick={(e) => e.stopPropagation()}
												/>
												<ListItemText
													primary={`${currentUserContact.firstName} ${currentUserContact.lastName} (You)`}
													secondary={currentUserContact.contactEmail}
												/>
											</Box>
											<Chip label='GovLynk User' color='primary' size='small' />
										</Box>

										{selectedContacts.some((c) => c.id === activeUserData?.contactId) && (
											<Box sx={{ pl: 6 }}>
												<FormControl fullWidth size='small'>
													<Select
														value={
															selectedContacts.find((c) => c.id === activeUserData?.contactId)?.role ||
															""
														}
														onChange={(e) => handleRoleChange(activeUserData?.contactId, e.target.value)}
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
							) : (
								<Box>
									{canAddAsGovLynkMember ? (
										<Box sx={{ p: 2, textAlign: "center" }}>
											<Typography variant='body2' color='text.secondary' gutterBottom>
												You can be added as a GovLynk team member
											</Typography>
											<Button variant='outlined' onClick={handleAddGovLynkUser} disabled={loading}>
												Add as GovLynk Member
											</Button>
										</Box>
									) : (
										<Alert severity='warning'>
											Your user account is not linked to a contact record in this company. Please contact an
											administrator to create a contact record.
										</Alert>
									)}
								</Box>
							)}
						</Box>
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
					{loading
						? "Saving..."
						: `Add ${selectedContacts.length} Member${selectedContacts.length !== 1 ? "s" : ""}`}
				</Button>
			</DialogActions>
		</Dialog>
	);
}

import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	IconButton,
	Alert,
	CircularProgress,
} from "@mui/material";
import { UserPlus, Edit, Trash2 } from "lucide-react";
import { ContactDialog } from "../components/contacts/ContactDialog";
import { useContactStore } from "../stores/contactStore";
import { useUserCompanyStore } from "../stores/userCompanyStore";

export default function ContactsScreen() {
	const { contacts, fetchContacts, loading, error, removeContact } = useContactStore();
	const { getActiveCompany } = useUserCompanyStore();
	const activeCompany = getActiveCompany();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editContact, setEditContact] = useState(null);

	useEffect(() => {
		if (activeCompany?.id) {
			fetchContacts(activeCompany.id);
		}
	}, [activeCompany?.id, fetchContacts]);

	const handleAddContact = () => {
		setEditContact(null);
		setDialogOpen(true);
	};

	const handleEditContact = (contact) => {
		setEditContact(contact);
		setDialogOpen(true);
	};

	const handleDeleteContact = async (contactId) => {
		if (window.confirm("Are you sure you want to delete this contact?")) {
			try {
				await removeContact(contactId);
			} catch (err) {
				console.error("Failed to remove contact:", err);
			}
		}
	};

	if (!activeCompany) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='warning'>Please select a company to manage contacts</Alert>
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			<Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
				<Typography variant='h4' sx={{ fontWeight: "bold" }}>
					Contacts
				</Typography>
				<Button variant='contained' startIcon={<UserPlus />} onClick={handleAddContact}>
					Add Contact
				</Button>
			</Box>

			{error && (
				<Alert severity='error' sx={{ mb: 3 }}>
					{error}
				</Alert>
			)}

			{loading ? (
				<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
					<CircularProgress />
				</Box>
			) : (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Phone</TableCell>
								<TableCell>Title</TableCell>
								<TableCell align='right'>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{contacts.map((contact) => (
								<TableRow key={contact.id} hover>
									<TableCell>{`${contact.firstName} ${contact.lastName}`}</TableCell>
									<TableCell>{contact.contactEmail}</TableCell>
									<TableCell>{contact.contactMobilePhone || contact.contactBusinessPhone}</TableCell>
									<TableCell>{contact.title}</TableCell>
									<TableCell align='right'>
										<IconButton onClick={() => handleEditContact(contact)} size='small'>
											<Edit size={18} />
										</IconButton>
										<IconButton onClick={() => handleDeleteContact(contact.id)} size='small' color='error'>
											<Trash2 size={18} />
										</IconButton>
									</TableCell>
								</TableRow>
							))}
							{contacts.length === 0 && (
								<TableRow>
									<TableCell colSpan={5} align='center'>
										No contacts found
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			<ContactDialog
				open={dialogOpen}
				onClose={() => {
					setDialogOpen(false);
					setEditContact(null);
				}}
				contact={editContact}
			/>
		</Box>
	);
}

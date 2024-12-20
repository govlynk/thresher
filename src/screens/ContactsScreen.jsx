import React, { useState, useEffect } from "react";
import { Box, Button, CircularProgress, Alert } from "@mui/material";
import { ContactList } from "../components/contacts/ContactList";
import { ContactDialog } from "../components/contacts/ContactDialog";
import { useContactStore } from "../stores/contactStore";

export function ContactsScreen() {
	const [dialogOpen, setDialogOpen] = useState(false);
	const [selectedContact, setSelectedContact] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const { contacts, fetchContacts, deleteContact } = useContactStore();

	useEffect(() => {
		const loadContacts = async () => {
			try {
				setLoading(true);
				await fetchContacts();
			} catch (err) {
				console.error("Error loading contacts:", err);
				setError(err.message || "Failed to load contacts");
			} finally {
				setLoading(false);
			}
		};
		loadContacts();
	}, [fetchContacts]);

	const handleAddContact = () => {
		setSelectedContact(null);
		setDialogOpen(true);
	};

	const handleEditContact = (contact) => {
		if (contact && typeof contact === "object") {
			setSelectedContact(contact);
			setDialogOpen(true);
		}
	};

	const handleDeleteContact = async (contactId) => {
		if (contactId) {
			try {
				await deleteContact(contactId);
			} catch (err) {
				console.error("Error deleting contact:", err);
				setError(err.message || "Failed to delete contact");
			}
		}
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
		setSelectedContact(null);
	};

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='error' sx={{ mb: 2 }}>
					{error}
				</Alert>
			</Box>
		);
	}

	return (
		<Box sx={{ p: 3 }}>
			<Box sx={{ mb: 3 }}>
				<Button variant='contained' onClick={handleAddContact}>
					Add Contact
				</Button>
			</Box>

			{Array.isArray(contacts) ? (
				<ContactList contacts={contacts} onEditContact={handleEditContact} onDeleteContact={handleDeleteContact} />
			) : (
				<Alert severity='warning'>No contacts available</Alert>
			)}

			<ContactDialog open={dialogOpen} onClose={handleCloseDialog} contact={selectedContact} />
		</Box>
	);
}

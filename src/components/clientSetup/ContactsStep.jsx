import React, { useState, useEffect } from "react";
import { Box, Button, Typography, Alert } from "@mui/material";
import { UserPlus } from "lucide-react";
import { useSetupWorkflowStore } from "../../stores/setupWorkflowStore";
import { ContactDialog } from "./contacts/ContactDialog";
import { ContactsTable } from "./contacts/ContactsTable";

export function ContactsStep() {
	const { companyData, contactsData, setContactsData, nextStep, prevStep } = useSetupWorkflowStore();
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editContact, setEditContact] = useState(null);
	const [error, setError] = useState(null);

	useEffect(() => {
		// Initialize contacts from company data if available
		if (companyData) {
			const initialContacts = [];
			if (companyData.EBfirstName) {
				initialContacts.push({
					id: "eb",
					firstName: companyData.EBfirstName,
					lastName: companyData.EBlastName,
					email: companyData.EBemail,
					phone: companyData.EBphone,
					dateLastContacted: new Date().toISOString(),
					role: "Executive",
					notes: `Initial contact created during company setup. Role: Electronic Business POC`,
				});
			}
			if (companyData.GBfirstName) {
				initialContacts.push({
					id: "gb",
					firstName: companyData.GBfirstName,
					lastName: companyData.GBlastName,
					email: companyData.GBemail,
					phone: companyData.GBphone,
					dateLastContacted: new Date().toISOString(),
					role: "Executive",
					notes: `Initial contact created during company setup. Role: Governemnt Business POC`,
				});
			}
			setContactsData(initialContacts);
		}
	}, [companyData, setContactsData]);

	const handleSaveContact = (formData) => {
		const newContact = {
			id: editContact?.id || Date.now().toString(),
			...formData,
		};

		setContactsData(
			editContact
				? contactsData.map((c) => (c.id === editContact.id ? newContact : c))
				: [...contactsData, newContact]
		);

		setDialogOpen(false);
		setEditContact(null);
		setError(null);
	};

	return (
		<Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
			<Typography variant='h5' gutterBottom>
				Manage Contacts
			</Typography>

			{error && (
				<Alert severity='error' sx={{ mb: 3 }}>
					{error}
				</Alert>
			)}

			<Box sx={{ mb: 3 }}>
				<Button variant='contained' startIcon={<UserPlus />} onClick={() => setDialogOpen(true)}>
					Add Contact
				</Button>
			</Box>

			<ContactsTable
				contacts={contactsData}
				onEdit={(contact) => {
					setEditContact(contact);
					setDialogOpen(true);
				}}
				onDelete={(contactId) => {
					setContactsData(contactsData.filter((c) => c.id !== contactId));
				}}
			/>

			<Box sx={{ display: "flex", justifyContent: "space-between" }}>
				<Button onClick={prevStep}>Back</Button>
				<Button variant='contained' onClick={nextStep} disabled={contactsData.length === 0}>
					Continue
				</Button>
			</Box>

			<ContactDialog
				open={dialogOpen}
				onClose={() => {
					setDialogOpen(false);
					setEditContact(null);
				}}
				onSave={handleSaveContact}
				initialData={editContact}
				error={error}
			/>
		</Box>
	);
}

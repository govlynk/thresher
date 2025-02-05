import { useState, useEffect, useMemo } from "react";
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

	// Helper function to check if two contacts are duplicates based on name
	const isDuplicateContact = (contact1, contact2) => {
		return (
			contact1.firstName?.toLowerCase() === contact2.firstName?.toLowerCase() &&
			contact1.lastName?.toLowerCase() === contact2.lastName?.toLowerCase()
		);
	};

	useEffect(() => {
		// Initialize contacts from company data if available
		if (companyData && contactsData.length === 0) {
			const initialContacts = [];

			// Create EB contact object if data exists
			const ebContact = companyData.EBfirstName
				? {
						rowId: "EB",
						firstName: companyData.EBfirstName,
						lastName: companyData.EBlastName,
						email: companyData.EBemail,
						phone: companyData.EBphone,
						workAddressStreetLine1: companyData.shippingAddressStreetLine1 || null,
						workAddressStreetLine2: companyData.shippingAddressStreetLine2 || null,
						workAddressCity: companyData.shippingAddressCity || null,
						workAddressStateCode: companyData.shippingAddressStateCode || null,
						workAddressZipCode: companyData.shippingAddressZipCode || null,
						workAddressCountryCode: companyData.shippingAddressCountryCode || "USA",
						dateLastContacted: new Date().toISOString(),
						companyId: companyData.id,
						role: "Contracts",
						notes: `Initial contact created during company setup. Role: Electronic Business POC`,
				  }
				: null;

			// Create GB contact object if data exists
			const gbContact = companyData.GBfirstName
				? {
						rowId: "GB",
						firstName: companyData.GBfirstName,
						lastName: companyData.GBlastName,
						email: companyData.GBemail,
						phone: companyData.GBphone,
						workAddressStreetLine1: companyData.shippingAddressStreetLine1 || null,
						workAddressStreetLine2: companyData.shippingAddressStreetLine2 || null,
						workAddressCity: companyData.shippingAddressCity || null,
						workAddressStateCode: companyData.shippingAddressStateCode || null,
						workAddressZipCode: companyData.shippingAddressZipCode || null,
						workAddressCountryCode: companyData.shippingAddressCountryCode || "USA",
						dateLastContacted: new Date().toISOString(),
						companyId: companyData.id,
						role: "Contracts",
						notes: `Initial contact created during company setup. Role: Government Business POC`,
				  }
				: null;

			// Add EB contact if it exists
			if (ebContact) {
				initialContacts.push(ebContact);
			}

			// Add GB contact if it exists and is not a duplicate of EB contact
			if (gbContact && (!ebContact || !isDuplicateContact(ebContact, gbContact))) {
				initialContacts.push(gbContact);
			}

			setContactsData(initialContacts);
		}
	}, [companyData, setContactsData]);

	const handleSaveContact = (formData) => {
		const newContact = {
			rowId: editContact?.rowId || Date.now().toString(),
			companyId: companyData.id,
			...formData,
		};

		// Check for duplicates only when adding a new contact
		if (!editContact) {
			const isDuplicate = contactsData.some((existingContact) => isDuplicateContact(existingContact, newContact));

			if (isDuplicate) {
				setError("A contact with this name already exists.");
				return;
			}
		}

		setContactsData(
			editContact
				? contactsData.map((c) => (c.rowId === editContact.rowId ? newContact : c))
				: [...contactsData, newContact]
		);

		setDialogOpen(false);
		setEditContact(null);
		setError(null);
	};

	const handleEditContact = (contact) => {
		setEditContact(contact);
		setDialogOpen(true);
	};

	const handleRemoveContact = (contactId) => {
		setContactsData(contactsData.filter((c) => c.id !== contactId));
	};

	const handleCloseDialog = () => {
		setDialogOpen(false);
		setEditContact(null);
	};

	// Check if at least one contact has an email address
	const hasContactWithEmail = contactsData.some((contact) => contact.email || contact.contactEmail);

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

			<ContactsTable contacts={contactsData} onEdit={handleEditContact} onDelete={handleRemoveContact} />

			<Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
				<Button onClick={prevStep}>Back</Button>
				<Button variant='contained' onClick={nextStep} disabled={contactsData.length === 0 || !hasContactWithEmail}>
					Continue
				</Button>
			</Box>

			{contactsData.length > 0 && !hasContactWithEmail && (
				<Alert severity='warning' sx={{ mt: 2 }}>
					At least one contact must have an email address to continue.
				</Alert>
			)}

			<ContactDialog
				open={dialogOpen}
				onClose={handleCloseDialog}
				onSave={handleSaveContact}
				initialData={editContact}
				error={error}
			/>
		</Box>
	);
}

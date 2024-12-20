import React from "react";
import { BaseFormDialog } from "../common/BaseFormDialog";
import { ContactForm } from "./ContactForm";
import { useContactStore } from "../../stores/contactStore";
import { useGlobalStore } from "../../stores/globalStore";

export function ContactDialog({ open, onClose, contact }) {
	const { addContact, updateContact } = useContactStore();
	const { activeCompanyId } = useGlobalStore();

	const initialData = contact
		? {
				firstName: contact.firstName || "",
				lastName: contact.lastName || "",
				contactEmail: contact.contactEmail || "",
				contactMobilePhone: contact.contactMobilePhone || "",
				contactBusinessPhone: contact.contactBusinessPhone || "",
				title: contact.title || "",
				department: contact.department || "",
				workAddressStreetLine1: contact.workAddressStreetLine1 || "",
				workAddressStreetLine2: contact.workAddressStreetLine2 || "",
				workAddressCity: contact.workAddressCity || "",
				workAddressStateCode: contact.workAddressStateCode || "",
				workAddressZipCode: contact.workAddressZipCode || "",
				workAddressCountryCode: contact.workAddressCountryCode || "USA",
				notes: contact.notes || "",
		  }
		: {
				firstName: "",
				lastName: "",
				contactEmail: "",
				contactMobilePhone: "",
				contactBusinessPhone: "",
				title: "",
				department: "",
				workAddressStreetLine1: "",
				workAddressStreetLine2: "",
				workAddressCity: "",
				workAddressStateCode: "",
				workAddressZipCode: "",
				workAddressCountryCode: "USA",
				notes: "",
		  };

	const validateForm = (data) => {
		const errors = {};
		if (!data.firstName?.trim()) errors.firstName = "First name is required";
		if (!data.lastName?.trim()) errors.lastName = "Last name is required";
		if (!data.contactEmail?.trim()) errors.contactEmail = "Email is required";
		if (!activeCompanyId) errors.submit = "No active company selected";
		return Object.keys(errors).length ? errors : null;
	};

	const handleSave = async (formData) => {
		const contactData = {
			...formData,
			companyId: activeCompanyId,
			dateLastContacted: new Date().toISOString(),
		};

		if (contact?.id) {
			return updateContact(contact.id, contactData);
		}
		return addContact(contactData);
	};

	return (
		<BaseFormDialog
			open={open}
			onClose={onClose}
			title={contact ? "Edit Contact" : "Add New Contact"}
			initialData={initialData}
			validateForm={validateForm}
			onSave={handleSave}
			FormComponent={ContactForm}
			maxWidth='md'
		/>
	);
}

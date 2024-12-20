import React from "react";
import { BaseFormDialog } from "../common/BaseFormDialog";
import { UserForm } from "./UserForm";
import { useUserStore } from "../../stores/userStore";
import { useGlobalStore } from "../../stores/globalStore";

export function UserDialog({ open, onClose, editUser, contactData }) {
	const { addUser, updateUser } = useUserStore();
	const { activeCompanyId } = useGlobalStore();

	const initialData = React.useMemo(() => {
		if (editUser) {
			return {
				cognitoId: editUser.cognitoId || "",
				email: editUser.email || "",
				name: editUser.name || "",
				phone: editUser.phone || "",
				status: editUser.status || "ACTIVE",
				accessLevel: editUser.companyRole?.access || "MEMBER",
			};
		}

		if (contactData) {
			return {
				email: contactData.contactEmail || "",
				name: `${contactData.firstName} ${contactData.lastName}`,
				phone: contactData.contactMobilePhone || contactData.contactBusinessPhone || "",
				status: "ACTIVE",
				accessLevel: "MEMBER",
				contactId: contactData.id,
			};
		}

		return {
			cognitoId: "",
			email: "",
			name: "",
			phone: "",
			status: "ACTIVE",
			accessLevel: "MEMBER",
		};
	}, [editUser, contactData]);

	const validateForm = (data) => {
		const errors = {};
		if (!data.email?.trim()) errors.email = "Email is required";
		if (!data.name?.trim()) errors.name = "Name is required";
		if (!data.accessLevel) errors.accessLevel = "Access level is required";
		if (!activeCompanyId) errors.submit = "No active company selected";
		return Object.keys(errors).length ? errors : null;
	};

	const handleSave = async (formData) => {
		const userData = {
			...formData,
			contactId: contactData?.id,
		};

		if (editUser) {
			return updateUser(editUser.id, userData);
		}

		return addUser({
			...userData,
			companyId: activeCompanyId,
		});
	};

	return (
		<BaseFormDialog
			open={open}
			onClose={onClose}
			title={editUser ? "Edit User" : "Create User Account"}
			initialData={initialData}
			validateForm={validateForm}
			onSave={handleSave}
			FormComponent={UserForm}
		/>
	);
}

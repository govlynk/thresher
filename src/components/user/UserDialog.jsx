import React from "react";
import { BaseFormDialog } from "../common/BaseFormDialog";
import { UserForm } from "./UserForm";
import { useUserStore } from "../../stores/userStore";

export function UserDialog({ open, onClose, editUser }) {
	const { addUser } = useUserStore();

	const initialData = React.useMemo(() => {
		if (!editUser)
			return {
				cognitoId: "",
				email: "",
				name: "",
				phone: "",
				status: "ACTIVE",
				accessLevel: "",
				companyRole: "",
				contactId: null,
			};

		return {
			cognitoId: editUser.cognitoId || "",
			email: editUser.email || "",
			name: editUser.name || "",
			phone: editUser.phone || "",
			status: editUser.status || "ACTIVE",
			accessLevel: editUser.accessLevel || "",
			companyRole: editUser.companyRole || "",
			contactId: editUser.contactId || null,
		};
	}, [editUser]);

	const validateForm = (data) => {
		const errors = {};
		if (!data.email?.trim()) errors.email = "Email is required";
		if (!data.name?.trim()) errors.name = "Name is required";
		if (!data.accessLevel) errors.accessLevel = "Access level is required";
		if (!data.companyRole) errors.companyRole = "Company role is required";
		return Object.keys(errors).length ? errors : null;
	};

	return (
		<BaseFormDialog
			open={open}
			onClose={onClose}
			title={editUser ? "Edit User" : "Create User Account"}
			initialData={initialData}
			validateForm={validateForm}
			onSave={addUser}
			FormComponent={UserForm}
		/>
	);
}

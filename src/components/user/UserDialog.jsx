import { BaseFormDialog } from "../common/BaseFormDialog";
import { useCompanyStore } from "../../stores/companyStore";
import { useUserStore } from "../../stores/userStore";
import { useUserCompanyAccessStore } from "../../stores/userCompanyAccessStore";
import { useAuthStore } from "../../stores/authStore";
import { generateClient } from "aws-amplify/data";
import { UserRegistrationForm } from "./UserRegistrationForm";

const client = generateClient({
	authMode: "userPool",
});

export function UserDialog({ open, onClose, contactData }) {
	const { addUser } = useUserStore();

	const initialData = {
		cognitoId: "",
		email: contactData?.contactEmail || "",
		name: contactData ? `${contactData.firstName} ${contactData.lastName}` : "",
		phone: contactData?.contactMobilePhone || contactData?.contactBusinessPhone || "",
		status: "ACTIVE",
		accessLevel: "",
		companyRole: "",
		contactId: contactData?.id || null,
	};

	const validateForm = (data) => {
		const errors = {};
		if (!data.email?.trim()) {
			errors.email = "Email is required";
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
			errors.email = "Invalid email format";
		}

		if (!data.name?.trim()) errors.name = "Name is required";
		if (!data.accessLevel) errors.accessLevel = "Access level is required";
		if (!data.companyRole) errors.companyRole = "Company role is required";
		return Object.keys(errors).length ? errors : null;
	};

	return (
		<BaseFormDialog
			open={open}
			onClose={onClose}
			title='Create User Account'
			initialData={initialData}
			validateForm={validateForm}
			onSave={addUser}
			FormComponent={UserRegistrationForm}
		/>
	);
}

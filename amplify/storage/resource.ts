import { defineStorage } from "@aws-amplify/backend";

// FIxing config issues
export const storage = defineStorage({
	name: "govlynkWorkDrive",
	access: (allow) => ({
		// Allow listing bucket contents and company directories

		"company/{company_id}/*": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN", "GOVLYNK_USER", "COMPANY_USER"]).to(["list"]),
			allow.entity("identity").to(["list"]),
		],

		// Documents subdirectory
		"company/{company_id}/documents/*": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["read", "write", "delete"]),
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["read", "write"]), // Add read permissions for user groups
			allow.entity("identity").to(["read"]),
		],
		// Documents subdirectory
		"company/{company_id}/documents/deliverables/*": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["read", "write", "delete"]),
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["read", "write"]), // Add read permissions for user groups
			allow.entity("identity").to(["read"]),
		],

		// Contracts subdirectory
		"company/{company_id}/documents/contracts/*": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["read", "write", "delete"]),
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["read", "write"]), // Add read permissions for user groups
			allow.entity("identity").to(["read"]),
		],
		// Contracts subdirectory
		"company/{company_id}/documents/branding/*": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["read", "write", "delete"]),
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["read", "write"]), // Add read permissions for user groups
			allow.entity("identity").to(["read"]),
		],
		// team subdirectory
		"company/{company_id}/team/*": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["read", "write", "delete"]),
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["read", "write"]), // Add read permissions for user groups
			allow.entity("identity").to(["read"]),
		],
		// contacts subdirectory
		"company/{company_id}/contacts/*": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["read", "write", "delete"]),
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["read", "write"]), // Add read permissions for user groups
			allow.entity("identity").to(["read"]),
		],
		// contacts subdirectory
		"company/{company_id}/contacts/{contact_id}*": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["read", "write", "delete"]),
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["read", "write"]), // Add read permissions for user groups
			allow.entity("identity").to(["read"]),
		],
		// Certifications subdirectory
		"company/{company_id}/certifications/*": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["read", "write", "delete"]),
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["read", "write"]), // Add read permissions for user groups
			allow.entity("identity").to(["read"]),
		],
	}),
});

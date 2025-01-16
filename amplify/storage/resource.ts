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
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["read"]), // Add read permissions for user groups
			allow.entity("identity").to(["read"]),
		],

		// Contracts subdirectory
		"company/{company_id}/contracts/*": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["read", "write", "delete"]),
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["read"]), // Add read permissions for user groups
			allow.entity("identity").to(["read"]),
		],

		// Certifications subdirectory
		"company/{company_id}/certifications/*": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["read", "write", "delete"]),
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["read"]), // Add read permissions for user groups
			allow.entity("identity").to(["read"]),
		],
	}),
});

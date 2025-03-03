import { defineStorage } from "@aws-amplify/backend";

// FIxing config issues
export const storage = defineStorage({
	name: "govlynkWorkDrive",
	access: (allow) => ({
		// Root company directory - only list access
		"company/{company_id}/*": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN", "GOVLYNK_USER", "COMPANY_USER"]).to(["get", "list"]),
			allow.entity("identity").to(["get", "list"]),
		],

		// Specific directory paths without overlapping prefixes
		"company/{company_id}/deliverables/*": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["get", "list", "write", "delete"]),
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["get", "list", "write"]),
			allow.entity("identity").to(["get", "list"]),
		],

		"company/{company_id}/contracts/*": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["get", "list", "write", "delete"]),
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["get", "list", "write"]),
			allow.entity("identity").to(["get", "list"]),
		],

		"company/{company_id}/branding/*": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["get", "list", "write", "delete"]),
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["get", "list", "write"]),
			allow.entity("identity").to(["get", "list"]),
		],

		"company/{company_id}/team/*": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["get", "list", "write", "delete"]),
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["get", "list", "write"]),
			allow.entity("identity").to(["get", "list"]),
		],

		"company/{company_id}/contacts/*": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["get", "list", "write", "delete"]),
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["get", "list", "write"]),
			allow.entity("identity").to(["get", "list"]),
		],

		"company/{company_id}/certifications/*": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["get", "list", "write", "delete"]),
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["get", "list", "write"]),
			allow.entity("identity").to(["get", "list"]),
		],
	}),
});

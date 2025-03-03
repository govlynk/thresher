import { defineStorage } from "@aws-amplify/backend";

// FIxing config issues
export const storage = defineStorage({
	name: "govlynkWorkDrive",
	access: (allow) => ({
		// Root company directory - only list access
		"company/{company_id}": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN", "GOVLYNK_USER", "COMPANY_USER"]).to(["get", "list"]),
			allow.entity("identity").to(["get", "list"]),
		],

		// Documents directory
		"company/{company_id}/documents": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN", "GOVLYNK_USER", "COMPANY_USER"]).to(["get", "list"]),
			allow.entity("identity").to(["get", "list"]),
		],

		// Deliverables directory
		"company/{company_id}/documents/deliverables": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["get", "list", "write", "delete"]),
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["get", "list", "write"]),
			allow.entity("identity").to(["get", "list"]),
		],

		// Contracts directory
		"company/{company_id}/documents/contracts": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["get", "list", "write", "delete"]),
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["get", "list", "write"]),
			allow.entity("identity").to(["get", "list"]),
		],

		// Branding directory
		"company/{company_id}/documents/branding": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["get", "list", "write", "delete"]),
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["get", "list", "write"]),
			allow.entity("identity").to(["get", "list"]),
		],

		// Team directory
		"company/{company_id}/team": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["get", "list", "write", "delete"]),
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["get", "list", "write"]),
			allow.entity("identity").to(["get", "list"]),
		],

		// Contacts directory
		"company/{company_id}/contacts": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["get", "list", "write", "delete"]),
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["get", "list", "write"]),
			allow.entity("identity").to(["get", "list"]),
		],

		// Individual contact files
		"company/{company_id}/contacts/{contact_id}": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["get", "list", "write", "delete"]),
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["get", "list", "write"]),
			allow.entity("identity").to(["get", "list"]),
		],

		// Certifications directory
		"company/{company_id}/certifications": [
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["get", "list", "write", "delete"]),
			allow.groups(["GOVLYNK_USER", "COMPANY_USER"]).to(["get", "list", "write"]),
			allow.entity("identity").to(["get", "list"]),
		],
	}),
});

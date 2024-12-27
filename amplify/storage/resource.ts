import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
	name: "govlynkWorkDrive",
	access: (allow) => ({
		"company{company_id}/*": [
			allow.entity("identity").to(["read", "write", "delete"]),
			allow.groups(["GOVLYNK_ADMIN", "COMPANY_ADMIN"]).to(["read", "write", "delete"]),
		],
	}),
});

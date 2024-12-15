// Setup data validation and initialization utilities
export function initializeCompanyData(companyData) {
	console.log("company data", companyData);
	return {
		legalBusinessName: companyData.legalBusinessName.trim(),
		dbaName: companyData.dbaName?.trim() || null,
		uei: companyData.uei.trim(),
		cageCode: companyData.cageCode || null,
		ein: companyData.ein || null,
		status: "ACTIVE",

		activationDate: companyData.activationDate ? new Date(companyData.activationDate).toISOString() : null,
		shippingAddressStreetLine1: companyData.shippingAddressStreetLine1 || null,
		shippingAddressStreetLine2: companyData.shippingAddressStreetLine2 || null,
		shippingAddressCity: companyData.shippingAddressCity || null,
		shippingAddressStateCode: companyData.shippingAddressStateCode || null,
		shippingAddressZipCode: companyData.shippingAddressZipCode || null,
		shippingAddressCountryCode: companyData.shippingAddressCountryCode || null,
		billingAddressCity: companyData.billingAddressCity || null,
		billingAddressCountryCode: companyData.billingAddressCountryCode || null,
		billingAddressStateCode: companyData.billingAddressStateCode || null,
		billingAddressStreetLine1: companyData.billingAddressStreetLine1 || null,
		billingAddressStreetLine2: companyData.billingAddressStreetLine2 || null,
		billingAddressZipCode: companyData.billingAddressZipCode || null,

		companyStartDate: companyData.companyStartDate ? new Date(companyData.companyStartDate).toISOString() : null,
		congressionalDistrict: companyData.congressionalDistrict || null,
		coreCongressionalDistrict: companyData.coreCongressionalDistrict || null,
		countryOfIncorporationCode: companyData.countryOfIncorporationCode || null,
		entityDivisionName: companyData.entityDivisionName || null,
		entityStartDate: companyData.entityStartDate ? new Date(companyData.entityStartDate).toISOString() : null,
		entityStructureDesc: companyData.entityStructureDesc || null,
		entityTypeDesc: companyData.entityTypeDesc || null,
		exclusionStatusFlag: companyData.exclusionStatusFlag || null,
		expirationDate: companyData.expirationDate ? new Date(companyData.expirationDate).toISOString() : null,
		fiscalYearEndCloseDate: companyData.fiscalYearEndCloseDate
			? new Date(companyData.fiscalYearEndCloseDate).toISOString()
			: null,
		lastUpdateDate: companyData.lastUpdateDate ? new Date(companyData.lastUpdateDate).toISOString() : null,

		companyEmail: companyData.companyEmail || null,
		companyPhoneNumber: companyData.companyPhoneNumber || null,
		companyWebsite: companyData.entityURL
			? companyData.entityURL.startsWith("http")
				? companyData.entityURL
				: `https://${companyData.entityURL}`
			: null,
		organizationStructureDesc: companyData.organizationStructureDesc || null,
		profitStructureDesc: companyData.profitStructureDesc || null,
		//
		registrationDate: companyData.registrationDate ? new Date(companyData.registrationDate).toISOString() : null,
		//
		registrationExpirationDate: companyData.registrationExpirationDate
			? new Date(companyData.registrationExpirationDate).toISOString()
			: null,

		registrationStatus: companyData.registrationStatus || null,
		purposeOfRegistrationDesc: companyData.purposeOfRegistrationDesc || null,

		submissionDate: companyData.submissionDate ? new Date(companyData.submissionDate).toISOString() : null,
		SAMPullDate: new Date().toISOString(),

		naicsCode: companyData.naicsCode || [],
		primaryNaics: companyData.primaryNaics || null,
		status: "ACTIVE",
		activationDate: new Date().toISOString(),
		SAMPullDate: new Date().toISOString(),
	};
}

export function initializeContactData(contact) {
	console.log("contact data", contact);
	return {
		firstName: contact.firstName,
		lastName: contact.lastName,
		title: contact.title || null,
		department: contact.department || null,
		contactEmail: contact.contactEmail,
		contactMobilePhone: contact.contactMobilePhone || null,
		contactBusinessPhone: contact.contactBusinessPhone || null,
		workAddressStreetLine1: contact.workAddressStreetLine1 || null,
		workAddressStreetLine2: contact.workAddressStreetLine2 || null,
		workAddressCity: contact.workAddressCity || null,
		workAddressStateCode: contact.workAddressStateCode || null,
		workAddressZipCode: contact.workAddressZipCode || null,
		workAddressCountryCode: contact.workAddressCountryCode || "USA",
		dateLastContacted: new Date().toISOString(),
		emailOptOut: false,
		notes: `Initial contact created during company setup. Role: ${contact.roleId}`,
		companyId: contact.companyId,
		documentFolder: null,
		resume: null,
	};
}

export function initializeUserData(userData) {
	console.log("user data", userData);
	return {
		cognitoId: userData.cognitoId || null,
		email: userData.email,
		name: `${userData.firstName} ${userData.lastName}`,
		phone: userData.contactBusinessPhone || userData.contactMobilePhone || null,
		status: "ACTIVE",
		avatar: null,
		contactId: userData.contactId,
		lastLogin: new Date().toISOString(),
	};
}

export function initializeTeamData(teamData, companyId) {
	console.log("team data", teamData);
	return {
		...teamData,
		companyId,
	};
}

export function initializeTeamMemberData(contactId, teamId, role) {
	console.log("team member data", contactId, teamId, role);
	return {
		contactId,
		teamId,
		role: role || "Sales",
	};
}

export function initializeUserCompanyAccess(userId, companyId, access) {
	console.log("user company access", userId, companyId, access);
	return {
		userId,
		companyId,
		access,
	};
}

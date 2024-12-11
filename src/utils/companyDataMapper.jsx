export const mapAddressData = (addressData, prefix = "") => {
	if (!addressData) return {};

	return {
		[`${prefix}City`]: addressData.city || null,
		[`${prefix}CountryCode`]: addressData.countryCode || null,
		[`${prefix}StateCode`]: addressData.stateOrProvinceCode || null,
		[`${prefix}StreetLine1`]: addressData.addressLine1 || null,
		[`${prefix}StreetLine2`]: addressData.addressLine2 || null,
		[`${prefix}ZipCode`]: addressData.zipCode || null,
	};
};

export const mapBusinessTypes = (businessTypes) => {
	if (!businessTypes?.businessTypeList) return {};

	return {
		sbaBusinessTypeDesc: businessTypes.businessTypeList.map((item) => item.sbaBusinessTypeDesc || null),
		certificationEntryDate: businessTypes.businessTypeList.map((item) => item.certificationEntryDate || null),
	};
};

export const mapGoodsAndServices = (goodsAndServices) => {
	if (!goodsAndServices) return {};

	return {
		naicsCode: goodsAndServices.naicsList?.map((item) => item.naicsCode) || [],
		primaryNaics: goodsAndServices.primaryNaics || null,
		pscCode: goodsAndServices.pscList?.map((item) => item.pscCode) || [],
	};
};

export const mapPointsOfContact = (POC) => {
	if (!POC) return {};
	console.log(POC);

	return {
		EBfirstName: POC.electronicBusinessPOC.firstName || null,
		EBlastName: POC.electronicBusinessPOC.lastName || null,
		EBtitle: POC.electronicBusinessPOC.title || null,
		EBaddressLine1: POC.electronicBusinessPOC.addressLine1 || null,
		EBaddressLine2: POC.electronicBusinessPOC.addressLine2 || null,
		EBcity: POC.electronicBusinessPOC.city || null,
		EBcountryCode: POC.electronicBusinessPOC.countryCode || null,
		EBstateOrProvinceCode: POC.electronicBusinessPOC.stateOrProvinceCode || null,
		EBzipCode: POC.electronicBusinessPOC.zipCode || null,
		//
		GBfirstName: POC.governmentBusinessPOC.firstName || null,
		GBlastName: POC.governmentBusinessPOC.lastName || null,
		GBtitle: POC.governmentBusinessPOC.title || null,
		GBaddressLine1: POC.governmentBusinessPOC.addressLine1 || null,
		GBaddressLine2: POC.governmentBusinessPOC.addressLine2 || null,
		GBcity: POC.governmentBusinessPOC.city || null,
		GBcountryCode: POC.governmentBusinessPOC.countryCode || null,
		GBstateOrProvinceCode: POC.governmentBusinessPOC.stateOrProvinceCode || null,
		GBzipCode: POC.governmentBusinessPOC.zipCode || null,
	};
};

export const formatCompanyData = (entityData) => {
	if (!entityData) return null;

	const entityRegistrationData = entityData.entityRegistration || {};
	const assertionsData = entityData.assertions || {};
	const coreData = entityData.coreData || {};
	const pointsOfContact = entityData.pointsOfContact || {};
	console.log("ED", entityData);
	console.log("poc", pointsOfContact);

	const companyData = {
		// Entity Registration Data
		activationDate: entityRegistrationData.activationDate || null,
		cageCode: entityRegistrationData.cageCode || null,
		companyEmail: entityRegistrationData.companyEmail || null,
		companyPhoneNumber: entityRegistrationData.companyPhoneNumber || null,
		companyStartDate: entityRegistrationData.companyStartDate || null,

		dbaName: entityRegistrationData.dbaName || null,
		exclusionStatusFlag: entityRegistrationData.exclusionStatusFlag || null,

		keyWords: entityRegistrationData.keyWords || null,
		lastUpdateDate: entityRegistrationData.lastUpdateDate || null,
		legalBusinessName: entityRegistrationData.legalBusinessName || null,
		purposeOfRegistrationDesc: entityRegistrationData.purposeOfRegistrationDesc || null,
		registrationStatus: entityRegistrationData.registrationStatus || null,
		registrationDate: entityRegistrationData.registrationDate || null,
		// Dups
		registrationExpirationDate: entityRegistrationData.registrationExpirationDate || null,
		expirationDate: entityRegistrationData.registrationExpirationDate || null,
		//
		SAMPullDate: new Date().toISOString(),
		uei: entityRegistrationData.ueiSAM || null,

		// Core Data - Entity Information
		entityDivisionName: coreData.entityInformation?.entityDivisionName || null,
		entityStartDate: coreData.entityInformation?.entityStartDate || null,
		// Dups
		entityURL: coreData.entityInformation?.entityURL || null,
		companyWebsite: coreData.entityInformation?.entityURL || null,
		//
		fiscalYearEndCloseDate: coreData.entityInformation?.fiscalYearEndCloseDate || null,
		submissionDate: coreData.entityInformation?.submissionDate || null,

		// Core Data - General Information
		entityStructureDesc: coreData.generalInformation?.entityStructureDesc || null,
		entityTypeDesc: coreData.generalInformation?.entityTypeDesc || null,
		organizationStructureDesc: coreData.generalInformation?.organizationStructureDesc || null,
		profitStructureDesc: coreData.generalInformation?.profitStructureDesc || null,
		stateOfIncorporationCode: coreData.generalInformation?.stateOfIncorporationCode || null,
		countryOfIncorporationCode: coreData.generalInformation?.countryOfIncorporationCode || null,

		// Congressional District from Core Data - Dups
		coreCongressionalDistrict: entityRegistrationData.congressionalDistrict || null,
		congressionalDistrict: entityRegistrationData.congressionalDistrict || null,
	};

	// Map Address Data
	const billingAddressData = mapAddressData(coreData.mailingAddress, "billingAddress");
	const shippingAddressData = mapAddressData(coreData.physicalAddress, "shippingAddress");

	// Map Business Types
	const businessTypesData = mapBusinessTypes(coreData.businessTypes);

	// Map Goods and Services
	const goodsAndServicesData = mapGoodsAndServices(assertionsData.goodsAndServices);

	//Map POC
	const pointsOfContactData = mapPointsOfContact(pointsOfContact);

	// Combine all data
	return {
		...companyData,
		...billingAddressData,
		...shippingAddressData,
		...businessTypesData,
		...goodsAndServicesData,
		...pointsOfContactData,
	};
};

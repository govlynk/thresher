import { generateClient } from "aws-amplify/data";
import { getEntity } from "./samApi";
import { formatCompanyData } from "../companyDataMapper";
// import { initializeCompanyData } from "../setupUtils";

const client = generateClient();

export async function refreshSamData(company) {
	if (!company?.uei) {
		throw new Error("Company UEI is required");
	}

	// Fetch fresh data from SAM.gov
	const entityData = await getEntity(company.uei);
	console.log("pull raw", entityData);
	const formattedData = formatCompanyData(entityData);
	console.log("pull formatted", formattedData);

	if (!formattedData) {
		throw new Error("No data found for the provided UEI");
	}

	// Update company in database
	const response = await client.models.Company.update({
		legalBusinessName: formattedData.legalBusinessName.trim(),
		dbaName: formattedData.dbaName?.trim() || null,
		uei: formattedData.uei.trim(),
		cageCode: formattedData.cageCode || null,
		ein: formattedData.ein || null,
		status: "ACTIVE",

		activationDate: formattedData.activationDate ? new Date(formattedData.activationDate).toISOString() : null,
		shippingAddressStreetLine1: formattedData.shippingAddressStreetLine1 || null,
		shippingAddressStreetLine2: formattedData.shippingAddressStreetLine2 || null,
		shippingAddressCity: formattedData.shippingAddressCity || null,
		shippingAddressStateCode: formattedData.shippingAddressStateCode || null,
		shippingAddressZipCode: formattedData.shippingAddressZipCode || null,
		shippingAddressCountryCode: formattedData.shippingAddressCountryCode || null,
		billingAddressCity: formattedData.billingAddressCity || null,
		billingAddressCountryCode: formattedData.billingAddressCountryCode || null,
		billingAddressStateCode: formattedData.billingAddressStateCode || null,
		billingAddressStreetLine1: formattedData.billingAddressStreetLine1 || null,
		billingAddressStreetLine2: formattedData.billingAddressStreetLine2 || null,
		billingAddressZipCode: formattedData.billingAddressZipCode || null,
		businessTypeList: formattedData.businessTypeList || [],

		companyStartDate: formattedData.companyStartDate ? new Date(formattedData.companyStartDate).toISOString() : null,
		congressionalDistrict: formattedData.congressionalDistrict || null,
		countryOfIncorporationCode: formattedData.countryOfIncorporationCode || null,
		entityDivisionName: formattedData.entityDivisionName || null,
		entityStartDate: formattedData.entityStartDate ? new Date(formattedData.entityStartDate).toISOString() : null,
		entityStructureDesc: formattedData.entityStructureDesc || null,
		entityTypeDesc: formattedData.entityTypeDesc || null,
		exclusionStatusFlag: formattedData.exclusionStatusFlag || null,
		fiscalYearEndCloseDate: formattedData.fiscalYearEndCloseDate
			? new Date(formattedData.fiscalYearEndCloseDate).toISOString()
			: null,
		lastUpdateDate: formattedData.lastUpdateDate ? new Date(formattedData.lastUpdateDate).toISOString() : null,

		companyEmail: formattedData.companyEmail || null,
		companyPhoneNumber: formattedData.companyPhoneNumber || null,
		companyWebsite: formattedData.companyWebsite || null,
		organizationStructureDesc: formattedData.organizationStructureDesc || null,
		profitStructureDesc: formattedData.profitStructureDesc || null,
		//
		registrationDate: formattedData.registrationDate ? new Date(formattedData.registrationDate).toISOString() : null,
		//
		registrationExpirationDate: formattedData.registrationExpirationDate
			? new Date(formattedData.registrationExpirationDate).toISOString()
			: null,

		registrationStatus: formattedData.registrationStatus || null,
		purposeOfRegistrationDesc: formattedData.purposeOfRegistrationDesc || null,
		stateOfIncorporationCode: formattedData.stateOfIncorporationCode || null,
		sbabusinessTypeDesc: formattedData.sbaBusinessTypeDesc || null,
		submissionDate: formattedData.submissionDate ? new Date(formattedData.submissionDate).toISOString() : null,
		SAMPullDate: new Date().toISOString(),

		naicsCode: formattedData.naicsCode || [],
		pscCode: formattedData.pscCode || [],
		primaryNaics: formattedData.primaryNaics || null,
	});
	console.log("pull response", response);

	return response.data;
}

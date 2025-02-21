import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { type DefaultAuthorizationMode } from "@aws-amplify/backend-data";
import { getOpportunities } from "../functions/getOpportunities/resource";
import { samApi } from "../functions/samApi/resource";
import { zohoAuth } from "../functions/zohoAuth/resource";
// add settings table

const schema = a.schema({
	User: a
		.model({
			cognitoId: a.string(),
			email: a.email().required(),
			name: a.string().required(),
			phone: a.string(),
			status: a.enum(["ACTIVE", "INACTIVE"]),
			lastLogin: a.datetime(),
			avatar: a.url(),
			contactId: a.string(),
			opportunities: a.hasMany("Opportunity", "userId"),
			opportunitySummaries: a.hasMany("OpportunitySummary", "userId"),
			companies: a.hasMany("UserCompanyAccess", "userId"),
			contact: a.belongsTo("Contact", "contactId"), // Relationship to Contact
			todos: a.hasMany("Todo", "assigneeId"),
		})
		.authorization((allow) => [
			allow.owner(),
			allow.authenticated().to(["create", "read", "update"]),
			allow.group("GOVLYNK_ADMIN").to(["create", "read", "update", "delete"]),
		]),

	Company: a
		.model({
			legalBusinessName: a.string().required(),
			dbaName: a.string(),
			uei: a.string().required(),
			cageCode: a.string(),
			ein: a.string(),
			companyEmail: a.email(),
			companyPhoneNumber: a.string(),
			companyWebsite: a.url(),
			status: a.enum(["ACTIVE", "INACTIVE", "PENDING"]),
			activationDate: a.datetime(),
			billingAddressCity: a.string(),
			billingAddressCountryCode: a.string(),
			billingAddressStateCode: a.string(),
			billingAddressStreetLine1: a.string(),
			billingAddressStreetLine2: a.string(),
			billingAddressZipCode: a.string(),
			businessTypeDesc: a.string().array(),
			companyStartDate: a.datetime(),
			congressionalDistrict: a.string(),
			countryOfIncorporationCode: a.string(),
			disasterRegistryFlag: a.string(),
			entityDivisionName: a.string(),
			entityStartDate: a.datetime(),
			entityStructureDesc: a.string(),
			entityTypeDesc: a.string(),
			exclusionStatusFlag: a.string(),
			fiscalYearEndCloseDate: a.string(),
			lastUpdateDate: a.datetime(),
			organizationStructureDesc: a.string(),
			primaryNaics: a.string(),
			profitStructureDesc: a.string(),
			purposeOfRegistrationDesc: a.string(),
			registrationDate: a.datetime(),
			registrationExpirationDate: a.datetime(),
			registrationStatus: a.string(),
			shippingAddressCity: a.string(),
			shippingAddressCountryCode: a.string(),
			shippingAddressStateCode: a.string(),
			shippingAddressStreetLine1: a.string(),
			shippingAddressStreetLine2: a.string(),
			shippingAddressZipCode: a.string(),
			stateOfIncorporationCode: a.string(),
			submissionDate: a.datetime(),
			SAMPullDate: a.datetime(),
			keyWords: a.string().array(),
			naicsCode: a.string().array(),
			naicsDescription: a.string().array(),
			pscCode: a.string().array(),
			pscDescription: a.string().array(),
			sbaBusinessTypeDesc: a.string().array(),
			sbaCertificationEntryDate: a.datetime().array(),
			sbaCertificationExitDate: a.datetime().array(),
			companyLogo: a.url(),
			documentFolder: a.url(),
			searchId: a.string(),

			// Relationships
			agencies: a.hasMany("TargetAgency", "companyId"),
			opportunities: a.hasMany("Opportunity", "companyId"),
			opportunitySummaries: a.hasMany("OpportunitySummary", "companyId"),
			capabilities: a.hasMany("CapabilityStatement", "companyId"),
			performances: a.hasMany("PastPerformance", "companyId"),
			certifications: a.hasMany("Certification", "companyId"),
			maturity: a.hasMany("MaturityAssessment", "companyId"),
			swot: a.hasMany("SwotAnalysis", "companyId"),
			federalRegulations: a.hasMany("FederalRegulation", "companyId"),
			RegulationDocuments: a.hasMany("RegulationDocument", "companyId"),
			users: a.hasMany("UserCompanyAccess", "companyId"),
			teams: a.hasMany("Team", "companyId"),
			sprints: a.hasMany("Sprint", "companyId"),
		})
		.authorization((allow) => [
			allow.owner(),
			allow.authenticated().to(["create", "read", "update"]),
			allow.group("GOVLYNK_ADMIN").to(["create", "read", "update", "delete"]),
		]),

	Team: a
		.model({
			name: a.string().required(),
			description: a.string(),
			companyId: a.string().required(),
			company: a.belongsTo("Company", "companyId"),
			members: a.hasMany("TeamMember", "teamId"),
			opportunities: a.hasMany("Opportunity", "teamId"),
			opportunitySummaries: a.hasMany("OpportunitySummary", "teamId"),
			sprint: a.hasMany("Sprint", "teamId"),
			todos: a.hasMany("Todo", "teamId"),
		})
		.authorization((allow) => [
			allow.owner(),
			allow.authenticated().to(["create", "read", "update"]),
			allow.group("GOVLYNK_ADMIN").to(["create", "read", "update", "delete"]),
		]),

	TeamMember: a
		.model({
			teamId: a.string().required(),
			contactId: a.string().required(),
			role: a.string().required(),
			isGovLynkUser: a.boolean(),
			workload: a.integer(),
			team: a.belongsTo("Team", "teamId"),
			contact: a.belongsTo("Contact", "contactId"),
		})
		.authorization((allow) => [
			allow.owner(),
			allow.authenticated().to(["create", "read", "update"]),
			allow.group("GOVLYNK_ADMIN").to(["create", "read", "update", "delete"]),
		]),

	Contact: a
		.model({
			firstName: a.string().required(),
			lastName: a.string().required(),
			title: a.string(),
			department: a.string(),
			contactEmail: a.email(),
			dateLastContacted: a.datetime(),
			contactMobilePhone: a.string(),
			contactBusinessPhone: a.string(),
			workAddressStreetLine1: a.string(),
			workAddressStreetLine2: a.string(),
			workAddressCity: a.string(),
			workAddressStateCode: a.string(),
			workAddressZipCode: a.string(),
			workAddressCountryCode: a.string(),
			emailOptOut: a.boolean(),
			notes: a.string(),
			documentFolder: a.url(),
			resume: a.url(),
			companyId: a.string().required(),
			users: a.hasMany("User", "contactId"), // Inverse relationship to User
			teamMembers: a.hasMany("TeamMember", "contactId"),
		})
		.authorization((allow) => [
			allow.owner(),
			allow.authenticated().to(["create", "read", "update"]),
			allow.group("GOVLYNK_ADMIN").to(["create", "read", "update", "delete"]),
		]),

	UserCompanyAccess: a
		.model({
			userId: a.string().required(),
			companyId: a.string().required(),
			access: a.enum(["COMPANY_ADMIN", "COMPANY_USER", "GOVLYNK_ADMIN", "GOVLYNK_USER"]),
			status: a.enum(["ACTIVE", "INACTIVE"]),
			user: a.belongsTo("User", "userId"),
			company: a.belongsTo("Company", "companyId"),
		})
		.authorization((allow) => [
			allow.owner(),
			allow.authenticated().to(["create", "read", "update"]),
			allow.group("GOVLYNK_ADMIN").to(["create", "read", "update", "delete"]),
		]),

	TargetAgency: a
		.model({
			agencyId: a.string().required(),
			toptier_code: a.string().required(),
			name: a.string(),
			mission: a.string(),
			about: a.string(),
			abbreviation: a.string(),
			congressional_justification_url: a.url(),
			subtier_agency_count: a.integer(),
			icon_filename: a.url(),
			website: a.string(),
			companyId: a.string().required(),
			lastModified: a.datetime(),
			company: a.belongsTo("Company", "companyId"),
		})
		.authorization((allow) => [
			allow.owner(),
			allow.authenticated().to(["create", "read", "update"]),
			allow.group("GOVLYNK_ADMIN").to(["create", "read", "update", "delete"]),
		]),

	CapabilityStatement: a
		.model({
			companyId: a.id().required(), // Changed to `a.id()` for proper unique identifier type
			aboutUs: a.string(), // Added `.optional()` for clarity
			keyCapabilities: a.string().array(), // Ensured `.array()` is valid and marked as optional
			competitiveAdvantage: a.string(),
			mission: a.string(),
			vision: a.string(),
			keywords: a.string().array(), // Ensured `.array()` is valid and marked as optional
			lastModified: a.datetime(), // Marked as optional for flexibility
			company: a.belongsTo("Company", "companyId"), // Marked as optional relationship
		})
		.authorization((allow) => [
			allow.owner(),
			allow.authenticated().to(["create", "read", "update"]),
			allow.group("GOVLYNK_ADMIN").to(["create", "read", "update", "delete"]),
		]),

	PastPerformance: a
		.model({
			projectName: a.string().required(),
			contractNumber: a.string(),
			client: a.string(),
			description: a.string(),
			customerAgency: a.string(),
			contractValue: a.float(), // Changed to `a.float()` for numerical values
			periodStart: a.date(),
			periodEnd: a.date(),
			workScope: a.string(),
			contractType: a.enum(["FIRM_FIXED_PRICE", "TIME_AND_MATERIALS", "COST_PLUS", "IDIQ", "BPA"]),
			// Reference Information
			pointOfContactName: a.string(),
			pointOfContactTitle: a.string(),
			pointOfContactEmail: a.string(),
			pointOfContactPhone: a.string(),
			pointOfContactAgency: a.string(),

			// Performance Details
			performanceRating: a.enum(["EXCEPTIONAL", "VERY_GOOD", "SATISFACTORY", "MARGINAL", "UNSATISFACTORY"]),
			relevantSINs: a.string().array(),

			// Compliance & Documentation
			cparsReference: a.string(),
			deliverables: a.string(),

			companyId: a.id().required(), // Changed to `a.id()` for proper unique identifier type
			company: a.belongsTo("Company", "companyId"), // Marked as optional relationship
		})
		.authorization((allow) => [
			allow.owner(),
			allow.authenticated().to(["create", "read", "update"]),
			allow.group("GOVLYNK_ADMIN").to(["create", "read", "update", "delete"]),
		]),

	Certification: a
		.model({
			name: a.string().required(),
			issuer: a.string().required(),
			dateObtained: a.date(), // Changed to `a.date()` for proper date type
			expirationDate: a.date(),
			description: a.string(),
			companyId: a.id().required(), // Changed to `a.id()` for proper unique identifier type
			company: a.belongsTo("Company", "companyId"), // Marked as optional relationship
		})
		.authorization((allow) => [
			allow.owner(),
			allow.authenticated().to(["create", "read", "update"]),
			allow.group("GOVLYNK_ADMIN").to(["create", "read", "update", "delete"]),
		]),

	// Main regulation model
	FederalRegulation: a
		.model({
			companyId: a.string().required(),
			type: a.enum(["FAR", "DFAR"]),
			provisionId: a.string().required(),
			lastUpdated: a.datetime(),
			status: a.string(),
			FinAsstCertifierFirstName: a.string(),
			FinAsstCertifierLastName: a.string(),
			FinAsstGrantsCertificationStatus: a.enum(["Y", "N"]),
			FinAsstGrantsCertifyingResponse: a.enum(["Y", "N"]),
			company: a.belongsTo("Company", "companyId"),
			answers: a.hasMany("RegulationAnswer", "regulationId"),
		})
		.authorization((allow) => [
			allow.owner(),
			allow.authenticated().to(["create", "read", "update"]),
			allow.group("GOVLYNK_ADMIN").to(["create", "read", "update", "delete"]),
		]),

	// Answers model
	RegulationAnswer: a
		.model({
			regulationId: a.string().required(),
			section: a.string(),
			questionText: a.string(),
			answerText: a.string(),
			answerId: a.string(),
			regulation: a.belongsTo("FederalRegulation", "regulationId"),
		})
		.authorization((allow) => [
			allow.owner(),
			allow.authenticated().to(["create", "read", "update"]),
			allow.group("GOVLYNK_ADMIN").to(["create", "read", "update", "delete"]),
		]),

	// PDF Links model
	RegulationDocument: a
		.model({
			companyId: a.string().required(),
			type: a.enum(["FAR", "COMBINED", "FINANCIAL", "ARCHITECT"]),
			documentUrl: a.string().required(),
			lastUpdated: a.datetime(),
			company: a.belongsTo("Company", "companyId"),
		})
		.authorization((allow) => [
			allow.owner(),
			allow.authenticated().to(["create", "read", "update"]),
			allow.group("GOVLYNK_ADMIN").to(["create", "read", "update", "delete"]),
		]),

	MaturityAssessment: a
		.model({
			companyId: a.string().required(),
			title: a.string(),
			answers: a.json(),
			maturityScore: a.json(),
			status: a.enum(["IN_PROGRESS", "COMPLETED"]),
			completedAt: a.datetime(),
			lastModified: a.datetime(),
			company: a.belongsTo("Company", "companyId"),
		})
		.authorization((allow) => [
			allow.owner(),
			allow.authenticated().to(["create", "read", "update"]),
			allow.group("GOVLYNK_ADMIN").to(["create", "read", "update", "delete"]),
		]),

	SwotAnalysis: a
		.model({
			companyId: a.string().required(),
			strengths: a.string().array(),
			weaknesses: a.string().array(),
			opportunities: a.string().array(),
			threats: a.string().array(),
			lastModified: a.datetime(),
			company: a.belongsTo("Company", "companyId"),
		})
		.authorization((allow) => [
			allow.owner(),
			allow.authenticated().to(["create", "read", "update"]),
			allow.group("GOVLYNK_ADMIN").to(["create", "read", "update", "delete"]),
		]),

	OpportunitySummary: a
		.model({
			sourceId: a.string().required(),
			title: a.string().required(),
			description: a.string(),
			status: a.enum(["BACKLOG", "BID", "REVIEW", "SUBMITTED", "WON", "LOST", "REJECTED"]),
			agency: a.string(),
			agencyType: a.string(),
			category: a.string(),
			sourceType: a.string(),
			opportunityType: a.string(),
			AISummary: a.string(),
			ValueEstLow: a.float(),
			ValueEstHigh: a.float(),
			typeOfSetAsideDescription: a.string(),

			postedDate: a.datetime(),
			responseDeadLine: a.datetime(),
			naicsCode: a.string(),
			pscCode: a.string(),

			documentLinks: a.url().array(),
			HGLink: a.url(),
			sourceLink: a.url(),

			// Office Address as embedded fields
			officeZipcode: a.string(),
			officeCity: a.string(),
			officeCountryCode: a.string(),
			officeState: a.string(),

			// Point of Contact as embedded fields
			pocName: a.string(),
			pocEmail: a.string(),
			pocPhone: a.string(),
			pocType: a.string(),

			// Pipeline fields
			position: a.integer(),
			priority: a.enum(["HIGH", "MEDIUM", "LOW"]),
			estimatedEffort: a.integer(),
			actualEffort: a.integer(),
			tags: a.string().array(),
			notes: a.string(),
			assigneeId: a.string(),
			dueDate: a.datetime(),

			// Foreign key relationships
			userId: a.string(),
			companyId: a.string().required(),
			teamId: a.string().required(),

			// Relationships
			user: a.belongsTo("User", "userId"),
			company: a.belongsTo("Company", "companyId"),
			team: a.belongsTo("Team", "teamId"),
		})
		.authorization((allow) => [
			allow.owner(),
			allow.authenticated().to(["create", "read", "update"]),
			allow.group("GOVLYNK_ADMIN").to(["create", "read", "update", "delete"]),
		]),

	Opportunity: a
		.model({
			noticeId: a.string().required(),
			title: a.string().required(),
			description: a.string(),
			status: a.enum(["BACKLOG", "BID", "REVIEW", "SUBMITTED", "WON", "LOST", "REJECTED"]),
			solicitationNumber: a.string(),
			fullParentPathName: a.string(),

			department: a.string(),
			agency: a.string(),
			office: a.string(),
			subOffice: a.string(),

			postedDate: a.datetime(),
			type: a.string(),
			typeOfSetAsideDescription: a.string(),
			typeOfSetAside: a.string(),
			responseDeadLine: a.datetime(),
			naicsCode: a.string(),
			naicsCodes: a.string().array(),
			classificationCode: a.string(),
			active: a.string(),
			organizationType: a.string(),
			resourceLinks: a.string().array(),
			uiLink: a.string(),

			// Office Address as embedded fields
			officeZipcode: a.string(),
			officeCity: a.string(),
			officeCountryCode: a.string(),
			officeState: a.string(),

			// Point of Contact as embedded fields
			pocName: a.string(),
			pocEmail: a.string(),
			pocPhone: a.string(),
			pocType: a.string(),

			// Pipeline fields
			position: a.integer(),
			priority: a.enum(["HIGH", "MEDIUM", "LOW"]),
			estimatedEffort: a.integer(),
			actualEffort: a.integer(),
			tags: a.string().array(),
			notes: a.string(),
			assigneeId: a.string(),
			dueDate: a.datetime(),

			// Foreign key relationships
			userId: a.string(),
			companyId: a.string().required(),
			teamId: a.string().required(),

			// Relationships
			user: a.belongsTo("User", "userId"),
			company: a.belongsTo("Company", "companyId"),
			team: a.belongsTo("Team", "teamId"),
		})
		.authorization((allow) => [
			allow.owner(),
			allow.authenticated().to(["create", "read", "update"]),
			allow.group("GOVLYNK_ADMIN").to(["create", "read", "update", "delete"]),
		]),

	Sprint: a
		.model({
			name: a.string().required(),
			goal: a.string().required(),
			startDate: a.datetime().required(),
			endDate: a.datetime().required(),
			status: a.string(),
			position: a.integer(),
			companyId: a.string(),
			teamId: a.string().required(),
			company: a.belongsTo("Company", "companyId"),
			team: a.belongsTo("Team", "teamId"),
			todos: a.hasMany("Todo", "sprintId"),
		})
		.authorization((allow) => [
			allow.owner(),
			allow.authenticated().to(["create", "read", "update"]),
			allow.group("GOVLYNK_ADMIN").to(["create", "read", "update", "delete"]),
		]),

	// Update Todo model to include sprint relationship
	Todo: a
		.model({
			title: a.string().required(),
			description: a.string().required(),
			status: a.string(),
			priority: a.enum(["LOW", "MEDIUM", "HIGH"]),
			dueDate: a.datetime().required(),
			estimatedEffort: a.float(),
			actualEffort: a.float(),
			tags: a.string().array(),
			position: a.integer().required(),
			assigneeId: a.string(),
			assignee: a.belongsTo("User", "assigneeId"),
			teamId: a.string().required(),
			team: a.belongsTo("Team", "teamId"),
			sprintId: a.string(), // Add sprint relationship
			sprint: a.belongsTo("Sprint", "sprintId"), // Add sprint relationship
		})
		.authorization((allow) => [
			allow.owner(),
			allow.authenticated().to(["create", "read", "update"]),
			allow.group("GOVLYNK_ADMIN").to(["create", "read", "update", "delete"]),
		]),

	// Custom queries
	ZohoAuth: a
		.model({
			id: a.id(),
			accessToken: a.string(),
			refreshToken: a.string(),
			expiresAt: a.datetime(),
			scope: a.string().array(),
		})
		.authorization((allow) => [
			allow.authenticated(),
			allow.owner(),
			allow.group("GOVLYNK_ADMIN").to(["create", "read", "update", "delete"]),
		]),

	getZohoAuthUrl: a
		.query()
		.returns(a.string())
		.authorization((allow) => [allow.authenticated()])
		.handler(a.handler.function(zohoAuth)),

	getZohoTokens: a
		.query()
		.arguments({ code: a.string() })
		.returns(a.ref("ZohoAuth"))
		.authorization((allow) => [allow.authenticated()])
		.handler(a.handler.function(zohoAuth)),

	refreshZohoTokens: a
		.query()
		.returns(a.ref("ZohoAuth"))
		.authorization((allow) => [allow.authenticated()])
		.handler(a.handler.function(zohoAuth)),

	getSamData: a
		.query()
		.arguments({
			uei: a.string().required(),
			action: a.enum(["repsAndCerts", "entity"]),
		})
		.returns(a.json())
		.authorization((allow) => [allow.authenticated()])
		.handler(a.handler.function(samApi)),

	getOpportunities: a
		.query()
		.arguments({
			naicsCode: a.string(),
			agency: a.string(),
			setAside: a.string(),
			state: a.string(),
			limit: a.integer(),
			offset: a.integer(),
			sourceType: a.string(),
			searchId: a.string(),
			postedDate: a.string(),
		})
		.returns(a.json())
		.authorization((allow) => [allow.authenticated()])
		.handler(a.handler.function(getOpportunities)),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
	schema,
	authorizationModes: {
		defaultAuthorizationMode: "userPool" as DefaultAuthorizationMode,
		apiKeyAuthorizationMode: {
			expiresInDays: 30,
		},
	},
});

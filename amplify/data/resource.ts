import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { type DefaultAuthorizationMode } from "@aws-amplify/backend-data";
import { sortCollisionsAsc } from "@dnd-kit/core/dist/utilities/algorithms/helpers";
import { notStrictEqual } from "assert";

const COMPANY_ROLES = [
	"Executive",
	"Sales",
	"Marketing",
	"Finance",
	"Risk",
	"Technology",
	"Engineering",
	"Operations",
	"HumanResources",
	"Legal",
	"Contracting",
	"Servicing",
	"Other",
] as const;

const schema = a.schema({
	Opportunity: a
		.model({
			opportunityId: a.string().required(),
			title: a.string().required(),
			description: a.string(),
			status: a.enum(["BACKLOG", "BID", "REVIEW", "SUBMITTED", "WON", "LOST", "REJECTED"]),
			solicitationNumber: a.string(),
			fullParentPathName: a.string(),
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
		.authorization((allow) => [allow.owner(), allow.group("Admin").to(["create", "read", "update", "delete"])]),

	User: a
		.model({
			cognitoId: a.string().required(),
			email: a.email().required(),
			name: a.string().required(),
			phone: a.string(),
			status: a.enum(["ACTIVE", "INACTIVE"]),
			lastLogin: a.datetime(),
			avatar: a.url(),
			opportunities: a.hasMany("Opportunity", "userId"),
			companies: a.hasMany("UserCompanyRole", "userId"),
			todos: a.hasMany("Todo", "assigneeId"),
		})
		.authorization((allow) => [allow.owner(), allow.group("Admin").to(["create", "read", "update", "delete"])]),

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
			companyStartDate: a.datetime(),
			congressionalDistrict: a.string(),
			coreCongressionalDistrict: a.string(),
			countryOfIncorporationCode: a.string(),
			entityDivisionName: a.string(),
			entityStartDate: a.datetime(),
			entityStructureDesc: a.string(),
			entityTypeDesc: a.string(),
			exclusionStatusFlag: a.string(),
			expirationDate: a.datetime(),
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
			certificationEntryDate: a.datetime().array(),
			keyWords: a.string().array(),
			naicsCode: a.string().array(),
			pscCode: a.string().array(),
			sbaBusinessTypeDesc: a.string().array(),
			entityURL: a.url(),
			opportunities: a.hasMany("Opportunity", "companyId"),
			users: a.hasMany("UserCompanyRole", "companyId"),
			teams: a.hasMany("Team", "companyId"),
		})
		.authorization((allow) => [allow.owner(), allow.group("Admin").to(["create", "read", "update", "delete"])]),

	Team: a
		.model({
			name: a.string().required(),
			description: a.string(),
			companyId: a.string().required(),
			company: a.belongsTo("Company", "companyId"),
			members: a.hasMany("TeamMember", "teamId"),
			opportunities: a.hasMany("Opportunity", "teamId"),
			todos: a.hasMany("Todo", "teamId"),
		})
		.authorization((allow) => [allow.owner(), allow.group("Admin").to(["create", "read", "update", "delete"])]),

	Todo: a
		.model({
			title: a.string().required(),
			description: a.string().required(),
			status: a.enum(["TODO", "DOING", "DONE"]),
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
		})
		.authorization((allow) => [allow.owner(), allow.group("Admin").to(["create", "read", "update", "delete"])]),

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
			notes: a.string(),
			companyId: a.string().required(),
			teamMembers: a.hasMany("TeamMember", "contactId"),
		})
		.authorization((allow) => [allow.owner(), allow.group("Admin").to(["create", "read", "update", "delete"])]),

	TeamMember: a
		.model({
			teamId: a.string().required(),
			contactId: a.string().required(),
			role: a.enum(COMPANY_ROLES),
			team: a.belongsTo("Team", "teamId"),
			contact: a.belongsTo("Contact", "contactId"),
		})
		.authorization((allow) => [allow.owner(), allow.group("Admin").to(["create", "read", "update", "delete"])]),

	UserCompanyRole: a
		.model({
			userId: a.string().required(),
			companyId: a.string().required(),
			roleId: a.string().required(),
			status: a.enum(["ACTIVE", "INACTIVE"]),
			user: a.belongsTo("User", "userId"),
			company: a.belongsTo("Company", "companyId"),
		})
		.authorization((allow) => [allow.owner(), allow.group("Admin").to(["create", "read", "update", "delete"])]),
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

import { QUESTION_TYPES } from "../common/form/questionTypes";

export const questions = [
	// Basic Yes/No Questions
	{
		id: "registration",
		title: "SAM.gov Registration",
		question: "Is your entity registration active in SAM.gov?",
		type: QUESTION_TYPES.YES_NO,
		required: true,
		multiple: false,
		minLength: 50,
		maxLength: 500,
		maxItems: 5,
		allowSpecialChars: true,
		pattern: "^\\d{6}(,\\s*\\d{6})*$",
		placeholder: "Enter at least 50 characters describing your capabilities...",
		helpText: "Select the classification that best matches your company size",
		info: {
			title: "SAM.gov Registration",
			backgroundInfo: `SAM.gov registration is a mandatory requirement for doing business with the federal government. 
    This system is used for vendor registration, certification of business information, and accessing federal procurement opportunities.`,
			videoUrl: "https://youtu.be/y2t5queourQ?si=jR8tFCG_Gz45esWU",
			resources: [
				{
					title: "SAM.gov Registration Guide",
					url: "https://sam.gov/content/entity-registration",
				},
				{
					title: "SAM.gov Registration Checklist",
					url: "https://www.fsd.gov/gsafsd_sp?id=kb_article_view&sysparm_article=KB0041254",
				},
			],
		},
	},

	// Single Choice Questions with Validation
	{
		id: "businessSize",
		title: "Business Size Classification",
		question: "What is your business size classification? This can vary by NAICS code.",
		type: QUESTION_TYPES.SINGLE_CHOICE,
		options: ["Small Business", "Large Business", "Not Sure"],
		required: true,
		helpText: "Select the classification that best matches your company size",
	},

	// Multiple Choice with Complex Options
	{
		id: "socioeconomic",
		title: "Socioeconomic Categories",
		question: "Select all socioeconomic categories that apply to your business:",
		type: QUESTION_TYPES.MULTIPLE_CHOICE,
		options: [
			"8(a) Business Development",
			"Woman-Owned Small Business (WOSB)",
			"HUBZone Certified",
			"Service-Disabled Veteran-Owned Small Business",
			"Economically Disadvantaged Women-Owned Small Business",
			"None of the above",
		],
		multiple: true,
		required: true,
		validation: (values) => {
			if (values?.includes("None of the above") && values.length > 1) {
				return "Cannot select 'None of the above' with other options";
			}
			return null;
		},
	},

	// Text Input with Validation
	{
		id: "capabilities",
		title: "Core Capabilities",
		question: "Describe your company's core capabilities and differentiators",
		type: QUESTION_TYPES.RICH_TEXT,
		required: true,
		minLength: 50,
		maxLength: 500,
		placeholder: "Enter at least 50 characters describing your capabilities...",
		validation: (value) => {
			if (value && value.length < 5) {
				return "Description must be at least 50 characters";
			}
			return null;
		},
	},

	// Long Text with Special Characters
	{
		id: "pastPerformance",
		title: "Past Performance",
		question: "Provide details of your most relevant past performance example",
		type: QUESTION_TYPES.LONG_TEXT,
		required: true,
		minLength: 10,
		maxLength: 2000,
		placeholder: "Include: contract number, customer, value, period of performance, and description",
		allowSpecialChars: true,
	},

	// Code List with Pattern Validation
	{
		id: "naicsCodes",
		title: "NAICS Codes",
		question: "Enter your primary and secondary NAICS codes (comma-separated)",
		type: QUESTION_TYPES.CODE_LIST,
		required: true,
		pattern: "^\\d{6}(,\\s*\\d{6})*$",
		validation: (value) => {
			if (!value) return null;
			const codes = value.split(",").map((code) => code.trim());
			if (codes.some((code) => !/^\d{6}$/.test(code))) {
				return "Each NAICS code must be exactly 6 digits";
			}
			return null;
		},
		maxItems: 5,
		helpText: "Enter up to 5 NAICS codes in format: 123456, 234567",
	},

	// Rating Question
	{
		id: "contractReadiness",
		title: "Contract Readiness Assessment",
		question: "Rate your readiness in the following areas:",
		type: QUESTION_TYPES.RATING,
		required: true,
		maxRating: 5,
		categories: ["Financial Systems", "Project Management", "Quality Control", "Cybersecurity"],
		labels: {
			1: "Not Ready",
			2: "Beginning",
			3: "Developing",
			4: "Advanced",
			5: "Fully Ready",
		},
	},

	// Demographic Information
	{
		id: "companyDemographics",
		title: "Company Demographics",
		type: QUESTION_TYPES.DEMOGRAPHIC,
		required: true,
		fields: [
			{
				name: "yearFounded",
				label: "Year Founded",
				type: "number",
				min: 1800,
				max: new Date().getFullYear(),
				required: true,
			},
			{
				name: "employeeCount",
				label: "Number of Employees",
				type: "select",
				options: [
					{ value: "1-10", label: "1-10 employees" },
					{ value: "11-50", label: "11-50 employees" },
					{ value: "51-200", label: "51-200 employees" },
					{ value: "201+", label: "201+ employees" },
				],
				required: true,
			},
		],
	},

	// File Upload with Validation
	{
		id: "certifications",
		title: "Business Certifications",
		question: "Upload relevant business certifications",
		type: QUESTION_TYPES.FILE_UPLOAD,
		required: false,
		acceptedTypes: [".pdf", ".jpg", ".png"],
		maxSize: 5 * 1024 * 1024, // 5MB
		maxFiles: 3,
		validation: (files) => {
			if (files && files.length > 3) {
				return "Maximum 3 files allowed";
			}
			return null;
		},
	},

	// Authorization Question
	{
		id: "termsAndConditions",
		title: "Terms and Conditions",
		type: QUESTION_TYPES.AUTHORIZATION,
		required: true,
		agreementText: `By proceeding, you certify that:
    1. All information provided is accurate and complete
    2. You are authorized to represent your company
    3. You understand that false statements may result in disqualification`,
		signatureRequired: true,
		validation: (value) => {
			if (!value.agreed) {
				return "You must agree to the terms to continue";
			}
			if (value.signatureRequired && !value.signature) {
				return "Signature is required";
			}
			return null;
		},
	},
];

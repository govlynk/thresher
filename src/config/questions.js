import { QUESTION_TYPES } from "./questionTypes";

export const questions = [
	// Yes/No Questions
	{
		id: "registration",
		title: "SAM.gov Registration",
		question: "Is your entity registration active in SAM.gov?",
		placeholder: "Type your name...",
		type: QUESTION_TYPES.YES_NO,
		options: ["Yes", "No"],
		required: true,
	},
	{
		id: "security",
		title: "Security Clearances",
		question: "Do you have required facility or personnel security clearances?",
		placeholder: "Type your name...",
		type: QUESTION_TYPES.YES_NO,
		options: ["Yes", "No"],
		required: true,
	},

	// Multiple Choice Questions
	{
		id: "businessSize",
		title: "Business Size",
		question: "What is your business size classification? This can vary by NAICS code.",
		placeholder: "Select Business Type...",
		type: QUESTION_TYPES.SINGLE_CHOICE,
		options: ["Small Business", "Large Business", "Not Sure"],
		required: true,
	},
	{
		id: "socioeconomic",
		title: "Socioeconomic Status",
		question: "Select all socioeconomic categories that apply:",
		placeholder: "Type your name...",
		type: QUESTION_TYPES.MULTIPLE_CHOICE,
		options: ["8(a)", "WOSB", "HUBZone", "SDVOSB", "None"],
		multiple: true,
		required: true,
	},

	// Text Response Questions
	{
		id: "capabilities",
		title: "Core Capabilities",
		question: "Describe your company's core capabilities and differentiators (max 500 characters)",
		placeholder: "Type your name...",
		type: QUESTION_TYPES.TEXT,
		maxLength: 500,
		required: true,
	},
	{
		id: "pastPerformance",
		title: "Past Performance",
		question: "Describe your most relevant past performance example",
		placeholder: "Type your name...",
		type: QUESTION_TYPES.TEXT,
		maxLength: 1000,
		required: true,
	},

	// Code List Questions
	{
		id: "primaryNaics",
		title: "Primary NAICS Code",
		question: "Enter your primary NAICS code",
		placeholder: "Type your name...",
		type: QUESTION_TYPES.CODE_LIST,
		// validation: /^\d{6}$/,
		required: true,
	},
	{
		id: "secondaryNaics",
		title: "Secondary NAICS Codes",
		question: "Enter up to 5 secondary NAICS codes (comma separated)",
		placeholder: "Type your name...",
		type: QUESTION_TYPES.CODE_LIST,
		validation: /^(\d{6},?\s*){1,5}$/,
		required: false,
	},

	// Multiple Choice with Status
	{
		id: "contractVehicles",
		title: "Contract Vehicles",
		question: "What is the status of your contract vehicles?",
		placeholder: "Type your name...",
		type: QUESTION_TYPES.MULTIPLE_CHOICE,
		options: ["Have GSA Schedule", "Have GWACs", "In Process", "None", "Need Assistance"],
		multiple: true,
		required: true,
	},
	{
		id: "complianceSystems",
		title: "Compliance Systems",
		question: "Which compliance systems do you have in place?",
		placeholder: "Type your name...",
		type: QUESTION_TYPES.MULTIPLE_CHOICE,
		options: ["Accounting System", "Quality Control", "Project Management", "Cybersecurity", "None"],
		multiple: true,
		required: true,
	},
];

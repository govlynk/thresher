import { QUESTION_TYPES } from "../common/form/questionTypes";

export const questions = [
	// Compliance & Governance Section
	{
		id: "compliance",
		title: "Compliance & Governance",
		type: QUESTION_TYPES.SECTION,
		questions: [
			{
				id: "farCompliance",
				title: "FAR Compliance",
				type: QUESTION_TYPES.LIKERT,
				required: true,
				info: false,
				scale: ["Initial", "Developing", "Defined", "Managed", "Optimized"],
				statements: [
					"We understand FAR/DFARS requirements",
					"We have a documented compliance program",
					"We maintain adequate internal controls",
					"We have a system for tracking compliance documentation",
				],
			},
			{
				id: "supplyChainSecurity",
				title: "Supply Chain Security",
				type: QUESTION_TYPES.LIKERT,
				required: true,
				info: false,
				scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
				statements: [
					"We have a documented supply chain security program",
					"Our suppliers are regularly assessed for security risks",
					"We maintain a current list of approved suppliers",
					"We have incident response procedures for supply chain disruptions",
				],
			},
			{
				id: "taaCompliance",
				title: "Trade Agreement Act Compliance",
				type: QUESTION_TYPES.LIKERT,
				required: true,
				info: false,

				scale: ["Never", "As Needed", "High Risk Items Only", "Best Endeavors", "Always"],
				statements: [
					"We document country of origin for all products",
					"We enforce TAA compliance training for employees",
					"We regularly audit suppliers for compliance",
					"We have documented compliance verification procedures",
				],
			},
		],
	},

	// Market Readiness Section
	{
		id: "marketReadiness",
		title: "Market Readiness",
		type: QUESTION_TYPES.SECTION,
		questions: [
			{
				id: "federalPresence",
				title: "Federal Marketplace Presence",
				type: QUESTION_TYPES.LIKERT,
				required: true,
				info: false,

				scale: ["Initial", "Developing", "Defined", "Managed", "Optimized"],
				statements: [
					"We have a documented federal market strategy",
					"We have a dedicated federal sales team",
					"We have a system for tracking federal opportunities",
					"We monitor federal market trends",
					"We monitor our competitors in the federal market",
				],
			},
		],
	},

	// Financial Health Section
	{
		id: "financialHealth",
		title: "Financial Health",
		type: QUESTION_TYPES.SECTION,
		questions: [
			// {
			// 	id: "revenueMetrics",
			// 	title: "Revenue Metrics",
			// 	type: QUESTION_TYPES.DEMOGRAPHIC,
			// 	required: true,
			// 	info: false,
			// 	fields: [
			// 		{
			// 			name: "annualRevenue",
			// 			label: "Annual Revenue",
			// 			type: "number",
			// 			min: 0,
			// 			required: true,
			// 		},
			// 		{
			// 			name: "federalRevenue",
			// 			label: "Federal Revenue Percentage",
			// 			type: "number",
			// 			min: 0,
			// 			max: 100,
			// 			required: true,
			// 		},
			// 		{
			// 			name: "profitMargin",
			// 			label: "Average Profit Margin",
			// 			type: "number",
			// 			min: -100,
			// 			max: 100,
			// 			required: true,
			// 		},
			// 	],
			// },
			{
				id: "contractCapacity",
				title: "Contract Management Capacity",
				type: QUESTION_TYPES.LIKERT,
				required: true,
				info: false,
				maxRating: 5,

				scale: ["Initial", "Developing", "Defined", "Managed", "Optimized"],
				statements: [
					"We have a financial system for tracking contracts",
					"We have a system for tracking contract deliverables",
					"We have a system for monitoring resource allocation",
					"We monitor contract risks",
				],
			},
		],
	},

	// Operational Excellence Section
	{
		id: "operationalExcellence",
		title: "Operational Excellence",
		type: QUESTION_TYPES.SECTION,
		questions: [
			{
				id: "qualityManagement",
				title: "Quality Management Systems",
				type: QUESTION_TYPES.LIKERT,
				required: true,
				info: false,
				scale: [
					"Continuous Improvement Program",
					"Performance Metrics Tracking",
					"Quality Control Procedures",
					"CMMI Certification",
					"ISO 9001 Certification",
				],
				statements: ["We maintain high quality"],
			},
			{
				id: "deliveryCapabilities",
				title: "Delivery Capabilities Assessment",
				type: QUESTION_TYPES.LIKERT,
				required: true,
				info: false,
				scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
				statements: [
					"We consistently meet delivery deadlines",
					"We have redundancy in critical processes",
					"We maintain adequate staffing levels",
					"We have effective project management practices",
				],
			},
		],
	},

	// Business Development Section
	{
		id: "businessDevelopment",
		title: "Business Development",
		type: QUESTION_TYPES.SECTION,
		questions: [
			{
				id: "pipelineManagement",
				title: "Pipeline Management",
				type: QUESTION_TYPES.LIKERT,
				required: true,
				info: false,
				maxRating: 5,

				scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
				statements: [
					"We track opportunities in a CRM system",
					"We monitor our win rate",
					"We have a bid/no-bid process",
					"We have a capture planning process",
				],
			},
		],
	},

	// Technical Infrastructure Section
	{
		id: "technicalInfrastructure",
		title: "Technical Infrastructure",
		type: QUESTION_TYPES.SECTION,
		questions: [
			{
				id: "cybersecurity",
				title: "Cybersecurity Posture",
				type: QUESTION_TYPES.LIKERT,
				required: true,
				info: false,

				scale: [
					"Security Training Program",
					"Incident Response Plan",
					"Regular Security Assessments",
					"CMMC Certification",
					"NIST 800-171 Compliant",
				],
				statements: ["We have a cyber security policy"],
			},
			{
				id: "systemsCompliance",
				title: "Systems Compliance",
				type: QUESTION_TYPES.LIKERT,
				required: true,
				info: false,
				maxRating: 5,

				scale: ["Strongly Disagree", "Disagree", "Neutral", "Agree", "Strongly Agree"],
				statements: [
					"We have a documented access control policy",
					"We have a data protection policy",
					"We maintain system documentation",
					"We have effective change management practices",
				],
			},
		],
	},
];

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
				type: QUESTION_TYPES.RATING,
				required: true,
				info: false,
				maxRating: 5,
				categories: ["FAR/DFARS Knowledge", "Compliance Program", "Internal Controls", "Documentation"],
				labels: {
					1: "Initial",
					2: "Developing",
					3: "Defined",
					4: "Managed",
					5: "Optimized",
				},
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
				type: QUESTION_TYPES.MULTIPLE_CHOICE,
				required: true,
				info: false,
				multiple: true,
				options: [
					"Documented country of origin tracking",
					"TAA compliance training program",
					"Regular supplier audits",
					"Compliance verification procedures",
					"None of the above",
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
				type: QUESTION_TYPES.RATING,
				required: true,
				info: false,
				maxRating: 5,
				categories: [
					"Contract Vehicle Coverage",
					"Agency Relationships",
					"Market Understanding",
					"Competitive Position",
				],
				labels: {
					1: "Limited",
					2: "Emerging",
					3: "Established",
					4: "Strong",
					5: "Leading",
				},
			},
			{
				id: "targetAgencies",
				title: "Target Agency Identification",
				type: QUESTION_TYPES.CODE_LIST,
				required: true,
				info: false,
				maxItems: 5,
				pattern: "^[A-Z]{2,4}$",
				helpText: "Enter agency codes (e.g., DOD, DHS, etc.)",
				validation: (codes) => {
					if (codes.length === 0) return "At least one agency code is required";
					return null;
				},
			},
		],
	},

	// Financial Health Section
	{
		id: "financialHealth",
		title: "Financial Health",
		type: QUESTION_TYPES.SECTION,
		questions: [
			{
				id: "revenueMetrics",
				title: "Revenue Metrics",
				type: QUESTION_TYPES.DEMOGRAPHIC,
				required: true,
				info: false,
				fields: [
					{
						name: "annualRevenue",
						label: "Annual Revenue",
						type: "number",
						min: 0,
						required: true,
					},
					{
						name: "federalRevenue",
						label: "Federal Revenue Percentage",
						type: "number",
						min: 0,
						max: 100,
						required: true,
					},
					{
						name: "profitMargin",
						label: "Average Profit Margin",
						type: "number",
						min: -100,
						max: 100,
						required: true,
					},
				],
			},
			{
				id: "contractCapacity",
				title: "Contract Management Capacity",
				type: QUESTION_TYPES.RATING,
				required: true,
				info: false,
				maxRating: 5,
				categories: ["Financial Systems", "Contract Administration", "Resource Allocation", "Risk Management"],
				labels: {
					1: "Basic",
					2: "Developing",
					3: "Established",
					4: "Advanced",
					5: "Expert",
				},
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
				type: QUESTION_TYPES.MULTIPLE_CHOICE,
				required: true,
				info: false,
				multiple: true,
				options: [
					"ISO 9001 Certification",
					"CMMI Certification",
					"Quality Control Procedures",
					"Performance Metrics Tracking",
					"Continuous Improvement Program",
					"None of the above",
				],
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
				id: "marketingStrategy",
				title: "Federal Marketing Strategy",
				type: QUESTION_TYPES.RICH_TEXT,
				required: true,
				info: false,
				minLength: 100,
				maxLength: 2000,
				placeholder: "Describe your federal marketing strategy...",
				helpText: "Include key initiatives, target agencies, and value proposition",
			},
			{
				id: "pipelineManagement",
				title: "Pipeline Management",
				type: QUESTION_TYPES.RATING,
				required: true,
				info: false,
				maxRating: 5,
				categories: ["Opportunity Tracking", "Win Rate", "Bid/No-Bid Process", "Capture Planning"],
				labels: {
					1: "Ad-hoc",
					2: "Basic",
					3: "Structured",
					4: "Advanced",
					5: "Optimized",
				},
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
				type: QUESTION_TYPES.MULTIPLE_CHOICE,
				required: true,
				info: false,
				multiple: true,
				options: [
					"NIST 800-171 Compliant",
					"CMMC Certification",
					"Regular Security Assessments",
					"Incident Response Plan",
					"Security Training Program",
					"None of the above",
				],
			},
			{
				id: "systemsCompliance",
				title: "Systems Compliance",
				type: QUESTION_TYPES.RATING,
				required: true,
				info: false,
				maxRating: 5,
				categories: ["Access Controls", "Data Protection", "System Documentation", "Change Management"],
				labels: {
					1: "Non-compliant",
					2: "Partially Compliant",
					3: "Compliant",
					4: "Advanced",
					5: "Industry Leading",
				},
			},
		],
	},

	// Final Authorization
	{
		id: "authorization",
		title: "Assessment Authorization",
		type: QUESTION_TYPES.AUTHORIZATION,
		required: true,
		info: false,
		agreementText: `By submitting this assessment, I certify that:
1. All information provided is accurate and complete to the best of my knowledge
2. I am authorized to complete this assessment on behalf of my organization
3. I understand that this assessment may be used to develop improvement recommendations
4. I agree to maintain supporting documentation for all responses`,
		signatureRequired: true,
	},
];

import { QUESTION_TYPES } from "../common/form/questionTypes";

export const questions = [
	// Compliance & Governance Section
	// Compliance & Governance Section
	{
		id: "compliance",
		title: "Compliance & Governance",
		type: QUESTION_TYPES.SECTION,
		questions: [
			{
				id: "taaCompliance",
				title: "Trade Agreements Act (TAA) Compliance",
				type: QUESTION_TYPES.LIKERT,
				required: true,
				info: true,
				scale: [
					"No formal monitoring",
					"Basic awareness",
					"Documented processes",
					"Regular audits",
					"Automated monitoring",
				],
				statements: [
					"We verify country of origin for all products",
					"We maintain documentation of TAA compliance",
					"We conduct regular supplier audits",
					"We have automated compliance tracking",
				],
			},
			{
				id: "section889Compliance",
				title: "NDAA Section 889 Compliance",
				type: QUESTION_TYPES.LIKERT,
				required: true,
				info: true,
				scale: [
					"No program",
					"Basic screening",
					"Documented processes",
					"Regular monitoring",
					"Comprehensive program",
				],
				statements: [
					"We maintain inventory of covered equipment",
					"We have vendor certification process",
					"We conduct regular supply chain evaluations",
					"We have employee awareness training",
				],
			},
			{
				id: "fascsa",
				title: "Federal Acquisition Supply Chain Security",
				type: QUESTION_TYPES.LIKERT,
				required: true,
				info: true,
				scale: ["No monitoring", "Ad-hoc checks", "Regular monitoring", "Proactive management", "Automated system"],
				statements: [
					"We monitor SAM.gov for FASCSA orders",
					"We have removal procedures for prohibited items",
					"We maintain supply chain documentation",
					"We have incident reporting procedures",
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
				id: "revenueRequirements",
				title: "Revenue Requirements",
				type: QUESTION_TYPES.LIKERT,
				required: true,
				info: true,
				scale: [
					"Below $25k annually",
					"$25k-$50k annually",
					"$50k-$75k annually",
					"$75k-$100k annually",
					"Over $100k annually",
				],
				statements: [
					"We meet minimum revenue thresholds",
					"We have documented revenue forecasts",
					"We track contract performance metrics",
					"We maintain financial stability metrics",
				],
			},
			{
				id: "targetMarket",
				title: "Federal Market Strategy",
				type: QUESTION_TYPES.LIKERT,
				required: true,
				info: true,
				scale: ["No strategy", "Basic research", "Defined targets", "Active engagement", "Strategic presence"],
				statements: [
					"We have identified target agencies",
					"We understand agency procurement patterns",
					"We maintain agency relationships",
					"We track market opportunities",
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
			{
				id: "financialStability",
				title: "Financial Stability",
				type: QUESTION_TYPES.LIKERT,
				required: true,
				info: true,
				scale: [
					"Below minimum requirements",
					"Meeting basic requirements",
					"Stable operations",
					"Strong performance",
					"Industry leading",
				],
				statements: [
					"We maintain minimum revenue of $25k annually",
					"We have positive cash flow trends",
					"We have documented financial forecasting",
					"We maintain competitive pricing structures",
				],
			},
			{
				id: "contractManagement",
				title: "Contract Management",
				type: QUESTION_TYPES.LIKERT,
				required: true,
				info: true,
				scale: [
					"No formal system",
					"Basic tracking",
					"Standardized processes",
					"Integrated systems",
					"Optimized management",
				],
				statements: [
					"We have financial tracking systems for contracts",
					"We maintain detailed cost analysis procedures",
					"We have established pricing strategies",
					"We track contract performance metrics",
				],
			},
		],
	},
	{
		id: "operationalExcellence",
		title: "Operational Excellence",
		type: QUESTION_TYPES.SECTION,
		questions: [
			{
				id: "qualityControl",
				title: "Quality Management",
				type: QUESTION_TYPES.LIKERT,
				required: true,
				info: true,
				scale: [
					"No formal processes",
					"Basic procedures",
					"Documented system",
					"Measured processes",
					"Continuous improvement",
				],
				statements: [
					"We maintain quality control documentation",
					"We have performance measurement systems",
					"We conduct regular process audits",
					"We hold relevant quality certifications",
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

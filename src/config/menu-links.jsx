import {
	Home,
	Users,
	Building,
	Contact2,
	Receipt,
	User,
	Medal,
	ListTodo,
	Building2,
	UserCog,
	Settings,
	Search,
	Briefcase,
	DollarSign,
	Settings2,
	PieChart,
	ChartLine,
	BarChart,
} from "lucide-react";

const homeLinks = {
	id: "home",
	title: "Home",
	icon: Home,
	links: [
		{
			title: "Calendar",
			path: "/calendar",
		},
		// {
		// 	title: "Dashboard",
		// 	path: "/dashboard",
		// },
		{
			title: "To Do",
			path: "/todos",
		},
	],
};

const profileLinks = {
	id: "profile",
	title: "Profile",
	icon: Users,
	links: [
		{
			title: "Experience",
			path: "/experience",
		},
		{
			title: "Certifications",
			path: "/certification",
		},
		{
			title: "SAM Registration",
			path: "/sam",
		},
		{
			title: "File Browser",
			path: "/company-files",
		},
	],
};

const strategyLinks = {
	id: "strategy",
	title: "Strategic Positioning",
	icon: Users,
	links: [
		{
			title: "Maturity Assessment",
			path: "/maturity",
		},
		{
			title: "Strategic Positioning",
			path: "/strategy",
		},
		{
			title: "SWOT",
			path: "/swot",
		},
	],
};

// Group related menu items
const marketIntelligenceLinks = {
	id: "market",
	title: "Market Intelligence",
	icon: Briefcase,
	links: [
		{
			title: "Federal Spending",
			path: "/spending-analysis",
		},
		{
			title: "Federal Spending by NAICS",
			path: "/spending-analysis-naics",
		},
		{
			title: "Agencies Spending",
			path: "/agency-overview",
		},
		{
			title: "Agency Analysis",
			path: "/agency-analysis",
		},
	],
};

// Group related menu items
const marketPositioningLinks = {
	id: "positioning",
	title: "Market Positioning",
	icon: PieChart,
	links: [
		{
			title: "Competitor Analysis",
			path: "/Competitor-analysis",
		},
		{
			title: "Agency Analysis",
			path: "/agency-analysis",
		},
	],
};

// Group related menu items
const productLinks = {
	id: "product",
	title: "Product Positioning",
	icon: PieChart,
	links: [
		{
			title: "Product/Service",
			path: "/product",
		},
		{
			title: "Cost Breakdown",
			path: "/competitive-pricing",
		},
		{
			title: "Profit Margin Analysis",
			path: "/profit-margin",
		},
	],
};

// Group related menu items
const salesLinks = {
	id: "sales",
	title: "Sales",
	icon: ChartLine,
	links: [
		{
			title: "Contract Opportunities",
			path: "/opportunities",
		},
		{
			title: "Qualification",
			path: "/qualification",
		},
		{
			title: "Pipeline",
			path: "/pipeline",
		},
	],
};

const postAwardLinks = {
	id: "postAward",
	title: "Post Award",
	icon: Medal,
	links: [
		{
			title: "KPIs",
			path: "/kpi",
		},
		{
			title: "Compliance",
			path: "/compliance",
		},
	],
};

const regulationLinks = {
	id: "regulations",
	title: "Regulations",
	icon: Medal,
	links: [
		{
			title: "FAR/DFARS",
			path: "/far",
		},
	],
};

const administrationLinks = {
	id: "administration",
	title: "Administration",
	icon: Settings2,
	requiredGroups: ["COMPANY_ADMIN", "GOVLYNK_ADMIN"], // Can also protect individual links
	links: [
		{
			title: "Manage Contacts",
			path: "/contacts",
		},
		{
			title: "Manage Team",
			path: "/team",
		},
		{
			title: "Manage Users",
			path: "/user-admin",
		},
		{
			title: "Sprints",
			path: "/sprints",
		},
	],
};

const systemLinks = {
	id: "govlynk",
	title: "GovLynk",
	icon: Settings,
	requiredGroups: ["GOVLYNK_ADMIN"], // Can also protect individual links
	links: [
		{
			title: "Client Setup",
			path: "/client-setup",
		},

		{
			title: "Contact Admin",
			path: "/contact-admin",
		},
		{
			title: "User Company Access",
			path: "/user-company-access",
		},
		{
			title: "Test",
			path: "/test",
		},
	],
};

// Export organized menu structure
export const menuLinks = [
	homeLinks,
	profileLinks,
	strategyLinks,
	marketIntelligenceLinks,
	marketPositioningLinks,
	productLinks,
	salesLinks,
	postAwardLinks,
	regulationLinks,
	administrationLinks,
	systemLinks,
];

import { Home, Users, Medal, Settings, Briefcase, Settings2, PieChart, ChartLine } from "lucide-react";

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
			title: "Strategic Positioning",
			path: "/strategy",
		},
		{
			title: "Past Performance",
			path: "/experience",
		},
		{
			title: "Certifications",
			path: "/certification",
		},
		{
			title: "SWOT",
			path: "/swot",
		},
		{
			title: "Maturity Assessment",
			path: "/maturity",
		},
		{
			title: "SAM Registration",
			path: "/sam",
		},
	],
};

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
	requiredGroups: ["COMPANY_ADMIN", "GOVLYNK_ADMIN"],
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
			title: "File Browser",
			path: "/company-files",
		},
	],
};

const settingsLinks = {
	id: "settings",
	title: "Settings",
	icon: Settings2,
	requiredGroups: ["COMPANY_ADMIN", "GOVLYNK_ADMIN"],
	links: [
		{
			title: "Settings",
			path: "/settings",
		},
	],
};

const systemLinks = {
	id: "govlynk",
	title: "GovLynk",
	icon: Settings,
	requiredGroups: ["GOVLYNK_ADMIN"],
	links: [
		{
			title: "Client Setup",
			path: "/client-setup",
		},
		{
			title: "Sprint Admin",
			path: "/sprint-admin",
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
		{
			title: "HigherGov",
			path: "/hg",
		},
	],
};

export const menuLinks = [
	homeLinks,
	profileLinks,
	marketIntelligenceLinks,
	marketPositioningLinks,
	productLinks,
	salesLinks,
	postAwardLinks,
	regulationLinks,
	administrationLinks,
	systemLinks,
	settingsLinks,
];
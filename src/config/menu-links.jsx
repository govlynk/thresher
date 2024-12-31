import {
	Home,
	Users,
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

const profileLinks = {
	id: "profile",
	title: "Profile",
	icon: Users,
	links: [
		{
			title: "Maturity Assessment",
			path: "/maturity",
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

// Group related menu items
const marketIntelligenceLinks = {
	id: "market",
	title: "Market Intelligence",
	icon: Briefcase,
	links: [
		{
			title: "Spending Analysis",
			path: "/spending-analysis",
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
			title: "Strategic Positioning",
			path: "/strategy",
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
			title: "Pipeline",
			path: "/pipeline",
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
	],
};

const systemLinks = {
	id: "govlynk",
	title: "GovLynk",
	icon: Settings,
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
			title: "Form Components Example",
			path: "/assessment",
		},
		{
			title: "Test",
			path: "/test",
		},
	],
};

// Export organized menu structure
export const menuLinks = [
	{
		id: "home",
		title: "Home",
		icon: Home,
		links: [
			{
				title: "Dashboard",
				path: "/dashboard",
			},
			{
				title: "To Do",
				path: "/todos",
			},
		],
	},

	profileLinks,
	marketPositioningLinks,
	marketIntelligenceLinks,
	salesLinks,
	regulationLinks,
	administrationLinks,
	systemLinks,
];

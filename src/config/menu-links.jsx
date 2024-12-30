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
	BarChart,
} from "lucide-react";

const profileLinks = {
	id: "profile",
	title: "Profile",
	icon: Users,
	links: [
		{
			title: "Company Background",
			path: "/capability",
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
	icon: PieChart,
	links: [
		{
			title: "Contract Opportunities",
			path: "/opportunities",
		},
		{
			title: "Spending Analysis",
			path: "/spending-analysis",
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
	marketIntelligenceLinks,
	regulationLinks,
	administrationLinks,
	systemLinks,
];

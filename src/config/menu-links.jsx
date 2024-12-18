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
	PieChart,
	BarChart,
} from "lucide-react";

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

const profileLinks = {
	id: "profile",
	title: "Profile",
	icon: Users,
	links: [
		{
			title: "Capability Statement",
			path: "/capability",
		},
		{
			title: "SAM Registration",
			path: "/sam",
		},
	],
};

const administrationLinks = {
	id: "administration",
	title: "Administration",
	icon: Users,
	links: [
		{
			title: "Manage Contacts",
			path: "/contacts",
		},
		{
			title: "Manage Team",
			path: "/team",
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
			title: "User Admin",
			path: "/user-admin",
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
	marketIntelligenceLinks,
	profileLinks,
	administrationLinks,
	regulationLinks,
	systemLinks,
];

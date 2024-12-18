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
} from "lucide-react";

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
	{
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
	},
	{
		id: "Company Admin",
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
	},
	{
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
	},
	{
		id: "Regulations",
		title: "Regulations",
		icon: Medal,
		links: [
			{
				title: "FAR/DFARS",
				path: "/far",
			},
		],
	},
	{
		id: "awards",
		title: "Awards",
		icon: Medal,
		links: [
			{
				title: "Past Awards",
				path: "/awards",
			},
		],
	},
	{
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
	},
];

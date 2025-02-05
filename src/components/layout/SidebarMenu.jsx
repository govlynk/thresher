import { Fragment, useState } from "react";
import { Sidebar, Menu, MenuItem, menuClasses, SubMenu } from "react-pro-sidebar";
import { Typography } from "@mui/material";
import { NavLink } from "react-router-dom";
import { menuLinks } from "../../config/menu-links";
import SidebarHeader from "./SidebarHeader";
import { useGlobalStore } from "../../stores/globalStore";

// Keep existing themes configuration
const themes = {
	light: {
		sidebar: {
			backgroundColor: "#ffffff",
			color: "#ffffff",
		},
		menu: {
			menuContent: "#121619",
			icon: "#167697",
			hover: {
				backgroundColor: "#c5e4ff",
				color: "#44596e",
			},
			disabled: {
				color: "#9fb6cf",
			},
		},
	},
	dark: {
		sidebar: {
			backgroundColor: "#0b2948",
			color: "#8ba1b7",
		},
		menu: {
			menuContent: "#082440",
			icon: "#167697",
			hover: {
				backgroundColor: "#00458b",
				color: "#b6c8d9",
			},
			disabled: {
				color: "#3e5e7e",
			},
		},
	},
};

// Keep hex to rgba converter
const hexToRgba = (hex, alpha) => {
	const r = parseInt(hex.slice(1, 3), 16);
	const g = parseInt(hex.slice(3, 5), 16);
	const b = parseInt(hex.slice(5, 7), 16);
	return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// Updated Item Component to use menuLinks structure
const MenuItems = ({ items, selected, setSelected, theme }) => {
	const { activeUserData } = useGlobalStore();
	const hasAccess = (requiredGroups) => {
		// Return true if no groups required
		if (!requiredGroups?.length) return true;

		// Return false if no user groups
		if (!activeUserData?.groups?.length) return false;
		// Check if any required group exists in user groups
		return requiredGroups.some((requiredGroup) => activeUserData.groups.includes(requiredGroup));
	};

	return (
		<>
			{items.map(
				(item) =>
					hasAccess(item.requiredGroups) && (
						<Fragment key={item.id}>
							<SubMenu label={item.title} icon={item.icon && <item.icon size={20} />}>
								{item.links?.map((link) => (
									<MenuItem
										key={link.path}
										onClick={() => setSelected(link.title)}
										component={
											<NavLink
												to={link.path}
												style={({ isActive }) => ({
													backgroundColor: isActive ? "#00458b" : "#0b2948",
												})}
											/>
										}
									>
										{link.title}
									</MenuItem>
								))}
							</SubMenu>
						</Fragment>
					)
			)}
		</>
	);
};

const SidebarMenu = ({ isCollapsed, onToggleCollapse }) => {
	const [selected, setSelected] = useState("Dashboard");
	const [theme, setTheme] = useState("light");

	const menuItemStyles = {
		root: {
			fontSize: "13px",
			fontWeight: 400,
		},
		icon: {
			color: themes[theme].menu.icon,
			[`&.${menuClasses.disabled}`]: {
				color: themes[theme].menu.disabled.color,
			},
		},
		SubMenuExpandIcon: {
			color: "#b6b7b9",
		},
		subMenuContent: ({ level }) => ({
			backgroundColor: level === 0 ? hexToRgba(themes[theme].menu.menuContent, 1) : "transparent",
		}),
		button: {
			[`&.${menuClasses.disabled}`]: {
				color: themes[theme].menu.disabled.color,
			},
			"&:hover": {
				backgroundColor: hexToRgba(themes[theme].menu.hover.backgroundColor, 1),
				color: themes[theme].menu.hover.color,
			},
		},
		label: ({ open }) => ({
			fontWeight: open ? 600 : undefined,
		}),
	};

	return (
		<Sidebar
			collapsed={isCollapsed}
			width='250px'
			backgroundColor={hexToRgba(themes[theme].sidebar.backgroundColor, 1)}
			rootStyles={{
				color: themes[theme].sidebar.color,
				height: "100%",
				overflow: "auto",
			}}
		>
			<div style={{ display: "flex", flexDirection: "column", height: "100%", backgroundColor: "black" }}>
				<SidebarHeader
					isCollapsed={isCollapsed}
					setIsCollapsed={onToggleCollapse}
					style={{ marginBottom: "24px", marginTop: "16px" }}
				/>

				<div style={{ flex: 1, marginBottom: "32px" }}>
					<div style={{ padding: "0 24px", marginBottom: "8px" }}>
						<Typography
							variant='body2'
							fontWeight={600}
							style={{ opacity: isCollapsed ? 0 : 0.7, letterSpacing: "0.5px" }}
						>
							General
						</Typography>
					</div>

					<Menu menuItemStyles={menuItemStyles}>
						<MenuItems items={menuLinks} selected={selected} setSelected={setSelected} theme={theme} />
					</Menu>
				</div>
			</div>
		</Sidebar>
	);
};

export default SidebarMenu;

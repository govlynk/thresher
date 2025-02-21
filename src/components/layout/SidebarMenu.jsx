import { Fragment, useState } from "react";
import { Sidebar, Menu, MenuItem, menuClasses, SubMenu } from "react-pro-sidebar";
import { Typography, Box, Drawer, useTheme } from "@mui/material";
import { NavLink } from "react-router-dom";
import { menuLinks } from "../../config/menu-links";
import SidebarHeader from "./SidebarHeader";
import { useGlobalStore } from "../../stores/globalStore";
import { ListItem, ListItemButton, ListItemIcon, ListItemText } from "@mui/material";
import React from "react";

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

export default function SidebarMenu({ isOpen, isCollapsed, onToggleCollapse, width }) {
	const theme = useTheme();
	const [selected, setSelected] = useState("Dashboard");

	const menuItemStyles = {
		root: {
			fontSize: "13px",
			fontWeight: 400,
		},
		icon: {
			color: themes[theme.palette.mode === "dark" ? "dark" : "light"].menu.icon,
			[`&.${menuClasses.disabled}`]: {
				color: themes[theme.palette.mode === "dark" ? "dark" : "light"].menu.disabled.color,
			},
		},
		SubMenuExpandIcon: {
			color: "#b6b7b9",
		},
		subMenuContent: ({ level }) => ({
			backgroundColor:
				level === 0
					? hexToRgba(themes[theme.palette.mode === "dark" ? "dark" : "light"].menu.menuContent, 1)
					: "transparent",
		}),
		button: {
			[`&.${menuClasses.disabled}`]: {
				color: themes[theme.palette.mode === "dark" ? "dark" : "light"].menu.disabled.color,
			},
			"&:hover": {
				backgroundColor: hexToRgba(
					themes[theme.palette.mode === "dark" ? "dark" : "light"].menu.hover.backgroundColor,
					1
				),
				color: themes[theme.palette.mode === "dark" ? "dark" : "light"].menu.hover.color,
			},
		},
		label: ({ open }) => ({
			fontWeight: open ? 600 : undefined,
		}),
	};

	return (
		<Drawer
			open={isOpen}
			variant='persistent'
			PaperProps={{
				sx: {
					width,
					border: "none",
					bgcolor: theme.palette.mode === "dark" ? "grey.900" : "grey.50",
					transition: "width 0.2s ease-out",
					display: "flex",
				},
			}}
		>
			<Box
				sx={{
					height: "100vh",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					borderRight: 1,
					borderColor: "divider",
					overflow: "hidden",
				}}
			>
				{/* Header section - stays fixed */}
				<Box
					sx={{
						p: 2,
						borderBottom: 1,
						borderColor: "divider",
						flexShrink: 0,
					}}
				>
					<SidebarHeader
						isCollapsed={isCollapsed}
						setIsCollapsed={onToggleCollapse}
						style={{ marginBottom: "24px", marginTop: "16px" }}
					/>
				</Box>

				{/* Scrollable content section */}
				<Box
					sx={{
						flex: 1,
						minHeight: 0,
						overflowY: "auto",
						overflowX: "hidden",
						"&::-webkit-scrollbar": {
							width: "8px",
							bgcolor: "transparent",
						},
						"&::-webkit-scrollbar-thumb": {
							bgcolor: theme.palette.mode === "dark" ? "grey.800" : "grey.300",
							borderRadius: "4px",
						},
						"&:hover::-webkit-scrollbar-thumb": {
							bgcolor: theme.palette.mode === "dark" ? "grey.700" : "grey.400",
						},
					}}
				>
					<Menu
						menuItemStyles={menuItemStyles}
						style={{
							height: "100%",
							border: "none",
						}}
					>
						<Box sx={{ p: 2 }}>
							<div style={{ padding: "0 24px", marginBottom: "8px" }}>
								<Typography
									variant='body2'
									fontWeight={600}
									style={{ opacity: isCollapsed ? 0 : 0.7, letterSpacing: "0.5px" }}
								>
									General
								</Typography>
							</div>

							<MenuItems
								items={menuLinks}
								selected={selected}
								setSelected={setSelected}
								theme={theme.palette.mode === "dark" ? "dark" : "light"}
							/>
						</Box>
					</Menu>
				</Box>

				{/* Footer section - stays fixed at bottom if needed */}
				<Box
					sx={{
						p: 2,
						borderTop: 1,
						borderColor: "divider",
						mt: "auto",
						flexShrink: 0,
					}}
				>
					{/* ... footer content if any ... */}
				</Box>
			</Box>
		</Drawer>
	);
}

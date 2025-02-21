import { Outlet } from "react-router-dom";
import { Box, useTheme } from "@mui/material";
import TopBar from "./TopBar";
import SidebarMenu from "./SidebarMenu";
import { useGlobalStore } from "../../stores/globalStore";
import { useState } from "react";

export default function MainLayout({ signOut }) {
	const theme = useTheme();
	const { activeUserData } = useGlobalStore();
	const [isCollapsed, setIsCollapsed] = useState(false);

	const SIDEBAR_WIDTH = 250;
	const COLLAPSED_WIDTH = 80;
	const TOPBAR_HEIGHT = 64;

	const handleToggleCollapse = () => {
		setIsCollapsed(!isCollapsed);
	};

	return (
		<Box
			sx={{
				display: "flex",
				minHeight: "100vh",
				backgroundColor: theme.palette.background.default,
			}}
		>
			{/* Fixed Sidebar */}
			<Box
				sx={{
					position: "fixed",
					left: 0,
					top: 0,
					bottom: 0,
					zIndex: theme.zIndex.drawer,
					width: isCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
					backgroundColor: theme.palette.mode === "dark" ? "grey.900" : "background.paper",
					borderRight: 1,
					borderColor: "divider",
					transition: theme.transitions.create("width", {
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.enteringScreen,
					}),
				}}
			>
				<SidebarMenu
					isOpen={true}
					isCollapsed={isCollapsed}
					onToggleCollapse={handleToggleCollapse}
					width={isCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH}
				/>
			</Box>

			{/* Main Content Area */}
			<Box
				sx={{
					display: "flex",
					flexDirection: "column",
					flexGrow: 1,
					ml: isCollapsed ? `${COLLAPSED_WIDTH}px` : `${SIDEBAR_WIDTH}px`,
					minHeight: "100vh",
					overflow: "hidden",
					transition: theme.transitions.create("margin", {
						easing: theme.transitions.easing.sharp,
						duration: theme.transitions.duration.enteringScreen,
					}),
				}}
			>
				{/* Fixed TopBar */}
				<Box
					sx={{
						position: "fixed",
						top: 0,
						right: 0,
						left: isCollapsed ? COLLAPSED_WIDTH : SIDEBAR_WIDTH,
						height: TOPBAR_HEIGHT,
						zIndex: theme.zIndex.appBar,
						backgroundColor: theme.palette.mode === "dark" ? "grey.900" : "background.paper",
						borderBottom: 1,
						borderColor: "divider",
						transition: theme.transitions.create("left", {
							easing: theme.transitions.easing.sharp,
							duration: theme.transitions.duration.enteringScreen,
						}),
					}}
				>
					<TopBar />
				</Box>

				{/* Main Content with top padding for fixed header */}
				<Box
					component='main'
					sx={{
						flexGrow: 1,
						mt: `${TOPBAR_HEIGHT}px`,
						p: 3,
						overflow: "auto",
						background:
							theme.palette.mode === "dark" ? "linear-gradient(90deg, #016996 0%, #012f55 100%)" : "#bcd1f8",
					}}
				>
					<Outlet />
				</Box>
			</Box>
		</Box>
	);
}

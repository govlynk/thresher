import { Box, IconButton } from "@mui/material";
import { Menu } from "lucide-react";
import logo from "../../assets/images/logo.png";

export default function SidebarHeader({ isCollapsed, setIsCollapsed, style }) {
	return (
		<Box
			sx={{
				display: "flex",
				alignItems: "center",
				justifyContent: isCollapsed ? "center" : "space-between",
				...style,
			}}
		>
			{!isCollapsed && (
				<Box
					sx={{
						display: "flex",
						alignItems: "center",
						pl: "24px", // Match menu item padding
						flex: 1,
					}}
				>
					<img
						src={logo}
						alt='Logo'
						style={{
							height: "32px",
							width: "auto",
							maxWidth: "80%",
						}}
					/>
				</Box>
			)}
			<IconButton
				onClick={() => setIsCollapsed(!isCollapsed)}
				sx={{
					width: 40,
					height: 40,
					borderRadius: "8px",
					mr: isCollapsed ? 0 : "8px", // Add margin when not collapsed
					ml: isCollapsed ? 0 : "auto", // Push to right when not collapsed
					"&:hover": {
						backgroundColor: (theme) =>
							theme.palette.mode === "dark" ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
					},
				}}
			>
				<Menu
					size={20}
					style={{
						transform: isCollapsed ? "rotate(180deg)" : "none",
						transition: "transform 0.2s ease-in-out",
					}}
				/>
			</IconButton>
		</Box>
	);
}

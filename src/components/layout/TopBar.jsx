import { useState } from "react";
import {
	AppBar,
	Toolbar,
	Typography,
	Box,
	Avatar,
	Divider,
	Menu,
	MenuItem,
	IconButton,
	ListItemIcon,
	CircularProgress,
} from "@mui/material";
import { LogOut, User, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signOut } from "aws-amplify/auth";
import { CompanySwitcher } from "./CompanySwitcher";
import { useAuthStore } from "../../stores/authStore";

function stringToColor(string) {
	if (!string) return "#666666";
	let hash = 0;
	for (let i = 0; i < string.length; i++) {
		hash = string.charCodeAt(i) + ((hash << 5) - hash);
	}
	let color = "#";
	for (let i = 0; i < 3; i++) {
		const value = (hash >> (i * 8)) & 0xff;
		color += `00${value.toString(16)}`.slice(-2);
	}
	return color;
}

function stringAvatar(name) {
	if (!name) return { children: "?", sx: { bgcolor: "#666666" } };

	const initials = name
		.split(" ")
		.map((word) => word[0])
		.join("")
		.toUpperCase()
		.slice(0, 2);

	return {
		sx: {
			bgcolor: stringToColor(name),
		},
		children: initials,
	};
}

export default function TopBar() {
	const navigate = useNavigate();
	const [anchorEl, setAnchorEl] = useState(null);
	const [isSigningOut, setIsSigningOut] = useState(false);
	const { user, reset } = useAuthStore();

	const handleMenu = (event) => {
		setAnchorEl(event.currentTarget);
	};

	const handleClose = () => {
		setAnchorEl(null);
	};

	const handleProfile = () => {
		navigate("/profile");
		handleClose();
	};

	const handleSignOut = async () => {
		try {
			setIsSigningOut(true);
			await signOut();
			reset();
			handleClose();
			navigate("/");
		} catch (error) {
			console.error("Error signing out:", error);
		} finally {
			setIsSigningOut(false);
		}
	};

	return (
		<AppBar
			position='sticky'
			elevation={0}
			sx={{
				bgcolor: "background.paper",
				borderBottom: "1px solid",
				borderColor: "divider",
			}}
		>
			<Toolbar sx={{ gap: 2 }}>
				{user && <CompanySwitcher />}
				<Divider orientation='vertical' flexItem />

				<Box sx={{ flexGrow: 1 }} />

				{user && (
					<Box sx={{ display: "flex", alignItems: "center" }}>
						<IconButton
							onClick={handleMenu}
							size='small'
							sx={{ ml: 2 }}
							aria-controls={Boolean(anchorEl) ? "user-menu" : undefined}
							aria-haspopup='true'
							aria-expanded={Boolean(anchorEl) ? "true" : undefined}
						>
							<Avatar {...stringAvatar(user.name)} />
						</IconButton>

						<Menu
							id='user-menu'
							anchorEl={anchorEl}
							open={Boolean(anchorEl)}
							onClose={handleClose}
							onClick={handleClose}
							transformOrigin={{ horizontal: "right", vertical: "top" }}
							anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
							PaperProps={{
								elevation: 0,
								sx: {
									overflow: "visible",
									filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
									mt: 1.5,
									"& .MuiAvatar-root": {
										width: 32,
										height: 32,
										ml: -0.5,
										mr: 1,
									},
								},
							}}
						>
							<MenuItem sx={{ pointerEvents: "none" }}>
								<Typography variant='subtitle2'>{user.name}</Typography>
							</MenuItem>
							<MenuItem sx={{ pointerEvents: "none", color: "text.secondary" }}>
								<Typography variant='caption'>{user.email}</Typography>
							</MenuItem>

							<Divider />

							<MenuItem onClick={handleProfile}>
								<ListItemIcon>
									<User size={20} />
								</ListItemIcon>
								Profile
							</MenuItem>

							{user.isAdmin && (
								<MenuItem onClick={() => navigate("/settings")}>
									<ListItemIcon>
										<Settings size={20} />
									</ListItemIcon>
									Settings
								</MenuItem>
							)}

							<MenuItem onClick={handleSignOut} disabled={isSigningOut}>
								<ListItemIcon>
									{isSigningOut ? <CircularProgress size={20} /> : <LogOut size={20} />}
								</ListItemIcon>
								{isSigningOut ? "Signing out..." : "Sign Out"}
							</MenuItem>
						</Menu>
					</Box>
				)}
			</Toolbar>
		</AppBar>
	);
}

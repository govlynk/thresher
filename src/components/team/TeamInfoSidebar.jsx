import React from "react";
import {
	Drawer,
	Box,
	Typography,
	IconButton,
	List,
	ListItem,
	ListItemText,
	Chip,
	Divider,
	useTheme,
} from "@mui/material";
import { X, Users, Calendar, User } from "lucide-react";

export function TeamInfoSidebar({ open, onClose, team }) {
	const theme = useTheme();

	if (!team) return null;

	return (
		<Drawer
			anchor='right'
			open={open}
			onClose={onClose}
			PaperProps={{
				sx: {
					width: 400,
					bgcolor: "background.paper",
					p: 3,
				},
			}}
		>
			<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
				<Typography variant='h6'>Team Information</Typography>
				<IconButton onClick={onClose} size='small'>
					<X size={20} />
				</IconButton>
			</Box>

			<Box sx={{ mb: 4 }}>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
					<Users size={20} color={theme.palette.primary.main} />
					<Typography variant='subtitle1' color='primary'>
						{team.name}
					</Typography>
				</Box>
				<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
					{team.description}
				</Typography>
				<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
					<Calendar size={16} />
					<Typography variant='caption' color='text.secondary'>
						Created: {new Date(team.createdAt).toLocaleDateString()}
					</Typography>
				</Box>
			</Box>

			<Typography variant='subtitle2' sx={{ mb: 2, color: "text.secondary" }}>
				Team Members ({team.members?.length || 0})
			</Typography>

			<List sx={{ mb: 3 }}>
				{team.members?.map((member) => (
					<React.Fragment key={member.id}>
						<ListItem sx={{ px: 0 }}>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1, mr: 2 }}>
								<User size={16} />
							</Box>
							<ListItemText
								primary={`${member.contact?.firstName} ${member.contact?.lastName}`}
								secondary={
									<Box component='span' sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
										<Typography variant='caption' color='text.secondary'>
											{member.contact?.contactEmail}
										</Typography>
										<Chip
											label={member.role}
											size='small'
											variant='outlined'
											color='primary'
											sx={{ alignSelf: "flex-start" }}
										/>
									</Box>
								}
							/>
						</ListItem>
						<Divider />
					</React.Fragment>
				))}
			</List>

			<Box sx={{ mt: "auto" }}>
				<Typography variant='caption' color='text.secondary'>
					Last Updated: {new Date(team.updatedAt || team.createdAt).toLocaleString()}
				</Typography>
			</Box>
		</Drawer>
	);
}

import React from "react";
import {
	Box,
	Typography,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	IconButton,
	Chip,
	CircularProgress,
	Alert,
} from "@mui/material";
import { Edit, Trash2 } from "lucide-react";
import { useTeamMemberStore } from "../../stores/teamMemberStore";

export function TeamMemberList({ teamId }) {
	const { teamMembers, loading, error, removeTeamMember } = useTeamMemberStore();

	const handleRemoveMember = async (memberId) => {
		if (window.confirm("Are you sure you want to remove this team member?")) {
			try {
				await removeTeamMember(memberId);
			} catch (err) {
				console.error("Failed to remove team member:", err);
			}
		}
	};

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return (
			<Alert severity='error' sx={{ mt: 2 }}>
				{error}
			</Alert>
		);
	}

	if (!teamMembers.length) {
		return (
			<Typography color='text.secondary' sx={{ p: 2, textAlign: "center" }}>
				No team members found
			</Typography>
		);
	}

	return (
		<List>
			{teamMembers.map((member) => (
				<ListItem key={member.id} divider>
					<ListItemText
						primary={`${member.contact.firstName} ${member.contact.lastName}`}
						secondary={member.contact.email}
					/>
					<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
						<Chip label={member.role} size='small' color='primary' variant='outlined' />
						<Chip label={member.status} size='small' color={member.status === "ACTIVE" ? "success" : "default"} />
						<ListItemSecondaryAction>
							<IconButton edge='end' onClick={() => handleRemoveMember(member.id)} size='small' color='error'>
								<Trash2 size={18} />
							</IconButton>
						</ListItemSecondaryAction>
					</Box>
				</ListItem>
			))}
		</List>
	);
}

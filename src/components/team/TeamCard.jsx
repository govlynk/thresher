import React, { useState } from "react";
import { Card, CardHeader, CardContent, IconButton, Typography, Box, Chip, Divider } from "@mui/material";
import { Edit, Trash2, UserPlus, Info, Users } from "lucide-react";
import { TeamMemberList } from "./TeamMemberList";
import { TeamMemberDialog } from "./TeamMemberDialog";
import { TeamInfoSidebar } from "./TeamInfoSidebar";
import { useTeamMemberStore } from "../../stores/teamMemberStore";
import { useTeamStore } from "../../stores/teamStore";

export function TeamCard({ team, onEdit, onDelete }) {
	const [memberDialogOpen, setMemberDialogOpen] = useState(false);
	const [infoSidebarOpen, setInfoSidebarOpen] = useState(false);
	const [selectedMember, setSelectedMember] = useState(null);
	const { addTeamMember, updateTeamMember, removeTeamMember } = useTeamMemberStore();
	const { fetchTeams } = useTeamStore();

	const handleMemberUpdate = async (action, data) => {
		try {
			switch (action) {
				case "addMember":
					const newMember = await addTeamMember({
						teamId: team.id,
						contactId: data.contactId,
						role: data.role,
					});
					console.log("Added new member:", newMember);
					break;
				case "updateMember":
					const updatedMember = await updateTeamMember(data.id, {
						role: data.role,
					});
					console.log("Updated member:", updatedMember);
					break;
				case "deleteMember":
					await removeTeamMember(data.id);
					console.log("Removed member:", data.id);
					break;
				default:
					throw new Error("Invalid action");
			}
			// Refresh team data after successful update
			if (team.companyId) {
				await fetchTeams(team.companyId);
			}
		} catch (err) {
			console.error("Member update error:", err);
			console.error("Error details:", {
				action,
				data,
				error: err.message,
				stack: err.stack,
			});
			throw err;
		}
	};

	return (
		<Card sx={{ height: "100%" }}>
			<CardHeader
				title={team.name}
				subheader={
					<Box component='div' color='text.secondary' sx={{ typography: "body2" }}>
						Created {new Date(team.createdAt).toLocaleDateString()}
					</Box>
				}
				action={
					<Box sx={{ display: "flex", gap: 1 }}>
						<IconButton onClick={() => setMemberDialogOpen(true)} size='small' title='Add Members'>
							<UserPlus size={18} />
						</IconButton>
						<IconButton onClick={() => setInfoSidebarOpen(true)} size='small' title='Team Info'>
							<Info size={18} />
						</IconButton>
						<IconButton onClick={() => onEdit(team)} size='small' title='Edit Team'>
							<Edit size={18} />
						</IconButton>
						<IconButton onClick={() => onDelete(team.id)} size='small' color='error' title='Delete Team'>
							<Trash2 size={18} />
						</IconButton>
					</Box>
				}
			/>
			<Divider />
			<CardContent>
				<Typography variant='body2' color='text.secondary' sx={{ mb: 2 }}>
					{team.description || "No description"}
				</Typography>

				<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
					<Users size={16} />
					<Typography variant='subtitle2'>
						{Array.isArray(team.members) ? team.members.length : 0} Members
					</Typography>
				</Box>

				<TeamMemberList team={team} onUpdate={handleMemberUpdate} onEditMember={setSelectedMember} />
			</CardContent>

			<TeamMemberDialog
				open={memberDialogOpen}
				onClose={() => {
					setMemberDialogOpen(false);
					setSelectedMember(null);
				}}
				team={team}
				member={selectedMember}
				onUpdate={handleMemberUpdate}
			/>

			<TeamInfoSidebar open={infoSidebarOpen} onClose={() => setInfoSidebarOpen(false)} team={team} />
		</Card>
	);
}

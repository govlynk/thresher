import React, { useState } from "react";
import {
	List,
	ListItem,
	ListItemText,
	IconButton,
	Chip,
	Box,
	Button,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	CircularProgress,
	Alert,
	Typography,
	Collapse,
} from "@mui/material";
import { Edit, Trash2, ChevronDown, ChevronUp, UserPlus } from "lucide-react";
import { TeamMemberDialog } from "./TeamMemberDialog";

const INITIAL_MEMBERS_SHOWN = 2;

export function TeamMemberList({ team, onUpdate }) {
	const [editMember, setEditMember] = useState(null);
	const [dialogOpen, setDialogOpen] = useState(false);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [memberToDelete, setMemberToDelete] = useState(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [expanded, setExpanded] = useState(false);

	const displayedMembers = expanded ? team?.members || [] : (team?.members || []).slice(0, INITIAL_MEMBERS_SHOWN);

	const handleAddMember = () => {
		setEditMember(null);
		setDialogOpen(true);
	};

	const handleEditMember = (member) => {
		setEditMember(member);
		setDialogOpen(true);
	};

	const handleDeleteClick = (member) => {
		setMemberToDelete(member);
		setDeleteConfirmOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!memberToDelete) return;

		if (!onUpdate) {
			console.error("onUpdate function not provided");
			return;
		}

		setLoading(true);
		try {
			await onUpdate("deleteMember", memberToDelete);
			setDeleteConfirmOpen(false);
			setMemberToDelete(null);
			setError(null);
		} catch (err) {
			console.error("Error deleting team member:", err);
			setError(err.message || "Failed to delete team member");
		} finally {
			setLoading(false);
		}
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
		setEditMember(null);
	};

	if (!team) {
		return (
			<Box sx={{ p: 2, textAlign: "center" }}>
				<Typography variant='body1' color='text.secondary'>
					No team selected
				</Typography>
			</Box>
		);
	}

	const totalMembers = team.members?.length || 0;
	const hasMoreToShow = totalMembers > INITIAL_MEMBERS_SHOWN;

	return (
		<Box>
			{error && (
				<Alert severity='error' sx={{ mb: 2 }}>
					{error}
				</Alert>
			)}

			<List>
				{displayedMembers.map((member) => (
					<ListItem
						key={member.id}
						sx={{
							mb: 1,
							bgcolor: "background.paper",
							borderRadius: 1,
							"&:hover": {
								bgcolor: "action.hover",
							},
							position: "relative",
							pr: 12, // Make room for actions
						}}
					>
						<ListItemText
							primary={`${member.contact?.firstName} ${member.contact?.lastName}`}
							secondary={member.contact?.contactEmail}
						/>
						<Box sx={{ position: "absolute", right: 8, display: "flex", alignItems: "center", gap: 1 }}>
							<Chip label={member.role} size='small' color='primary' variant='outlined' />
							<IconButton onClick={() => handleEditMember(member)} disabled={loading} size='small'>
								<Edit size={18} />
							</IconButton>
							<IconButton
								onClick={() => handleDeleteClick(member)}
								disabled={loading}
								size='small'
								color='error'
							>
								<Trash2 size={18} />
							</IconButton>
						</Box>
					</ListItem>
				))}
			</List>

			{totalMembers > 0 && (
				<Button
					fullWidth
					onClick={() => setExpanded(!expanded)}
					startIcon={expanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
					sx={{
						mt: 1,
						color: "text.secondary",
						"&:hover": {
							backgroundColor: "action.hover",
						},
					}}
				>
					{expanded ? "Show Less" : `Show More (${totalMembers - INITIAL_MEMBERS_SHOWN} more)`}
				</Button>
			)}

			<TeamMemberDialog
				open={dialogOpen}
				onClose={handleDialogClose}
				team={team}
				member={editMember}
				onUpdate={onUpdate}
			/>

			<Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
				<DialogTitle>Confirm Delete</DialogTitle>
				<DialogContent>
					<Typography variant='body1'>
						Are you sure you want to remove {memberToDelete?.contact?.firstName}{" "}
						{memberToDelete?.contact?.lastName} from the team?
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteConfirmOpen(false)} disabled={loading}>
						Cancel
					</Button>
					<Button
						onClick={handleDeleteConfirm}
						color='error'
						disabled={loading}
						startIcon={loading && <CircularProgress size={20} />}
					>
						{loading ? "Deleting..." : "Delete"}
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

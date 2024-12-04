import React, { useEffect } from "react";
import {
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Collapse,
	IconButton,
	Typography,
	Chip,
	Alert,
	CircularProgress,
	List,
	TextField,
	Divider,
} from "@mui/material";
import { Edit, Trash2, UserPlus, Filter, Search, ChevronDown, ChevronUp, Users } from "lucide-react";
import { TeamDialog } from "./TeamDialog";
import { TeamMemberDialog } from "./TeamMemberDialog";
import { useTeamStore } from "../../stores/teamStore";
import { useTeamMemberStore } from "../../stores/teamMemberStore";
import { useUserCompanyStore } from "../../stores/userCompanyStore";

export function TeamList() {
	const [searchTerm, setSearchTerm] = React.useState("");
	const [teamDialogOpen, setTeamDialogOpen] = React.useState(false);
	const [memberDialogOpen, setMemberDialogOpen] = React.useState(false);
	const [selectedTeam, setSelectedTeam] = React.useState(null);
	const [expandedTeamId, setExpandedTeamId] = React.useState(null);

	const { teams, removeTeam, loading, error, fetchTeams } = useTeamStore();
	const { getActiveCompany } = useUserCompanyStore();
	const activeCompany = getActiveCompany();

	useEffect(() => {
		if (activeCompany?.id) {
			fetchTeams(activeCompany.id);
		}
	}, [activeCompany?.id, fetchTeams]);

	const filteredTeams =
		teams?.filter(
			(team) =>
				team?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				team?.description?.toLowerCase().includes(searchTerm.toLowerCase())
		) || [];

	const handleEditTeam = (team) => {
		setSelectedTeam(team);
		setTeamDialogOpen(true);
	};

	const handleAddMembers = (team) => {
		setSelectedTeam(team);
		setMemberDialogOpen(true);
	};

	const handleDeleteTeam = async (teamId) => {
		if (window.confirm("Are you sure you want to delete this team?")) {
			try {
				await removeTeam(teamId);
			} catch (err) {
				console.error("Error deleting team:", err);
			}
		}
	};

	const handleExpandTeam = (teamId) => {
		setExpandedTeamId(expandedTeamId === teamId ? null : teamId);
	};

	const handleDialogClose = () => {
		setTeamDialogOpen(false);
		setMemberDialogOpen(false);
		setSelectedTeam(null);
		if (activeCompany?.id) {
			fetchTeams(activeCompany.id);
		}
	};

	if (!activeCompany) {
		return (
			<Alert severity='warning' sx={{ mt: 2 }}>
				Please select a company to manage teams
			</Alert>
		);
	}

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
				<CircularProgress />
			</Box>
		);
	}

	return (
		<Box>
			{error && (
				<Alert severity='error' sx={{ mb: 3 }}>
					{error}
				</Alert>
			)}

			<Typography variant='h4' component='h1' sx={{ mb: 4, fontWeight: "bold" }}>
				Team Management
			</Typography>

			<Box sx={{ mb: 3, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
				<Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
					<TextField
						size='small'
						placeholder='Search teams...'
						value={searchTerm}
						onChange={(e) => setSearchTerm(e.target.value)}
						InputProps={{
							startAdornment: <Search size={20} />,
						}}
					/>
					<IconButton>
						<Filter size={20} />
					</IconButton>
				</Box>
				<Button variant='contained' onClick={() => setTeamDialogOpen(true)}>
					Create Team
				</Button>
			</Box>

			<Box sx={{ display: "grid", gap: 3, gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
				{filteredTeams.length > 0 ? (
					filteredTeams.map((team) => (
						<Card key={team.id} sx={{ height: "100%" }}>
							<CardHeader
								title={team.name}
								subheader={
									<Typography variant='body2' component='div' color='text.secondary'>
										Created {new Date(team.createdAt).toLocaleDateString()}
									</Typography>
								}
								action={
									<Box sx={{ display: "flex", gap: 1 }}>
										<IconButton onClick={() => handleAddMembers(team)} size='small' title='Add Members'>
											<UserPlus size={18} />
										</IconButton>
										<IconButton onClick={() => handleEditTeam(team)} size='small' title='Edit Team'>
											<Edit size={18} />
										</IconButton>
										<IconButton
											onClick={() => handleDeleteTeam(team.id)}
											size='small'
											color='error'
											title='Delete Team'
										>
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

								<Box
									sx={{
										display: "flex",
										justifyContent: "space-between",
										alignItems: "center",
										mb: 1,
									}}
								>
									<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
										<Users size={16} />
										<Typography variant='subtitle2' component='div'>
											{Array.isArray(team.members) ? team.members.length : 0} Members
										</Typography>
									</Box>
									<IconButton
										onClick={() => handleExpandTeam(team.id)}
										size='small'
										sx={{ transform: expandedTeamId === team.id ? "rotate(180deg)" : "none" }}
									>
										{expandedTeamId === team.id ? <ChevronUp /> : <ChevronDown />}
									</IconButton>
								</Box>

								<Collapse in={expandedTeamId === team.id}>
									<List sx={{ mt: 1 }}>
										{Array.isArray(team.members) && team.members.length > 0 ? (
											team.members.map((member) => (
												<Box
													key={member.id}
													sx={{
														display: "flex",
														justifyContent: "space-between",
														alignItems: "center",
														p: 1,
														borderRadius: 1,
														"&:hover": {
															bgcolor: "action.hover",
														},
													}}
												>
													<Box>
														<Typography variant='body2'>
															{member.contact?.firstName} {member.contact?.lastName}
														</Typography>
														<Typography variant='caption' color='text.secondary'>
															{member.contact?.contactEmail}
														</Typography>
													</Box>
													<Chip label={member.role} size='small' variant='outlined' color='primary' />
												</Box>
											))
										) : (
											<Typography variant='body2' color='text.secondary' align='center' sx={{ py: 2 }}>
												No members yet
											</Typography>
										)}
									</List>
								</Collapse>
							</CardContent>
						</Card>
					))
				) : (
					<Box sx={{ textAlign: "center", gridColumn: "1 / -1", py: 4 }}>
						<Typography color='text.secondary'>No teams found</Typography>
					</Box>
				)}
			</Box>

			<TeamDialog open={teamDialogOpen} onClose={handleDialogClose} team={selectedTeam} />

			<TeamMemberDialog open={memberDialogOpen} onClose={handleDialogClose} team={selectedTeam} />
		</Box>
	);
}

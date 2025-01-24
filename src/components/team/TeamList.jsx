import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	Card,
	CardActions,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	CardContent,
	CardHeader,
	Collapse,
	IconButton,
	Typography,
	Chip,
	Alert,
	CircularProgress,
	TextField,
	Divider,
	List,
	FormControl,
	Select,
	MenuItem,
} from "@mui/material";
import { Edit, Trash2, UserPlus, Filter, Search, ChevronDown, ChevronUp, Users, Info } from "lucide-react";
import { TeamDialog } from "./TeamDialog";
import { TeamMemberDialog } from "./TeamMemberDialog";
import { TeamInfoSidebar } from "./TeamInfoSidebar";
import { useTeamMemberStore } from "../../stores/teamMemberStore";
import { useTeamStore } from "../../stores/teamStore";
import { useGlobalStore } from "../../stores/globalStore";

const ROLES = [
	"Decision Maker",
	"Business Development",
	"Sales",
	"Marketing",
	"Finance",
	"Engineering",
	"Contracts",
	"Consultant",
	"Negotiator",
	"SME",
	"Other",
];

export function TeamList() {
	const [searchTerm, setSearchTerm] = useState("");
	const [teamDialogOpen, setTeamDialogOpen] = useState(false);
	const [memberDialogOpen, setMemberDialogOpen] = useState(false);
	const [selectedTeam, setSelectedTeam] = useState(null);
	const [expandedTeamId, setExpandedTeamId] = useState(null);
	const [memberToDelete, setMemberToDelete] = useState(null);
	const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
	const [infoSidebarOpen, setInfoSidebarOpen] = useState(false);
	const [selectedTeamForInfo, setSelectedTeamForInfo] = useState(null);
	const [editMemberDialogOpen, setEditMemberDialogOpen] = useState(false);
	const [selectedMember, setSelectedMember] = useState(null);

	const { teams, removeTeam, loading, error, fetchTeams } = useTeamStore();
	const { removeTeamMember, updateTeamMember } = useTeamMemberStore();
	const { activeCompanyId } = useGlobalStore.getState();

	useEffect(() => {
		if (activeCompanyId) {
			fetchTeams(activeCompanyId);
		}
	}, [activeCompanyId, fetchTeams]);

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

	const handleViewTeamInfo = (team) => {
		setSelectedTeamForInfo(team);
		setInfoSidebarOpen(true);
	};

	const handleDeleteMember = async (member) => {
		setMemberToDelete(member);
		setDeleteConfirmOpen(true);
	};

	const handleConfirmDeleteMember = async () => {
		if (!memberToDelete) return;

		try {
			await removeTeamMember(memberToDelete.id);
			await fetchTeams(activeCompanyId);
			setDeleteConfirmOpen(false);
			setMemberToDelete(null);
		} catch (err) {
			console.error("Error deleting team member:", err);
		}
	};

	const handleEditMember = (member) => {
		setSelectedMember(member);
		setEditMemberDialogOpen(true);
	};

	const handleUpdateMember = async (memberId, role) => {
		try {
			await updateTeamMember(memberId, {
				role: role,
			});
			await fetchTeams(activeCompanyId);
		} catch (err) {
			console.error("Error updating team member:", err);
			throw err;
		}
	};

	const handleDialogClose = () => {
		setTeamDialogOpen(false);
		setMemberDialogOpen(false);
		setEditMemberDialogOpen(false);
		setSelectedTeam(null);
		setSelectedMember(null);
		if (activeCompanyId) {
			fetchTeams(activeCompanyId);
		}
	};

	if (!activeCompanyId) {
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
		<Box
			sx={{
				height: "100%",
				display: "flex",
				flexDirection: "column",
				overflow: "hidden",
			}}
		>
			{error && (
				<Alert severity='error' sx={{ mb: 3 }}>
					{error}
				</Alert>
			)}

			<Typography variant='h4' component='div' sx={{ mb: 2, fontWeight: "bold" }}>
				Team Management
			</Typography>

			<Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
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

			<Box
				sx={{
					display: "grid",
					gap: 3,
					gridTemplateColumns: "repeat(auto-fill, minmax(450px, 1fr))",
					overflow: "auto",
					flex: 1,
					p: 1,
					"&::-webkit-scrollbar": {
						width: "8px",
						height: "8px",
					},
					"&::-webkit-scrollbar-track": {
						background: "transparent",
					},
					"&::-webkit-scrollbar-thumb": {
						background: (theme) => (theme.palette.mode === "dark" ? "#555" : "#ccc"),
						borderRadius: "4px",
					},
					"&::-webkit-scrollbar-thumb:hover": {
						background: (theme) => (theme.palette.mode === "dark" ? "#666" : "#999"),
					},
				}}
			>
				{filteredTeams.length > 0 ? (
					filteredTeams.map((team) => (
						<Card
							key={team.id}
							sx={{
								height: "fit-content",
								minHeight: 200,
								minWidth: 450,
								display: "flex",
								flexDirection: "column",
							}}
						>
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
										<IconButton onClick={() => handleViewTeamInfo(team)} size='small' title='Team Info'>
											<Info size={18} />
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
										mb: 2,
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
									<List
										sx={{
											mt: 1,
											maxHeight: "320px",
											height: team.members?.length > 4 ? "320px" : "auto",
											overflowY: team.members?.length > 4 ? "auto" : "hidden",
											overflowX: "hidden",
											"&::-webkit-scrollbar": {
												width: "8px",
											},
											"&::-webkit-scrollbar-track": {
												background: "transparent",
											},
											"&::-webkit-scrollbar-thumb": {
												background: (theme) => (theme.palette.mode === "dark" ? "#555" : "#ccc"),
												borderRadius: "4px",
											},
											"&::-webkit-scrollbar-thumb:hover": {
												background: (theme) => (theme.palette.mode === "dark" ? "#666" : "#999"),
											},
											"& > .MuiBox-root": {
												height: "80px",
											},
										}}
									>
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
														<Typography
															variant='body2'
															sx={{
																fontWeight: 500,
																fontSize: "0.9rem",
																color: "text.primary",
															}}
														>
															{member.contact?.firstName} {member.contact?.lastName}
														</Typography>
														<Typography
															variant='caption'
															color='text.secondary'
															sx={{ fontSize: "0.8rem" }}
														>
															{member.contact?.contactEmail}
														</Typography>
													</Box>
													<Box
														sx={{
															display: "flex",
															alignItems: "center",
															justifyContent: "space-between",
															gap: 1,
														}}
													>
														<FormControl size='small' sx={{ minWidth: 120 }}>
															<Select
																value={member.role}
																onChange={(e) => handleUpdateMember(member.id, e.target.value)}
																variant='outlined'
																sx={{
																	"& .MuiOutlinedInput-notchedOutline": {
																		borderColor: "divider",
																	},
																	"&:hover .MuiOutlinedInput-notchedOutline": {
																		borderColor: "primary.main",
																	},
																	height: "30px",
																	"& .MuiSelect-select": {
																		py: "2px",
																		px: 1.5,
																		fontSize: "0.8125rem",
																		lineHeight: "1.5",
																		width: "100%",
																	},
																}}
															>
																{ROLES.map((role) => (
																	<MenuItem key={role} value={role}>
																		<Typography variant='body2' sx={{ fontSize: "0.8125rem" }}>
																			{role}
																		</Typography>
																	</MenuItem>
																))}
															</Select>
														</FormControl>
														<IconButton
															title='Edit Member'
															size='small'
															onClick={() => handleEditMember(member)}
															color='primary'
														>
															<Edit size={16} />
														</IconButton>
														<IconButton
															title='Remove Member'
															size='small'
															onClick={() => handleDeleteMember(member)}
															color='error'
														>
															<Trash2 size={16} />
														</IconButton>
													</Box>
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
			<TeamMemberDialog
				open={memberDialogOpen}
				onClose={handleDialogClose}
				team={selectedTeam}
				onUpdate={handleUpdateMember}
			/>

			<TeamInfoSidebar
				open={infoSidebarOpen}
				onClose={() => {
					setInfoSidebarOpen(false);
					setSelectedTeamForInfo(null);
				}}
				team={selectedTeamForInfo}
			/>

			<Dialog open={deleteConfirmOpen} onClose={() => setDeleteConfirmOpen(false)}>
				<DialogTitle>Confirm Delete</DialogTitle>
				<DialogContent>
					<Typography>
						Are you sure you want to remove {memberToDelete?.contact?.firstName}{" "}
						{memberToDelete?.contact?.lastName} from the team?
					</Typography>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
					<Button onClick={handleConfirmDeleteMember} color='error' variant='contained'>
						Delete
					</Button>
				</DialogActions>
			</Dialog>
		</Box>
	);
}

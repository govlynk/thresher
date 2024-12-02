import React, { useState, useEffect } from "react";
import {
	Box,
	Button,
	Card,
	IconButton,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TextField,
	Typography,
	Chip,
	Alert,
	CircularProgress,
} from "@mui/material";
import { Edit, Trash2, UserPlus, Filter, Search } from "lucide-react";
import { TeamDialog } from "./TeamDialog";
import { TeamMemberDialog } from "./TeamMemberDialog";
import { useTeamStore } from "../../stores/teamStore";
import { useUserCompanyStore } from "../../stores/userCompanyStore";

export function TeamList() {
	const [searchTerm, setSearchTerm] = useState("");
	const [teamDialogOpen, setTeamDialogOpen] = useState(false);
	const [memberDialogOpen, setMemberDialogOpen] = useState(false);
	const [selectedTeam, setSelectedTeam] = useState(null);

	const { teams, removeTeam, loading, error, fetchTeams } = useTeamStore();
	const { getActiveCompany } = useUserCompanyStore();
	const activeCompany = getActiveCompany();

	useEffect(() => {
		if (activeCompany?.id) {
			fetchTeams(activeCompany.id);
			fetchMembers(teams.id);
			console.log("fetchTeams", teams);
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

			<Typography variant='h4' sx={{ mb: 4, fontWeight: "bold" }}>
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

			<TableContainer component={Card}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Team Name</TableCell>
							<TableCell>Description</TableCell>
							<TableCell>Members</TableCell>
							<TableCell>Created</TableCell>
							<TableCell align='right'>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{filteredTeams.length > 0 ? (
							filteredTeams.map((team) => (
								<TableRow key={team.id}>
									<TableCell>{team.name}</TableCell>
									<TableCell>{team.description || "-"}</TableCell>
									<TableCell>
										<Chip label={`${team.members?.length || 0} members`} size='small' />
									</TableCell>
									<TableCell>{team.createdAt ? new Date(team.createdAt).toLocaleDateString() : "-"}</TableCell>
									<TableCell align='right'>
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
									</TableCell>
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell colSpan={5} align='center'>
									No teams found
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>

			<TeamDialog
				open={teamDialogOpen}
				onClose={() => {
					setTeamDialogOpen(false);
					setSelectedTeam(null);
				}}
				team={selectedTeam}
			/>

			<TeamMemberDialog
				open={memberDialogOpen}
				onClose={() => {
					setMemberDialogOpen(false);
					setSelectedTeam(null);
				}}
				team={selectedTeam}
				activeCompanyId={activeCompany?.id} // Pass activeCompanyId to TeamMemberDialog
			/>
		</Box>
	);
}

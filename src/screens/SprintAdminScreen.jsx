import React, { useState, useEffect } from "react";
import {
	Box,
	Typography,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	IconButton,
	Button,
	Alert,
	CircularProgress,
	TablePagination,
	TableSortLabel,
} from "@mui/material";
import { Edit, Trash2, Plus } from "lucide-react";
import { generateClient } from "aws-amplify/data";
import { useGlobalStore } from "../stores/globalStore";
import { format } from "date-fns";

const client = generateClient();

const ROWS_PER_PAGE_OPTIONS = [10, 25, 50, 100];

export default function SprintAdminScreen() {
	const [companies, setCompanies] = useState([]);
	const [teams, setTeams] = useState([]);
	const [sprints, setSprints] = useState([]);
	const [selectedCompany, setSelectedCompany] = useState("");
	const [selectedTeam, setSelectedTeam] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	// Pagination state
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(ROWS_PER_PAGE_OPTIONS[0]);

	// Sorting state
	const [orderBy, setOrderBy] = useState("startDate");
	const [order, setOrder] = useState("desc");

	// Fetch companies on mount
	useEffect(() => {
		fetchCompanies();
	}, []);

	// Fetch teams when company is selected
	useEffect(() => {
		if (selectedCompany) {
			fetchTeams(selectedCompany);
		} else {
			setTeams([]);
			setSelectedTeam("");
		}
	}, [selectedCompany]);

	// Fetch all sprints when team is selected
	useEffect(() => {
		if (selectedTeam) {
			fetchAllSprints(selectedTeam);
		} else {
			setSprints([]);
		}
	}, [selectedTeam]);

	const fetchCompanies = async () => {
		setLoading(true);
		try {
			const response = await client.models.Company.list();
			setCompanies(response.data || []);
			setError(null);
		} catch (err) {
			console.error("Error fetching companies:", err);
			setError("Failed to fetch companies");
		} finally {
			setLoading(false);
		}
	};

	const fetchTeams = async (companyId) => {
		setLoading(true);
		try {
			const response = await client.models.Team.list({
				filter: { companyId: { eq: companyId } },
			});
			setTeams(response.data || []);
			setError(null);
		} catch (err) {
			console.error("Error fetching teams:", err);
			setError("Failed to fetch teams");
		} finally {
			setLoading(false);
		}
	};

	const fetchAllSprints = async (teamId) => {
		setLoading(true);
		try {
			let allSprints = [];
			let nextToken = null;

			do {
				const response = await client.models.Sprint.list({
					filter: { teamId: { eq: teamId } },
					limit: 1000,
					nextToken,
				});

				allSprints = [...allSprints, ...(response.data || [])];
				nextToken = response.nextToken;
			} while (nextToken);

			setSprints(allSprints);
			setError(null);
		} catch (err) {
			console.error("Error fetching sprints:", err);
			setError("Failed to fetch sprints");
		} finally {
			setLoading(false);
		}
	};

	const handleDeleteSprint = async (sprintId) => {
		if (!window.confirm("Are you sure you want to delete this sprint?")) return;

		setLoading(true);
		try {
			await client.models.Sprint.delete({ id: sprintId });
			setSprints(sprints.filter((sprint) => sprint.id !== sprintId));
			setError(null);
		} catch (err) {
			console.error("Error deleting sprint:", err);
			setError("Failed to delete sprint");
		} finally {
			setLoading(false);
		}
	};

	const handleSort = (property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	// Sort function
	const sortSprints = (sprintA, sprintB) => {
		let comparison = 0;

		switch (orderBy) {
			case "name":
				comparison = sprintA.name.localeCompare(sprintB.name);
				break;
			case "goal":
				comparison = sprintA.goal.localeCompare(sprintB.goal);
				break;
			case "startDate":
				comparison = new Date(sprintA.startDate) - new Date(sprintB.startDate);
				break;
			case "endDate":
				comparison = new Date(sprintA.endDate) - new Date(sprintB.endDate);
				break;
			case "status":
				comparison = sprintA.status.localeCompare(sprintB.status);
				break;
			default:
				comparison = 0;
		}

		return order === "desc" ? -comparison : comparison;
	};

	// Get current page data
	const sortedAndPaginatedSprints = React.useMemo(() => {
		return [...sprints].sort(sortSprints).slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
	}, [sprints, order, orderBy, page, rowsPerPage]);

	const renderSortLabel = (property, label) => (
		<TableSortLabel
			active={orderBy === property}
			direction={orderBy === property ? order : "asc"}
			onClick={() => handleSort(property)}
		>
			{label}
		</TableSortLabel>
	);

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h4' sx={{ mb: 4, fontWeight: "bold" }}>
				Sprint Administration
			</Typography>

			{error && (
				<Alert severity='error' sx={{ mb: 3 }}>
					{error}
				</Alert>
			)}

			<Box sx={{ display: "flex", gap: 2, mb: 4 }}>
				<FormControl fullWidth>
					<InputLabel>Select Company</InputLabel>
					<Select
						value={selectedCompany}
						onChange={(e) => setSelectedCompany(e.target.value)}
						label='Select Company'
					>
						{companies.map((company) => (
							<MenuItem key={company.id} value={company.id}>
								{company.legalBusinessName}
							</MenuItem>
						))}
					</Select>
				</FormControl>

				<FormControl fullWidth>
					<InputLabel>Select Team</InputLabel>
					<Select
						value={selectedTeam}
						onChange={(e) => setSelectedTeam(e.target.value)}
						label='Select Team'
						disabled={!selectedCompany}
					>
						{teams.map((team) => (
							<MenuItem key={team.id} value={team.id}>
								{team.name}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			</Box>

			{loading ? (
				<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
					<CircularProgress />
				</Box>
			) : (
				<>
					<Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
						<Button variant='contained' startIcon={<Plus />} disabled={!selectedTeam}>
							Add Sprint
						</Button>
					</Box>

					<Paper>
						<TableContainer>
							<Table>
								<TableHead>
									<TableRow>
										<TableCell>{renderSortLabel("name", "Name")}</TableCell>
										<TableCell>{renderSortLabel("goal", "Goal")}</TableCell>
										<TableCell>{renderSortLabel("startDate", "Start Date")}</TableCell>
										<TableCell>{renderSortLabel("endDate", "End Date")}</TableCell>
										<TableCell>{renderSortLabel("status", "Status")}</TableCell>
										<TableCell align='right'>Actions</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{sortedAndPaginatedSprints.map((sprint) => (
										<TableRow key={sprint.id} hover>
											<TableCell>{sprint.name}</TableCell>
											<TableCell>{sprint.goal}</TableCell>
											<TableCell>{format(new Date(sprint.startDate), "MMM d, yyyy")}</TableCell>
											<TableCell>{format(new Date(sprint.endDate), "MMM d, yyyy")}</TableCell>
											<TableCell>{sprint.status.charAt(0).toUpperCase() + sprint.status.slice(1)}</TableCell>
											<TableCell align='right'>
												<IconButton size='small'>
													<Edit size={18} />
												</IconButton>
												<IconButton
													size='small'
													color='error'
													onClick={() => handleDeleteSprint(sprint.id)}
												>
													<Trash2 size={18} />
												</IconButton>
											</TableCell>
										</TableRow>
									))}
									{sprints.length === 0 && (
										<TableRow>
											<TableCell colSpan={6} align='center'>
												No sprints found
											</TableCell>
										</TableRow>
									)}
								</TableBody>
							</Table>
						</TableContainer>

						<TablePagination
							rowsPerPageOptions={ROWS_PER_PAGE_OPTIONS}
							component='div'
							count={sprints.length}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</Paper>
				</>
			)}
		</Box>
	);
}

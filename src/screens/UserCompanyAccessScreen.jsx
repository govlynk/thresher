import React, { useEffect, useState } from "react";
import {
	Box,
	Button,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Typography,
	IconButton,
	Chip,
	CircularProgress,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Alert,
} from "@mui/material";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { UserCompanyAccessDialog } from "../components/userCompanyAccess/UserCompanyAccessDialog";
import { useUserCompanyAccessStore } from "../stores/userCompanyAccessStore";
import { generateClient } from "aws-amplify/data";

const ACCESS_LEVELS = {
	COMPANY_ADMIN: "Company Administrator",
	COMPANY_USER: "Company User",
	GOVLYNK_ADMIN: "GovLynk Administrator",
	GOVLYNK_USER: "GovLynk User",
};

const client = generateClient({
	authMode: "userPool",
});

export default function UserCompanyAccessScreen() {
	const { UserCompanyAccesss, fetchUserCompanyAccesss, loading, error } = useUserCompanyAccessStore();
	const [companies, setCompanies] = useState([]);
	const [selectedCompany, setSelectedCompany] = useState("");
	const [users, setUsers] = useState({});
	const [dialogOpen, setDialogOpen] = useState(false);
	const [editRole, setEditRole] = useState(null);
	const [localLoading, setLocalLoading] = useState(false);
	const [localError, setLocalError] = useState(null);

	useEffect(() => {
		fetchCompanies();
	}, []);

	useEffect(() => {
		if (selectedCompany) {
			fetchUserCompanyAccesss(selectedCompany);
			fetchUsers();
		}
	}, [selectedCompany, fetchUserCompanyAccesss]);

	useEffect(() => {
		if (UserCompanyAccesss.length > 0) {
			const userIds = UserCompanyAccesss.map((role) => role.userId);
			fetchUsers(userIds);
		}
	}, [UserCompanyAccesss]);

	const fetchCompanies = async () => {
		setLocalLoading(true);
		try {
			const response = await client.models.Company.list();
			setCompanies(response.data || []);
			setLocalError(null);
		} catch (err) {
			console.error("Failed to fetch companies", err);
			setLocalError("Failed to load companies");
		} finally {
			setLocalLoading(false);
		}
	};

	const fetchUsers = async () => {
		setLocalLoading(true);
		try {
			const response = await client.models.User.list();
			const userMap = {};
			response.data.forEach((user) => {
				userMap[user.id] = user;
			});
			setUsers(userMap);
			setLocalError(null);
		} catch (err) {
			console.error("Failed to fetch users", err);
			setLocalError("Failed to load users");
		} finally {
			setLocalLoading(false);
		}
	};

	const handleCompanyChange = (event) => {
		setSelectedCompany(event.target.value || "");
	};

	const handleAddClick = () => {
		if (!selectedCompany) {
			setLocalError("Please select a company first");
			return;
		}
		setEditRole(null);
		setDialogOpen(true);
	};

	const handleEditClick = async (role) => {
		setLocalLoading(true);
		try {
			const [userResponse, companyResponse] = await Promise.all([
				client.models.User.get({ id: role.userId }),
				client.models.Company.get({ id: role.companyId }),
			]);

			if (!userResponse?.data || !companyResponse?.data) {
				throw new Error("Failed to load role details");
			}
			const completeRole = {
				...role,
				user: userResponse.data,
				company: companyResponse.data,
				access: role.access,
			};

			setEditRole(completeRole);
			setDialogOpen(true);
			setLocalError(null);
		} catch (err) {
			console.error("Error fetching role details:", err);
			setLocalError("Failed to load role details");
		} finally {
			setLocalLoading(false);
		}
	};

	const handleDeleteClick = async (role) => {
		if (!window.confirm("Are you sure you want to delete this role?")) {
			return;
		}

		setLocalLoading(true);
		try {
			await client.models.UserCompanyAccess.delete({ id: role.id });
			if (selectedCompany) {
				await fetchUserCompanyAccesss(selectedCompany);
			}
			setLocalError(null);
		} catch (err) {
			console.error("Failed to delete role", err);
			setLocalError("Failed to delete role");
		} finally {
			setLocalLoading(false);
		}
	};

	const handleDialogClose = () => {
		setDialogOpen(false);
		setEditRole(null);
		if (selectedCompany) {
			fetchUserCompanyAccesss(selectedCompany);
		}
	};

	const isLoading = loading || localLoading;
	const displayError = error || localError;

	return (
		<Box sx={{ p: 3 }}>
			<Typography variant='h4' sx={{ mb: 4, fontWeight: "bold" }}>
				User Company Roles
			</Typography>

			{displayError && (
				<Alert severity='error' sx={{ mb: 3 }}>
					{displayError}
				</Alert>
			)}

			<FormControl fullWidth sx={{ mb: 3 }}>
				<InputLabel>Select Company</InputLabel>
				<Select value={selectedCompany} onChange={handleCompanyChange} label='Select Company'>
					{companies.map((company) => (
						<MenuItem key={company.id} value={company.id}>
							{company.legalBusinessName}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			{isLoading ? (
				<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
					<CircularProgress />
				</Box>
			) : (
				<TableContainer component={Paper}>
					<Table>
						<TableHead>
							<TableRow>
								<TableCell>Name</TableCell>
								<TableCell>Email</TableCell>
								<TableCell>Access</TableCell>
								<TableCell>Status</TableCell>
								<TableCell align='right'>Actions</TableCell>
							</TableRow>
						</TableHead>
						<TableBody>
							{UserCompanyAccesss.map((role) => {
								const user = users[role.userId] || {};
								return (
									<TableRow key={role.id} hover>
										<TableCell>{user.name || "Loading..."}</TableCell>
										<TableCell>{user.email || "Loading..."}</TableCell>
										<TableCell>{ACCESS_LEVELS[role.access] || "-"}</TableCell>
										<TableCell>
											<Chip
												label={role.status || "INACTIVE"}
												color={role.status === "ACTIVE" ? "success" : "default"}
												size='small'
											/>
										</TableCell>
										<TableCell align='right'>
											<IconButton onClick={() => handleEditClick(role)} size='small' title='Edit Role'>
												<Edit size={18} />
											</IconButton>
											<IconButton
												onClick={() => handleDeleteClick(role)}
												size='small'
												color='error'
												title='Delete Role'
											>
												<Trash2 size={18} />
											</IconButton>
										</TableCell>
									</TableRow>
								);
							})}
							{UserCompanyAccesss.length === 0 && (
								<TableRow>
									<TableCell colSpan={5} align='center'>
										No roles found for this company
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</TableContainer>
			)}

			<Button
				variant='contained'
				color='primary'
				startIcon={<UserPlus size={20} />}
				onClick={handleAddClick}
				sx={{ mt: 3 }}
				disabled={!selectedCompany}
			>
				Add Role
			</Button>

			<UserCompanyAccessDialog
				open={dialogOpen}
				onClose={handleDialogClose}
				role={editRole}
				companyId={selectedCompany}
			/>
		</Box>
	);
}

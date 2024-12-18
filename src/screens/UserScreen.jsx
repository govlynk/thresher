// src/screens/UserScreen.jsx
import React, { useEffect } from "react";
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
	Alert,
	CircularProgress,
} from "@mui/material";
import { Edit, Trash2, UserPlus } from "lucide-react";
import { useUserStore } from "../stores/userStore";
import { UserDialog } from "../components/UserDialog";
import { ContactSelectionDialog } from "../components/user/ContactSelectionDialog";
import { UserCreationDialog } from "../components/user/UserCreationDialog";
import { ContactCreationDialog } from "../components/user/ContactCreationDialog";
import { useGlobalStore } from "../stores/globalStore";

export default function UserScreen() {
	const { users, fetchUsers, removeUser, loading, error, cleanup } = useUserStore();
	const { activeCompanyId } = useGlobalStore();
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const [contactSelectionOpen, setContactSelectionOpen] = React.useState(false);
	const [contactCreationOpen, setContactCreationOpen] = React.useState(false);
	const [userCreationOpen, setUserCreationOpen] = React.useState(false);
	const [selectedContact, setSelectedContact] = React.useState(null);
	const [editUser, setEditUser] = React.useState(null);

	useEffect(() => {
		if (activeCompanyId) {
			fetchUsers();
		}
		return () => cleanup();
	}, [activeCompanyId, fetchUsers, cleanup]);

	if (!activeCompanyId) {
		return (
			<Box sx={{ p: 3 }}>
				<Alert severity='warning'>Please select a company to manage users</Alert>
			</Box>
		);
	}

	const handleAddClick = () => {
		setContactSelectionOpen(true);
	};

	const handleContactSelected = (contact) => {
		setContactSelectionOpen(false);
		if (contact) {
			setSelectedContact(contact);
			setUserCreationOpen(true);
		} else {
			setContactCreationOpen(true);
		}
	};

	const handleContactCreated = (newContact) => {
		setContactCreationOpen(false);
		setSelectedContact(newContact);
		setUserCreationOpen(true);
	};

	const handleEditClick = (user) => {
		setEditUser(user);
		setDialogOpen(true);
	};

	const handleDeleteClick = async (userId) => {
		if (window.confirm("Are you sure you want to delete this user?")) {
			try {
				await removeUser(userId);
			} catch (err) {
				console.error("Error deleting user:", err);
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

	return (
		<Box sx={{ p: 3 }}>
			<Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
				<Typography variant='h5'>Users</Typography>
				<Button variant='contained' startIcon={<UserPlus size={20} />} onClick={handleAddClick}>
					Add User
				</Button>
			</Box>

			{error && (
				<Alert severity='error' sx={{ mb: 3 }}>
					{error}
				</Alert>
			)}

			<TableContainer component={Paper}>
				<Table>
					<TableHead>
						<TableRow>
							<TableCell>Name</TableCell>
							<TableCell>Email</TableCell>
							<TableCell>Phone</TableCell>
							<TableCell>Status</TableCell>
							<TableCell>Last Login</TableCell>
							<TableCell align='right'>Actions</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{users.map((user) => (
							<TableRow key={user.id} hover>
								<TableCell>{user.name}</TableCell>
								<TableCell>{user.email}</TableCell>
								<TableCell>{user.phone || "-"}</TableCell>
								<TableCell>
									<Chip
										label={user.status}
										color={user.status === "ACTIVE" ? "success" : "default"}
										size='small'
									/>
								</TableCell>
								<TableCell>{user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "-"}</TableCell>
								<TableCell align='right'>
									<IconButton onClick={() => handleEditClick(user)} size='small' title='Edit User'>
										<Edit size={18} />
									</IconButton>
									<IconButton
										onClick={() => handleDeleteClick(user.id)}
										size='small'
										color='error'
										title='Delete User'
									>
										<Trash2 size={18} />
									</IconButton>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</TableContainer>

			<ContactSelectionDialog
				open={contactSelectionOpen}
				onClose={() => setContactSelectionOpen(false)}
				onContactSelected={handleContactSelected}
			/>

			<ContactCreationDialog
				open={contactCreationOpen}
				onClose={() => setContactCreationOpen(false)}
				onContactCreated={handleContactCreated}
			/>

			<UserCreationDialog
				open={userCreationOpen}
				onClose={() => {
					setUserCreationOpen(false);
					setSelectedContact(null);
				}}
				contactData={selectedContact}
			/>

			<UserDialog
				open={dialogOpen}
				onClose={() => {
					setDialogOpen(false);
					setEditUser(null);
				}}
				editUser={editUser}
			/>
		</Box>
	);
}

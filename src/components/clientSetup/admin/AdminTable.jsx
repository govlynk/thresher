import React from "react";
import { Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, Tooltip, IconButton } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { UserPlus, AlertCircle } from "lucide-react";

const ACCESS_LEVELS = {
	COMPANY_ADMIN: "Company Administrator",
	MANAGER: "Company Manager",
	MEMBER: "Company Member",
	GOVLYNK_ADMIN: "Govlynk Administrator",
	GOVLYNK_MEMBER: "Govlynk Member",
};

export function AdminTable({ rows, onEMailChange, onCognitoIdChange, onAccessLevelChange, onAuthorize, loading }) {
	console.log("rows", rows);
	const columns = [
		{ field: "firstName", headerName: "First Name", width: 130 },
		{ field: "lastName", headerName: "Last Name", width: 130 },
		{
			field: "email",
			headerName: "Email",
			width: 200,
			renderCell: (params) => (
				<TextField
					size='small'
					value={params.row.email || ""}
					onChange={(e) => onEMailChange(params.row.id, e.target.value)}
					disabled={params.row.isAuthorized}
				/>
			),
		},
		{
			field: "cognitoId",
			headerName: "Cognito ID",
			width: 200,
			renderCell: (params) => (
				<TextField
					size='small'
					value={params.row.cognitoId}
					onChange={(e) => onCognitoIdChange(params.row.id, e.target.value)}
					disabled={params.row.isAuthorized}
				/>
			),
		},
		{
			field: "accessLevel",
			headerName: "Access Level",
			width: 200,
			renderCell: (params) => (
				<FormControl fullWidth size='small'>
					<Select
						value={params.row.accessLevel}
						onChange={(e) => onAccessLevelChange(params.row.id, e.target.value)}
						disabled={params.row.isAuthorized}
					>
						{Object.entries(ACCESS_LEVELS).map(([value, label]) => (
							<MenuItem key={value} value={value}>
								{label}
							</MenuItem>
						))}
					</Select>
				</FormControl>
			),
		},
		{
			field: "actions",
			headerName: "Actions",
			width: 150,
			renderCell: (params) => (
				<Box sx={{ display: "flex", gap: 1 }}>
					<Button
						size='small'
						variant='contained'
						onClick={() => onAuthorize(params.row)}
						disabled={params.row.isAuthorized || !params.row.cognitoId || !params.row.accessLevel}
						startIcon={<UserPlus size={16} />}
					>
						{params.row.isAuthorized ? "Authorized" : "Authorize"}
					</Button>
					<Tooltip title='User must have Cognito ID and Access Level to be authorized'>
						<IconButton size='small'>
							<AlertCircle size={16} />
						</IconButton>
					</Tooltip>
				</Box>
			),
		},
	];

	return (
		<DataGrid rows={rows} columns={columns} autoHeight disableSelectionOnClick loading={loading} sx={{ mb: 3 }} />
	);
}

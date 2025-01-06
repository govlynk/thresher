import React, { useEffect } from "react";
import { Box, Select, MenuItem, FormControl, Typography, Chip, CircularProgress, Alert } from "@mui/material";
import { Building2 } from "lucide-react";
import { useUserCompanyStore } from "../../stores/userCompanyStore";
import { useGlobalStore } from "../../stores/globalStore";
import { useAuthStore } from "../../stores/authStore";

export function CompanySelector() {
	const { userCompanies, fetchUserCompanies, loading } = useUserCompanyStore();
	const { activeCompanyId, setActiveCompany, activeCompanyData } = useGlobalStore();
	const { user } = useAuthStore();
	const [error, setError] = React.useState(null);

	useEffect(() => {
		if (user?.id) {
			fetchUserCompanies();
		}
	}, [user?.id, fetchUserCompanies]);

	useEffect(() => {
		const initializeActiveCompany = async () => {
			if (userCompanies.length > 0 && activeCompanyId) {
				try {
					await setActiveCompany(userCompanies[0].id);
					setError(null);
				} catch (err) {
					console.error("Error initializing active company:", err);
					setError("Failed to set active company");
				}
			}
		};

		initializeActiveCompany();
	}, [userCompanies, activeCompanyId, setActiveCompany]);

	const handleCompanyChange = async (event) => {
		const newCompanyId = event.target.value;
		try {
			await setActiveCompany(newCompanyId);
			setError(null);
		} catch (err) {
			console.error("Error changing company:", err);
			setError("Failed to change company");
		}
	};

	if (loading) {
		return (
			<Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
				<CircularProgress size={20} />
			</Box>
		);
	}

	if (error) {
		return (
			<Alert severity='error' sx={{ maxWidth: 300 }}>
				{error}
			</Alert>
		);
	}

	if (!userCompanies?.length) {
		return null;
	}

	return (
		<Box sx={{ display: "flex", alignItems: "center", gap: 2, minWidth: 300, maxWidth: 400 }}>
			<Building2 size={20} />
			<FormControl fullWidth size='small'>
				<Select
					value={activeCompanyId || ""}
					onChange={handleCompanyChange}
					MenuProps={{
						PaperProps: {
							sx: {
								bgcolor: "grey.900",
								borderRadius: 1,
								boxShadow: (theme) => theme.shadows[4],
								"& .MuiMenuItem-root": {
									color: "common.white",
									"&:hover": {
										bgcolor: "grey.800",
									},
									"&.Mui-selected": {
										bgcolor: "grey.800",
										"&:hover": {
											bgcolor: "grey.700",
										},
									},
								},
								"& .MuiChip-root": {
									bgcolor: "grey.800",
									borderColor: "grey.700",
									color: "common.white",
								},
							},
						},
					}}
					sx={{
						color: "common.white",
						".MuiOutlinedInput-notchedOutline": {
							borderColor: "grey.700",
						},
						"&:hover .MuiOutlinedInput-notchedOutline": {
							borderColor: "grey.600",
						},
						"&.Mui-focused .MuiOutlinedInput-notchedOutline": {
							borderColor: "primary.main",
						},
						".MuiSvgIcon-root": {
							color: "common.white",
						},
					}}
					displayEmpty
					renderValue={(selected) => {
						const company = userCompanies.find((c) => c.id === selected);
						console.log("***Selected company:", company);
						return (
							<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
								<Typography variant='body2' noWrap sx={{ color: "common.white" }}>
									{company?.legalBusinessName || "Select a company"}
								</Typography>
								{company?.uei && (
									<Chip
										label={`UEI: ${company.uei}`}
										size='small'
										variant='outlined'
										sx={{
											color: "common.white",
											borderColor: "grey.700",
										}}
									/>
								)}
							</Box>
						);
					}}
				>
					{userCompanies.map((company) => (
						<MenuItem
							key={company.id}
							value={company.id}
							sx={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
								gap: 2,
								color: "common.white",
								backgroundColor: "grey.900",
								"&:hover": {
									bgcolor: "grey.800",
								},
							}}
						>
							<Typography variant='body2' noWrap>
								{company.legalBusinessName}
							</Typography>
							{company.uei && (
								<Chip
									label={`UEI: ${company.uei}`}
									sx={{
										color: "common.white",
										borderColor: "grey.700",
										backgroundColor: "grey.900",
									}}
									size='small'
									variant='outlined'
								/>
							)}
						</MenuItem>
					))}
				</Select>
			</FormControl>
		</Box>
	);
}

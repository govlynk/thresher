import React, { useState } from "react";
import { Box, TextField, Button, Typography, Paper, useTheme, CircularProgress, Alert } from "@mui/material";
import { Search, ArrowRight, Building2 } from "lucide-react";
import { getEntity, getRepsAndCerts } from "../utils/samApi";
import { formatCompanyData } from "../utils/companyDataMapper";

export default function TestScreen() {
	const [selectedCompany, setSelectedCompany] = useState(null);
	const theme = useTheme();
	const [uei, setUei] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			handleSearch();
		}
	};

	const handleSearch = async () => {
		if (!uei.trim()) {
			setError("Please enter a UEI");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const FARData = await getRepsAndCerts(uei.trim());
			console.log("FAR Data:", FARData);
			const entityData = await getEntity(uei.trim());
			const formattedData = formatCompanyData(entityData);

			if (!formattedData) {
				throw new Error("No data found for the provided UEI");
			}
			console.log("Raw entity data:", entityData);
			console.log("Formatted company data:", formattedData);
			setSelectedCompany(formattedData);
		} catch (err) {
			console.error("Search error:", err);
			setError(err.message || "Failed to fetch company information");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Box>
			<Typography variant='h6' sx={{ mb: 3 }}>
				Search Company by UEI
			</Typography>

			<Box sx={{ display: "flex", gap: 2, mb: 3 }}>
				<TextField
					fullWidth
					label='Unique Entity ID (UEI)'
					value={uei}
					onChange={(e) => setUei(e.target.value)}
					onKeyPress={handleKeyPress}
					disabled={loading}
					placeholder='Enter 12-character UEI'
					InputProps={{
						sx: { bgcolor: "background.paper" },
					}}
				/>
				<Button
					variant='contained'
					onClick={handleSearch}
					disabled={loading}
					startIcon={loading ? <CircularProgress size={20} /> : <Search />}
				>
					Search
				</Button>
			</Box>

			{error && (
				<Alert severity='error' sx={{ mb: 3 }}>
					{error}
				</Alert>
			)}

			{selectedCompany && (
				<Paper
					sx={{
						p: 3,
						bgcolor: theme.palette.mode === "dark" ? "grey.900" : "background.paper",
						borderRadius: 2,
						boxShadow: 3,
					}}
				>
					<Typography variant='h6' sx={{ mb: 2, color: "primary.main" }}>
						Company Information
					</Typography>

					<Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(2, 1fr)" }}>
						<Box>
							<Typography variant='caption' color='text.secondary'>
								Legal Business Name
							</Typography>
							<Typography variant='body1'>{selectedCompany.legalBusinessName}</Typography>
						</Box>
						<Box>
							<Typography variant='caption' color='text.secondary'>
								DBA Name
							</Typography>
							<Typography variant='body1'>{selectedCompany.dbaName || "-"}</Typography>
						</Box>
						<Box>
							<Typography variant='caption' color='text.secondary'>
								UEI
							</Typography>
							<Typography variant='body1'>{selectedCompany.uei}</Typography>
						</Box>
						<Box>
							<Typography variant='caption' color='text.secondary'>
								CAGE Code
							</Typography>
							<Typography variant='body1'>{selectedCompany.cageCode || "-"}</Typography>
						</Box>
						<Box>
							<Typography variant='caption' color='text.secondary'>
								Registration Status
							</Typography>
							<Typography variant='body1'>{selectedCompany.registrationStatus || "-"}</Typography>
						</Box>
						<Box>
							<Typography variant='caption' color='text.secondary'>
								Expiration Date
							</Typography>
							<Typography variant='body1'>
								{selectedCompany.registrationExpirationDate
									? new Date(selectedCompany.registrationExpirationDate).toLocaleDateString()
									: "-"}
							</Typography>
						</Box>
						<Box sx={{ gridColumn: "1 / -1" }}>
							<Typography variant='caption' color='text.secondary'>
								Physical Address
							</Typography>
							<Typography variant='body1'>
								{selectedCompany.shippingAddressStreetLine1}
								{selectedCompany.shippingAddressStreetLine2 && (
									<>
										<br />
										{selectedCompany.shippingAddressStreetLine2}
									</>
								)}
								<br />
								{selectedCompany.shippingAddressCity}, {selectedCompany.shippingAddressStateCode}{" "}
								{selectedCompany.shippingAddressZipCode}
							</Typography>
						</Box>
					</Box>
				</Paper>
			)}
		</Box>
	);
}

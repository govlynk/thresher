import React, { useState } from "react";
import { Box, TextField, Button, Typography, CircularProgress, Alert, Paper, useTheme } from "@mui/material";
import { Search, ArrowRight } from "lucide-react";
import { getEntity } from "../../utils/samApi";
import { formatCompanyData } from "../../utils/companyDataMapper";

export function CompanySearch({ onCompanySelect }) {
	const theme = useTheme();
	const [uei, setUei] = useState("");
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [searchResult, setSearchResult] = useState(null);

	const handleSearch = async () => {
		if (!uei.trim()) {
			setError("Please enter a UEI");
			return;
		}

		setLoading(true);
		setError(null);

		try {
			const entityData = await getEntity(uei.trim());
			if (!entityData) {
				throw new Error("No data found for the provided UEI");
			}

			const formattedData = formatCompanyData(entityData);
			if (!formattedData) {
				throw new Error("Failed to format company data");
			}

			console.log("Raw entity data:", entityData);
			console.log("Formatted company data:", formattedData);
			setSearchResult(formattedData);
		} catch (err) {
			console.error("Search error:", err);
			setError(err.message || "Failed to fetch company information. Please verify the UEI and try again.");
		} finally {
			setLoading(false);
		}
	};

	const handleContinue = () => {
		if (!searchResult) {
			setError("Please search for a company first");
			return;
		}

		// Ensure all required fields are present
		if (!searchResult.legalBusinessName || !searchResult.uei) {
			setError("Company data is incomplete. Please try searching again.");
			return;
		}

		onCompanySelect(searchResult);
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter") {
			handleSearch();
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

			{searchResult && (
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
							<Typography variant='body1'>{searchResult.legalBusinessName}</Typography>
						</Box>
						<Box>
							<Typography variant='caption' color='text.secondary'>
								DBA Name
							</Typography>
							<Typography variant='body1'>{searchResult.dbaName || "-"}</Typography>
						</Box>
						<Box>
							<Typography variant='caption' color='text.secondary'>
								UEI
							</Typography>
							<Typography variant='body1'>{searchResult.uei}</Typography>
						</Box>
						<Box>
							<Typography variant='caption' color='text.secondary'>
								CAGE Code
							</Typography>
							<Typography variant='body1'>{searchResult.cageCode || "-"}</Typography>
						</Box>
						<Box>
							<Typography variant='caption' color='text.secondary'>
								Registration Status
							</Typography>
							<Typography variant='body1'>{searchResult.registrationStatus || "-"}</Typography>
						</Box>
						<Box>
							<Typography variant='caption' color='text.secondary'>
								Expiration Date
							</Typography>
							<Typography variant='body1'>
								{searchResult.registrationExpirationDate
									? new Date(searchResult.registrationExpirationDate).toLocaleDateString()
									: "-"}
							</Typography>
						</Box>
						<Box sx={{ gridColumn: "1 / -1" }}>
							<Typography variant='caption' color='text.secondary'>
								Physical Address
							</Typography>
							<Typography variant='body1'>
								{searchResult.shippingAddressStreetLine1}
								{searchResult.shippingAddressStreetLine2 && (
									<>
										<br />
										{searchResult.shippingAddressStreetLine2}
									</>
								)}
								<br />
								{searchResult.shippingAddressCity}, {searchResult.shippingAddressStateCode}{" "}
								{searchResult.shippingAddressZipCode}
							</Typography>
						</Box>
					</Box>

					<Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
						<Button variant='contained' endIcon={<ArrowRight />} onClick={handleContinue}>
							Continue
						</Button>
					</Box>
				</Paper>
			)}
		</Box>
	);
}

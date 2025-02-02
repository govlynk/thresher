import React from "react";
import { FormControl, InputLabel, Select, MenuItem, Box, CircularProgress } from "@mui/material";
import { useAgencies } from "../../hooks/useAgencies";

export function AgencySelector({ value, onChange }) {
	const { data: agencies, isLoading, error } = useAgencies();

	if (error) {
		return null;
	}

	return (
		<FormControl sx={{ minWidth: 300 }}>
			<InputLabel>Select Agency</InputLabel>
			<Select
				value={value?.toptier_code || ""}
				onChange={(e) => {
					// Find agency by string comparison to preserve leading zeros
					const agency = agencies?.find((a) => String(a.toptier_code) === e.target.value);
					onChange(agency || null);
				}}
				label='Select Agency'
				disabled={isLoading}
				displayEmpty
			>
				{isLoading ? (
					<Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
						<CircularProgress size={20} />
					</Box>
				) : (
					agencies?.map((agency) => (
						<MenuItem key={agency.toptier_code} value={agency.toptier_code}>
							{`${agency.agency_name} - ${agency.toptier_code}`}
						</MenuItem>
					))
				)}
			</Select>
		</FormControl>
	);
}

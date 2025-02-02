import React from "react";
import { Box, Button, Chip, Stack, Typography, useTheme, FormControl, Select, MenuItem } from "@mui/material";
import { Filter, ArrowDownUp, SortAsc, SortDesc } from "lucide-react";
import { OpportunityFiltersDialog } from "./OpportunityFiltersDialog";

export function OpportunityFilters({
	filters,
	onFilterChange,
	sortConfig,
	onSortChange,
	naicsCodes,
	agencies,
	setAsideTypes,
}) {
	const [dialogOpen, setDialogOpen] = React.useState(false);
	const theme = useTheme();

	const handleSortToggle = (field) => {
		if (sortConfig.field === field) {
			onSortChange({
				field,
				direction: sortConfig.direction === "asc" ? "desc" : "asc",
			});
		} else {
			onSortChange({ field, direction: "asc" });
		}
	};

	const activeFiltersCount = Object.values(filters).filter(Boolean).length;

	return (
		<Box>
			<Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
				<Button
					startIcon={<Filter size={18} />}
					onClick={() => setDialogOpen(true)}
					variant={activeFiltersCount > 0 ? "contained" : "outlined"}
					size='small'
					sx={{ minWidth: 120 }}
				>
					{activeFiltersCount > 0 ? `${activeFiltersCount} Filters` : "Filters"}
				</Button>

				<Stack
					direction='row'
					spacing={1}
					alignItems='center'
					sx={{
						flexGrow: 1,
						minWidth: { xs: "100%", sm: "auto" },
						mt: { xs: 1, sm: 0 },
					}}
				>
					<Typography variant='body2' color='text.secondary'>
						Sort by:
					</Typography>
					<FormControl
						size='small'
						sx={{
							minWidth: 180,
							flexGrow: { xs: 1, sm: 0 },
						}}
					>
						<Select
							value={sortConfig.field || ""}
							onChange={(e) => handleSortToggle(e.target.value)}
							displayEmpty
							renderValue={(value) => (
								<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
									<ArrowDownUp size={16} />
									{value ? value.charAt(0).toUpperCase() + value.slice(1) : "Select field"}
									{value && (
										<Box component='span' sx={{ ml: "auto" }}>
											{sortConfig.direction === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />}
										</Box>
									)}
								</Box>
							)}
						>
							<MenuItem value='responseDeadLine'>Response Date</MenuItem>
							<MenuItem value='postedDate'>Posted Date</MenuItem>
							<MenuItem value='agency'>Agency</MenuItem>
							<MenuItem value='naicsCode'>NAICS Code</MenuItem>
							<MenuItem value='typeOfSetAside'>Set-Aside Type</MenuItem>
						</Select>
					</FormControl>
				</Stack>

				{/* Active Filters Display */}
			</Box>

			{/* Active Filters Display */}
			{activeFiltersCount > 0 && (
				<Stack
					direction='row'
					spacing={1}
					sx={{
						mt: 2,
						flexWrap: "wrap",
						gap: 1,
					}}
				>
					{Object.entries(filters).map(([key, value]) => {
						if (!value) return null;
						let displayValue = value;
						if (value instanceof Date) {
							displayValue = value.toLocaleDateString();
						} else if (Array.isArray(value)) {
							displayValue = `${value.length} selected`;
						}
						return (
							<Chip
								key={key}
								label={`${key.replace(/([A-Z])/g, " $1").trim()}: ${displayValue}`}
								onDelete={() => onFilterChange(key, "")}
								size='small'
								color='primary'
								variant='outlined'
							/>
						);
					})}
				</Stack>
			)}

			<OpportunityFiltersDialog
				open={dialogOpen}
				onClose={() => setDialogOpen(false)}
				filters={filters}
				onFilterChange={onFilterChange}
				onApplyFilters={(newFilters) => {
					Object.entries(newFilters).forEach(([key, value]) => {
						onFilterChange(key, value);
					});
				}}
				naicsCodes={naicsCodes}
				agencies={agencies}
				setAsideTypes={setAsideTypes}
			/>
		</Box>
	);
}

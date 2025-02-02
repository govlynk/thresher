import React from "react";
import {
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	Button,
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Box,
	Typography,
	Stack,
	Chip,
	Divider,
} from "@mui/material";
import { LocalizationProvider, DatePicker } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { FileText, Building2, Tags, Calendar, X } from "lucide-react";

export function OpportunityFiltersDialog({
	open,
	onClose,
	filters,
	onFilterChange,
	onApplyFilters,
	naicsCodes,
	agencies,
	setAsideTypes,
}) {
	// Create local state for filters
	const [localFilters, setLocalFilters] = React.useState(filters);

	// Reset local filters when dialog opens
	React.useEffect(() => {
		setLocalFilters(filters);
	}, [open, filters]);

	const handleFilterChange = (field, value) => {
		setLocalFilters((prev) => ({ ...prev, [field]: value }));
	};

	const handleApply = () => {
		onApplyFilters(localFilters);
		onClose();
	};

	const handleClearAll = () => {
		const emptyFilters = {
			naicsCodes: [],
			agency: "",
			typeOfSetAside: "",
			responseDateFrom: null,
			responseDateTo: null,
		};
		setLocalFilters(emptyFilters);
	};

	const FilterSection = ({ title, icon: Icon, children }) => (
		<Box sx={{ mb: 3 }}>
			<Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
				<Icon size={18} />
				<Typography variant='subtitle2' color='text.secondary'>
					{title}
				</Typography>
			</Box>
			{children}
		</Box>
	);

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<Dialog
				open={open}
				onClose={onClose}
				maxWidth='md'
				fullWidth
				PaperProps={{
					sx: {
						borderRadius: 2,
					},
				}}
			>
				<DialogTitle>
					<Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
						<Typography variant='h6'>Filter Opportunities</Typography>
						{Object.values(localFilters).some(Boolean) && (
							<Button size='small' onClick={handleClearAll} color='inherit'>
								Clear All
							</Button>
						)}
					</Box>
				</DialogTitle>

				<DialogContent dividers>
					<Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 4, p: 2 }}>
						{/* NAICS Codes Section */}
						{naicsCodes?.length > 0 && (
							<FilterSection title='NAICS Codes' icon={FileText}>
								<FormControl fullWidth size='small'>
									<Select
										multiple
										value={localFilters.naicsCodes || []}
										onChange={(e) => handleFilterChange("naicsCodes", e.target.value)}
										renderValue={(selected) => (
											<Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
												{selected.map((value) => (
													<Chip
														key={value}
														label={value}
														size='small'
														onDelete={() => {
															const newValue = localFilters.naicsCodes.filter((v) => v !== value);
															handleFilterChange("naicsCodes", newValue);
														}}
														deleteIcon={<X size={14} />}
													/>
												))}
											</Box>
										)}
									>
										{naicsCodes.map((code) => (
											<MenuItem key={code} value={code}>
												{code}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</FilterSection>
						)}

						{/* Agency Section */}
						<FilterSection title='Agency' icon={Building2}>
							<FormControl fullWidth size='small'>
								<Select
									value={localFilters.agency || ""}
									onChange={(e) => handleFilterChange("agency", e.target.value)}
									displayEmpty
								>
									<MenuItem value=''>All Agencies</MenuItem>
									{agencies?.map((agency) => (
										<MenuItem key={agency} value={agency}>
											{agency}
										</MenuItem>
									))}
								</Select>
							</FormControl>
						</FilterSection>

						{/* Set-Aside Types Section */}
						{setAsideTypes?.length > 0 && (
							<FilterSection title='Set-Aside Type' icon={Tags}>
								<FormControl fullWidth size='small'>
									<Select
										value={localFilters.typeOfSetAside || ""}
										onChange={(e) => handleFilterChange("typeOfSetAside", e.target.value)}
										displayEmpty
									>
										<MenuItem value=''>All Set-Aside Types</MenuItem>
										{setAsideTypes.map((type) => (
											<MenuItem key={type} value={type}>
												{type}
											</MenuItem>
										))}
									</Select>
								</FormControl>
							</FilterSection>
						)}

						{/* Date Range Section */}
						<FilterSection title='Response Date Range' icon={Calendar}>
							<Stack spacing={2}>
								<DatePicker
									label='From'
									value={localFilters.responseDateFrom}
									onChange={(date) => handleFilterChange("responseDateFrom", date)}
									slotProps={{
										textField: {
											size: "small",
											fullWidth: true,
										},
									}}
								/>
								<DatePicker
									label='To'
									value={localFilters.responseDateTo}
									onChange={(date) => handleFilterChange("responseDateTo", date)}
									slotProps={{
										textField: {
											size: "small",
											fullWidth: true,
										},
									}}
								/>
							</Stack>
						</FilterSection>
					</Box>
				</DialogContent>

				<DialogActions sx={{ p: 2.5 }}>
					<Button onClick={onClose} color='inherit'>
						Cancel
					</Button>
					<Button
						onClick={handleApply}
						variant='contained'
						disabled={JSON.stringify(localFilters) === JSON.stringify(filters)}
					>
						Apply Filters
					</Button>
				</DialogActions>
			</Dialog>
		</LocalizationProvider>
	);
}

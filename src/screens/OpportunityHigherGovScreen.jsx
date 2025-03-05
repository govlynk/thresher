import { useState, useCallback, useEffect } from "react";
import {
	Box,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	TablePagination,
	TextField,
	Grid,
	CircularProgress,
	Typography,
	MenuItem,
	Button,
	Stack,
	ToggleButtonGroup,
	ToggleButton,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { generateClient } from "aws-amplify/api";
import { DatePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { Download, Table as TableIcon, TableOfContents } from "lucide-react";
import { OpportunitySummaryCard } from "../components/opportunities/HigherGov/OpportunitySummaryCard";
import { useGlobalStore } from "../stores/globalStore";
import { useOpportunityStore } from "../stores/opportunityStore";

/** @type {import('../../amplify/data/resource').Schema} */
const client = generateClient();

function convertToCSV(opportunities) {
	if (!opportunities?.length) return "";

	// Define CSV headers based on first opportunity object
	const headers = [
		"Title",
		"Description",
		"AI Summary",
		"Source ID",
		"Source ID Version",
		"Captured Date",
		"Posted Date",
		"Due Date",
		"Agency Name",
		"Agency Type",
		"NAICS Code",
		"PSC Code",
		"Opportunity Type",
		"Contact Name",
		"Contact Email",
		"Contact Phone",
		"Set Aside",
		"Value Est. Low",
		"Value Est. High",
		"Country",
		"State",
		"City",
		"ZIP",
		"Category",
		"Source Type",
		"Path",
		"Source Path",
	];

	// Convert data to CSV rows with all available fields
	const rows = opportunities.map((opp) => [
		opp.title,
		opp.description_text?.replace(/[\n\r]+/g, " "),
		opp.ai_summary?.replace(/[\n\r]+/g, " "),
		opp.source_id,
		opp.source_id_version,
		new Date(opp.captured_date).toLocaleDateString(),
		new Date(opp.posted_date).toLocaleDateString(),
		opp.due_date ? new Date(opp.due_date).toLocaleDateString() : "N/A",
		opp.agency?.agency_name,
		opp.agency?.agency_type,
		opp.naics_code?.naics_code,
		opp.psc_code?.psc_code,
		opp.opp_type?.description,
		opp.primary_contact_email?.contact_name,
		opp.primary_contact_email?.contact_email,
		opp.primary_contact_email?.contact_phone,
		opp.set_aside || "N/A",
		opp.val_est_low || "N/A",
		opp.val_est_high || "N/A",
		opp.pop_country,
		opp.pop_state,
		opp.pop_city,
		opp.pop_zip,
		opp.opp_cat,
		opp.source_type,
		opp.path,
		opp.source_path,
		opp.document_path,
	]);

	// Combine headers and rows, properly escape and quote all fields
	return [headers, ...rows]
		.map((row) => row.map((cell) => `"${(cell || "").toString().replace(/"/g, '""')}"`).join(","))
		.join("\n");
}

function OpportunitiesScreen() {
	const { activeCompanyId } = useGlobalStore();
	const [company, setCompany] = useState(null);
	const { saveOpportunity } = useOpportunityStore();
	const [loading, setLoading] = useState(false);
	const [saveError, setError] = useState(null);

	// State for filters and pagination
	const defaultPostedDate = new Date();
	defaultPostedDate.setDate(defaultPostedDate.getDate() - 30);

	const [filters, setFilters] = useState({
		naicsCode: "",
		agency: "",
		setAside: "",
		state: "",
		sourceType: "",
		searchId: "",
		postedDate: "",
	});
	const [page, setPage] = useState(0);
	const [rowsPerPage, setRowsPerPage] = useState(10);
	const [viewMode, setViewMode] = useState("table");

	// Fetch company data including searchId
	useEffect(() => {
		async function fetchCompany() {
			try {
				const companyData = await client.models.Company.get(activeCompanyId);
				setCompany(companyData);
			} catch (err) {
				console.error("Error fetching company:", err);
			}
		}
		if (activeCompanyId) {
			fetchCompany();
		}
	}, [activeCompanyId]);

	// Query for fetching opportunities
	const {
		data,
		isLoading,
		error: fetchError,
		refetch,
	} = useQuery({
		queryKey: ["opportunities", filters, page, rowsPerPage],
		queryFn: async () => {
			try {
				const queryParams = {
					naicsCode: filters.naicsCode || undefined,
					agency: filters.agency || undefined,
					setAside: filters.setAside || undefined,
					state: filters.state || undefined,
					sourceType: filters.sourceType,
					searchId: company?.searchId || filters.searchId || "KrP4TUMN3FLNdLYH3tfSE",
					postedDate: filters.postedDate,
					limit: rowsPerPage,
					offset: page * rowsPerPage,
				};

				console.log("Making request with params:", queryParams);
				const response = await client.queries.getOpportunities(queryParams);
				console.log("+++ Response:", response);

				// Log Lambda errors but continue
				if (response.errors) {
					const error = response.errors[0];
					console.error("Lambda error:", error);
					return { items: [], total: 0 }; // Return empty result instead of throwing
				}

				if (!response?.data) {
					console.error("No response data received");
					return { items: [], total: 0 };
				}

				let parsedData;
				try {
					parsedData = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
				} catch (e) {
					console.error("Failed to parse response data:", e);
					return { items: [], total: 0 };
				}

				if (!parsedData?.body) {
					return { items: [], total: 0 };
				}

				const body = typeof parsedData.body === "string" ? JSON.parse(parsedData.body) : parsedData.body;
				console.log("+++ Body:", body);
				return {
					items: body.items || [],
					total: body.total || 0,
				};
			} catch (error) {
				console.error("Query error:", error);
				return { items: [], total: 0 }; // Return empty result instead of throwing
			}
		},
		enabled: false,
		keepPreviousData: true,
		refetchOnWindowFocus: false,
		staleTime: 5 * 60 * 1000,
		cacheTime: 30 * 60 * 1000,
	});

	// Handlers
	const handleFilterChange = useCallback(
		(field) => (event) => {
			console.log(`Updating ${field}:`, event.target.value);
			setFilters((prev) => ({
				...prev,
				[field]: event.target.value,
			}));
		},
		[]
	);

	const handleChangePage = useCallback(
		(event, newPage) => {
			setPage(newPage);
			refetch();
		},
		[refetch]
	);

	const handleChangeRowsPerPage = useCallback(
		(event) => {
			setRowsPerPage(parseInt(event.target.value, 10));
			setPage(0);
			refetch();
		},
		[refetch]
	);

	const handleSubmit = useCallback(() => {
		console.log("Submit clicked, current filters:", filters);
		setPage(0);
		refetch();
	}, [refetch, filters]);

	const handleExport = useCallback(() => {
		if (!data?.items?.length) return;

		const csv = convertToCSV(data.items);
		const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
		const link = document.createElement("a");
		const url = URL.createObjectURL(blob);

		link.setAttribute("href", url);
		link.setAttribute("download", "opportunities.csv");
		link.style.visibility = "hidden";
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}, [data]);

	const handleSave = async (opportunity) => {
		setLoading(true);
		try {
			// Map the opportunity data to match the database schema
			const opportunityData = {
				noticeId: opportunity.source_id,
				title: opportunity.title,
				description: opportunity.description_text || opportunity.ai_summary || "",
				status: "BACKLOG",
				department: opportunity.agency?.agency_name || "N/A",
				agency: opportunity.agency?.agency_name || "N/A",
				office: opportunity.agency?.agency_type || "N/A",
				subOffice: "",
				solicitationNumber: opportunity.source_id || "",
				type: opportunity.opp_type?.description || "",
				typeOfSetAsideDescription: opportunity.set_aside || "",
				typeOfSetAside: opportunity.set_aside || "",
				naicsCode: opportunity.naics_code?.naics_code || "",
				naicsCodes: [opportunity.naics_code?.naics_code || ""],
				classificationCode: opportunity.psc_code?.psc_code || "",
				active: "Yes",
				organizationType: "",
				resourceLinks: [],
				uiLink: opportunity.path || opportunity.source_path || "",
				officeZipcode: opportunity.pop_zip || "",
				officeCity: opportunity.pop_city || "",
				officeCountryCode: opportunity.pop_country || "USA",
				officeState: opportunity.pop_state || "",
				pocName: opportunity.primary_contact_email?.contact_name || "",
				pocEmail: opportunity.primary_contact_email?.contact_email || "",
				pocPhone: opportunity.primary_contact_email?.contact_phone || "",
				pocType: "PRIMARY",
				position: 0,
				priority: "MEDIUM",
				estimatedEffort: 0,
				actualEffort: 0,
				tags: [],
				notes: "",
				assigneeId: "",
				postedDate: opportunity.posted_date ? new Date(opportunity.posted_date).toISOString() : null,
				responseDeadLine: opportunity.due_date ? new Date(opportunity.due_date).toISOString() : null,
				dueDate: opportunity.due_date ? new Date(opportunity.due_date).toISOString() : null,
			};

			console.log("Saving opportunity with data:", opportunityData);
			const result = await saveOpportunity(opportunityData);

			if (!result) {
				throw new Error("Failed to save opportunity - no result returned");
			}

			console.log("Successfully saved opportunity:", result);
			setError(null);
		} catch (err) {
			console.error("Error saving opportunity:", err);
			setError(err.message || "Failed to save opportunity");
		} finally {
			setLoading(false);
		}
	};

	const handleReject = async (opportunity) => {
		// Add reject handler if needed
		console.log("Reject opportunity:", opportunity);
	};

	if (fetchError) {
		return (
			<Box sx={{ p: 3 }}>
				<Typography color='error'>Error loading opportunities: {fetchError.message}</Typography>
			</Box>
		);
	}

	return (
		<LocalizationProvider dateAdapter={AdapterDateFns}>
			<Box sx={{ p: 3 }}>
				{/* Filters */}
				<Paper sx={{ p: 2, mb: 2 }}>
					<Grid container spacing={2}>
						<Grid item xs={12} sm={3}>
							<TextField
								fullWidth
								label='NAICS Code'
								value={filters.naicsCode}
								onChange={handleFilterChange("naicsCode")}
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField
								fullWidth
								label='Agency'
								value={filters.agency}
								onChange={handleFilterChange("agency")}
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField
								fullWidth
								label='Set Aside'
								value={filters.setAside}
								onChange={handleFilterChange("setAside")}
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField fullWidth label='State' value={filters.state} onChange={handleFilterChange("state")} />
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField
								select
								fullWidth
								label='Source Type'
								value={filters.sourceType}
								onChange={handleFilterChange("sourceType")}
							>
								{["sam", "dibbs", "sbir", "grant", "sled"].map((type) => (
									<MenuItem key={type} value={type}>
										{type.toUpperCase()}
									</MenuItem>
								))}
							</TextField>
						</Grid>
						<Grid item xs={12} sm={3}>
							<TextField
								fullWidth
								label='Search ID'
								value={filters.searchId}
								onChange={handleFilterChange("searchId")}
							/>
						</Grid>
						<Grid item xs={12} sm={3}>
							<DatePicker
								label='Posted Date'
								value={filters.postedDate ? new Date(filters.postedDate) : null}
								onChange={(newValue) => {
									setFilters((prev) => ({
										...prev,
										postedDate: newValue ? newValue.toISOString().split("T")[0] : "",
									}));
								}}
								slotProps={{ textField: { fullWidth: true } }}
							/>
						</Grid>
						<Grid item xs={12}>
							<Stack direction='row' spacing={2} sx={{ mt: 2 }}>
								<Button variant='contained' color='primary' onClick={handleSubmit} disabled={isLoading}>
									{isLoading ? "Loading..." : "Search Opportunities"}
								</Button>
								<Button
									variant='outlined'
									startIcon={<Download size={20} />}
									onClick={handleExport}
									disabled={!data?.items?.length}
								>
									Export CSV
								</Button>
								<ToggleButtonGroup
									value={viewMode}
									exclusive
									onChange={(e, newValue) => newValue && setViewMode(newValue)}
									size='small'
								>
									<ToggleButton value='table'>
										<TableOfContents size={20} />
									</ToggleButton>
									<ToggleButton value='cards'>
										<TableIcon size={20} />
									</ToggleButton>
								</ToggleButtonGroup>
							</Stack>
						</Grid>
					</Grid>
				</Paper>

				{/* Results */}
				{viewMode === "table" ? (
					<TableContainer component={Paper}>
						<Table>
							<TableHead>
								<TableRow>
									<TableCell>Title</TableCell>
									<TableCell>Agency</TableCell>
									<TableCell>NAICS</TableCell>
									<TableCell>Set Aside</TableCell>
									<TableCell>Due Date</TableCell>
									<TableCell>Value Range</TableCell>
									<TableCell>Category</TableCell>
									<TableCell>Contact</TableCell>
									<TableCell>Location</TableCell>
								</TableRow>
							</TableHead>
							<TableBody>
								{isLoading ? (
									<TableRow>
										<TableCell colSpan={9} align='center'>
											<CircularProgress />
										</TableCell>
									</TableRow>
								) : !data?.items?.length ? (
									<TableRow>
										<TableCell colSpan={9} align='center'>
											<Typography color='textSecondary'>
												{data
													? "No results found"
													: "Use the search filters above and click Search to find opportunities"}
											</Typography>
										</TableCell>
									</TableRow>
								) : (
									data.items.map((opportunity) => (
										<TableRow key={opportunity.opp_key} hover>
											<TableCell>
												<a href={opportunity.path} target='_blank' rel='noopener noreferrer'>
													{opportunity.title}
													<Typography variant='caption' display='block' color='textSecondary'>
														{opportunity.description_text?.substring(0, 100)}...
													</Typography>
												</a>
											</TableCell>
											<TableCell>
												{opportunity.agency?.agency_name}
												<Typography variant='caption' display='block'>
													Type: {opportunity.agency?.agency_type}
												</Typography>
											</TableCell>
											<TableCell>{opportunity.naics_code?.naics_code}</TableCell>
											<TableCell>{opportunity.set_aside || "N/A"}</TableCell>
											<TableCell>
												{opportunity.due_date ? new Date(opportunity.due_date).toLocaleDateString() : "N/A"}
												<Typography variant='caption' display='block'>
													Posted: {new Date(opportunity.posted_date).toLocaleDateString()}
												</Typography>
											</TableCell>
											<TableCell>
												{opportunity.val_est_low
													? `$${opportunity.val_est_low} - $${opportunity.val_est_high}`
													: "N/A"}
											</TableCell>
											<TableCell>
												{opportunity.opp_cat}
												<Typography variant='caption' display='block'>
													Type: {opportunity.opp_type?.description}
												</Typography>
											</TableCell>
											<TableCell>
												{opportunity.primary_contact_email?.contact_name}
												<Typography variant='caption' display='block'>
													{opportunity.primary_contact_email?.contact_email}
												</Typography>
											</TableCell>
											<TableCell>
												{opportunity.pop_state && `${opportunity.pop_city || ""}, ${opportunity.pop_state}`}
												{opportunity.pop_zip && (
													<Typography variant='caption' display='block'>
														ZIP: {opportunity.pop_zip}
													</Typography>
												)}
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
						<TablePagination
							rowsPerPageOptions={[5, 10, 25]}
							component='div'
							count={data?.total || 0}
							rowsPerPage={rowsPerPage}
							page={page}
							onPageChange={handleChangePage}
							onRowsPerPageChange={handleChangeRowsPerPage}
						/>
					</TableContainer>
				) : (
					<Grid container spacing={3}>
						{isLoading ? (
							<Grid item xs={12} sx={{ textAlign: "center" }}>
								<CircularProgress />
							</Grid>
						) : !data?.items?.length ? (
							<Grid item xs={12} sx={{ textAlign: "center" }}>
								<Typography color='textSecondary'>
									{data
										? "No results found"
										: "Use the search filters above and click Search to find opportunities"}
								</Typography>
							</Grid>
						) : (
							data.items.map((opportunity) => (
								<Grid item xs={12} md={6} lg={4} key={opportunity.opp_key || opportunity.source_id}>
									<OpportunitySummaryCard
										opportunity={{
											title: opportunity.title,
											description: opportunity.description_text,
											opportunityType: opportunity.opp_type?.description,
											typeOfSetAsideDescription: opportunity.set_aside,
											naicsCode: opportunity.naics_code?.naics_code,
											agency: opportunity.agency?.agency_name,
											agencyType: opportunity.agency?.agency_type,
											postedDate: opportunity.posted_date,
											responseDeadLine: opportunity.due_date,
											officeCity: opportunity.pop_city,
											officeState: opportunity.pop_state,
											ValueEstLow: opportunity.val_est_low,
											ValueEstHigh: opportunity.val_est_high,
											sourceLink: opportunity.path || opportunity.source_path,
											ai_summary: opportunity.ai_summary,
										}}
										onSave={() => handleSave(opportunity)}
										onReject={() => handleReject(opportunity)}
									/>
								</Grid>
							))
						)}
					</Grid>
				)}
				{saveError && (
					<Box sx={{ p: 2 }}>
						<Typography color='error'>{saveError}</Typography>
					</Box>
				)}
			</Box>
		</LocalizationProvider>
	);
}

export default OpportunitiesScreen;

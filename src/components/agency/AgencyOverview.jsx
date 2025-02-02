import { useState } from "react";
import { Box, Paper, Typography, Grid, Link, Chip, Divider, IconButton, Collapse } from "@mui/material";
import { Globe, FileText, Building2, AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { formatBillions } from "../../utils/formatters";

export function AgencyOverview({ data }) {
	if (!data) return null;
	const [showDefCodes, setShowDefCodes] = useState(false);

	return (
		<Paper sx={{ p: 3, height: "100%" }}>
			<Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
				<Building2 size={24} />
				<Typography variant='h6'>Agency Overview</Typography>
			</Box>

			<Grid container spacing={3}>
				<Grid item xs={12}>
					<Typography variant='subtitle2' color='text.secondary'>
						Mission
					</Typography>
					<Typography variant='body2' sx={{ mt: 1 }}>
						{data.mission || "No mission statement available"}
					</Typography>
				</Grid>

				<Grid item xs={12}>
					<Divider sx={{ my: 2 }} />
				</Grid>

				<Grid item xs={12} sm={6}>
					<Box sx={{ mb: 2 }}>
						<Typography variant='subtitle2' color='text.secondary'>
							Quick Facts
						</Typography>
						<Box sx={{ mt: 1 }}>
							<Typography variant='body2'>
								<strong>Abbreviation:</strong> {data.abbreviation}
							</Typography>
							<Typography variant='body2'>
								<strong>Subtier Agencies:</strong> {data.subtier_agency_count}
							</Typography>
						</Box>
					</Box>
				</Grid>

				<Grid item xs={12} sm={6}>
					<Box sx={{ mb: 2 }}>
						<Typography variant='subtitle2' color='text.secondary'>
							Links
						</Typography>
						<Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 1 }}>
							{data.website && (
								<Link
									href={data.website}
									target='_blank'
									rel='noopener noreferrer'
									sx={{ display: "flex", alignItems: "center", gap: 1 }}
								>
									<Globe size={16} />
									Agency Website
								</Link>
							)}
							{data.congressional_justification_url && (
								<Link
									href={data.congressional_justification_url}
									target='_blank'
									rel='noopener noreferrer'
									sx={{ display: "flex", alignItems: "center", gap: 1 }}
								>
									<FileText size={16} />
									Congressional Justification
								</Link>
							)}
						</Box>
					</Box>
				</Grid>

				{data.def_codes?.length > 0 && (
					<>
						<Grid item xs={12}>
							<Divider sx={{ my: 2 }} />
						</Grid>
						<Grid item xs={12}>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
								<Typography variant='subtitle2' color='text.secondary'>
									Disaster Emergency Fund Codes
								</Typography>
								<IconButton size='small' onClick={() => setShowDefCodes(!showDefCodes)}>
									{showDefCodes ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
								</IconButton>
							</Box>
							<Collapse in={showDefCodes}>
								<Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 2 }}>
									{data.def_codes.map((code) => (
										<Chip
											key={code.code}
											label={`${code.code} - ${code.title.split("|")[0]}`}
											size='small'
											icon={<AlertCircle size={14} />}
											variant='outlined'
											sx={{ maxWidth: 400 }}
										/>
									))}
								</Box>
							</Collapse>
						</Grid>
					</>
				)}
			</Grid>
		</Paper>
	);
}

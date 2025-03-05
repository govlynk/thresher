import React, { useState, useEffect, useCallback } from "react";
import {
	Card,
	CardContent,
	CardActions,
	Typography,
	Button,
	Chip,
	Box,
	Tooltip,
	IconButton,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Collapse,
	Divider,
	useTheme,
} from "@mui/material";
import {
	ThumbsUp,
	ThumbsDown,
	Calendar,
	Building2,
	MapPin,
	ExternalLink,
	DollarSign,
	Eye,
	Users,
	ChevronDown,
	ChevronUp,
} from "lucide-react";
import { useOpportunityStore } from "../../stores/opportunityStore";
import { OpportunityDetailsSidebar } from "./OpportunityDetailsSidebar";
import { formatDate, formatCurrency } from "../../utils/formatters";
import { useGlobalStore } from "../../stores/globalStore";
import { useTeamStore } from "../../stores/teamStore";
import { differenceInDays } from "date-fns";
import { getNoticeDescription } from "../../utils/sam/samApi";

export function OpportunityCard({ opportunity, type = "new" }) {
	const theme = useTheme();
	const { saveOpportunity, rejectOpportunity, moveToSaved, loading, error } = useOpportunityStore();
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [localLoading, setLocalLoading] = useState(false);
	const [localError, setLocalError] = useState(null);
	const [noticeDescription, setNoticeDescription] = useState(null);
	const [expanded, setExpanded] = useState(false);
	const { activeCompanyId, activeTeamId } = useGlobalStore();
	const { teams } = useTeamStore();
	const [selectedTeamId, setSelectedTeamId] = useState(activeTeamId);

	useEffect(() => {
		if (opportunity?.description) {
			getNoticeDescription(opportunity.description)
				.then((desc) => setNoticeDescription(desc))
				.catch((err) => console.error("Error fetching notice description:", err));
		}
	}, [opportunity?.description]);

	const getDeadlineColor = (deadline) => {
		if (!deadline) return "text.primary";
		const daysRemaining = differenceInDays(new Date(deadline), new Date());
		if (daysRemaining < 30) return "error.main";
		if (daysRemaining < 45) return "warning.main";
		return "success.main";
	};

	const handleSave = async () => {
		setLocalLoading(true);
		setLocalError(null);
		console.log("Handling save for opportunity:", opportunity);
		try {
			if (type === "rejected") {
				await moveToSaved(opportunity);
			} else {
				const result = await saveOpportunity({
					...opportunity,
					description: noticeDescription || opportunity.description || "No description available",
					teamId: selectedTeamId,
					noticeId: opportunity.noticeId || opportunity.id,
					sourceLink: opportunity.sourceLink || opportunity.uiLink,
				});
				console.log("Save result:", result);
			}
			setDetailsOpen(false);
		} catch (err) {
			console.error("Error saving opportunity:", err);
			setLocalError(err.message || "Failed to save opportunity");
		} finally {
			setLocalLoading(false);
		}
	};

	const handleReject = async () => {
		setLocalLoading(true);
		setLocalError(null);
		console.log("Handling reject for opportunity:", opportunity);
		try {
			const result = await rejectOpportunity({
				...opportunity,
				description: noticeDescription || "No description available",
			});
			console.log("Reject result:", result);
			setDetailsOpen(false);
		} catch (err) {
			console.error("Error rejecting opportunity:", err);
			setLocalError(err.message || "Failed to reject opportunity");
		} finally {
			setLocalLoading(false);
		}
	};

	console.log("OpportunityCard render", opportunity);

	return (
		<>
			<Card
				sx={{
					height: "100%",
					display: "flex",
					flexDirection: "column",
					borderRadius: 2,
					transition: "transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out",
					"&:hover": {
						transform: "translateY(-4px)",
						boxShadow: (theme) => theme.shadows[8],
					},
					bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.900" : "background.paper"),
				}}
			>
				<CardContent
					sx={{
						flexGrow: 1,
						p: 3,
					}}
				>
					{/* Line 1: Title */}
					<Typography variant='h6' gutterBottom>
						{opportunity.title}
					</Typography>

					{/* Line 2: Tags */}
					<Box sx={{ display: "flex", gap: 1, mb: 2 }}>
						<Chip size='small' label={opportunity.type} color='primary' variant='outlined' />
						{opportunity.typeOfSetAside && (
							<Chip
								size='small'
								label={opportunity.typeOfSetAside}
								color='secondary'
								variant='outlined'
								sx={{ ml: 1 }}
							/>
						)}
						{opportunity.naicsCode && (
							<Chip
								size='small'
								label={`NAICS: ${opportunity.naicsCode}`}
								color='info'
								variant='outlined'
								sx={{ ml: 1 }}
							/>
						)}
					</Box>

					{/* Description with expand/collapse */}
					<Box sx={{ mb: 3, position: "relative" }}>
						<Typography
							component='div'
							theme={theme}
							sx={{
								marginBottom: expanded ? 3 : 1,
								maxHeight: expanded ? "none" : "6em",
								overflow: "hidden",
								position: "relative",
								cursor: "pointer",
								lineHeight: 1.6,
								fontSize: "0.875rem",
								"&::after": !expanded
									? {
											content: '""',
											position: "absolute",
											bottom: 0,
											left: 0,
											right: 0,
											height: "2em",
									  }
									: {},
							}}
							onClick={() => setExpanded(!expanded)}
						>
							<div dangerouslySetInnerHTML={{ __html: noticeDescription || "No description available" }} />
						</Typography>
						<Button
							onClick={() => setExpanded(!expanded)}
							sx={{
								color: "text.secondary",
								fontSize: "0.75rem",
								p: 0,
								minWidth: "auto",
								"&:hover": { background: "none" },
							}}
						>
							{expanded ? "Show less" : "Show more"}
							<ChevronDown
								size={16}
								style={{
									marginLeft: 4,
									transform: expanded ? "rotate(180deg)" : "none",
									transition: "transform 0.2s ease-in-out",
								}}
							/>
						</Button>
					</Box>

					{/* Agency and Dates Section */}
					{/* Agency Information */}
					<Box sx={{ mb: 2 }}>
						<Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
							<Building2 size={16} style={{ marginTop: 4 }} />
							<Box sx={{ display: "flex", flexDirection: "column" }}>
								<Typography variant='body2' sx={{ fontWeight: 500 }}>
									{opportunity.department}
								</Typography>
								{opportunity.agency && (
									<Typography variant='caption' color='text.secondary'>
										{opportunity.agency}
									</Typography>
								)}
								{opportunity.office && (
									<Typography variant='caption' color='text.secondary'>
										{opportunity.office}
										{opportunity.subOffice && ` - ${opportunity.subOffice}`}
									</Typography>
								)}
							</Box>
						</Box>
					</Box>

					{/* Dates */}
					<Box sx={{ mb: 2 }}>
						<Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
							<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
								<Calendar size={16} />
								<Typography variant='body2'>Posted: {formatDate(opportunity.postedDate)}</Typography>
							</Box>
							{opportunity.responseDeadLine && (
								<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
									<Calendar size={16} />
									<Typography variant='body2' color={getDeadlineColor(opportunity.responseDeadLine)}>
										Due: {formatDate(opportunity.responseDeadLine)}
									</Typography>
								</Box>
							)}
						</Box>
					</Box>

					{/* Location */}
					<Box sx={{ display: "flex", gap: 3 }}>
						{opportunity.placeOfPerformance && (
							<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
								<MapPin size={16} />
								<Typography variant='body2'>
									{`${opportunity.placeOfPerformance.state?.name || ""}, 
									${opportunity.placeOfPerformance.country?.name || ""}`}
								</Typography>
							</Box>
						)}

						{opportunity.award?.amount && (
							<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
								<DollarSign size={16} />
								<Typography variant='body2'>
									Award Amount: {formatCurrency(opportunity.award.amount)}
								</Typography>
							</Box>
						)}
					</Box>

					<Divider />

					{type === "new" && (
						<FormControl
							fullWidth
							size='small'
							sx={{
								mt: 3,
								"& .MuiSelect-select": {
									fontSize: "0.875rem",
								},
								"& .MuiInputLabel-root": {
									fontSize: "0.875rem",
								},
								"& .MuiMenuItem-root": {
									fontSize: "0.875rem",
								},
							}}
						>
							<InputLabel>Assign Team</InputLabel>
							<Select
								value={selectedTeamId}
								onChange={(e) => setSelectedTeamId(e.target.value)}
								label='Assign Team'
							>
								{teams.map((team) => (
									<MenuItem key={team.id} value={team.id}>
										<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
											<Users size={16} />
											{team.name}
										</Box>
									</MenuItem>
								))}
							</Select>
						</FormControl>
					)}

					{localError && (
						<Typography color='error' variant='body2' sx={{ mt: 1 }}>
							{localError}
						</Typography>
					)}
				</CardContent>

				<CardActions
					sx={{
						justifyContent: "space-between",
						p: 2,
						borderTop: 1,
						borderColor: "divider",
					}}
				>
					<Box>
						<Tooltip title={type === "saved" ? "Already Saved" : "Save Opportunity"}>
							<span>
								<IconButton
									onClick={handleSave}
									color='primary'
									size='small'
									disabled={localLoading || loading || type === "saved"}
									sx={{
										"&:hover": {
											bgcolor: "primary.light",
											"& svg": { color: "common.white" },
										},
									}}
								>
									<ThumbsUp size={20} />
								</IconButton>
							</span>
						</Tooltip>
						<Tooltip title={type === "rejected" ? "Already Rejected" : "Reject Opportunity"}>
							<span>
								<IconButton
									size='small'
									onClick={handleReject}
									color='error'
									disabled={localLoading || loading || type === "rejected"}
									sx={{
										"&:hover": {
											bgcolor: "error.light",
											"& svg": { color: "common.white" },
										},
									}}
								>
									<ThumbsDown size={20} />
								</IconButton>
							</span>
						</Tooltip>
						<Tooltip title='View Details'>
							<IconButton
								onClick={() => setDetailsOpen(true)}
								color='info'
								size='small'
								sx={{
									"&:hover": {
										bgcolor: "info.light",
										"& svg": { color: "common.white" },
									},
								}}
							>
								<Eye size={20} />
							</IconButton>
						</Tooltip>
					</Box>

					<Button
						endIcon={<ExternalLink size={16} />}
						href={opportunity.uiLink}
						target='_blank'
						rel='noopener noreferrer'
						size='small'
						sx={{
							textTransform: "none",
							"&:hover": {
								bgcolor: (theme) => (theme.palette.mode === "dark" ? "grey.800" : "grey.100"),
							},
							borderRadius: 1.5,
						}}
					>
						View on SAM.gov
					</Button>
				</CardActions>
			</Card>

			<OpportunityDetailsSidebar
				open={detailsOpen}
				onClose={() => setDetailsOpen(false)}
				opportunity={opportunity}
			/>
		</>
	);
}

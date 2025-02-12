import React, { useState } from "react";
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
	ChevronDown,
	ChevronUp,
} from "lucide-react";

import { formatDate, formatCurrency } from "../../../utils/formatters";
import { differenceInDays } from "date-fns";

export function OpportunitySummaryCard({ opportunity, onSave, onReject, type = "new" }) {
	const theme = useTheme();
	const [expanded, setExpanded] = useState(false);
	const [detailsOpen, setDetailsOpen] = useState(false);

	const getDeadlineColor = (deadline) => {
		if (!deadline) return "text.primary";
		const daysRemaining = differenceInDays(new Date(deadline), new Date());
		if (daysRemaining < 30) return "error.main";
		if (daysRemaining < 45) return "warning.main";
		return "success.main";
	};

	return (
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
			<CardContent sx={{ flexGrow: 1, p: 3 }}>
				{/* Title */}
				<Typography variant='h6' gutterBottom>
					{opportunity.title}
				</Typography>

				{/* Tags */}
				<Box sx={{ display: "flex", gap: 1, mb: 2 }}>
					<Chip size='small' label={opportunity.opportunityType} color='primary' variant='outlined' />
					{opportunity.typeOfSetAsideDescription && (
						<Chip
							size='small'
							label={opportunity.typeOfSetAsideDescription}
							color='secondary'
							variant='outlined'
						/>
					)}
					{opportunity.naicsCode && (
						<Chip size='small' label={`NAICS: ${opportunity.naicsCode}`} color='info' variant='outlined' />
					)}
				</Box>

				{/* Description and AI Summary */}
				<Box sx={{ mb: 3, position: "relative" }}>
					<Typography
						component='div'
						sx={{
							marginBottom: expanded ? 3 : 1,
							maxHeight: expanded ? "none" : "6em",
							overflow: "hidden",
							position: "relative",
							cursor: "pointer",
							lineHeight: 1.6,
							fontSize: "0.875rem",
						}}
						onClick={() => setExpanded(!expanded)}
					>
						{opportunity.description && (
							<>
								<Typography variant='subtitle2' gutterBottom>
									Description:
								</Typography>
								<div style={{ marginBottom: "1rem" }}>{opportunity.description}</div>
							</>
						)}
						{!opportunity.description && "No description available"}
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
						{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
					</Button>
				</Box>
				{/*  AI Summary */}
				<Box sx={{ mb: 3, position: "relative" }}>
					<Typography
						component='div'
						sx={{
							marginBottom: expanded ? 3 : 1,
							maxHeight: expanded ? "none" : "6em",
							overflow: "hidden",
							position: "relative",
							cursor: "pointer",
							lineHeight: 1.6,
							fontSize: "0.875rem",
						}}
						onClick={() => setExpanded(!expanded)}
					>
						{opportunity.ai_summary && (
							<>
								<Typography variant='subtitle2' gutterBottom>
									AI Summary:
								</Typography>
								<div>{opportunity.ai_summary}</div>
							</>
						)}
						{!opportunity.ai_summary && "No AI summary available"}
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
						{expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
					</Button>
				</Box>

				{/* Agency Info */}
				<Box sx={{ mb: 2 }}>
					<Box sx={{ display: "flex", alignItems: "flex-start", gap: 1 }}>
						<Building2 size={16} style={{ marginTop: 4 }} />
						<Box>
							<Typography variant='body2' sx={{ fontWeight: 500 }}>
								{typeof opportunity.agency === "string"
									? opportunity.agency
									: opportunity.agency?.agency_name || "N/A"}
							</Typography>
							<Typography variant='caption' color='text.secondary'>
								{typeof opportunity.agencyType === "string"
									? opportunity.agencyType
									: opportunity.agency?.agency_type || "N/A"}
							</Typography>
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

				{/* Location and Value */}
				<Box sx={{ display: "flex", gap: 3 }}>
					{opportunity.officeState && (
						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<MapPin size={16} />
							<Typography variant='body2'>
								{`${opportunity.officeCity || ""}, ${opportunity.officeState}`}
							</Typography>
						</Box>
					)}

					{(opportunity.ValueEstLow || opportunity.ValueEstHigh) && (
						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<DollarSign size={16} />
							<Typography variant='body2'>
								{opportunity.ValueEstLow && opportunity.ValueEstHigh
									? `${formatCurrency(opportunity.ValueEstLow)} - ${formatCurrency(opportunity.ValueEstHigh)}`
									: formatCurrency(opportunity.ValueEstLow || opportunity.ValueEstHigh)}
							</Typography>
						</Box>
					)}
				</Box>
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
							<IconButton onClick={onSave} color='primary' size='small' disabled={type === "saved"}>
								<ThumbsUp size={20} />
							</IconButton>
						</span>
					</Tooltip>
					<Tooltip title={type === "rejected" ? "Already Rejected" : "Reject Opportunity"}>
						<span>
							<IconButton size='small' onClick={onReject} color='error' disabled={type === "rejected"}>
								<ThumbsDown size={20} />
							</IconButton>
						</span>
					</Tooltip>
					<Tooltip title='View Details'>
						<IconButton onClick={() => setDetailsOpen(true)} color='info' size='small'>
							<Eye size={20} />
						</IconButton>
					</Tooltip>
				</Box>

				<Button
					endIcon={<ExternalLink size={16} />}
					href={opportunity.sourceLink}
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
					View Source
				</Button>
			</CardActions>
		</Card>
	);
}

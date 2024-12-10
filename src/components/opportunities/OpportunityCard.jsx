import React, { useState } from "react";
import { Card, CardContent, CardActions, Typography, Button, Chip, Box, Tooltip, IconButton } from "@mui/material";
import {
	ThumbsUp,
	ThumbsDown,
	Calendar,
	Building2,
	MapPin,
	ExternalLink,
	DollarSign,
	Eye,
	Building,
} from "lucide-react";
import { useOpportunityStore } from "../../stores/opportunityStore";
import { OpportunityDetailsSidebar } from "./OpportunityDetailsSidebar";
import { formatDate, formatCurrency } from "../../utils/formatters";
import { useGlobalStore } from "../../stores/globalStore";

export function OpportunityCard({ opportunity, type = "new" }) {
	const { saveOpportunity, rejectOpportunity, moveToSaved, loading, error } = useOpportunityStore();
	const [detailsOpen, setDetailsOpen] = useState(false);
	const [localLoading, setLocalLoading] = useState(false);
	const [localError, setLocalError] = useState(null);
	const { activeCompanyId, activeTeamId, activeUserId } = useGlobalStore();

	const handleSave = async () => {
		setLocalLoading(true);
		setLocalError(null);
		try {
			if (type === "rejected") {
				await moveToSaved(opportunity);
			} else {
				await saveOpportunity({
					opportunityId: opportunity.noticeId,
					title: opportunity.title,
					description: opportunity.description || "",
					agency: opportunity.department,
					dueDate: opportunity.responseDeadLine,
					status: "BACKLOG",
					notes: "",
					solicitationNumber: opportunity.solicitationNumber || "",
					fullParentPathName: opportunity.fullParentPathName || "",
					fullParentPathCode: opportunity.fullParentPathCode || "",
					postedDate: opportunity.postedDate,
					type: opportunity.type || "",
					typeOfSetAsideDescription: opportunity.typeOfSetAsideDescription || "",
					typeOfSetAside: opportunity.typeOfSetAside || "",
					responseDeadLine: opportunity.responseDeadLine,
					naicsCode: opportunity.naicsCode || "",
					naicsCodes: opportunity.naicsCodes,
					classificationCode: opportunity.classificationCode || "",
					active: opportunity.active || "Yes",
					organizationType: opportunity.organizationType || "",
					resourceLinks: opportunity.resourceLinks,
					uiLink: opportunity.uiLink,
					// Office Address as embedded fields
					officeZipcode: opportunity.officeAddress.officeZipcode || "",
					officeCity: opportunity.officeAddress.officeCity || "",
					officeCountryCode: opportunity.officeAddress.officeCountryCode || "",
					officeState: opportunity.officeAddress.officeState || "",
					// Point of Contact as embedded fields
					pocName: opportunity.pointOfContact.pocName || "",
					pocEmail: opportunity.pointOfContact.pocEmail || "",
					pocPhone: opportunity.pointOfContact.pocPhone || "",
					pocType: opportunity.pointOfContact.pocType || "",
					// Foreign key relationships
					userId: activeUserId,
					companyId: activeCompanyId,
					teamId: activeTeamId,
				});
			}
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
		try {
			await rejectOpportunity(opportunity);
		} catch (err) {
			console.error("Error rejecting opportunity:", err);
			setLocalError(err.message || "Failed to reject opportunity");
		} finally {
			setLocalLoading(false);
		}
	};

	return (
		<>
			<Card sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
				<CardContent sx={{ flexGrow: 1 }}>
					<Typography variant='h6' gutterBottom>
						{opportunity.title}
					</Typography>

					<Box sx={{ mb: 2 }}>
						<Chip size='small' label={opportunity.type} color='primary' sx={{ mr: 1 }} />
						{opportunity.typeOfSetAside && (
							<Chip size='small' label={opportunity.typeOfSetAside} color='secondary' />
						)}
					</Box>

					<Box sx={{ display: "flex", flexDirection: "column", gap: 1, mb: 2 }}>
						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<Building2 size={16} />
							<Typography variant='body2'>{opportunity.department}</Typography>
						</Box>

						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<Building size={16} />
							<Typography variant='body2'>{opportunity.subtier}</Typography>
						</Box>

						<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
							<Calendar size={16} />
							<Typography variant='body2'>Posted: {formatDate(opportunity.postedDate)}</Typography>
						</Box>

						{opportunity.responseDeadLine && (
							<Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
								<Calendar size={16} />
								<Typography variant='body2' color='error'>
									Due: {formatDate(opportunity.responseDeadLine)}
								</Typography>
							</Box>
						)}

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

					{localError && (
						<Typography color='error' variant='body2' sx={{ mt: 1 }}>
							{localError}
						</Typography>
					)}
				</CardContent>

				<CardActions sx={{ justifyContent: "space-between", p: 2 }}>
					<Box>
						<Tooltip title={type === "saved" ? "Already Saved" : "Save Opportunity"}>
							<span>
								<IconButton
									onClick={handleSave}
									color='primary'
									disabled={localLoading || loading || type === "saved"}
								>
									<ThumbsUp size={20} />
								</IconButton>
							</span>
						</Tooltip>
						<Tooltip title={type === "rejected" ? "Already Rejected" : "Reject Opportunity"}>
							<span>
								<IconButton
									onClick={handleReject}
									color='error'
									disabled={localLoading || loading || type === "rejected"}
								>
									<ThumbsDown size={20} />
								</IconButton>
							</span>
						</Tooltip>
						<Tooltip title='View Details'>
							<IconButton onClick={() => setDetailsOpen(true)} color='info'>
								<Eye size={20} />
							</IconButton>
						</Tooltip>
					</Box>

					<Button
						endIcon={<ExternalLink size={16} />}
						href={opportunity.uiLink}
						target='_blank'
						rel='noopener noreferrer'
					>
						View Details
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

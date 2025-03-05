import React, { useState, useEffect } from "react";
import {
	Container,
	Box,
	Typography,
	Alert,
	CircularProgress,
	Paper,
	Table,
	TableBody,
	TableCell,
	TableContainer,
	TableHead,
	TableRow,
	Button,
	Chip,
	Grid,
	Card,
	CardContent,
	CardActions,
	IconButton,
	Stack,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
	List,
	ListItem,
	ListItemText,
	Rating,
} from "@mui/material";
import { useQualificationStore } from "../stores/qualificationStore";
import { useGlobalStore } from "../stores/globalStore";
import { QualificationForm } from "../components/qualification/QualificationForm";
import { useOpportunityStore } from "../stores/opportunityStore";
import { formatCurrency, formatDate } from "../utils/formatters";
import { ThumbsUp, ThumbsDown, ArrowRight, BarChart2, X as XIcon, PlusCircle } from "lucide-react";
import { generateClient } from "aws-amplify/api";
import { useQuery } from "@tanstack/react-query";

const client = generateClient();

function QualificationScreen() {
	const { activeCompanyId } = useGlobalStore();
	const { qualification, loading, error, fetchQualification } = useQualificationStore();
	const { savedOpportunities, fetchSavedOpportunities, moveOpportunity } = useOpportunityStore();
	const [selectedOpportunities, setSelectedOpportunities] = useState([]);
	const [showQualification, setShowQualification] = useState(false);
	const [isSelectingOpportunity, setIsSelectingOpportunity] = useState(false);
	const [assessments, setAssessments] = useState({});

	useEffect(() => {
		if (activeCompanyId) {
			fetchQualification(activeCompanyId);
			fetchSavedOpportunities();
		}
	}, [activeCompanyId, fetchQualification, fetchSavedOpportunities]);

	const backlogOpportunities = savedOpportunities.filter((opp) => opp.status === "BACKLOG");

	const handleOpportunityToggle = (opportunity) => {
		setSelectedOpportunities((prev) => {
			if (prev.find((o) => o.id === opportunity.id)) {
				return prev.filter((o) => o.id !== opportunity.id);
			}
			return [...prev, opportunity];
		});
	};

	const handleReject = async (opportunity) => {
		try {
			await moveOpportunity(opportunity.id, "REJECTED");
			setSelectedOpportunities((prev) => prev.filter((o) => o.id !== opportunity.id));
		} catch (err) {
			console.error("Error rejecting opportunity:", err);
		}
	};

	const handleProceed = async (opportunity) => {
		try {
			await moveOpportunity(opportunity.id, "BID");
			setSelectedOpportunities((prev) => prev.filter((o) => o.id !== opportunity.id));
			setShowQualification(true);
		} catch (err) {
			console.error("Error moving opportunity to bid:", err);
		}
	};

	// Query for fetching qualification results
	const { data: qualificationResults, isLoading: isLoadingQualifications } = useQuery({
		queryKey: ["qualifications", selectedOpportunities],
		queryFn: async () => {
			const results = {};
			for (const oppId of selectedOpportunities) {
				try {
					const response = await client.models.Qualification.get({
						opportunityId: oppId,
						companyId: activeCompanyId,
					});
					if (response?.data) {
						results[oppId] = response.data;
					}
				} catch (err) {
					console.error(`Error fetching qualification for opportunity ${oppId}:`, err);
				}
			}
			return results;
		},
		enabled: selectedOpportunities.length > 0,
	});

	const handleSelectOpportunity = (opportunity) => {
		if (selectedOpportunities.length < 3) {
			setSelectedOpportunities([...selectedOpportunities, opportunity.id]);
		}
		setIsSelectingOpportunity(false);
	};

	const handleRemoveOpportunity = (opportunityId) => {
		setSelectedOpportunities(selectedOpportunities.filter((id) => id !== opportunityId));
	};

	const calculateOverallScore = (scores) => {
		const weights = {
			technical: 0.3,
			pastPerformance: 0.2,
			competition: 0.2,
			pricing: 0.2,
			risk: 0.1,
		};

		return (
			scores.technicalScore * weights.technical +
			scores.pastPerformanceScore * weights.pastPerformance +
			scores.competitionScore * weights.competition +
			scores.pricingScore * weights.pricing +
			(100 - scores.riskScore) * weights.risk
		);
	};

	const runQualification = async (opportunityId) => {
		setLoading((prev) => ({ ...prev, [opportunityId]: true }));
		try {
			const opportunity = savedOpportunities.find((opp) => opp.id === opportunityId);
			if (!opportunity) throw new Error("Opportunity not found");

			// Calculate scores based on opportunity data
			const technicalScore = Math.min(
				(opportunity.naicsCodes?.length || 0) * 20 +
					(opportunity.typeOfSetAside ? 20 : 0) +
					(opportunity.description ? 20 : 0),
				100
			);

			const pastPerformanceScore = 75; // This should be calculated based on past performance data

			const competitionScore = opportunity.typeOfSetAside ? 60 : 80;

			const pricingScore =
				opportunity.ValueEstHigh && opportunity.ValueEstLow
					? 80
					: opportunity.ValueEstHigh || opportunity.ValueEstLow
					? 60
					: 40;

			const riskScore = Math.min(
				(opportunity.responseDeadLine ? 0 : 20) +
					(opportunity.pocEmail ? 0 : 20) +
					(opportunity.description ? 0 : 20) +
					(opportunity.agency ? 0 : 20) +
					(opportunity.naicsCodes?.length ? 0 : 20),
				100
			);

			const qualificationData = {
				opportunityId,
				companyId: activeCompanyId,
				status: "COMPLETED",
				technicalScore,
				pastPerformanceScore,
				competitionScore,
				pricingScore,
				riskScore,
				overallScore: calculateOverallScore({
					technicalScore,
					pastPerformanceScore,
					competitionScore,
					pricingScore,
					riskScore,
				}),
				assessmentDate: new Date().toISOString(),
				notes: "",
			};

			const qualificationResponse = await client.models.Qualification.create(qualificationData);

			if (!qualificationResponse?.data) {
				throw new Error("Failed to create qualification");
			}

			setError(null);
		} catch (err) {
			console.error("Error running qualification:", err);
			setError(err.message);
		} finally {
			setLoading((prev) => ({ ...prev, [opportunityId]: false }));
		}
	};

	const renderQualificationCard = (opportunityId) => {
		const opportunity = savedOpportunities.find((opp) => opp.id === opportunityId);
		const qualification = qualificationResults?.[opportunityId];

		if (!opportunity) return null;

		return (
			<Card sx={{ height: "100%" }}>
				<CardContent>
					<Stack direction='row' justifyContent='space-between' alignItems='center' mb={2}>
						<Typography variant='h6' noWrap sx={{ maxWidth: "80%" }}>
							{opportunity.title}
						</Typography>
						<IconButton size='small' onClick={() => handleRemoveOpportunity(opportunityId)}>
							<XIcon size={20} />
						</IconButton>
					</Stack>

					{qualification ? (
						<Box>
							<Typography variant='subtitle1' gutterBottom>
								Overall Score: {qualification.overallScore.toFixed(1)}
							</Typography>
							<List dense>
								<ListItem>
									<ListItemText
										primary='Technical Fit'
										secondary={
											<>
												<Rating value={qualification.technicalScore / 20} readOnly />
												<Typography variant='caption' sx={{ ml: 1 }}>
													{qualification.technicalScore.toFixed(1)}%
												</Typography>
											</>
										}
									/>
								</ListItem>
								<ListItem>
									<ListItemText
										primary='Past Performance'
										secondary={
											<>
												<Rating value={qualification.pastPerformanceScore / 20} readOnly />
												<Typography variant='caption' sx={{ ml: 1 }}>
													{qualification.pastPerformanceScore.toFixed(1)}%
												</Typography>
											</>
										}
									/>
								</ListItem>
								<ListItem>
									<ListItemText
										primary='Competition'
										secondary={
											<>
												<Rating value={qualification.competitionScore / 20} readOnly />
												<Typography variant='caption' sx={{ ml: 1 }}>
													{qualification.competitionScore.toFixed(1)}%
												</Typography>
											</>
										}
									/>
								</ListItem>
								<ListItem>
									<ListItemText
										primary='Pricing'
										secondary={
											<>
												<Rating value={qualification.pricingScore / 20} readOnly />
												<Typography variant='caption' sx={{ ml: 1 }}>
													{qualification.pricingScore.toFixed(1)}%
												</Typography>
											</>
										}
									/>
								</ListItem>
								<ListItem>
									<ListItemText
										primary='Risk Level'
										secondary={
											<>
												<Rating value={5 - qualification.riskScore / 20} readOnly />
												<Typography variant='caption' sx={{ ml: 1 }}>
													{qualification.riskScore.toFixed(1)}%
												</Typography>
											</>
										}
									/>
								</ListItem>
							</List>
						</Box>
					) : (
						<Box sx={{ textAlign: "center", py: 2 }}>
							<Button
								variant='contained'
								onClick={() => runQualification(opportunityId)}
								disabled={loading[opportunityId]}
							>
								{loading[opportunityId] ? <CircularProgress size={24} /> : "Run Qualification"}
							</Button>
						</Box>
					)}
				</CardContent>
			</Card>
		);
	};

	if (!activeCompanyId) {
		return (
			<Container>
				<Box sx={{ p: 3 }}>
					<Alert severity='warning'>Please select a company to view qualifications</Alert>
				</Box>
			</Container>
		);
	}

	if (loading) {
		return (
			<Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
				<CircularProgress />
			</Box>
		);
	}

	if (error) {
		return <Alert severity='error'>{error}</Alert>;
	}

	if (showQualification) {
		return (
			<Container maxWidth={false} disableGutters>
				<Box sx={{ p: 2, width: "100%" }}>
					<Typography variant='h4' gutterBottom>
						Qualification Assessment
					</Typography>
					<QualificationForm />
				</Box>
			</Container>
		);
	}

	return (
		<Container maxWidth={false} disableGutters>
			<Box sx={{ p: 2, width: "100%" }}>
				<Typography variant='h4' gutterBottom>
					Opportunity Qualification
				</Typography>

				{backlogOpportunities.length === 0 ? (
					<Alert severity='info'>No opportunities in backlog to qualify</Alert>
				) : (
					<>
						<Grid container spacing={3}>
							{backlogOpportunities.map((opportunity) => (
								<Grid item xs={12} md={6} key={opportunity.id}>
									<Card
										variant='outlined'
										sx={{
											height: "100%",
											bgcolor: selectedOpportunities.find((o) => o.id === opportunity.id)
												? "action.selected"
												: "background.paper",
										}}
									>
										<CardContent>
											<Typography variant='h6' gutterBottom>
												{opportunity.title}
											</Typography>

											<Box sx={{ mb: 2 }}>
												<Chip label={opportunity.agency} size='small' sx={{ mr: 1, mb: 1 }} />
												{opportunity.naicsCode && (
													<Chip
														label={`NAICS: ${opportunity.naicsCode}`}
														size='small'
														sx={{ mr: 1, mb: 1 }}
													/>
												)}
											</Box>

											<Typography variant='body2' color='text.secondary' paragraph>
												{opportunity.description?.substring(0, 200)}...
											</Typography>

											<Box
												sx={{
													display: "flex",
													justifyContent: "space-between",
													alignItems: "center",
													mt: 2,
												}}
											>
												<Typography variant='subtitle2'>
													Due: {formatDate(opportunity.responseDeadLine)}
												</Typography>
												<Typography variant='subtitle2'>
													Value: {formatCurrency(opportunity.ValueEstHigh || opportunity.ValueEstLow)}
												</Typography>
											</Box>
										</CardContent>

										<CardActions sx={{ justifyContent: "flex-end", p: 2 }}>
											<Button
												startIcon={<ThumbsDown />}
												color='error'
												onClick={() => handleReject(opportunity)}
											>
												Reject
											</Button>
											<Button
												startIcon={<ThumbsUp />}
												color='success'
												onClick={() => handleProceed(opportunity)}
											>
												Proceed
											</Button>
											<Button
												startIcon={<ArrowRight />}
												variant='contained'
												onClick={() => handleOpportunityToggle(opportunity)}
											>
												Compare
											</Button>
										</CardActions>
									</Card>
								</Grid>
							))}
						</Grid>

						{selectedOpportunities.length > 0 && (
							<Paper sx={{ mt: 4, p: 3 }}>
								<Typography variant='h6' gutterBottom>
									Comparison ({selectedOpportunities.length} selected)
								</Typography>
								<TableContainer>
									<Table>
										<TableHead>
											<TableRow>
												<TableCell>Title</TableCell>
												<TableCell>Agency</TableCell>
												<TableCell>Due Date</TableCell>
												<TableCell>Value</TableCell>
												<TableCell>NAICS Code</TableCell>
												<TableCell>Set-Aside</TableCell>
												<TableCell align='right'>Actions</TableCell>
											</TableRow>
										</TableHead>
										<TableBody>
											{selectedOpportunities.map((opportunity) => (
												<TableRow key={opportunity.id}>
													<TableCell>{opportunity.title}</TableCell>
													<TableCell>{opportunity.agency}</TableCell>
													<TableCell>{formatDate(opportunity.responseDeadLine)}</TableCell>
													<TableCell>
														{formatCurrency(opportunity.ValueEstHigh || opportunity.ValueEstLow)}
													</TableCell>
													<TableCell>{opportunity.naicsCode}</TableCell>
													<TableCell>{opportunity.typeOfSetAside}</TableCell>
													<TableCell align='right'>
														<Button
															color='error'
															size='small'
															onClick={() => handleReject(opportunity)}
															startIcon={<ThumbsDown />}
														>
															Reject
														</Button>
														<Button
															color='success'
															size='small'
															onClick={() => handleProceed(opportunity)}
															startIcon={<ThumbsUp />}
															sx={{ ml: 1 }}
														>
															Proceed
														</Button>
													</TableCell>
												</TableRow>
											))}
										</TableBody>
									</Table>
								</TableContainer>
							</Paper>
						)}
					</>
				)}
			</Box>

			<Paper sx={{ p: 2, mb: 3 }}>
				<Stack direction='row' spacing={2} alignItems='center'>
					<Typography variant='h5'>Opportunity Qualification</Typography>
					<Button
						startIcon={<PlusCircle size={20} />}
						variant='outlined'
						onClick={() => setIsSelectingOpportunity(true)}
						disabled={selectedOpportunities.length >= 3}
					>
						Add Opportunity
					</Button>
					{selectedOpportunities.length > 1 && (
						<Chip icon={<BarChart2 size={16} />} label='Comparing Assessments' color='primary' />
					)}
				</Stack>
			</Paper>

			<Grid container spacing={3}>
				{selectedOpportunities.map((oppId) => (
					<Grid item xs={12} md={selectedOpportunities.length > 1 ? 6 : 12} key={oppId}>
						{renderQualificationCard(oppId)}
					</Grid>
				))}
			</Grid>

			<Dialog open={isSelectingOpportunity} onClose={() => setIsSelectingOpportunity(false)} maxWidth='md' fullWidth>
				<DialogTitle>Select Opportunity</DialogTitle>
				<DialogContent>
					<List>
						{savedOpportunities.map((opportunity) => (
							<ListItem
								key={opportunity.id}
								button
								onClick={() => handleSelectOpportunity(opportunity)}
								disabled={selectedOpportunities.includes(opportunity.id)}
							>
								<ListItemText
									primary={opportunity.title}
									secondary={`Agency: ${opportunity.agency} | NAICS: ${opportunity.naicsCode}`}
								/>
							</ListItem>
						))}
					</List>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setIsSelectingOpportunity(false)}>Cancel</Button>
				</DialogActions>
			</Dialog>
		</Container>
	);
}

export default QualificationScreen;

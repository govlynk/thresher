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
import { useQueryClient } from "@tanstack/react-query";

const client = generateClient();

function QualificationScreen() {
	const { activeCompanyId } = useGlobalStore();
	const { qualification, loading: storeLoading, error, fetchQualification } = useQualificationStore();
	const { savedOpportunities, fetchSavedOpportunities, moveOpportunity } = useOpportunityStore();
	const [selectedOpportunities, setSelectedOpportunities] = useState([]);
	const [showQualification, setShowQualification] = useState(false);
	const [isSelectingOpportunity, setIsSelectingOpportunity] = useState(false);
	const [assessments, setAssessments] = useState({});
	const [loadingStates, setLoadingStates] = useState({});
	const [currentAssessmentOpportunity, setCurrentAssessmentOpportunity] = useState(null);
	const queryClient = useQueryClient();

	const scaleValues = {
		"No Experience": 1,
		Basic: 2,
		Intermediate: 3,
		Advanced: 4,
		Expert: 5,
	};

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
			console.log("Fetching qualifications for:", selectedOpportunities);
			const results = {};
			for (const oppId of selectedOpportunities) {
				try {
					console.log("Fetching qualification for opportunity:", oppId);
					// First get the qualification ID by filtering
					const listResponse = await client.models.Qualification.list({
						filter: {
							opportunityId: { eq: oppId },
						},
					});
					console.log("List response:", {
						data: listResponse?.data,
						errors: listResponse?.errors?.map((e) => ({
							message: e.message,
							errorType: e.errorType,
							errorInfo: e.errorInfo,
						})),
					});

					if (listResponse?.data?.length > 0) {
						const qualificationId = listResponse.data[0].id;
						const response = await client.models.Qualification.get({
							id: qualificationId,
						});
						console.log("Qualification response:", {
							data: response?.data,
							errors: response?.errors?.map((e) => ({
								message: e.message,
								errorType: e.errorType,
								errorInfo: e.errorInfo,
							})),
						});
						if (response?.data) {
							results[oppId] = response.data;
						}
					}
				} catch (err) {
					console.error("Error fetching qualification:", {
						message: err.message,
						name: err.name,
						code: err.code,
						stack: err.stack,
					});
				}
			}
			console.log("Final qualification results:", results);
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

	const handleQualificationComplete = async (formData) => {
		if (!currentAssessmentOpportunity) return;
		console.log("Starting qualification completion for:", currentAssessmentOpportunity.id);
		console.log("Form data received:", formData);

		setLoadingStates((prev) => ({ ...prev, [currentAssessmentOpportunity.id]: true }));
		try {
			// Get answers from the form data
			const answers = formData.answers || formData;
			console.log("Processing answers:", answers);

			// Calculate scores based on form data
			const scores = {
				technicalScore: calculateTechnicalScore(answers),
				pastPerformanceScore: calculatePastPerformanceScore(answers),
				competitionScore: calculateCompetitionScore(answers),
				pricingScore: calculatePricingScore(answers),
				riskScore: calculateRiskScore(answers),
			};
			console.log("Calculated scores:", scores);

			const qualificationData = {
				opportunityId: currentAssessmentOpportunity.id,
				status: "COMPLETED",
				...scores,
				overallScore: calculateOverallScore(scores),
				assessmentDate: new Date().toISOString(),
				notes: answers.notes || "",
				formAnswers: JSON.stringify(answers),
			};
			console.log("Qualification data to save:", qualificationData);

			// Check for existing qualification
			console.log("Checking for existing qualification...");
			let existingQualification;
			try {
				const listResponse = await client.models.Qualification.list({
					filter: {
						opportunityId: { eq: currentAssessmentOpportunity.id },
					},
				});
				console.log("List response:", {
					data: listResponse?.data,
					errors: listResponse?.errors?.map((e) => ({
						message: e.message,
						errorType: e.errorType,
						errorInfo: e.errorInfo,
					})),
				});

				if (listResponse?.data?.length > 0) {
					existingQualification = {
						data: listResponse.data[0],
					};
				}
			} catch (err) {
				console.error("Error checking existing qualification:", {
					message: err.message,
					name: err.name,
					code: err.code,
					stack: err.stack,
				});
			}

			let qualificationResponse;
			try {
				if (existingQualification?.data) {
					console.log("Updating existing qualification with ID:", existingQualification.data.id);
					qualificationResponse = await client.models.Qualification.update({
						id: existingQualification.data.id,
						...qualificationData,
					});
				} else {
					console.log("Creating new qualification with data:", qualificationData);
					qualificationResponse = await client.models.Qualification.create(qualificationData);
				}
				console.log("Qualification response:", {
					data: qualificationResponse?.data,
					errors: qualificationResponse?.errors?.map((e) => ({
						message: e.message,
						errorType: e.errorType,
						errorInfo: e.errorInfo,
					})),
				});
			} catch (err) {
				console.error("Error saving qualification:", {
					message: err.message,
					name: err.name,
					code: err.code,
					stack: err.stack,
				});
				throw err;
			}

			if (!qualificationResponse?.data) {
				throw new Error("Failed to save qualification - no data returned");
			}

			// Update the local assessments state
			setAssessments((prev) => ({
				...prev,
				[currentAssessmentOpportunity.id]: qualificationResponse.data,
			}));

			// Reset all states related to qualification form
			setShowQualification(false);
			setCurrentAssessmentOpportunity(null);

			// Invalidate the qualifications query to force a refresh
			console.log("Invalidating qualifications query cache");
			await queryClient.invalidateQueries(["qualifications"]);
		} catch (err) {
			console.error("Error in qualification completion:", {
				message: err.message,
				name: err.name,
				code: err.code,
				stack: err.stack,
			});
			throw err;
		} finally {
			setLoadingStates((prev) => ({ ...prev, [currentAssessmentOpportunity.id]: false }));
		}
	};

	const runQualification = async (opportunityId) => {
		console.log("Starting qualification run for opportunity:", opportunityId);
		const opportunity = savedOpportunities.find((opp) => opp.id === opportunityId);
		if (!opportunity) {
			console.log("Opportunity not found:", opportunityId);
			return;
		}

		// Check for existing qualification
		try {
			console.log("Checking for existing qualification...");
			const listResponse = await client.models.Qualification.list({
				filter: {
					opportunityId: { eq: opportunityId },
				},
			});
			console.log("List response:", {
				data: listResponse?.data,
				errors: listResponse?.errors?.map((e) => ({
					message: e.message,
					errorType: e.errorType,
					errorInfo: e.errorInfo,
				})),
			});

			// Add the opportunity to the selected opportunities for comparison
			if (!selectedOpportunities.includes(opportunityId)) {
				console.log("Adding opportunity to selected opportunities");
				setSelectedOpportunities((prev) => {
					if (prev.length >= 3) {
						return [...prev.slice(1), opportunityId];
					}
					return [...prev, opportunityId];
				});
			}

			// If we have an existing qualification, convert the scores back to form data
			let initialFormData = null;
			if (listResponse?.data?.length > 0) {
				console.log("Converting existing qualification to form data");
				const qualification = listResponse.data[0];
				console.log("Raw qualification data:", qualification);

				if (qualification.formAnswers) {
					try {
						initialFormData = JSON.parse(qualification.formAnswers);
						console.log("Retrieved stored form answers:", initialFormData);
					} catch (err) {
						console.error("Error parsing stored form answers:", err);
						// Fall back to calculating from scores if parsing fails
						initialFormData = {
							technicalCapability: {
								questions: {
									technicalExperience: convertScoreToLikertAnswers(qualification.technicalScore),
									staffingCapability: convertScoreToLikertAnswers(qualification.technicalScore),
								},
							},
							pastPerformance: {
								questions: {
									contractPerformance: convertScoreToLikertAnswers(qualification.pastPerformanceScore),
								},
							},
							managementApproach: {
								questions: {
									projectManagement: convertScoreToLikertAnswers(qualification.competitionScore),
								},
							},
							notes: qualification.notes || "",
						};
					}
				} else {
					// No stored form answers, calculate from scores
					initialFormData = {
						technicalCapability: {
							questions: {
								technicalExperience: convertScoreToLikertAnswers(qualification.technicalScore),
								staffingCapability: convertScoreToLikertAnswers(qualification.technicalScore),
							},
						},
						pastPerformance: {
							questions: {
								contractPerformance: convertScoreToLikertAnswers(qualification.pastPerformanceScore),
							},
						},
						managementApproach: {
							questions: {
								projectManagement: convertScoreToLikertAnswers(qualification.competitionScore),
							},
						},
						notes: qualification.notes || "",
					};
				}
				console.log("Final form data:", initialFormData);
			}

			setCurrentAssessmentOpportunity(opportunity);
			setShowQualification(true);
			return initialFormData;
		} catch (err) {
			console.error("Error in runQualification:", {
				message: err.message,
				name: err.name,
				code: err.code,
				stack: err.stack,
			});
			setCurrentAssessmentOpportunity(opportunity);
			setShowQualification(true);
			return null;
		}
	};

	// Helper function to convert numeric scores back to Likert scale answers
	const convertScoreToLikertAnswers = (score) => {
		console.log("Converting score to Likert:", score);
		const scaleValues = [
			{ min: 0, max: 20, value: "No Experience" },
			{ min: 21, max: 40, value: "Basic" },
			{ min: 41, max: 60, value: "Intermediate" },
			{ min: 61, max: 80, value: "Advanced" },
			{ min: 81, max: 100, value: "Expert" },
		];

		const value = scaleValues.find((range) => score >= range.min && score <= range.max)?.value || "Intermediate";
		console.log("Converted to Likert value:", value);
		return value;
	};

	// Score calculation functions
	const calculateTechnicalScore = (formData) => {
		const technicalSection = formData.technicalCapability?.questions || {};
		console.log("Technical section data:", technicalSection);
		const scores = {
			technicalExperience: scaleValues[technicalSection.technicalExperience] || 0,
			staffingCapability: scaleValues[technicalSection.staffingCapability] || 0,
		};
		console.log("Technical scores:", scores);
		return ((scores.technicalExperience + scores.staffingCapability) / 2) * 20;
	};

	const calculatePastPerformanceScore = (formData) => {
		const pastPerformanceSection = formData.pastPerformance?.questions || {};
		console.log("Past performance section data:", pastPerformanceSection);
		const score = scaleValues[pastPerformanceSection.contractPerformance] || 0;
		console.log("Past performance score:", score);
		return score * 20;
	};

	const calculateCompetitionScore = (formData) => {
		const managementSection = formData.managementApproach?.questions || {};
		console.log("Management section data:", managementSection);
		const score = scaleValues[managementSection.projectManagement] || 0;
		console.log("Competition score:", score);
		return score * 20;
	};

	const calculatePricingScore = (formData) => {
		// Default to 75 for now - this should be calculated based on pricing analysis
		return 75;
	};

	const calculateRiskScore = (formData) => {
		// Calculate risk based on management approach scores
		const managementSection = formData.managementApproach?.questions || {};
		const riskScore = 100 - averageLikertScores(managementSection.projectManagement) * 20;
		return Math.max(0, Math.min(100, riskScore));
	};

	const averageLikertScores = (likertData = {}) => {
		if (!likertData || typeof likertData !== "object" || Object.keys(likertData).length === 0) return 0;

		const scaleValues = {
			"No Experience": 1,
			Basic: 2,
			Intermediate: 3,
			Advanced: 4,
			Expert: 5,
			Inadequate: 1,
			Adequate: 3,
			Strong: 4,
			Exceptional: 5,
			Poor: 1,
			Fair: 2,
			Good: 3,
			"Very Good": 4,
			Excellent: 5,
			None: 1,
			Established: 3,
			Optimized: 5,
		};

		const scores = Object.values(likertData).map((answer) => scaleValues[answer] || 3);
		return scores.reduce((sum, score) => sum + score, 0) / scores.length;
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
								disabled={loadingStates[opportunityId]}
							>
								{loadingStates[opportunityId] ? <CircularProgress size={24} /> : "Run Qualification"}
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

	if (storeLoading) {
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
						Qualification Assessment for {currentAssessmentOpportunity?.title}
					</Typography>
					<QualificationForm
						onComplete={handleQualificationComplete}
						initialData={async () => await runQualification(currentAssessmentOpportunity.id)}
					/>
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
												startIcon={<BarChart2 />}
												variant='outlined'
												onClick={() => runQualification(opportunity.id)}
												disabled={loadingStates[opportunity.id]}
											>
												{loadingStates[opportunity.id] ? <CircularProgress size={20} /> : "Run Assessment"}
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

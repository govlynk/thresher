import React, { useState, useEffect } from "react";
import {
	Paper,
	Tabs,
	Tab,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Divider,
	Typography,
	Box,
	useTheme,
} from "@mui/material";
import { CheckCircle2, XCircle, AlertCircle, ChevronRight } from "lucide-react";

export function RegulationTabs({ regulations = [], selectedRegulation, onRegulationSelect }) {
	const [selectedTab, setSelectedTab] = useState(0);
	const theme = useTheme();

	const handleTabChange = (event, newValue) => {
		setSelectedTab(newValue);
		onRegulationSelect(null);
	};

	const getResponseIcon = (answers = []) => {
		const hasYes = answers.some((a) => a.answerText?.toLowerCase() === "yes");
		const hasNo = answers.some((a) => a.answerText?.toLowerCase() === "no");

		if (hasYes && !hasNo) return <CheckCircle2 color={theme.palette.success.main} />;
		if (hasNo) return <XCircle color={theme.palette.error.main} />;
		return <AlertCircle color={theme.palette.warning.main} />;
	};

	const farRegulations = regulations.filter((r) => r.type === "FAR") || [];
	const dfarRegulations = regulations.filter((r) => r.type === "DFAR") || [];
	const currentRegulations = selectedTab === 0 ? farRegulations : dfarRegulations;

	useEffect(() => {
		console.log("Current regulations:", currentRegulations); // Debug log
	}, [currentRegulations]);

	if (!regulations.length) {
		return (
			<Paper sx={{ width: 400, flexShrink: 0, p: 3 }}>
				<Typography variant='body1' color='text.secondary' align='center'>
					No regulations found
				</Typography>
			</Paper>
		);
	}

	return (
		<Paper sx={{ width: 400, flexShrink: 0 }}>
			<Tabs value={selectedTab} onChange={handleTabChange} sx={{ borderBottom: 1, borderColor: "divider" }}>
				<Tab label={`FAR (${farRegulations.length})`} />
				<Tab label={`DFAR (${dfarRegulations.length})`} />
			</Tabs>

			{currentRegulations.length === 0 ? (
				<Box sx={{ p: 3, textAlign: "center" }}>
					<Typography variant='body2' color='text.secondary'>
						No {selectedTab === 0 ? "FAR" : "DFAR"} regulations available
					</Typography>
				</Box>
			) : (
				<List sx={{ overflow: "auto", maxHeight: "calc(100vh - 250px)" }}>
					{currentRegulations.map((regulation) => (
						<React.Fragment key={regulation.provisionId}>
							<ListItem disablePadding>
								<ListItemButton
									selected={selectedRegulation?.provisionId === regulation.provisionId}
									onClick={() => onRegulationSelect(regulation)}
									sx={{
										"&:hover": {
											bgcolor: theme.palette.action.hover,
										},
									}}
								>
									<ListItemIcon>{getResponseIcon(regulation.listOfAnswers)}</ListItemIcon>
									<ListItemText
										primary={regulation.provisionId}
										secondary={`${regulation.listOfAnswers?.length || 0} responses`}
									/>
									<ChevronRight size={20} />
								</ListItemButton>
							</ListItem>
							<Divider />
						</React.Fragment>
					))}
				</List>
			)}
		</Paper>
	);
}

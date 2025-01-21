import React, { useState } from "react";
import { Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSetupWorkflowStore } from "../../stores/setupWorkflowStore";
import { SetupReviewContent } from "./review/SetupReviewContent";
import { SetupReviewHeader } from "./review/SetupReviewHeader";
import { SetupReviewFooter } from "./review/SetupReviewFooter";
import { useGlobalStore } from "../../stores/globalStore";
import { setupCompany } from "../../utils/setupDbOperations";

export function SetupReview() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const { activeUserData } = useGlobalStore();
	const { companyData, contactsData, adminData, teamData, resetWorkflow } = useSetupWorkflowStore();
	const navigate = useNavigate();

	const handleComplete = async () => {
		setLoading(true);
		setError(null);

		try {
			await setupCompany({
				companyData,
				contactsData,
				adminData,
				teamData,
				activeUserData,
			});

			resetWorkflow();
			navigate("/client-setup");
		} catch (err) {
			console.error("Setup error:", err);
			setError(err.message || "Failed to complete setup");
			setLoading(false);
		}
	};

	return (
		<Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
			<SetupReviewHeader />

			<SetupReviewContent
				companyData={companyData}
				contactsData={contactsData}
				adminData={adminData}
				teamData={teamData}
				error={error}
			/>

			<SetupReviewFooter onComplete={handleComplete} loading={loading} />
		</Box>
	);
}

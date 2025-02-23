// src/screens/TodoScreen.jsx
import React, { useState, useEffect } from "react";
import { Box, Container, Alert, Button, Typography, CircularProgress } from "@mui/material";
import { generateClient } from "aws-amplify/api";

const client = generateClient();

export default function TestScreen() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [authUrl, setAuthUrl] = useState(null);
	const [accessToken, setAccessToken] = useState(null);
	const [userCount, setUserCount] = useState(null);
	const [debugLogs, setDebugLogs] = useState([]);

	const addDebugLog = (message, data = null) => {
		setDebugLogs((prev) => [
			...prev,
			{
				timestamp: new Date().toISOString(),
				message,
				data: data ? JSON.stringify(data, null, 2) : null,
			},
		]);
	};

	const handleGetAuthUrl = async () => {
		setLoading(true);
		setError(null);
		try {
			addDebugLog("Requesting Zoho auth URL");
			const response = await client.graphql({
				query: `query GetZohoAuthUrl {
					getZohoAuthUrl
				}`,
			});

			const url = response.data.getZohoAuthUrl;
			setAuthUrl(url);
			addDebugLog("Received auth URL", url);
			window.open(url, "_blank");
		} catch (err) {
			setError(err.message);
			addDebugLog("Error getting auth URL", err);
		} finally {
			setLoading(false);
		}
	};

	// Handle auth callback from URL
	useEffect(() => {
		const urlParams = new URLSearchParams(window.location.search);
		const data = urlParams.get("data");

		if (data) {
			try {
				const responseData = JSON.parse(data);
				if (responseData.userCount) {
					setUserCount(responseData.userCount);
					setAccessToken("token_received"); // Indicate successful auth
					addDebugLog("Auth successful", responseData);
				}
			} catch (err) {
				setError("Failed to process response data");
				addDebugLog("Error processing response", err);
			}
		}
	}, []);

	return (
		<Container maxWidth={false} disableGutters>
			<Box sx={{ p: 4, width: "100%" }}>
				<Typography variant='h4' gutterBottom>
					Zoho CRM Integration Test
				</Typography>

				{error && (
					<Alert severity='error' sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				<Button variant='contained' onClick={handleGetAuthUrl} disabled={loading} sx={{ mb: 2 }}>
					{loading ? <CircularProgress size={24} /> : "Connect to Zoho CRM"}
				</Button>

				{accessToken && (
					<Alert severity='success' sx={{ mb: 2 }}>
						Connected to Zoho CRM
					</Alert>
				)}

				{userCount !== null && (
					<Typography variant='h6' gutterBottom>
						Crm User Count: {userCount}
					</Typography>
				)}

				{/* Debug Logs */}
				<Box sx={{ mt: 4 }}>
					<Typography variant='h6' gutterBottom>
						Debug Logs
					</Typography>
					<Box
						sx={{
							maxHeight: 400,
							overflow: "auto",
							bgcolor: "grey.900",
							p: 2,
							borderRadius: 1,
						}}
					>
						{debugLogs.map((log, i) => (
							<Box key={i} sx={{ mb: 1, color: "grey.300" }}>
								<Typography variant='caption' sx={{ color: "primary.main" }}>
									{log.timestamp}
								</Typography>
								<Typography>{log.message}</Typography>
								{log.data && (
									<pre style={{ margin: 0 }}>
										<code>{log.data}</code>
									</pre>
								)}
							</Box>
						))}
					</Box>
				</Box>
			</Box>
		</Container>
	);
}

// src/screens/TodoScreen.jsx
import React, { useState } from "react";
import { Box, Container, Alert, Button, Typography, CircularProgress } from "@mui/material";
import { getZohoAccessToken } from "../lib/zoho-auth";

export default function TestScreen() {
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState(null);
	const [accessToken, setAccessToken] = useState(null);

	const handleGetToken = async () => {
		setLoading(true);
		setError(null);
		try {
			const token = await getZohoAccessToken();
			setAccessToken(token);
		} catch (err) {
			setError(err.message);
		} finally {
			setLoading(false);
		}
	};

	return (
		<Container maxWidth={false} disableGutters>
			<Box sx={{ p: 4, width: "100%" }}>
				<Typography variant='h4' gutterBottom>
					Zoho CRM Integration Test
				</Typography>

				<Button variant='contained' onClick={handleGetToken} disabled={loading} sx={{ mb: 2 }}>
					{loading ? <CircularProgress size={24} /> : "Get Zoho Access Token"}
				</Button>

				{error && (
					<Alert severity='error' sx={{ mb: 2 }}>
						{error}
					</Alert>
				)}

				{accessToken && (
					<Alert severity='success' sx={{ mb: 2 }}>
						Access Token Received
					</Alert>
				)}
			</Box>
		</Container>
	);
}

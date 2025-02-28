import React, { useState } from "react";
import { Box, Container, Button, Typography, CircularProgress, Paper, TextField } from "@mui/material";
import { generateClient } from "aws-amplify/api";

export default function TestScreen() {
	const client = generateClient();
	const [description, setDescription] = useState("Create a recipe for chocolate chip cookies");
	const [isLoading, setIsLoading] = useState(false);
	const [data, setData] = useState(null);

	const handleGenerateResearch = async () => {
		setIsLoading(true);
		try {
			const response = await client.graphql({
				query: `
					query GenerateResearch($description: String!) {
						generateResearch(description: $description) {
							name
							ingredients
							instructions
						}
					}
				`,
				variables: {
					description,
				},
			});
			console.log(response);

			setData(response.data.generateResearch);
		} catch (error) {
			console.error("Error generating research:", error);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Container maxWidth={false} disableGutters>
			<Box sx={{ p: 4, width: "100%" }}>
				<Typography variant='h4' gutterBottom>
					AI Recipe Generation
				</Typography>

				<TextField
					fullWidth
					label='Recipe Description'
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					margin='normal'
					variant='outlined'
					sx={{ mb: 2 }}
				/>

				<Button variant='contained' onClick={handleGenerateResearch} disabled={isLoading} sx={{ mb: 2 }}>
					{isLoading ? <CircularProgress size={24} /> : "Generate Recipe"}
				</Button>

				{data && (
					<Paper sx={{ p: 3, mt: 3 }}>
						<Typography variant='h5' gutterBottom>
							{data.name}
						</Typography>

						<Typography variant='h6' sx={{ mt: 2 }}>
							Ingredients:
						</Typography>
						<ul>
							{data.ingredients.map((ingredient, index) => (
								<li key={index}>
									<Typography>{ingredient}</Typography>
								</li>
							))}
						</ul>

						<Typography variant='h6' sx={{ mt: 2 }}>
							Instructions:
						</Typography>
						<Typography sx={{ whiteSpace: "pre-line" }}>{data.instructions}</Typography>
					</Paper>
				)}
			</Box>
		</Container>
	);
}

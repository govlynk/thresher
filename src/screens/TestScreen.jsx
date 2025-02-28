import React from "react";
import { Box, Container, Button, Typography, CircularProgress, Paper } from "@mui/material";
import { generateClient } from "aws-amplify/api";
import { createAIHooks } from "@aws-amplify/ui-react-ai";

export default function TestScreen() {
	const client = generateClient();
	const { useAIGeneration } = createAIHooks(client);
	const description = "Create a recipe for chocolate chip cookies";

	// data is React state and will be populated when the generation is returned
	const [{ data, isLoading }, generateResearch] = useAIGeneration("generateResearch");

	const handleGenerateResearch = () => {
		generateResearch({
			description,
		});
	};

	return (
		<Container maxWidth={false} disableGutters>
			<Box sx={{ p: 4, width: "100%" }}>
				<Typography variant='h4' gutterBottom>
					AI Recipe Generation
				</Typography>

				<Button variant='contained' onClick={handleGenerateRecipe} disabled={isLoading} sx={{ mb: 2 }}>
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

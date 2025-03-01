import React, { useState } from "react";
import { Box, Container, Typography, Card, CardContent } from "@mui/material";
import { generateClient } from "aws-amplify/api";
import { useAIConversation } from "./client";
import { AIConversation, createAIHooks } from "@aws-amplify/ui-react-ai";
import ReactMarkdown from "react-markdown";

export default function TestScreen() {
	const [
		{
			data: { messages },
			isLoading,
		},
		handleSendMessage,
	] = useAIConversation("chat");
	// 'chat' is based on the key for the conversation route in your schema.

	return (
		<Container maxWidth={false} disableGutters>
			<Box sx={{ p: 4, width: "100%" }}>
				<Typography variant='h4' gutterBottom>
					AI Chat
				</Typography>

				<AIConversation
					messages={messages}
					allowAttachments={true}
					isLoading={isLoading}
					handleSendMessage={handleSendMessage}
					messageRenderer={{
						text: ({ text }) => <ReactMarkdown>{text}</ReactMarkdown>,
					}}
					welcomeMessage={
						<Card variant='outlined' sx={{ mb: 2 }}>
							<CardContent>
								<Typography>I am your virtual assistant, ask me any questions you like!</Typography>
							</CardContent>
						</Card>
					}
				/>
			</Box>
		</Container>
	);
}

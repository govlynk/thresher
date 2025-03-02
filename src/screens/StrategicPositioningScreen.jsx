import React, { useState } from "react";
import {
	Box,
	Container,
	Typography,
	Paper,
	Button,
	IconButton,
	Card,
	CardContent,
	CardHeader,
	Stack,
} from "@mui/material";
import { Pencil, Save, X } from "lucide-react";
import { RichTextEditor } from "../components/common/form/RichTextEditor/RichTextEditor";
import useStore from "../stores/strategicStore";

function EditableSection({ title, content, onSave }) {
	const [isEditing, setIsEditing] = useState(false);
	const [editedContent, setEditedContent] = useState(content);

	const handleSave = () => {
		onSave(editedContent);
		setIsEditing(false);
	};

	const handleCancel = () => {
		setEditedContent(content);
		setIsEditing(false);
	};

	return (
		<Card sx={{ mb: 3, position: "relative" }}>
			<CardHeader
				title={title}
				action={
					!isEditing ? (
						<IconButton onClick={() => setIsEditing(true)}>
							<Pencil size={20} />
						</IconButton>
					) : (
						<Stack direction='row' spacing={1}>
							<IconButton color='primary' onClick={handleSave}>
								<Save size={20} />
							</IconButton>
							<IconButton color='error' onClick={handleCancel}>
								<X size={20} />
							</IconButton>
						</Stack>
					)
				}
			/>
			<CardContent>
				{isEditing ? (
					<RichTextEditor
						value={editedContent}
						onChange={setEditedContent}
						placeholder={`Enter ${title.toLowerCase()}...`}
						minHeight={200}
					/>
				) : (
					<RichTextEditor value={content} readOnly minHeight={200} />
				)}
			</CardContent>
		</Card>
	);
}

export default function StrategicPositioningScreen() {
	const {
		companyDescription,
		targetMarket,
		competitiveAdvantage,
		valueProposition,
		marketingStrategy,
		updateCompanyDescription,
		updateTargetMarket,
		updateCompetitiveAdvantage,
		updateValueProposition,
		updateMarketingStrategy,
	} = useStore();

	const sections = [
		{
			title: "Company Description",
			content: companyDescription,
			onSave: updateCompanyDescription,
		},
		{
			title: "Target Market",
			content: targetMarket,
			onSave: updateTargetMarket,
		},
		{
			title: "Competitive Advantage",
			content: competitiveAdvantage,
			onSave: updateCompetitiveAdvantage,
		},
		{
			title: "Value Proposition",
			content: valueProposition,
			onSave: updateValueProposition,
		},
		{
			title: "Marketing Strategy",
			content: marketingStrategy,
			onSave: updateMarketingStrategy,
		},
	];

	return (
		<Container maxWidth='lg' sx={{ py: 4 }}>
			<Paper sx={{ p: 3, mb: 4 }}>
				<Typography variant='h4' gutterBottom>
					Strategic Positioning
				</Typography>
				<Typography variant='body1' color='text.secondary' paragraph>
					Complete your strategic positioning by filling out each section below. Click the edit icon to modify any
					section.
				</Typography>
			</Paper>

			{sections.map((section, index) => (
				<EditableSection key={index} title={section.title} content={section.content} onSave={section.onSave} />
			))}

			<Box sx={{ mt: 4, display: "flex", justifyContent: "flex-end" }}>
				<Button variant='contained' color='primary' size='large' onClick={() => console.log("Form submitted")}>
					Submit Strategic Position
				</Button>
			</Box>
		</Container>
	);
}

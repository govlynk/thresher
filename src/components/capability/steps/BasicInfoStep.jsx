import React from "react";
import { Grid } from "@mui/material";
import { FormStep } from "../../common/form/FormStep";
import { FormSection } from "../../common/form/FormSection";
// import { RichTextQuestion } from '../../common/form/questionTypes/RichTextQuestion';
import { TextQuestion } from "../../common/form/questionTypes/TextQuestion";

export function BasicInfoStep({ formData, onChange, errors, onInfoClick }) {
	return (
		<FormStep
			title='Basic Information'
			description="Tell us about your company's mission, vision, and values"
			onInfoClick={onInfoClick}
		>
			<FormSection>
				<Grid container spacing={3}>
					<Grid item xs={12}>
						<TextQuestion
							question={{
								id: "aboutUs",
								title: "About Us",
								required: false,
								error: errors?.aboutUs,
								placeholder: "Describe your company...",
								minHeight: 200,
							}}
							value={formData.aboutUs}
							onChange={onChange}
						/>
					</Grid>

					<Grid item xs={12}>
						<TextQuestion
							question={{
								id: "mission",
								title: "Mission Statement",
								required: false,
								error: errors?.mission,
								placeholder: "Your company mission...",
								minHeight: 150,
							}}
							value={formData.mission}
							onChange={onChange}
						/>
					</Grid>

					<Grid item xs={12}>
						<TextQuestion
							question={{
								id: "vision",
								title: "Vision Statement",
								required: false,
								error: errors?.vision,
								placeholder: "Your company vision...",
								minHeight: 150,
							}}
							value={formData.vision}
							onChange={onChange}
						/>
					</Grid>

					<Grid item xs={12}>
						<TextQuestion
							question={{
								id: "competitiveAdvantage",
								title: "Competitive Advantage",
								required: false,
								error: errors?.competitiveAdvantage,
								placeholder: "What sets you apart...",
								minHeight: 150,
							}}
							value={formData.competitiveAdvantage}
							onChange={onChange}
						/>
					</Grid>
				</Grid>
			</FormSection>
		</FormStep>
	);
}

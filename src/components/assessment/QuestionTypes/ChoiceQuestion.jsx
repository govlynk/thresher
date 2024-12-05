import React from "react";
import { FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Typography } from "@mui/material";

export function ChoiceQuestion({ question, value, onChange }) {
	const values = value ? (Array.isArray(value) ? value : [value]) : [];

	return (
		<FormControl component='fieldset' fullWidth>
			<FormLabel component='legend'>
				<Typography variant='h6' gutterBottom>
					{question.title}
				</Typography>
			</FormLabel>

			<Typography variant='body1' sx={{ mb: 3, color: "text.secondary" }}>
				{question.question}
			</Typography>

			{/* <RadioGroup value={value || ""} onChange={(e) => onChange(question.id, e.target.value)}>
				{question.options.map((option) => (
					<FormControlLabel key={option.value} value={option.value} control={<Radio />} label={option.label} />
				))}
			</RadioGroup> */}

			<RadioGroup onChange={(e) => onChange(question.id, e.target.value)}>
				{question.options.map((option) => (
					<FormControlLabel
						key={option}
						control={<Radio checked={values.includes(option)} onChange={() => handleChange(option)} />}
						label={option}
					/>
				))}
			</RadioGroup>
		</FormControl>
	);
}

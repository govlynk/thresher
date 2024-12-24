import React from "react";
import { Box } from "@mui/material";
import { SortableListQuestion } from "../../common/form/questionTypes/SortableListQuestion";

export function CapabilitiesSection({ value = [], onChange }) {
	return (
		<Box>
			<SortableListQuestion
				question={{
					id: "capabilities",
					title: "Key Capabilities",
					required: false,
					instructions: "List your company's key capabilities and core competencies.",
					placeholder: "Capability...",
					minHeight: 300,
					maxLength: 100,
				}}
				value={value}
				onChange={onChange}
			/>
		</Box>
	);
}

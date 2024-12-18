// src/components/regulation/RegulationList.jsx
import React from "react";
import { List, ListItem, ListItemText, Paper } from "@mui/material";
import { REGULATION_TYPES } from "../../types/regulationTypes";

export function RegulationList({ regulations, selectedId, onSelect }) {
	return (
		<Paper sx={{ width: 300, flexShrink: 0 }}>
			<List>
				{regulations.map((reg) => (
					<ListItem
						key={`${reg.type}-${reg.provisionId}`}
						button
						selected={selectedId === `${reg.type}-${reg.provisionId}`}
						onClick={() => onSelect(reg)}
					>
						<ListItemText
							primary={`${reg.type} ${reg.provisionId}`}
							secondary={`${reg.answers.length} responses`}
						/>
					</ListItem>
				))}
			</List>
		</Paper>
	);
}

import React from "react";
import { Box, Paper, Typography, TextField, Button, Chip } from "@mui/material";
import { Plus, Tag } from "lucide-react";

export function SwotSection({ title, items = [], onAdd, onRemove, color }) {
	const [inputValue, setInputValue] = React.useState("");

	const handleAdd = () => {
		if (inputValue.trim()) {
			onAdd(inputValue.trim());
			setInputValue("");
		}
	};

	const handleKeyPress = (e) => {
		if (e.key === "Enter" && inputValue.trim()) {
			handleAdd();
		}
	};

	return (
		<Paper
			sx={{
				p: 3,
				height: "100%",
				borderTop: 3,
				borderColor: color,
			}}
		>
			<Typography variant='h6' gutterBottom>
				{title}
			</Typography>

			<Box sx={{ mb: 2 }}>
				<TextField
					fullWidth
					placeholder={`Add new ${title.toLowerCase()}`}
					size='small'
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					onKeyPress={handleKeyPress}
				/>
				<Button startIcon={<Plus size={20} />} onClick={handleAdd} sx={{ mt: 1 }}>
					Add Item
				</Button>
			</Box>

			<Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
				{Array.isArray(items) &&
					items.map((item, index) => (
						<Chip
							key={index}
							icon={<Tag size={14} />}
							label={item}
							onDelete={() => onRemove(index)}
							sx={{
								bgcolor: `${color}15`,
								color: color,
								borderColor: color,
								"& .MuiChip-deleteIcon": {
									color: color,
									"&:hover": {
										color: `${color}CC`,
									},
								},
								"& .MuiChip-icon": {
									color: color,
								},
								"&:hover": {
									bgcolor: `${color}25`,
								},
							}}
						/>
					))}
			</Box>
		</Paper>
	);
}

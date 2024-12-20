import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { Save, X } from "lucide-react";

export function ContactDialogHeader({ title, onSave, onClose, loading }) {
	return (
		<Box
			sx={{
				p: 2,
				display: "flex",
				alignItems: "center",
				justifyContent: "space-between",
				borderBottom: 1,
				borderColor: "divider",
			}}
		>
			<Typography variant='h6'>{title}</Typography>
			<Box sx={{ display: "flex", gap: 1 }}>
				<Button onClick={onClose} startIcon={<X size={18} />} disabled={loading}>
					Cancel
				</Button>
				<Button variant='contained' onClick={onSave} startIcon={<Save size={18} />} disabled={loading}>
					{loading ? "Saving..." : "Save"}
				</Button>
			</Box>
		</Box>
	);
}

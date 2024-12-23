import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { Bold, Italic, List, ListOrdered } from "lucide-react";

export function EditorToolbar({ onToggle, currentStyle }) {
	const { inline, block } = currentStyle;

	const INLINE_STYLES = [
		{ label: "Bold", style: "BOLD", icon: Bold },
		{ label: "Italic", style: "ITALIC", icon: Italic },
	];

	const BLOCK_TYPES = [
		{ label: "Bullet List", style: "unordered-list-item", icon: List },
		{ label: "Numbered List", style: "ordered-list-item", icon: ListOrdered },
	];

	const hasInlineStyle = (style) => {
		return inline ? inline.has(style) : false;
	};

	return (
		<Box sx={{ display: "flex", gap: 1, p: 1, borderBottom: 1, borderColor: "divider" }}>
			{INLINE_STYLES.map(({ label, style, icon: Icon }) => (
				<Tooltip key={style} title={label}>
					<IconButton
						size='small'
						onClick={() => onToggle("inline", style)}
						color={hasInlineStyle(style) ? "primary" : "default"}
					>
						<Icon size={18} />
					</IconButton>
				</Tooltip>
			))}

			{BLOCK_TYPES.map(({ label, style, icon: Icon }) => (
				<Tooltip key={style} title={label}>
					<IconButton
						size='small'
						onClick={() => onToggle("block", style)}
						color={block === style ? "primary" : "default"}
					>
						<Icon size={18} />
					</IconButton>
				</Tooltip>
			))}
		</Box>
	);
}

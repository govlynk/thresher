import React, { useRef, useEffect } from "react";
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw, ContentState } from "draft-js";
import { Box, Paper } from "@mui/material";
import { EditorToolbar } from "./EditorToolbar";
import "draft-js/dist/Draft.css";

export function RichTextEditor({ value, onChange, placeholder, minHeight = 200, readOnly = false, error = false }) {
	// Initialize editor state
	const [editorState, setEditorState] = React.useState(() => {
		// If no value is provided, create empty editor state
		if (!value) {
			return EditorState.createEmpty();
		}

		try {
			// First try to parse as JSON (for rich text)
			const contentState = convertFromRaw(JSON.parse(value));
			return EditorState.createWithContent(contentState);
		} catch (e) {
			// If JSON parsing fails, create from plain text
			const contentState = ContentState.createFromText(String(value));
			return EditorState.createWithContent(contentState);
		}
	});

	const editorRef = useRef(null);
	const valueRef = useRef(value);

	// Handle value prop changes
	useEffect(() => {
		if (value === valueRef.current) return;

		valueRef.current = value;

		if (!value) {
			setEditorState(EditorState.createEmpty());
			return;
		}

		try {
			// Try parsing as JSON first
			const contentState = convertFromRaw(JSON.parse(value));
			setEditorState(EditorState.createWithContent(contentState));
		} catch (e) {
			// Fall back to plain text
			const contentState = ContentState.createFromText(String(value));
			setEditorState(EditorState.createWithContent(contentState));
		}
	}, [value]);

	const handleChange = (newState) => {
		setEditorState(newState);
	};

	const handleToggle = (type, style) => {
		const newState =
			type === "block"
				? RichUtils.toggleBlockType(editorState, style)
				: RichUtils.toggleInlineStyle(editorState, style);
		handleChange(newState);
	};

	const handleBlur = () => {
		const contentState = editorState.getCurrentContent();
		const rawContent = convertToRaw(contentState);
		const contentStr = JSON.stringify(rawContent);

		if (contentStr !== valueRef.current) {
			valueRef.current = contentStr;
			onChange(contentStr);
		}
	};

	const handleKeyCommand = (command, editorState) => {
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			handleChange(newState);
			return "handled";
		}
		return "not-handled";
	};

	const focusEditor = () => {
		if (editorRef.current && !readOnly) {
			editorRef.current.focus();
		}
	};

	return (
		<Paper
			variant='outlined'
			sx={{
				border: error ? "1px solid red" : undefined,
				"&:hover": {
					borderColor: error ? "red" : "primary.main",
				},
			}}
		>
			{!readOnly && (
				<EditorToolbar
					onToggle={handleToggle}
					currentStyle={{
						inline: editorState.getCurrentInlineStyle(),
						block: RichUtils.getCurrentBlockType(editorState),
					}}
				/>
			)}
			<Box
				onClick={focusEditor}
				sx={{
					minHeight,
					padding: 2,
					cursor: readOnly ? "default" : "text",
					"& .DraftEditor-root": {
						height: "100%",
					},
					"& .public-DraftEditorPlaceholder-root": {
						color: "text.secondary",
						position: "absolute",
						padding: "8px",
					},
					"& .public-DraftEditor-content": {
						minHeight: minHeight - 32, // Adjust for padding
					},
				}}
			>
				<Editor
					ref={editorRef}
					editorState={editorState}
					onChange={handleChange}
					onBlur={handleBlur}
					handleKeyCommand={handleKeyCommand}
					placeholder={placeholder}
					readOnly={readOnly}
					spellCheck={true}
				/>
			</Box>
		</Paper>
	);
}

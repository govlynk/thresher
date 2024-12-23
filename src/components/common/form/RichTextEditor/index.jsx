import React, { useRef, useEffect } from "react";
import { Editor, EditorState, RichUtils, convertToRaw, convertFromRaw } from "draft-js";
import { Box, Paper } from "@mui/material";
import { EditorToolbar } from "./EditorToolbar";
import "draft-js/dist/Draft.css";

export function RichTextEditor({ value, onChange, placeholder, minHeight = 200 }) {
	const [editorState, setEditorState] = React.useState(() => {
		if (value) {
			try {
				const contentState = convertFromRaw(JSON.parse(value));
				return EditorState.createWithContent(contentState);
			} catch (e) {
				console.warn("Invalid editor content:", e);
				return EditorState.createEmpty();
			}
		}
		return EditorState.createEmpty();
	});

	const editorRef = useRef(null);
	const valueRef = useRef(value);

	// Update editor state when value prop changes
	useEffect(() => {
		if (value !== valueRef.current) {
			valueRef.current = value;
			if (value) {
				try {
					const contentState = convertFromRaw(JSON.parse(value));
					const newEditorState = EditorState.createWithContent(contentState);
					setEditorState(newEditorState);
				} catch (e) {
					console.warn("Invalid editor content:", e);
				}
			} else {
				setEditorState(EditorState.createEmpty());
			}
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
		const content = convertToRaw(editorState.getCurrentContent());
		const contentStr = JSON.stringify(content);

		// Only trigger onChange if content has actually changed
		if (contentStr !== valueRef.current) {
			valueRef.current = contentStr;
			onChange(contentStr);
		}
	};

	const focusEditor = () => {
		if (editorRef.current) {
			editorRef.current.focus();
		}
	};

	return (
		<Paper variant='outlined'>
			<EditorToolbar
				onToggle={handleToggle}
				currentStyle={{
					inline: editorState.getCurrentInlineStyle(),
					block: RichUtils.getCurrentBlockType(editorState),
				}}
			/>
			<Box
				onClick={focusEditor}
				sx={{
					minHeight,
					padding: 2,
					cursor: "text",
					"& .DraftEditor-root": {
						height: "100%",
					},
				}}
			>
				<Editor
					ref={editorRef}
					editorState={editorState}
					onChange={handleChange}
					onBlur={handleBlur}
					placeholder={placeholder}
				/>
			</Box>
		</Paper>
	);
}

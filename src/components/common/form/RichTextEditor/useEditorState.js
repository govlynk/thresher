import { useState, useEffect, useRef } from "react";
import { EditorState, convertToRaw, convertFromRaw, ContentState } from "draft-js";

// Helper to preserve selection
const preserveEditorSelection = (editorState, newContentState) => {
	const selection = editorState.getSelection();
	const newEditorState = EditorState.createWithContent(newContentState);
	return EditorState.forceSelection(newEditorState, selection);
};

export function useEditorState({ value, onChange, readOnly }) {
	// Store selection state
	const selectionRef = useRef(null);

	const [editorState, setEditorState] = useState(() => {
		try {
			if (!value) {
				return EditorState.createEmpty();
			}

			// Handle string value (JSON)
			if (typeof value === "string") {
				const content = JSON.parse(value);
				const contentState = convertFromRaw(content);
				return EditorState.createWithContent(contentState);
			}

			// Handle raw content state
			if (typeof value === "object") {
				const contentState = convertFromRaw(value);
				return EditorState.createWithContent(contentState);
			}

			return EditorState.createEmpty();
		} catch (err) {
			console.warn("Error creating editor state:", err);
			return EditorState.createEmpty();
		}
	});

	const prevValueRef = useRef(value);

	// Update editor state when value prop changes
	useEffect(() => {
		if (value !== prevValueRef.current) {
			prevValueRef.current = value;
			try {
				if (!value) {
					setEditorState(EditorState.createEmpty());
					return;
				}

				const content = typeof value === "string" ? JSON.parse(value) : value;
				const contentState = convertFromRaw(content);
				let newState;

				// Restore selection if available
				if (selectionRef.current) {
					newState = preserveEditorSelection(editorState, contentState);
				} else {
					newState = EditorState.createWithContent(contentState);
				}
				setEditorState(newState);
			} catch (err) {
				console.warn("Error updating editor state:", err);
			}
		}
	}, [value]);

	// Handle editor state changes
	const handleEditorStateChange = (newState) => {
		if (!newState) return;

		// Update selection state
		const selection = newState.getSelection();
		if (selection.getHasFocus()) {
			selectionRef.current = selection;
		}

		setEditorState(newState);

		if (!readOnly && onChange) {
			try {
				const content = convertToRaw(newState.getCurrentContent());
				const rawContent = JSON.stringify(content);
				if (rawContent !== value) {
					onChange(rawContent);
				}
			} catch (err) {
				console.error("Error converting editor content:", err);
			}
		}
	};

	return {
		editorState,
		setEditorState: handleEditorStateChange,
	};
}

import { useState, useEffect, useRef } from "react";
import { EditorState } from "draft-js";
import { createEditorStateFromRaw, convertEditorStateToRaw } from "../../../../utils/editor/editorStateUtils";

export function useEditorState({ value, onChange, readOnly }) {
	const [editorState, setEditorState] = useState(() => createEditorStateFromRaw(value));
	const prevValueRef = useRef(value);
	const prevSelectionRef = useRef(null);

	// Update editor state when value prop changes externally
	useEffect(() => {
		if (value !== prevValueRef.current) {
			prevValueRef.current = value;
			const currentSelection = editorState.getSelection();

			const newEditorState = createEditorStateFromRaw(value, editorState);

			// Preserve selection if possible
			if (currentSelection && currentSelection.getHasFocus()) {
				const withSelection = EditorState.forceSelection(newEditorState, currentSelection);
				setEditorState(withSelection);
			} else {
				setEditorState(newEditorState);
			}
		}
	}, [value, editorState]);

	// Handle editor state changes
	const handleEditorStateChange = (newState) => {
		setEditorState(newState);

		if (!readOnly && onChange) {
			const rawContent = convertEditorStateToRaw(newState);
			if (rawContent !== value) {
				onChange(rawContent);
			}
		}
	};

	return {
		editorState,
		setEditorState: handleEditorStateChange,
	};
}

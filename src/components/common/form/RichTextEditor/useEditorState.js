import { useState, useEffect } from "react";
import {
	createEditorStateFromRaw,
	createEditorStateFromText,
	convertEditorStateToRaw,
} from "../../../../utils/editor/editorStateUtils";

export function useEditorState({ value, onChange, readOnly }) {
	const [editorState, setEditorState] = useState(() => createEditorStateFromRaw(value));

	// Update editor state when value prop changes
	useEffect(() => {
		const newEditorState = createEditorStateFromRaw(value);
		setEditorState(newEditorState);
	}, [value]);

	// Handle editor state changes
	const handleEditorStateChange = (newState) => {
		setEditorState(newState);

		if (!readOnly && onChange) {
			const rawContent = convertEditorStateToRaw(newState);
			onChange(rawContent);
		}
	};

	return {
		editorState,
		setEditorState: handleEditorStateChange,
	};
}

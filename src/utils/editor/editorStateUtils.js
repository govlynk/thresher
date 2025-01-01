import { EditorState, convertToRaw, convertFromRaw, ContentState } from "draft-js";

export const createEditorStateFromRaw = (rawContent, previousEditorState = null) => {
	if (!rawContent) return EditorState.createEmpty();

	try {
		// Try parsing as JSON (rich text)
		const contentState = convertFromRaw(JSON.parse(rawContent));
		const newEditorState = EditorState.createWithContent(contentState);

		// If we have a previous editor state, try to preserve selection
		if (previousEditorState) {
			const selection = previousEditorState.getSelection();
			if (selection.getHasFocus()) {
				return EditorState.forceSelection(newEditorState, selection);
			}
		}

		return newEditorState;
	} catch (e) {
		console.warn("Invalid raw content, creating empty editor state:", e);
		return EditorState.createEmpty();
	}
};

export const convertEditorStateToRaw = (editorState) => {
	if (!editorState) return "";

	const contentState = editorState.getCurrentContent();
	return JSON.stringify(convertToRaw(contentState));
};

export const getPlainText = (value) => {
	if (!value) return "";

	try {
		const contentState = convertFromRaw(JSON.parse(value));
		return contentState.getPlainText();
	} catch (e) {
		return String(value || "");
	}
};

export const isEmptyEditorState = (editorState) => {
	if (!editorState) return true;

	const contentState = editorState.getCurrentContent();
	return !contentState.hasText() && contentState.getBlockMap().first().getType() === "unstyled";
};

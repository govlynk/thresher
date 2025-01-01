import { EditorState, convertToRaw, convertFromRaw, ContentState } from "draft-js";

export const createEmptyEditorState = () => {
	return EditorState.createEmpty();
};

export const createEditorStateFromRaw = (rawContent) => {
	if (!rawContent) return createEmptyEditorState();

	try {
		const contentState = convertFromRaw(JSON.parse(rawContent));
		return EditorState.createWithContent(contentState);
	} catch (err) {
		console.warn("Invalid raw content, creating empty editor state:", err);
		return createEmptyEditorState();
	}
};

export const createEditorStateFromText = (text) => {
	if (!text) return createEmptyEditorState();

	const contentState = ContentState.createFromText(String(text));
	return EditorState.createWithContent(contentState);
};

export const convertEditorStateToRaw = (editorState) => {
	if (!editorState) return "";

	const contentState = editorState.getCurrentContent();
	return JSON.stringify(convertToRaw(contentState));
};

export const getPlainTextFromEditorState = (editorState) => {
	if (!editorState) return "";
	return editorState.getCurrentContent().getPlainText();
};

export const isEditorStateEmpty = (editorState) => {
	if (!editorState) return true;

	const contentState = editorState.getCurrentContent();
	return !contentState.hasText() && contentState.getBlockMap().first().getType() === "unstyled";
};

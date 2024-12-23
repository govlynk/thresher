import { convertFromRaw } from "draft-js";

export function getPlainText(rawContent) {
	if (!rawContent) return "";

	try {
		const contentState = convertFromRaw(JSON.parse(rawContent));
		return contentState.getPlainText();
	} catch (e) {
		console.warn("Error converting rich text to plain text:", e);
		return "";
	}
}

export function validateRichText(value, { required, minLength, maxLength } = {}) {
	if (!value && required) {
		return "This field is required";
	}

	const plainText = getPlainText(value);

	if (minLength && plainText.length < minLength) {
		return `Must be at least ${minLength} characters`;
	}

	if (maxLength && plainText.length > maxLength) {
		return `Must be no more than ${maxLength} characters`;
	}

	return null;
}

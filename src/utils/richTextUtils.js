import { convertFromHTML, convertToRaw, ContentState } from 'draft-js';
import { stateToHTML } from 'draft-js-export-html';

export function htmlToEditorState(html) {
  if (!html) return null;
  
  try {
    const blocksFromHTML = convertFromHTML(html);
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    return convertToRaw(contentState);
  } catch (err) {
    console.warn('Error converting HTML to editor state:', err);
    return null;
  }
}

export function editorStateToHtml(editorState) {
  if (!editorState) return '';
  
  try {
    return stateToHTML(editorState.getCurrentContent());
  } catch (err) {
    console.warn('Error converting editor state to HTML:', err);
    return '';
  }
}

export function getPlainText(html) {
  if (!html) return '';
  
  try {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
  } catch (err) {
    console.warn('Error converting HTML to plain text:', err);
    return '';
  }
}

export function validateRichText(value, { required, minLength, maxLength } = {}) {
  if (!value && required) {
    return 'This field is required';
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
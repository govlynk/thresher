import React from 'react';
import { Box, IconButton, Tooltip, Divider } from '@mui/material';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  Heading1,
  Heading2,
  Quote
} from 'lucide-react';

const INLINE_STYLES = [
  { label: 'Bold', style: 'BOLD', icon: Bold },
  { label: 'Italic', style: 'ITALIC', icon: Italic },
];

const BLOCK_TYPES = [
  { label: 'H1', style: 'header-one', icon: Heading1 },
  { label: 'H2', style: 'header-two', icon: Heading2 },
  { label: 'Blockquote', style: 'blockquote', icon: Quote },
  { label: 'UL', style: 'unordered-list-item', icon: List },
  { label: 'OL', style: 'ordered-list-item', icon: ListOrdered },
];

const ALIGNMENT_STYLES = [
  { label: 'Left', style: 'left', icon: AlignLeft },
  { label: 'Center', style: 'center', icon: AlignCenter },
  { label: 'Right', style: 'right', icon: AlignRight },
];

export function EditorToolbar({ onToggle, currentStyle }) {
  const { inline, block } = currentStyle;

  const hasInlineStyle = (style) => {
    return inline ? inline.has(style) : false;
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        gap: 0.5, 
        p: 1, 
        borderBottom: 1, 
        borderColor: 'divider',
        flexWrap: 'wrap'
      }}
    >
      {/* Inline Styles */}
      {INLINE_STYLES.map(({ label, style, icon: Icon }) => (
        <Tooltip key={style} title={label}>
          <IconButton
            size="small"
            onClick={() => onToggle('inline', style)}
            color={hasInlineStyle(style) ? 'primary' : 'default'}
          >
            <Icon size={18} />
          </IconButton>
        </Tooltip>
      ))}

      <Divider orientation="vertical" flexItem />

      {/* Block Types */}
      {BLOCK_TYPES.map(({ label, style, icon: Icon }) => (
        <Tooltip key={style} title={label}>
          <IconButton
            size="small"
            onClick={() => onToggle('block', style)}
            color={block === style ? 'primary' : 'default'}
          >
            <Icon size={18} />
          </IconButton>
        </Tooltip>
      ))}

      <Divider orientation="vertical" flexItem />

      {/* Alignment Styles */}
      {ALIGNMENT_STYLES.map(({ label, style, icon: Icon }) => (
        <Tooltip key={style} title={label}>
          <IconButton
            size="small"
            onClick={() => onToggle('alignment', style)}
            color={block === `text-align-${style}` ? 'primary' : 'default'}
          >
            <Icon size={18} />
          </IconButton>
        </Tooltip>
      ))}
    </Box>
  );
}
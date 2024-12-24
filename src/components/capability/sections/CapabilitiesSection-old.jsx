import React, { useState } from 'react';
import {
  Box,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Button,
  Paper
} from '@mui/material';
import { Plus, X, GripVertical } from 'lucide-react';
import { DndContext, closestCenter } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

function SortableCapability({ capability, onRemove, id }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      sx={{ mb: 1 }}
    >
      <ListItem
        secondaryAction={
          <IconButton edge="end" onClick={onRemove}>
            <X size={18} />
          </IconButton>
        }
      >
        <Box {...attributes} {...listeners} sx={{ cursor: 'grab', mr: 2 }}>
          <GripVertical size={20} />
        </Box>
        <ListItemText primary={capability} />
      </ListItem>
    </Paper>
  );
}

export function CapabilitiesSection({ value = [], onChange }) {
  const [newCapability, setNewCapability] = useState('');

  const handleAdd = () => {
    if (newCapability.trim()) {
      onChange([...value, newCapability.trim()]);
      setNewCapability('');
    }
  };

  const handleRemove = (index) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = value.findIndex(item => item === active.id);
      const newIndex = value.findIndex(item => item === over.id);
      const newItems = [...value];
      newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, value[oldIndex]);
      onChange(newItems);
    }
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Key Capabilities
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        List your company's key capabilities and core competencies.
      </Typography>

      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          value={newCapability}
          onChange={(e) => setNewCapability(e.target.value)}
          placeholder="Enter a key capability"
          onKeyPress={(e) => e.key === 'Enter' && handleAdd()}
        />
        <Button
          startIcon={<Plus size={20} />}
          onClick={handleAdd}
          sx={{ mt: 1 }}
        >
          Add Capability
        </Button>
      </Box>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={value}
          strategy={verticalListSortingStrategy}
        >
          <List>
            {value.map((capability, index) => (
              <SortableCapability
                key={capability}
                id={capability}
                capability={capability}
                onRemove={() => handleRemove(index)}
              />
            ))}
          </List>
        </SortableContext>
      </DndContext>
    </Box>
  );
}
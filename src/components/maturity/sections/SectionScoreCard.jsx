import React from "react";
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, Chip } from "@mui/material";
import { CheckCircle, AlertCircle, AlertTriangle } from "lucide-react";

export function SectionScoreCard({ section }) {
  const getScoreColor = (score) => {
    if (score >= 4) return "success";
    if (score >= 3) return "warning";
    return "error";
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <Typography variant="h6">{section.name}</Typography>
        <Chip
          label={`Score: ${section.score.toFixed(1)}`}
          color={getScoreColor(section.score)}
        />
      </Box>

      <Box sx={{ mb: 2 }}>
        <Typography variant="subtitle2" color="text.secondary" gutterBottom>
          Strengths
        </Typography>
        <List dense>
          {section.summary.strengths.map((strength, index) => (
            <ListItem key={index}>
              <ListItemIcon sx={{ minWidth: 36 }}>
                <CheckCircle size={18} color="success" />
              </ListItemIcon>
              <ListItemText primary={strength} />
            </ListItem>
          ))}
        </List>
      </Box>

      {section.summary.weaknesses.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Areas for Improvement
          </Typography>
          <List dense>
            {section.summary.weaknesses.map((weakness, index) => (
              <ListItem key={index}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <AlertTriangle size={18} color="error" />
                </ListItemIcon>
                <ListItemText primary={weakness} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}

      {section.summary.recommendations.length > 0 && (
        <Box>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Recommendations
          </Typography>
          <List dense>
            {section.summary.recommendations.map((recommendation, index) => (
              <ListItem key={index}>
                <ListItemIcon sx={{ minWidth: 36 }}>
                  <AlertCircle size={18} color="info" />
                </ListItemIcon>
                <ListItemText primary={recommendation} />
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Paper>
  );
}
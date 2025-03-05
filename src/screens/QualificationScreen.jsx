import React from "react";
import { Container, Box, Typography, Alert, CircularProgress } from "@mui/material";
import { useQualificationStore } from "../stores/qualificationStore";
import { useGlobalStore } from "../stores/globalStore";
import { QualificationForm } from "../components/qualification/QualificationForm";

function QualificationScreen() {
  const { activeCompanyId } = useGlobalStore();
  const { qualification, loading, error, fetchQualification } = useQualificationStore();

  React.useEffect(() => {
    if (activeCompanyId) {
      fetchQualification(activeCompanyId);
    }
  }, [activeCompanyId, fetchQualification]);

  if (!activeCompanyId) {
    return (
      <Container>
        <Box sx={{ p: 3 }}>
          <Alert severity="warning">Please select a company to view qualification assessment</Alert>
        </Box>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <Container maxWidth={false} disableGutters>
      <Box sx={{ p: 2, width: "100%" }}>
        <Typography variant="h4" gutterBottom>
          Qualification Assessment
        </Typography>
        <QualificationForm />
      </Box>
    </Container>
  );
}

export default QualificationScreen;
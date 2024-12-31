import React from 'react';
import { Box, Container } from '@mui/material';
import { FormController } from '../common/form/FormController';
import { questions } from './questions';
import { questionInfo } from './questionInfo';
import { useMaturityStore } from '../../stores/maturityStore';
import { useGlobalStore } from '../../stores/globalStore';
import { useFormAutosave } from '../common/form/useFormAutosave';

export function MaturityAssessmentForm() {
  const { assessment, saveAssessment, loading, error } = useMaturityStore();
  const { activeCompanyId } = useGlobalStore();

  // Enable autosave
  useFormAutosave({
    formData: assessment?.answers || {},
    onSave: saveAssessment
  });

  const handleSubmit = async (formData) => {
    if (!activeCompanyId) {
      throw new Error('No active company selected');
    }

    await saveAssessment({
      companyId: activeCompanyId,
      answers: formData,
      status: 'COMPLETED',
      completedAt: new Date().toISOString()
    });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <FormController
          steps={questions}
          initialData={assessment?.answers || {}}
          onSubmit={handleSubmit}
          onSave={saveAssessment}
          loading={loading}
          error={error}
          questionInfo={questionInfo}
        />
      </Box>
    </Container>
  );
}
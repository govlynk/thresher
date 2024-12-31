import { create } from 'zustand';
import { generateClient } from 'aws-amplify/data';

const client = generateClient();

export const useMaturityStore = create((set, get) => ({
  assessment: null,
  history: [],
  loading: false,
  error: null,

  fetchAssessment: async (companyId) => {
    set({ loading: true, error: null });
    try {
      const response = await client.models.MaturityAssessment.list({
        filter: { companyId: { eq: companyId } },
        sort: { field: 'createdAt', direction: 'DESC' },
        limit: 1
      });

      set({
        assessment: response?.data?.[0] || null,
        loading: false,
        error: null
      });
    } catch (err) {
      console.error('Error fetching assessment:', err);
      set({ error: err.message, loading: false });
    }
  },

  saveAssessment: async (data) => {
    set({ loading: true, error: null });
    try {
      const currentAssessment = get().assessment;
      const timestamp = new Date().toISOString();

      // Save current version to history if it exists
      if (currentAssessment) {
        await client.models.MaturityAssessmentHistory.create({
          ...currentAssessment,
          assessmentId: currentAssessment.id,
          modifiedAt: timestamp
        });

        // Update existing assessment
        const response = await client.models.MaturityAssessment.update({
          id: currentAssessment.id,
          ...data,
          lastModified: timestamp
        });

        set({
          assessment: response.data,
          loading: false,
          error: null
        });
      } else {
        // Create new assessment
        const response = await client.models.MaturityAssessment.create({
          ...data,
          lastModified: timestamp
        });

        set({
          assessment: response.data,
          loading: false,
          error: null
        });
      }
    } catch (err) {
      console.error('Error saving assessment:', err);
      set({ error: err.message, loading: false });
      throw err;
    }
  },

  fetchHistory: async () => {
    const assessment = get().assessment;
    if (!assessment?.id) return;

    set({ loading: true });
    try {
      const response = await client.models.MaturityAssessmentHistory.list({
        filter: { assessmentId: { eq: assessment.id } },
        sort: { field: 'modifiedAt', direction: 'DESC' }
      });

      set({
        history: response?.data || [],
        loading: false,
        error: null
      });
    } catch (err) {
      console.error('Error fetching history:', err);
      set({ error: err.message, loading: false });
    }
  },

  calculateMaturityScore: (answers) => {
    if (!answers) return null;

    const dimensions = {
      compliance: ['farCompliance', 'supplyChainSecurity', 'taaCompliance'],
      marketReadiness: ['federalPresence', 'targetAgencies'],
      financialHealth: ['revenueMetrics', 'contractCapacity'],
      operationalExcellence: ['qualityManagement', 'deliveryCapabilities'],
      businessDevelopment: ['marketingStrategy', 'pipelineManagement'],
      technicalInfrastructure: ['cybersecurity', 'systemsCompliance']
    };

    const scores = {};
    let totalScore = 0;
    let totalWeight = 0;

    // Calculate score for each dimension
    Object.entries(dimensions).forEach(([dimension, questions]) => {
      let dimensionScore = 0;
      let dimensionWeight = questions.length;

      questions.forEach(questionId => {
        const answer = answers[questionId];
        if (!answer) return;

        // Calculate question score based on question type
        let questionScore = 0;
        if (Array.isArray(answer)) {
          questionScore = answer.length / 5; // Normalize to 0-1 scale
        } else if (typeof answer === 'number') {
          questionScore = answer / 5; // Assuming 5-point scale
        } else if (typeof answer === 'object' && answer.agreed) {
          questionScore = 1;
        }

        dimensionScore += questionScore;
      });

      scores[dimension] = dimensionScore / dimensionWeight;
      totalScore += scores[dimension];
      totalWeight += 1;
    });

    return {
      overall: totalScore / totalWeight,
      dimensions: scores
    };
  }
}));
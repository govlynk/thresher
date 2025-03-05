import { create } from "zustand";
import { generateClient } from "aws-amplify/data";
import { processQualificationData } from "../utils/qualification/dataProcessing";

const client = generateClient();

export const useQualificationStore = create((set, get) => ({
  qualification: null,
  qualifications: [],
  processedData: null,
  loading: false,
  error: null,

  fetchQualification: async (companyId) => {
    if (!companyId) {
      throw new Error("Company ID is required");
    }

    set({ loading: true, error: null });
    try {
      const response = await client.models.Qualification.list({
        filter: { companyId: { eq: companyId } },
        sort: { field: "createdAt", direction: "DESC" },
      });

      const qualifications = response?.data || [];
      const latestQualification = qualifications[0] || null;

      let processedData = null;
      if (latestQualification?.answers) {
        try {
          const answers = JSON.parse(latestQualification.answers);
          processedData = latestQualification.qualificationScore
            ? JSON.parse(latestQualification.qualificationScore)
            : processQualificationData(answers);
        } catch (err) {
          console.error("Error parsing qualification data:", err);
        }
      }

      set({
        qualifications,
        qualification: latestQualification,
        processedData,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Error fetching qualification:", err);
      set({ error: err.message, loading: false });
    }
  },

  saveQualification: async (data) => {
    if (!data.companyId) {
      throw new Error("Company ID is required");
    }

    set({ loading: true, error: null });
    try {
      const timestamp = new Date().toISOString();
      const answers = JSON.stringify(data.answers);
      const processedData = processQualificationData(data.answers);

      const qualificationData = {
        companyId: data.companyId,
        title: data.title || `Qualification Assessment - ${new Date().toLocaleDateString()}`,
        answers,
        qualificationScore: JSON.stringify(processedData),
        status: data.status || "IN_PROGRESS",
        completedAt: data.completedAt || null,
        lastModified: timestamp,
      };

      const response = await client.models.Qualification.create(qualificationData);

      set((state) => ({
        qualification: response.data,
        qualifications: [response.data, ...state.qualifications],
        processedData,
        loading: false,
        error: null,
      }));

      return response.data;
    } catch (err) {
      console.error("Error saving qualification:", err);
      set({
        error: err.message || "Failed to save qualification",
        loading: false,
      });
      throw err;
    }
  },

  selectQualification: (qualificationId) => {
    const { qualifications } = get();
    const selectedQualification = qualifications.find((q) => q.id === qualificationId);

    if (selectedQualification) {
      try {
        const answers = JSON.parse(selectedQualification.answers);
        const processedData = selectedQualification.qualificationScore
          ? JSON.parse(selectedQualification.qualificationScore)
          : processQualificationData(answers);

        set({
          qualification: selectedQualification,
          processedData,
        });
      } catch (err) {
        console.error("Error processing qualification data:", err);
        set({
          error: "Failed to process qualification data",
          qualification: selectedQualification,
          processedData: null,
        });
      }
    }
  },

  reset: () => {
    set({
      qualification: null,
      qualifications: [],
      processedData: null,
      loading: false,
      error: null,
    });
  },
}));
import { QUESTION_TYPES } from "../common/form/questionTypes";

export const questions = [
  {
    id: "technicalCapability",
    title: "Technical Capability",
    type: QUESTION_TYPES.SECTION,
    questions: [
      {
        id: "technicalExperience",
        title: "Technical Experience",
        type: QUESTION_TYPES.LIKERT,
        required: true,
        info: true,
        scale: ["No Experience", "Basic", "Intermediate", "Advanced", "Expert"],
        statements: [
          "Experience with required technologies",
          "Similar project experience",
          "Technical certifications",
          "Industry standards compliance",
        ],
      },
      {
        id: "staffingCapability",
        title: "Staffing Capability",
        type: QUESTION_TYPES.LIKERT,
        required: true,
        info: true,
        scale: ["Inadequate", "Basic", "Adequate", "Strong", "Exceptional"],
        statements: [
          "Available qualified staff",
          "Staff certifications",
          "Staff experience level",
          "Backup personnel availability",
        ],
      },
    ],
  },
  {
    id: "pastPerformance",
    title: "Past Performance",
    type: QUESTION_TYPES.SECTION,
    questions: [
      {
        id: "contractPerformance",
        title: "Contract Performance History",
        type: QUESTION_TYPES.LIKERT,
        required: true,
        info: true,
        scale: ["Poor", "Fair", "Good", "Very Good", "Excellent"],
        statements: [
          "On-time delivery record",
          "Quality of deliverables",
          "Customer satisfaction",
          "Cost control performance",
        ],
      },
    ],
  },
  {
    id: "managementApproach",
    title: "Management Approach",
    type: QUESTION_TYPES.SECTION,
    questions: [
      {
        id: "projectManagement",
        title: "Project Management Capabilities",
        type: QUESTION_TYPES.LIKERT,
        required: true,
        info: true,
        scale: ["None", "Basic", "Established", "Advanced", "Optimized"],
        statements: [
          "Project management methodology",
          "Risk management approach",
          "Quality control procedures",
          "Communication protocols",
        ],
      },
    ],
  },
];
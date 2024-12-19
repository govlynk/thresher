import { getDateRange } from './dateUtils';

/**
 * Generate base filters used across multiple queries
 */
export const getBaseFilters = (naicsCodes) => {
  const { startDate, endDate } = getDateRange();
  
  return {
    time_period: [{ start_date: startDate, end_date: endDate }],
    award_type_codes: ["A", "B", "C", "D"],
    naics_codes: naicsCodes
  };
};

/**
 * Common fields requested for awards
 */
export const AWARD_FIELDS = [
  "Award ID",
  "Recipient Name", 
  "Description",
  "Start Date",
  "End Date",
  "Award Amount",
  "Awarding Agency",
  "Awarding Sub Agency",
  "NAICS Code",
  "NAICS Description"
];
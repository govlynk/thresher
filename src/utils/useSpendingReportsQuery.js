import { useQuery } from "@tanstack/react-query";
import { getNaicsSpending } from "./spending/queries/naicsSpending";
import { getAgencySpending } from "./spending/queries/agencySpending";
import { getGeographicSpending } from "./spending/queries/geographicSpending";

const getDateRange = () => {
  const date = new Date();
  const endDate = date.toISOString().split("T")[0];
  const startDate = new Date(date.setFullYear(date.getFullYear() - 1)).toISOString().split("T")[0];
  return { startDate, endDate };
};

export function useSpendingReportsQuery(company) {
  return useQuery({
    queryKey: ["spendingReports", company?.naicsCode],
    queryFn: async () => {
      if (!company) {
        throw new Error("Company data is required");
      }

      if (!Array.isArray(company.naicsCode) || company.naicsCode.length === 0) {
        throw new Error("Company must have at least one NAICS code");
      }

      const { startDate, endDate } = getDateRange();
      const baseFilters = {
        time_period: [{ start_date: startDate, end_date: endDate }],
        award_type_codes: ["A", "B", "C", "D"],
        naics_codes: company.naicsCode,
      };

      try {
        console.log("[USASpending API] Starting queries with filters:", baseFilters);

        const [naicsSpending, agencySpending, geographicSpending] = await Promise.all([
          getNaicsSpending(baseFilters),
          getAgencySpending(baseFilters),
          getGeographicSpending(baseFilters),
        ]);

        return {
          naicsSpending,
          agencySpending,
          geographicSpending,
        };
      } catch (error) {
        console.error("[USASpending API] Query Execution Error:", error);
        throw new Error(
          error.response?.data?.detail || 
          error.response?.data?.message || 
          error.message || 
          "Failed to fetch spending reports"
        );
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes
    retry: 2,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    enabled: Boolean(company?.naicsCode?.length),
  });
}
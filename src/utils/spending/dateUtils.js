/**
 * Get date range for spending queries
 * @returns {Object} Object containing start and end dates
 */
export const getDateRange = () => {
  const date = new Date();
  const endDate = date.toISOString().split('T')[0];
  const startDate = new Date(date.setFullYear(date.getFullYear() - 1))
    .toISOString()
    .split('T')[0];
  
  console.log('Date range:', { startDate, endDate });
  return { startDate, endDate };
};
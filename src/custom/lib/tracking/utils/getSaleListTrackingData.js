import getSaleTrackingData from "./getSaleTrackingData";

/**
 * Transform a list of sales into data for tracking with the Segment Sale List Viewed event
 * @name getSaleListTrackingData
 * @param {Object} data Object containing data for tracking a list of sales
 * @param {Array} data.sales An array of sale documents
 * @returns {Object} Data for tracking
 */
export default function getSaleListTrackingData({ sales }) {
  const data = {};

  if (Array.isArray(sales) && sales.length) {
    data.sales = sales.map((sale) => getSaleTrackingData(sale));
  }

  return data;
}

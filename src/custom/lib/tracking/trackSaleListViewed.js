import track from "lib/tracking/track";
import getSaleListTrackingData from "./utils/getSaleListTrackingData";

/**
 * trackSaleListViewed higher tracks a list of viewed sales
 * @name trackSaleListViewed
 * @param {Object} options options to supply to tracking HOC
 * @returns {React.Component} - component
 */
export default (options) => track(({ tag, catalogItems }) => {
  const sales = (Array.isArray(catalogItems) && catalogItems.map((catalogItem) => catalogItem.node.sale)) || undefined;
  return {
    action: "Sale List Viewed",
    ...getSaleListTrackingData({ tag, sales })
  };
}, {
  ...options
});

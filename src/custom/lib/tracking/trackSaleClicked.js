import track from "lib/tracking/track";
import getSaleTrackingData from "./utils/getSaleTrackingData";

/**
 * @name trackSaleClicked
 * @summary tracks the "Sale Clicked" Segment event. Expects the function it decorates to have a second argument,
 *  being the sale that was clicked
 * @param {Object} options options to supply to tracking HOC
 * @returns {React.Component} - component
 */
export default (options) => (
  track((props, state, methodArgs) => {
    let data = {};

    const sale = methodArgs && methodArgs[1];

    // If sale data is provided as a prop, then process the data for tracking
    if (sale) {
      data = {
        action: "Sale Clicked",
        ...getSaleTrackingData(sale)
      };
    }

    return data;
  }, options)
);

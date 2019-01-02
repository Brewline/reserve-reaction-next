import routes from "routes";

/**
 * Transform a sale object into a partial representation of the Segment sale schema.
 * @name getSaleTrackingData
 * @param {Object} sale Sale object
 * @returns {Object} Data for tracking
 */
export default function getSaleTrackingData(sale) {
  let currency;
  let price;
  let url;

  if (sale) {
    if (sale.shop) {
      const shopCurrency = sale.shop.currency.code;
      const foundPricing = sale.pricing.find((pricing) => pricing.currency.code === shopCurrency);

      if (foundPricing) {
        price = foundPricing.price || foundPricing.minPrice; // eslint-disable-line prefer-destructuring
      }

      if (sale.shop.currency) {
        currency = sale.shop.currency.code;
      }
    }

    const route = routes.findAndGetUrls("sale", { slugOrId: sale.slug || sale._id });

    if (route && route.urls) {
      url = route.urls.as;
    }
  }

  return {
    sale_id: sale._id, // eslint-disable-line camelcase
    name: sale.headline,
    // brand: sale.vendor,
    currency,
    price,
    quantity: 1,
    value: price,
    image_url: sale.primaryImage && sale.primaryImage.URLs.original, // eslint-disable-line camelcase
    url
  };
}

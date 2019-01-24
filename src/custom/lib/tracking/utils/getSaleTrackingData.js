import routes from "routes";

/**
 * Transform a sale object into a partial representation of the Segment sale schema.
 * @name getSaleTrackingData
 * @param {Object} sale Sale object
 * @returns {Object} Data for tracking
 */
export default function getSaleTrackingData(sale) {
  let url;
  const {
    _id: saleId,
    headline: name,
    shop: { name: brand } = {},
    slug
  } = sale || {};

  if (sale) {
    const route = routes.findAndGetUrls("sale", { slugOrId: slug || saleId });

    if (route && route.urls) {
      url = route.urls.as;
    }
  }

  return {
    sale_id: saleId, // eslint-disable-line camelcase
    name,
    brand,
    // image_url: sale.primaryImage && sale.primaryImage.URLs.original, // eslint-disable-line camelcase
    url
  };
}

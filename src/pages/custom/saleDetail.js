import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import withCart from "containers/cart/withCart";
import PageLoading from "components/PageLoading";
import { SaleDetail } from "custom/components/SaleDetail";
import withSale from "custom/containers/sales/withSale";
import ErrorPage from "../_error";

@withCart
@withSale
class SaleDetailPage extends Component {
  static propTypes = {
    /**
     * Function to add items to a cart, usually using the addItemsToCart from
     * @withCart decorator.
     *
     * @example addItemsToCart(CartItemInput)
     * @type function
     */
    addItemsToCart: PropTypes.func,
    initialGridSize: PropTypes.object,
    isLoadingSale: PropTypes.bool,
    sale: PropTypes.object,
    shop: PropTypes.shape({
      name: PropTypes.string.isRequired,
      currency: PropTypes.shape({
        code: PropTypes.string.isRequired
      })
    })
  };

  static async getInitialProps({ req }) {
    // It is not perfect, but the only way we can guess at the screen width of
    // the requesting device is to parse the `user-agent` header it sends.
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    const width = (userAgent && userAgent.indexOf("Mobi")) > -1 ? 320 : 1024;

    return { initialGridSize: { width } };
  }

  /**
   *
   * @name buildJSONLd
   * @summary Builds a JSONLd object from sale properties.
   * @return {String} Stringified sale jsonld
   */
  buildJSONLd() {
    const { sale, shop } = this.props;

    if (!sale || !shop) return "";

    return "";

    // const currencyCode = shop.currency.code || "USD";
    // const priceData = sale.pricing[0];
    // const images = sale.media.map((image) => image.URLs.original);

    // let saleAvailability = "http://schema.org/InStock";
    // if (sale.isLowQuantity) {
    //   saleAvailability = "http://schema.org/LimitedAvailability";
    // }
    // if (sale.isBackorder && sale.isSoldOut) {
    //   saleAvailability = "http://schema.org/PreOrder";
    // }
    // if (!sale.isBackorder && sale.isSoldOut) {
    //   saleAvailability = "http://schema.org/SoldOut";
    // }

    // // Recommended data from https://developers.google.com/search/docs/data-types/sale
    // const saleJSON = {
    //   "@context": "http://schema.org/",
    //   "@type": "Sale",
    //   "brand": sale.vendor,
    //   "description": sale.description,
    //   // "image": images, // TODO
    //   "name": sale.headline,
    //   "offers": {
    //     "@type": "Offer",
    //     "priceCurrency": currencyCode,
    //     "price": priceData.minPrice,
    //     "availability": saleAvailability,
    //     "seller": {
    //       "@type": "Organization",
    //       "name": shop.name
    //     }
    //   }
    // };

    // return JSON.stringify(saleJSON);
  }

  renderMainArea() {
    const { addItemsToCart, isLoadingSale, sale, shop } = this.props;
    const currencyCode = (shop && shop.currency.code) || "USD";

    if (isLoadingSale) return <PageLoading />;

    if (!sale) return <ErrorPage shop={shop} subtitle="Not Found" />;

    return (
      <SaleDetail
        addItemsToCart={addItemsToCart}
        currencyCode={currencyCode}
        sale={sale}
        shop={shop}
      />
    );
  }

  render() {
    const { sale, shop } = this.props;

    return (
      <Fragment>
        <Helmet
          title={`${sale && sale.headline} | ${shop && shop.name}`}
          meta={[{ name: "description", content: sale && sale.description }]}
          script={[{ type: "application/ld+json", innerHTML: this.buildJSONLd() }]}
        />
        {this.renderMainArea()}
      </Fragment>
    );
  }
}

export default SaleDetailPage;

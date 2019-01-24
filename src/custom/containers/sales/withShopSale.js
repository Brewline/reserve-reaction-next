import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import hoistNonReactStatic from "hoist-non-react-statics";
import shopSaleQuery from "./shopSale.gql";

/**
 * withSale higher order query component for fetching primaryShopId and catalog data
 * @name withSale
 * @param {React.Component} Component to decorate and apply
 * @returns {React.Component} - component decorated with primaryShopId and catalog as props
 */
export default function withShopSale(Component) {
  class ShopSale extends React.Component {
    static propTypes = {
      router: PropTypes.object.isRequired
    };

    areImagesLoaded(sale) {
      const { products = [] } = sale || {};
      return products.every((product) => {
        if (!product) { return false; }

        const { primaryImage } = product;

        if (!primaryImage) { return false; }

        const { URLs } = primaryImage;

        if (!URLs) { return false; }

        const { large } = URLs;

        return !!large && large !== "null";
      });
    }

    render() {
      const {
        router: {
          query: {
            shopSlugOrId,
            saleSlugOrId,
            _poll: shouldPollForImages
          }
        }
      } = this.props;

      return (
        <Query
          /* doesn't seem to work pollInterval={1000} */
          query={shopSaleQuery}
          variables={{ shopSlugOrId, saleSlugOrId }}
        >
          {({ data, loading, startPolling, stopPolling }) => {
            const { shopSale } = data || {};

            if (this.areImagesLoaded(shopSale)) {
              stopPolling();
            } else if (shouldPollForImages) {
              // TODO: prevent polling restart
              startPolling(2500);
            }

            return (
              <Component
                {...this.props}
                sale={shopSale}
                isLoadingSale={loading}
              />
            );
          }}
        </Query>
      );
    }
  }

  hoistNonReactStatic(ShopSale, Component);

  return ShopSale;
}

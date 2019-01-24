import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import hoistNonReactStatic from "hoist-non-react-statics";
import shopSalesQuery from "./shopSales.gql";

/**
 * withSale higher order query component for fetching primaryShopId and catalog data
 * @name withSale
 * @param {React.Component} Component to decorate and apply
 * @returns {React.Component} - component decorated with primaryShopId and catalog as props
 */
export default function withShopSales(Component) {
  class ShopSales extends React.Component {
    static propTypes = {
      router: PropTypes.object.isRequired
    };

    render() {
      const { router: { query: { shopSlugOrId } } } = this.props;

      return (
        <Query query={shopSalesQuery} variables={{ shopSlugOrId }}>
          {({ data, loading }) => {
            const { shopSales } = data || {};

            return (
              <Component
                {...this.props}
                sales={shopSales}
                isLoadingSale={loading}
              />
            );
          }}
        </Query>
      );
    }
  }

  hoistNonReactStatic(ShopSales, Component);

  return ShopSales;
}

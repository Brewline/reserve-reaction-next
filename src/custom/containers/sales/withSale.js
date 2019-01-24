import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import hoistNonReactStatic from "hoist-non-react-statics";
import saleQuery from "./sale.gql";

/**
 * withSale higher order query component for fetching primaryShopId and catalog data
 * @name withSale
 * @param {React.Component} Component to decorate and apply
 * @returns {React.Component} - component decorated with primaryShopId and catalog as props
 */
export default function withSale(Component) {
  class Sale extends React.Component {
    static propTypes = {
      router: PropTypes.object.isRequired
    };

    render() {
      const variables = {};
      const { router: { query } } = this.props;

      if (("shopSlugOrId" in query) && ("saleSlugOrId" in query)) {
        // shopSaleDetail-style
        variables.shopSlugOrId = query.shopSlugOrId;
        variables.saleSlugOrId = query.saleSlugOrId;
      } else {
        // standard-style
        variables.slugOrId = query.slugOrId;
      }

      return (
        <Query query={saleQuery} variables={variables}>
          {({ data, loading }) => {
            const { sale } = data || {};

            return (
              <Component
                {...this.props}
                sale={sale}
                isLoadingSale={loading}
              />
            );
          }}
        </Query>
      );
    }
  }

  hoistNonReactStatic(Sale, Component);

  return Sale;
}

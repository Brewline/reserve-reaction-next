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
      const { router: { query } } = this.props;

      return (
        <Query query={saleQuery} variables={{ slugOrId: query.slugOrId }}>
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

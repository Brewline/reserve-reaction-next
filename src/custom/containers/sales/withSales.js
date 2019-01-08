import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { Query } from "react-apollo";
import hoistNonReactStatic from "hoist-non-react-statics";
import { pagination, paginationVariablesFromUrlParams } from "lib/utils/pagination";
import salesQuery from "./sales.gql";

/**
 * withSales higher order query component for fetching primaryShopId and catalog data
 * @name withSales
 * @param {React.Component} Component to decorate and apply
 * @returns {React.Component} - component decorated with primaryShopId and catalog as props
 */
export default function withSales(Component) {
  @inject("routingStore", "uiStore")
  @observer
  class Sales extends React.Component {
    static propTypes = {
      routingStore: PropTypes.object.isRequired,
      uiStore: PropTypes.object.isRequired
    };

    render() {
      const { routingStore, uiStore } = this.props;
      const [sortBy, sortOrder] = uiStore.salesSortBy.split("-");
      const variables = {
        ...paginationVariablesFromUrlParams(routingStore.query, { defaultPageLimit: uiStore.pageSize }),
        sortBy,
        sortOrder
      };

      return (
        <Query query={salesQuery} variables={variables}>
          {({ data, fetchMore, loading }) => {
            const { sales } = data || {};

            return (
              <Component
                {...this.props}
                salesPageInfo={pagination({
                  fetchMore,
                  routingStore,
                  data,
                  queryName: "sales",
                  limit: uiStore.pageSize
                })}
                sales={(sales && sales.edges) || []}
                isLoadingSales={loading}
              />
            );
          }}
        </Query>
      );
    }
  }

  hoistNonReactStatic(Sales, Component);

  return Sales;
}

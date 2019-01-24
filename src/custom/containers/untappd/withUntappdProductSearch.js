import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import hoistNonReactStatic from "hoist-non-react-statics";
import productsQuery from "./products.gql";

/**
 * withUntappdProductSearch higher order query component for fetching Untappd product search results
 * @name withUntappdProductSearch
 * @param {React.Component} Component to decorate and apply
 * @returns {React.Component} - component decorated with onBeerSearch, isSearchingBeer, beerSearchResults,
 */
export default function withUntappdProductSearch(Component) {
  class UntappdProductSearch extends React.Component {
    static propTypes = {
      router: PropTypes.object.isRequired
    };

    state = {
      query: "",
      limit: 10,
      offset: 0
    };

    handleBeerSearch = (query, limit = this.state.limit, offset = this.state.offset) => {
      this.setState({ query, limit, offset });
    }

    render() {
      const { query, limit, offset } = this.state;
      const shouldSkip = !query || query.length < 3;

      return (
        <Query
          query={productsQuery}
          variables={{ q: query, limit, offset }}
          skip={shouldSkip}
        >
          {(apolloParams) => {
            const { data, loading } = apolloParams;
            const {
              untappdProducts: { beers: { items } = {} } = {}
            } = data || {};

            return (
              <Component
                {...this.props}
                beerSearchResults={items}
                isSearchingBeer={!shouldSkip && loading}
                onBeerSearch={this.handleBeerSearch}
              />
            );
          }}
        </Query>
      );
    }
  }

  hoistNonReactStatic(UntappdProductSearch, Component);

  return UntappdProductSearch;
}

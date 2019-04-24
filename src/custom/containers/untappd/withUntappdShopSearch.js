import React from "react";
import { Query } from "react-apollo";
import hoistNonReactStatic from "hoist-non-react-statics";
import shopsQuery from "./shops.gql";

/**
 * withUntappdShopSearch higher order query component for fetching Untappd shop search results
 * @name withUntappdShopSearch
 * @param {React.Component} Component to decorate and apply
 * @returns {React.Component} - component decorated with onBeerSearch, isSearchingBeer, beerSearchResults,
 */
export default function withUntappdShopSearch(Component) {
  class UntappdShopSearch extends React.Component {
    state = {
      query: "",
      limit: 10,
      offset: 0
    };

    handleBrewerySearch = (query, limit = this.state.limit, offset = this.state.offset) => {
      this.setState({ query, limit, offset });
    }

    render() {
      const { query, limit, offset } = this.state;
      const shouldSkip = !query || query.length < 3;

      return (
        <Query
          query={shopsQuery}
          variables={{ q: query, limit, offset }}
          skip={shouldSkip}
        >
          {(apolloParams) => {
            const { data, loading } = apolloParams;
            const {
              untappdShops: { brewery: { items } = {} } = {}
            } = data || {};

            return (
              <Component
                {...this.props}
                brewerySearchResults={items}
                isSearchingBrewery={!shouldSkip && loading}
                onBrewerySearch={this.handleBrewerySearch}
              />
            );
          }}
        </Query>
      );
    }
  }

  hoistNonReactStatic(UntappdShopSearch, Component);

  return UntappdShopSearch;
}

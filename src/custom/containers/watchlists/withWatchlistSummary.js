import React from "react";
import PropTypes from "prop-types";
import { Query } from "react-apollo";
import hoistNonReactStatic from "hoist-non-react-statics";
// import { loadMore } from "/imports/plugins/core/graphql/lib/helpers/pagination";
import withWatchlistMutation from "./withWatchlistMutation";
import watchlistSummaryQuery from "./watchlistSummary.gql";

const loadMore = ({ queryName, fetchMore, pageInfo }, callback) => {
  fetchMore({
    variables: {
      itemsAfterCursor: (pageInfo && pageInfo.endCursor) || null
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      // TODO: No guarantee this works! (copied from reaction)
      const { [queryName]: items } = fetchMoreResult;

      if (callback) {
        callback();
      }

      // Return with additional results
      if (items.edges.length) {
        const edges = [
          ...previousResult[queryName].edges,
          ...fetchMoreResult[queryName].edges
        ];
        return {
          [queryName]: {
            __typename: previousResult[queryName].__typename,
            edges,
            pageInfo: fetchMoreResult[queryName].pageInfo,
            totalCount: fetchMoreResult[queryName].totalCount
          }
        };
      }

      // Send the previous result if the new result contains no additional data
      return previousResult;
    }
  });
};

/**
 * withUntappdProductSearch higher order query component for fetching Untappd product search results
 * @name withUntappdProductSearch
 * @param {React.Component} UnderlyingComponent to decorate and apply
 * @returns {React.Component} - component decorated with props used to search
 * and refetch watchlist summary data
 */
export default function withWatchlistSummary(UnderlyingComponent) {
  const Component = withWatchlistMutation(UnderlyingComponent);

  class WatchlistSummary extends React.Component {
    static propTypes = {
      watchlistName: PropTypes.string.isRequired
    };

    render() {
      const { watchlistName } = this.props;

      return (
        <Query
          query={watchlistSummaryQuery}
          variables={{ name: watchlistName }}
        >
          {(apolloParams) => {
            const {
              data: { watchlist: watchlistResult } = {},
              loading,
              fetchMore,
              refetch
            } = apolloParams;

            const props = {
              ...this.props,
              watchlist: watchlistResult,
              isLoading: loading
            };

            const { pageInfo } = watchlistResult.summary;
            if (pageInfo) {
              const { hasNextPage } = pageInfo;
              props.hasMoreResults = hasNextPage;
              props.loadMoreResults = (callback) => {
                loadMore({
                  queryName: "watchlistSummary",
                  fetchMore,
                  pageInfo,
                  limit: 10 // TODO: make this a prop
                }, callback);
              };
            }
            props.refetchResults = refetch; // mostly for debugging
            props.onMutationComplete = refetch;

            return <Component {...props} />;
          }}
        </Query>
      );
    }
  }

  hoistNonReactStatic(WatchlistSummary, Component);

  return WatchlistSummary;
}

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
      after: (pageInfo && pageInfo.endCursor) || null
    },
    updateQuery: (previousResult, { fetchMoreResult }) => {
      const { [queryName]: { summary } } = fetchMoreResult;
      const {
        [queryName]: { summary: previousSummary, ...previousResultData }
      } = previousResult;

      if (callback) {
        callback();
      }

      // Return with additional results
      if (summary.nodes.length) {
        const nodes = [
          ...previousSummary.nodes,
          ...summary.nodes
        ];
        return {
          [queryName]: {
            ...previousResultData,
            summary: {
              __typename: previousSummary.__typename,
              nodes,
              pageInfo: summary.pageInfo,
              totalCount: summary.totalCount
            }
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
      resultsPageSize: PropTypes.int,
      watchlistName: PropTypes.string.isRequired
    };

    static defaultProps = {
      resultsPageSize: 5
    };

    render() {
      const { resultsPageSize, watchlistName } = this.props;

      return (
        <Query
          query={watchlistSummaryQuery}
          variables={{ name: watchlistName, first: resultsPageSize }}
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
              props.hasMoreSummaryResults = hasNextPage;
              props.loadMoreSummaryResults = (callback) => {
                loadMore({
                  queryName: "watchlist",
                  fetchMore,
                  pageInfo,
                  limit: resultsPageSize
                }, callback);
              };
            }
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

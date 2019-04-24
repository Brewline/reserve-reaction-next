import React from "react";
import PropTypes from "prop-types";
import hoistNonReactStatic from "hoist-non-react-statics";
import { Query } from "react-apollo";
import watchlistUserItems from "./watchlistUserItems.gql";

export default function withWatchlistUserItems(Component) {
  class WatchlistUserItems extends React.Component {
    static propTypes = {
      client: PropTypes.shape({
        query: PropTypes.func.isRequired
      }),
      watchlistName: PropTypes.string.isRequired
    };

    render() {
      const { watchlistName } = this.props;

      return (
        <Query
          query={watchlistUserItems}
          ssr={false}
          variables={{ name: watchlistName }}
        >
          {(apolloParams) => {
            const {
              data: { watchlistUserItems: results = {} } = {},
              loading = true,
              // fetchMore,
              refetch
            } = apolloParams;

            const { nodes = [] } = results;

            const props = {
              ...this.props,
              watchlistUserItems: nodes,
              isLoading: loading
            };

            const { pageInfo } = results;
            if (pageInfo) {
              const { hasNextPage } = pageInfo;
              props.hasMoreResults = hasNextPage;
              // props.loadMoreResults = (callback) => {
              //   loadMore({
              //     queryName: "watchlistSummary",
              //     fetchMore,
              //     pageInfo,
              //     limit: 10 // TODO: make this a prop
              //   }, callback);
              // };
            }
            props.refetchResults = refetch; // mostly for debugging
            props.onMutationComplete = refetch;

            return <Component {...props} />;
          }}
        </Query>
      );
    }
  }

  hoistNonReactStatic(WatchlistUserItems, Component);

  return WatchlistUserItems;
}

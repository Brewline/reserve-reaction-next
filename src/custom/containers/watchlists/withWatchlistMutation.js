import React from "react";
import PropTypes from "prop-types";
import { reject } from "lodash";
import hoistNonReactStatic from "hoist-non-react-statics";
import { withApollo } from "react-apollo";
import { observer } from "mobx-react";
import createWatchlistItem from "./createWatchlistItem.gql";
import createWatchlistItemForUntappdShop from "./createWatchlistItemForUntappdShop.gql";
import removeWatchlistItem from "./removeWatchlistItem.gql";
import watchlistUserItems from "./watchlistUserItems.gql";

export default function withWatchlistMutation(Component) {
  @withApollo
  @observer
  class WatchlistMutation extends React.Component {
    static propTypes = {
      client: PropTypes.shape({
        query: PropTypes.func.isRequired
      }),
      onMutationComplete: PropTypes.func,
      watchlistName: PropTypes.string.isRequired
    };

    addNewItemToCache(cache, watchlistName, newItem) {
      const cacheData = cache.readQuery({
        query: watchlistUserItems,
        variables: { name: watchlistName }
      });

      if (!cacheData.watchlistUserItems) {
        cacheData.watchlistUserItems = {};
      }
      if (!cacheData.watchlistUserItems.edges) {
        cacheData.watchlistUserItems.edges = [];
      }
      if (!cacheData.watchlistUserItems.nodes) {
        cacheData.watchlistUserItems.nodes = [];
      }

      cacheData.watchlistUserItems.edges.push({
        __typename: "WatchlistItem",
        node: newItem
      });
      cacheData.watchlistUserItems.nodes.push({
        __typename: "WatchlistItem",
        ...newItem
      });
      // Update Apollo cache
      cache.writeQuery({
        query: watchlistUserItems,
        variables: { name: watchlistName },
        data: cacheData
      });
    }

    /**
     * @name handleCreateWatchlistItem
     * @summary Adds a watchlistItem
     * TODO: , and updates watchlist items if watchlist is provided
     * @param {String} watchlistName name (unique id) of the watchlist to which this
     * item will be added
     * @param {String} itemId unique id for this item
     * @param {Object} watchlistItemData WatchlistItem to add
     * @return {Undefined} undefined
     */
    handleCreateWatchlistItem = (watchlistName, itemId, watchlistItemData) => {
      const { client: apolloClient, onMutationComplete } = this.props;

      apolloClient.mutate({
        mutation: createWatchlistItem,
        variables: {
          watchlist: watchlistName,
          itemId,
          watchlistItemData
        },
        update: (cache, { data: mutationData }) => {
          if (onMutationComplete) { onMutationComplete(); }

          const {
            createWatchlistItem: { item: newItem } = {}
          } = mutationData || {};

          if (!newItem) { return; }

          this.addNewItemToCache(cache, watchlistName, newItem);
        }
      });
    }

    /**
     * @name handleCreateWatchlistItemForUntappdShop
     * @summary Adds a watchlistItem
     * TODO: , and updates watchlist items if watchlist is provided
     * @param {String} watchlistName name (unique id) of the watchlist to which this
     * item will be added
     * @param {String} untappdId unique id for this item
     * @return {Undefined} undefined
     */
    handleCreateWatchlistItemForUntappdShop = (watchlistName, untappdId) => {
      const { client: apolloClient, onMutationComplete } = this.props;

      apolloClient.mutate({
        mutation: createWatchlistItemForUntappdShop,
        variables: {
          watchlist: watchlistName,
          untappdId: String(untappdId)
        },
        update: (cache, { data: mutationData }) => {
          if (onMutationComplete) { onMutationComplete(); }

          const {
            createWatchlistItemForUntappdShop: { item: newItem } = {}
          } = mutationData || {};

          if (!newItem) { return; }

          this.addNewItemToCache(cache, watchlistName, newItem);
        }
      });
    }

    /**
     * @name handleRemoveWatchlistItem
     * @summary Adds a watchlistItem
     * TODO: , and updates watchlist items if watchlist is provided
     * @param {String} watchlistName name (unique id) of the watchlist to which this
     * item will be added
     * @param {String} itemId unique id for this item
     * @return {Undefined} undefined
     */
    handleRemoveWatchlistItem = (watchlistName, itemId) => {
      const { client: apolloClient, onMutationComplete } = this.props;

      apolloClient.mutate({
        mutation: removeWatchlistItem,
        variables: {
          watchlist: watchlistName,
          itemId
        },
        update: (cache, { data: mutationData }) => {
          if (onMutationComplete) { onMutationComplete(); }

          if (!mutationData || !mutationData.removeWatchlistItem) { return; }

          const { wasRemoved } = mutationData.removeWatchlistItem;

          if (!wasRemoved) { return; }

          const cacheData = cache.readQuery({
            query: watchlistUserItems,
            variables: { name: watchlistName }
          });
          if (!cacheData.watchlistUserItems) { return; }

          const { edges = [], nodes = [] } = cacheData.watchlistUserItems;

          cacheData.watchlistUserItems.edges =
            reject(edges, ({ node: { itemId: id } = {} }) => id === itemId);
          cacheData.watchlistUserItems.nodes =
            reject(nodes, ({ itemId: id }) => id === itemId);

          // Update Apollo cache
          cache.writeQuery({
            query: watchlistUserItems,
            variables: { name: watchlistName },
            data: cacheData
          });
        }
      });
    }

    render() {
      const props = {
        ...this.props,
        onCreateWatchlistItem: this.handleCreateWatchlistItem,
        onCreateWatchlistItemForUntappdShop: this.handleCreateWatchlistItemForUntappdShop,
        onRemoveWatchlistItem: this.handleRemoveWatchlistItem
      };

      return <Component {...props} />;
    }
  }

  hoistNonReactStatic(WatchlistMutation, Component);

  return WatchlistMutation;
}

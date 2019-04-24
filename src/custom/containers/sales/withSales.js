import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { Query } from "react-apollo";
import hoistNonReactStatic from "hoist-non-react-statics";
import Divider from "@material-ui/core/Divider";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import { pagination, paginationVariablesFromUrlParams } from "lib/utils/pagination";
import { WatchlistSummaryCta, WatchlistNames } from "custom/components/Watchlist";
import salesQuery from "./sales.gql";

const styles = (_theme) => ({
  watchlistSummaryDivider: {
    marginTop: "50px"
  }
});

/**
 * withSales higher order query component for fetching primaryShopId and catalog data
 * @name withSales
 * @param {React.Component} Component to decorate and apply
 * @returns {React.Component} - component decorated with primaryShopId and catalog as props
 */
export default function withSales(Component) {
  @withStyles(styles)
  @inject("routingStore", "uiStore")
  @observer
  class Sales extends React.Component {
    static propTypes = {
      classes: PropTypes.object,
      routingStore: PropTypes.object.isRequired,
      uiStore: PropTypes.object.isRequired
    };

    renderNoSales() {
      const { classes } = this.props;

      return (
        <Grid container spacing={8}>
          <Grid item sm={12} md={2} />
          <Grid item sm={12} md={8}>
            <Typography component="h2" gutterBottom={true} variant="h6">
              No Active Sales at this time
            </Typography>

            <Typography>
              Check back regularly to get your hands on the freshest beer around.
              And please let us know who you would like to see run can releases
              online. We will reach out and update you as new brewers launch on
              the Brewline platform.
            </Typography>

            <Divider className={classes.watchlistSummaryDivider} />

            <WatchlistSummaryCta watchlistName={WatchlistNames.Breweries}/>
          </Grid>
        </Grid>
      );
    }

    render() {
      const { routingStore, uiStore } = this.props;
      const [sortBy, sortOrder] = (uiStore.salesSortBy || "").split("-");
      const variables = {
        ...paginationVariablesFromUrlParams(routingStore.query, {
          defaultPageLimit: uiStore.pageSize
        })
      };

      if (sortBy) { variables.sortBy = sortBy; }
      if (sortOrder) { variables.sortOrder = sortOrder; }

      return (
        <Query query={salesQuery} variables={variables}>
          {({ data, fetchMore, loading }) => {
            const { sales } = data || {};
            const saleEdges = (sales && sales.edges) || [];

            if (!loading && !saleEdges.length) {
              // I don't know that this is the best pattern. it leads to
              // confusing scenarios. better to render the Component with a flag
              // indicating that there are no results
              return this.renderNoSales();
            }

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
                sales={saleEdges}
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

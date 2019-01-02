import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import track from "lib/tracking/track";
import PageLoading from "components/PageLoading";
import PageStepper from "components/PageStepper";
import PageSizeSelector from "components/PageSizeSelector";
import trackSaleClicked from "custom/lib/tracking/trackSaleClicked";
import SaleGrid from "./SaleGrid";
import SaleGridEmptyMessage from "./SaleGridEmptyMessage";
import SortBySelector from "./SortBySelector";

const styles = (theme) => ({
  filters: {
    justifyContent: "flex-end",
    marginBottom: theme.spacing.unit * 2
  }
});

@withStyles(styles, { name: "SkSaleGrid" })
@track()
export default class SaleGridWithControls extends Component {
  static propTypes = {
    classes: PropTypes.object,
    currencyCode: PropTypes.string.isRequired,
    initialSize: PropTypes.object,
    isLoadingSales: PropTypes.bool,
    pageInfo: PropTypes.shape({
      startCursor: PropTypes.string,
      endCursor: PropTypes.string,
      hasNextPage: PropTypes.bool,
      hasPreviousPage: PropTypes.bool,
      loadNextPage: PropTypes.func,
      loadPreviousPage: PropTypes.func
    }),
    pageSize: PropTypes.number.isRequired,
    sales: PropTypes.arrayOf(PropTypes.object),
    setPageSize: PropTypes.func.isRequired,
    setSortBy: PropTypes.func.isRequired,
    sortBy: PropTypes.string.isRequired
  };

  renderFilters() {
    const { classes, pageSize, setPageSize, setSortBy, sortBy } = this.props;

    return (
      <Grid container spacing={8} className={classes.filters}>
        <Grid item>
          <PageSizeSelector pageSize={pageSize} onChange={setPageSize} />
        </Grid>
        <Grid item>
          <SortBySelector sortBy={sortBy} onChange={setSortBy} />
        </Grid>
      </Grid>
    );
  }

  @trackSaleClicked()
  onItemClick = (event, sale) => {} // eslint-disable-line no-unused-vars

  renderMainArea() {
    const { sales = [], initialSize, isLoadingSales, pageInfo } = this.props;

    if (isLoadingSales) return <PageLoading />;

    if (sales.length === 0) return <SaleGridEmptyMessage />;

    return (
      <Fragment>
        <Grid container spacing={24}>
          <SaleGrid
            initialSize={initialSize}
            onItemClick={this.onItemClick}
            sales={sales}
            placeholderImageURL="/static/images/placeholder.gif"
            {...this.props}
          />
        </Grid>
        {pageInfo && <PageStepper pageInfo={pageInfo} />}
      </Fragment>
    );
  }

  render() {
    return (
      <Fragment>
        {this.renderFilters()}
        {this.renderMainArea()}
      </Fragment>
    );
  }
}

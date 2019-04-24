import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { observer, inject } from "mobx-react";
import Helmet from "react-helmet";
import { inPageSizes } from "lib/utils/pageSizes";
import { SaleGridWithControls } from "custom/components/SaleGrid";
import withSales from "custom/containers/sales/withSales";
// import trackProductListViewed from "custom/lib/tracking/trackSaleListViewed";

@withSales
@inject("routingStore", "uiStore")
@observer
class SaleGridPage extends Component {
  static propTypes = {
    initialGridSize: PropTypes.object,
    isLoadingSales: PropTypes.bool,
    routingStore: PropTypes.object,
    sales: PropTypes.array,
    salesPageInfo: PropTypes.object,
    shop: PropTypes.shape({
      currency: PropTypes.shape({
        code: PropTypes.string.isRequired
      })
    }).isRequired,
    uiStore: PropTypes.shape({
      pageSize: PropTypes.number.isRequired,
      setPageSize: PropTypes.func.isRequired,
      setSortBy: PropTypes.func.isRequired,
      sortBy: PropTypes.string.isRequired
    })
  };

  static async getInitialProps({ req }) {
    // It is not perfect, but the only way we can guess at the screen width of
    // the requesting device is to parse the `user-agent` header it sends.
    const userAgent = req ? req.headers["user-agent"] : navigator.userAgent;
    const width = (userAgent && userAgent.indexOf("Mobi")) > -1 ? 320 : 1024;

    return { initialGridSize: { width } };
  }

  // @trackProductListViewed()
  // componentDidMount() {
  //   const { routingStore } = this.props;
  //   routingStore.setTag({});
  // }

  componentDidUpdate(prevProps) {
    if (this.props.sales !== prevProps.sales) {
      this.trackEvent(this.props);
    }
  }

  // @trackProductListViewed()
  // trackEvent() {}

  setPageSize = (pageSize) => {
    this.props.routingStore.setSearch({ limit: pageSize });
    this.props.uiStore.setPageSize(pageSize);
  };

  setSortBy = (sortBy) => {
    this.props.routingStore.setSearch({ sortby: sortBy });
    this.props.uiStore.setSortBy(sortBy);
  };

  render() {
    const {
      sales,
      salesPageInfo,
      initialGridSize,
      isLoadingSales,
      routingStore: { query },
      shop,
      uiStore
    } = this.props;
    const pageSize = query && inPageSizes(query.limit) ? parseInt(query.limit, 10) : uiStore.pageSize;
    const sortBy = query && query.sortby ? query.sortby : uiStore.salesSortBy;
    const pageTitle = shop && shop.description ? `${shop.name} | ${shop.description}` : shop.name;

    return (
      <Fragment>
        <Helmet
          title={pageTitle}
          meta={[{ name: "description", content: shop && shop.description }]}
        />
        <SaleGridWithControls
          sales={sales}
          currencyCode={shop.currency.code}
          initialSize={initialGridSize}
          isLoadingSales={isLoadingSales}
          pageInfo={salesPageInfo}
          pageSize={pageSize}
          setPageSize={this.setPageSize}
          setSortBy={this.setSortBy}
          sortBy={sortBy}
        />
      </Fragment>
    );
  }
}

export default SaleGridPage;

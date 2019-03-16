// import React, { Component, Fragment } from "react";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { inject } from "mobx-react";
// import { Router } from "routes";
// import Helmet from "react-helmet";
// import { withStyles } from "@material-ui/core/styles";
// import ShopLogo from "@reactioncommerce/components/ShopLogo/v1";
// import withCart from "containers/cart/withCart";
import withShop from "containers/shop/withShop";
// import withViewer from "containers/account/withViewer";
// import Entry from "components/Entry";
// import Link from "components/Link";
// import PageLoading from "components/PageLoading";
// import ChevronLeftIcon from "mdi-material-ui/ChevronLeft";
import MarketplaceHome from "custom/home/MarketplaceHome";
import MerchantHome from "custom/home/MerchantHome";

// @withCart
@withShop
@inject("primaryShopId")
// @withStyles(styles, { withTheme: true })
// @withViewer
export default class Root extends Component {
  static propTypes = {
    classes: PropTypes.object,
    primaryShopId: PropTypes.string,
    shop: PropTypes.object
  };

  isMerchantShop() {
    const { primaryShopId, shop } = this.props;

    if (!shop) { return false; }

    return shop._id !== primaryShopId;
  }

  renderMarketplace() {
    return <MarketplaceHome {...this.props} />;
  }

  renderMerchantShop() {
    return <MerchantHome {...this.props} />;
  }

  render() {
    if (this.isMerchantShop()) {
      return this.renderMerchantShop();
    }

    return this.renderMarketplace();
  }
}

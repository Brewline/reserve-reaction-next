import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
// import { Router } from "routes";
import Helmet from "react-helmet";
import { withStyles } from "@material-ui/core/styles";
// import ShopLogo from "@reactioncommerce/components/ShopLogo/v1";
import withCart from "containers/cart/withCart";
import withShop from "containers/shop/withShop";
import withViewer from "containers/account/withViewer";
// import Entry from "components/Entry";
// import Link from "components/Link";
import PageLoading from "components/PageLoading";
// import ChevronLeftIcon from "mdi-material-ui/ChevronLeft";
import SaleGridPage from "./saleGrid";

const styles = (theme) => ({
  backLink: {
    "color": theme.palette.reaction.black80,
    "cursor": "pointer",
    "fontFamily": theme.typography.fontFamily,
    "fontSize": 14,
    "&:hover": {
      color: theme.palette.reaction.reactionBlue400
    }
  },
  backLinkText: {
    letterSpacing: "0.3px",
    lineHeight: 1.71,
    marginLeft: theme.spacing.unit,
    textDecoration: "underline"
  },
  headerFlex: {
    alignSelf: "center",
    flex: "1 1 1%"
  },
  header: {
    alignContent: "center",
    borderBottom: `solid 1px ${theme.palette.reaction.black10}`,
    display: "flex",
    justifyContent: "center",
    marginBottom: theme.spacing.unit * 3,
    padding: theme.spacing.unit * 3
  },
  logo: {
    color: theme.palette.reaction.reactionBlue,
    margin: "auto",
    borderBottom: `solid 5px ${theme.palette.reaction.reactionBlue200}`
  },
  main: {
    flex: "1 1 auto",
    maxWidth: theme.layout.mainLoginMaxWidth,
    minHeight: "calc(100vh - 135px)",
    margin: "0 auto",
    padding: `${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px 0`,
    [theme.breakpoints.up("md")]: {
      padding: `${theme.spacing.unit * 10}px ${theme.spacing.unit * 3}px 0`
    }
  },
  root: {}
});

@withCart
@withShop
@withStyles(styles, { withTheme: true })
@withViewer
export default class Root extends Component {
  static propTypes = {
    classes: PropTypes.object,
    primaryShopId: PropTypes.string,
    shop: PropTypes.object,
    viewer: PropTypes.object
  };

  componentDidMount() {
    console.log({ props: this.props });
  }

  isNewUser() {
    const { viewer } = this.props;

    return !viewer;
  }

  isPrimaryShop() {
    const { primaryShopId, shop } = this.props;

    if (!shop) { return false; }

    return shop._id === primaryShopId;
  }

  isMerchantShop() {
    const { primaryShopId, shop } = this.props;

    if (!shop) { return false; }

    return shop._id !== primaryShopId;
  }

  renderOnboarding() {
    return <h1>Onboarding</h1>;
  }

  renderMarketplace() {
    return (
      <SaleGridPage
        {...this.props}
        pageTitle="Marketplace"
      />
    );
  }

  renderMerchantShop() {
    return (
      <SaleGridPage
        {...this.props}
        pageTitle="Merchant Shop"
      />
    );
  }

  render() {
    let content;

    if (this.isNewUser()) {
      content = this.renderOnboarding();
    } else if (this.isPrimaryShop()) {
      content = this.renderMarketplace();
    } else if (this.isMerchantShop()) {
      content = this.renderMerchantShop();
    } else {
      content = <PageLoading delay={0} />;
    }

    const { classes, shop } = this.props;
    return (
      <Fragment>
        <Helmet
          title={`Welcome | ${shop && shop.name}`}
          meta={[{ name: "description", content: shop && shop.description }]}
        />
        <div className={classes.root}>
          <main className={classes.main}>{content}</main>
        </div>
      </Fragment>
    );
  }
}

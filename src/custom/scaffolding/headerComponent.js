import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import ShopLogo from "@reactioncommerce/components/ShopLogo/v1";
import withCart from "containers/cart/withCart";
import Link from "components/Link";
import ChevronLeftIcon from "mdi-material-ui/ChevronLeft";

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
  }
});

@withCart
@withStyles(styles, { withTheme: true })
export default class Header extends Component {
  static propTypes = {
    cart: PropTypes.shape({
      account: PropTypes.object,
      email: PropTypes.string
    }),
    classes: PropTypes.object,
    setEmailOnAnonymousCart: PropTypes.func,
    shop: PropTypes.shape({
      name: PropTypes.string.isRequired,
      description: PropTypes.string
    }),
    theme: PropTypes.object.isRequired
  };

  render() {
    const { classes, shop, theme } = this.props;

    return (
      <div className={classes.header}>
        <div className={classes.headerFlex}>
          <Link route="/" className={classes.backLink}>
            <ChevronLeftIcon
              style={{
                fontSize: 1.5 * theme.backLink.fontSize,
                color: "inherit",
                verticalAlign: "sub",
                transition: "none"
              }}
            />

            {/* TODO: i18n */}
            <span className={classes.backLinkText}>Back</span>
          </Link>
        </div>

        <Link route="home">
          <div className={classes.logo}>
            <ShopLogo shopName={shop.name} />
          </div>
        </Link>

        <div className={classes.headerFlex} />
      </div>
    );
  }
}

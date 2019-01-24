import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
// import { Router } from "routes";
import Helmet from "react-helmet";
import { withStyles } from "@material-ui/core/styles";
// import ShopLogo from "@reactioncommerce/components/ShopLogo/v1";
// import Entry from "components/Entry";
// import Link from "components/Link";

import { styles } from "./styles";

@withStyles(styles, { withTheme: true })
export default class MerchantHome extends Component {
  static propTypes = {
    classes: PropTypes.object,
    shop: PropTypes.object
  };

  renderHero() {
    return <h1>Hero!</h1>;
  }

  renderBeers() {
    return <div>List of beers</div>;
  }

  render() {
    const { classes, shop: { name, description } = {} } = this.props;
    return (
      <Fragment>
        <Helmet
          title={`Welcome to ${name}`}
          meta={[{ name: "description", content: description }]}
        />
        <div className={classes.root}>
          <main className={classes.main}>
            {this.renderHero()}

            {this.renderBeers()}

            {/* this.renderTestimonials() */}
          </main>
        </div>
      </Fragment>
    );
  }
}

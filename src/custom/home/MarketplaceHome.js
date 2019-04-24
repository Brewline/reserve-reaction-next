import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { Router } from "routes";
import Helmet from "react-helmet";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import AccountMultiple from "mdi-material-ui/AccountMultiple";
import AtIcon from "mdi-material-ui/At";
import AlertIcon from "mdi-material-ui/Alert";
import Finance from "mdi-material-ui/Finance";
import Settings from "mdi-material-ui/Settings";
import Rocket from "mdi-material-ui/Rocket";
import ThumbUp from "mdi-material-ui/ThumbUp";

// import ShopLogo from "@reactioncommerce/components/ShopLogo/v1";
// import Entry from "components/Entry";
// import Link from "components/Link";

import { typeBrewery } from "custom/onboarding/onboardingLinks";
import { styles } from "./styles";

const FEATURES = [{
  icon: <AtIcon fontSize="inherit" />,
  title: "Customer Engagement",
  description: "Grow your customer database and communicate with them directly"
}, {
  icon: <AlertIcon fontSize="inherit" />,
  title: "FOMO & Urgency",
  description: "Capitalize on customer excitement by taking orders as soon as you announce"
}, {
  icon: <AccountMultiple fontSize="inherit" />,
  title: "Social Sharing",
  description: "Sharing on Facebook, Instagram, Twitter, and Untappd helps spread the word"
}, {
  icon: <ThumbUp fontSize="inherit" />,
  title: "Reviews",
  description: "Boost your reviews on platforms like Facebook, Untappd, Yelp, and more"
}, {
  icon: <Finance fontSize="inherit" />,
  title: "Data Analysis",
  description: "Learn more about your customers to identify trends and behaviors"
}, {
  icon: <Settings fontSize="inherit" />,
  title: "Inventory Control",
  description: "Set quantity, purchase limits, and schedule pickup times"
}];

@withStyles(styles, { withTheme: true, name: "Home" })
export default class MarketplaceHome extends Component {
  static propTypes = {
    classes: PropTypes.object,
    shop: PropTypes.object
  };

  renderHero() {
    const { classes } = this.props;

    const type = typeBrewery;
    const href = Router.getRoute("onboarding", { type });

    return (
      <article className={classes.hero}>
        <Typography className={classes.heroTitle} component="h2" gutterBottom={true} variant="h3">
          Super charge your next Can Release
        </Typography>

        <Grid container spacing={8}>
          <Grid item sm={12} md={3} />
          <Grid item sm={12} md={6}>
            <Typography gutterBottom={true}>
              Whether you are looking to increase sales, spread the word about
              your brewery, improve your release-day logistics, or build your
              community of raving fans, online pre-sales will help with all
              aspects of your marketing and sales processes.
            </Typography>
          </Grid>
        </Grid>

        <Typography className={classes.heroCta} component="h2" gutterBottom={true} variant="h6">
          Ready to see your next beer release on Brewline?
        </Typography>

        <Grid container spacing={8}>
          <Grid item sm={12} md={3} />
          <Grid item sm={12} md={6} className={classes.ctaButtonWrapper}>
            <Button
              color="primary"
              route="sales"
              className={classes.button}
              fullWidth={true}
              href={href}
              size="large"
              variant="contained"
            >
              <Rocket fontSize="inherit" />
              Launch a risk-free demo in seconds
            </Button>
          </Grid>
        </Grid>
      </article>
    );
  }

  renderConsumerCta() {
    const { classes } = this.props;

    const href = Router.getRoute("sales");

    return (
      <article className={classes.secondaryCtaSection}>
        <div className={classes.secondaryCtaContent}>
          <Typography variant="h6">
            Not a Craft Brewer?
          </Typography>

          <Button
            color="default"
            route="sales"
            className={classes.button}
            href={href}
            variant="contained"
          >
            I'm here for the beer!
          </Button>
        </div>
      </article>
    );
  }

  renderFeatures() {
    const { classes } = this.props;

    return (
      <article className={classes.featuresSection}>
        <div className={classes.featuresContent}>
          <Typography className={classes.featuresTitle} component="h2" variant="h6">
            All the features you need
          </Typography>

          <Grid container spacing={8}>
            {FEATURES.map((feature, index) => (
              <Grid
                item
                sm={12}
                md={6}
                lg={4}
                key={index}
                className={classes.featureGridItem}
              >
                <Card className={classes.featureCard} square={true} raised={true}>
                  <CardContent className={classes.feature}>
                    <div className={classes.featureIcon}>
                      {feature.icon}
                    </div>

                    <Typography component="h4" variant="subtitle1" gutterBottom>
                      {feature.title}
                    </Typography>

                    <Typography gutterBottom>
                      {feature.description}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </div>
      </article>
    );
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

            {this.renderConsumerCta()}

            {this.renderFeatures()}

            {/* this.renderTestimonials() */}
          </main>
        </div>
      </Fragment>
    );
  }
}

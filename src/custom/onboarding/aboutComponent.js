import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import { withStyles } from "@material-ui/core/styles";
import {
  OnboardingBreweryAboutLink,
  OnboardingCustomerAboutLink
} from "./onboardingLinks";

/* eslint-disable quote-props */
const styles = (theme) => ({
  callToActionGroup: {
    display: "flex",
    [theme.breakpoints.down("xs")]: {
      flexDirection: "column"
    }
  },

  callToAction: {
    backgroundColor: theme.palette.background.default,
    borderRadius: theme.spacing.unithalf,
    flex: 1,
    color: theme.palette.text.primary,
    margin: theme.spacing.unit,
    padding: theme.spacing.unit,

    "& > *": {
      marginTop: 0
    }
  }
});
/* eslint-disable quote-props */

// .brewline-onboarding__about {
//   .features {
//     .media {
//       margin-top: 10px; // override :first-child no margin
//     }
//     .icon {
//       width: 56px; // measured in practice
//     }
//   }

//   .cta-wrapper {
//     min-height: 300px;
//   }

//   .hero-title {
//     text-align: center;
//   }

//   .cta-wrapper,
//   .hero-content,
//   .features-content {
//     .max-width-container;
//   }

//   .hero-content {
//     margin-top: 40px;

//     .button {
//       margin-top: 20px;
//     }
//   }

//   .features-wrapper {
//     padding: 20px;
//     margin-top: 20px;
//     margin-bottom: 20px;
//     background-color: @body-bg;
//     border-radius: 5px;
//     color: @text-color;
//   }
// }

@withStyles(styles)
export default class About extends Component {
  static propTypes = {
    classes: PropTypes.object
  }

  get classes() {
    const { classes = {} } = this.props;

    return classes;
  }

  renderHero() {
    return (
      <div className="hero-wrapper">
        <Typography variant="headline" gutterBottom>
          Reserve Online. Skip the Line. Brewline
        </Typography>

        <div className="hero-content">
          <Typography variant="body1" gutterBottom>
            The freshest, best-tasting, most innovative beer today is not sold
            in stores. It can only be found in the tap rooms of your local
            breweries.
          </Typography>

          <Typography variant="body1" gutterBottom>
            Find out more about what Brewline can do for you...
          </Typography>
        </div>

        <Divider />
      </div>
    );
  }

  renderBrewerCta() {
    return (
      <Fragment>
        <Typography variant="title" gutterBottom>
          Craft Brewers
        </Typography>

        <Typography variant="body1" gutterBottom>
          Get started now. Your brewery can be set up for online pre-sales in
          minutes. Click to learn more.
        </Typography>

        <Button
          className={this.classes.button}
          color="primary"
          component={OnboardingBreweryAboutLink}
          fullWidth={true}
          size="large"
          variant="contained"
        >
          {/* i18nKeyLabel="brewline.onboarding.brewerCta" */}
          I am a Brewer
        </Button>
      </Fragment>
    );
  }

  renderCustomerCta() {
    return (
      <Fragment>
        <Typography variant="title" gutterBottom>
          Craft Beer Lovers
        </Typography>

        <Typography variant="body1" gutterBottom>
          Find out whether your favorite craft brewers are on Brewline
          and be notified of new releases near you.
        </Typography>

        <Button
          className={this.classes.button}
          color="primary"
          component={OnboardingCustomerAboutLink}
          fullWidth={true}
          size="large"
          variant="contained"
        >
          {/* i18nKeyLabel="brewline.onboarding.customerCta" */}
          I drink Craft Beer
        </Button>
      </Fragment>
    );
  }

  render() {
    return (
      <div className="onboarding__step brewline-onboarding__about">
        {this.renderHero()}

        <div className={this.classes.callToActionGroup}>
          <div className={this.classes.callToAction}>
            {this.renderBrewerCta()}
          </div>

          <div className={this.classes.callToAction}>
            {this.renderCustomerCta()}
          </div>
        </div>
      </div>
    );
  }
}

import _ from "lodash";
import React, { Fragment, PureComponent } from "react";
import PropTypes from "prop-types";
// import { Packages } from "/lib/collections";
// import { VelocityComponent } from "velocity-react";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";
import Modal from "@material-ui/core/Modal";
// import SocialButtons from "./socialButtons";

function Login() {}

export default class ThankYou extends PureComponent {
  static propTypes = {
    classes: PropTypes.object,
    done: PropTypes.func,
    loggedInUser: PropTypes.object,
    merchantShops: PropTypes.arrayOf(PropTypes.shape({
      UntappdId: PropTypes.number
    })),
    onCancelSignUp: PropTypes.func.isRequired,
    onRequestSignUp: PropTypes.func.isRequired,
    shouldShowAuthModal: PropTypes.bool,
    watchlistItems: PropTypes.arrayOf(PropTypes.shape({
      displayName: PropTypes.string
    }))
  };

  get classes() {
    const { classes = {} } = this.props;

    return classes;
  }

  // renderWatchlistItem = (watchlistItem, index) => {
  //   const { displayName, itemMetadata } = watchlistItem;
  //   const { contact = {} } = itemMetadata;
  //   const { twitter, facebook } = contact;

  //   const socialPackage = Packages.findOne({ name: "reaction-social" });
  //   const socialSettings = _.get(socialPackage, "settings.public");

  //   const apps = {};

  //   if (twitter) {
  //     apps.twitter = {
  //       ...(_.get(socialSettings, "apps.twitter", {})),
  //       description: `.@${twitter} do you do can releases online? have you heard of @brewlineHQ?`
  //     };
  //   }

  //   if (facebook) {
  //     const handle = facebook.replace(/^.*\.facebook\.com\//i, "");
  //     apps.facebook = {
  //       ...(_.get(socialSettings, "apps.facebook", {})),
  //       description: `@${handle} do you do can releases online? have you heard of @brewlineHQ?`
  //     };
  //   }

  //   const shareSettings = {
  //     description: "Reserve Online. Skip the Line. Brewline.",
  //     title: "Online Can Release Reservations by Brewline",
  //     url: "https://reserve.brewline.io/welcome/brewery",
  //     settings: { apps },
  //     providers: Object.keys(apps)
  //   };

  //   return (
  //     <div className={`brewery-with-social row-${index % 2}`} key={index}>
  //       <div className="display-name">
  //         {displayName}
  //       </div>

  //       <div className="sharing-options flex align-items-center">
  //         <span className="nudge">Please share:</span>
  //         <SocialButtons {...shareSettings} />
  //       </div>
  //     </div>
  //   );
  // }

  // renderWatchlistItems() {
  //   const { watchlistItems } = this.props;

  //   return (
  //     <div className="watchlist-container">
  //       {_.map(watchlistItems, this.renderWatchlistItem)}
  //     </div>
  //   );
  // }

  renderFavoritesStats() {
    // TODO: figure out if any are on the platform
    return (
      <div className="brewery-favorite-summary">
        <Typography variant="subtitle" gutterBottom>
          0
        </Typography>
        <Typography variant="body1" gutterBottom>
          of your favorites are on Brewline
        </Typography>
      </div>
    );
  }

  renderCallToAction() {
    return (
      <Fragment>
        <h3>Get Notified</h3>

        <Typography variant="body1" gutterBottom>
          Sign up now, and we will let you know when your favorite brewers
          start running can releases on Brewline.
        </Typography>

        {/* <VelocityComponent animation="callout.shake" runOnMount={true}> */}
        <Button
          className={this.classes.button}
          color="primary"
          onClick={this.props.onRequestSignUp}
          size="large"
          variant="contained"
        >
          {/* TODO: i18n */}
            Notify me
        </Button>
        {/* </VelocityComponent> */}

        <Modal
          isOpen={this.props.shouldShowAuthModal}
          onRequestClose={this.props.onCancelSignUp}
          size="sm"
        >
          <Login
            loginFormCurrentView="loginFormSignUpView"
          />
        </Modal>
      </Fragment>
    );
  }

  renderCallToActionComplete() {
    return (
      <Fragment>
        <h3>All Set!</h3>

        <Typography variant="body1" gutterBottom>
          You will not be notified when your favorite brewers are up and running
          can releases on Brewline.
        </Typography>
      </Fragment>
    );
  }

  render() {
    let callToActionContent;
    const { loggedInUser } = this.props;
    const isLoggedIn = !_.isEmpty(loggedInUser);

    if (isLoggedIn) {
      callToActionContent = this.renderCallToActionComplete();
    } else {
      callToActionContent = this.renderCallToAction();
    }
    return (
      <div className="onboarding__step brewline-onboarding__thank-you">
        {this.renderFavoritesStats()}

        <Divider />

        {callToActionContent}

        <Typography variant="body1" gutterBottom>&nbsp;</Typography>

        <h5>
          {isLoggedIn ? "One Last Thing" : "Help Us Get the Word Out"}
        </h5>

        <Typography variant="body1" gutterBottom>
          Share on social to let your favorite Brewers know they should
          be running can releases on Brewline!
        </Typography>

        {/* {this.renderWatchlistItems()} */}
      </div>
    );
  }
}

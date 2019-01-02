import _ from "lodash";
import React, { Component } from "react";
import PropTypes from "prop-types";
// import { VelocityComponent } from "velocity-react";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Modal from "@material-ui/core/Modal";
import Typography from "@material-ui/core/Typography";

export default class Login extends Component {
  static propTypes = {
    classes: PropTypes.object,
    loggedInUser: PropTypes.object,
    onCloseSignUpModal: PropTypes.func,
    onLogin: PropTypes.func.isRequired,
    onNextStep: PropTypes.func.isRequired,
    onOpenSignUpModal: PropTypes.func
  };

  state = {
    shouldShowAuthModal: false
  };

  get classes() {
    const { classes = {} } = this.props;

    return classes;
  }

  handleClickSignUp = () => {
    const { onOpenSignUpModal } = this.props;

    this.setState({ shouldShowAuthModal: true });

    if (!onOpenSignUpModal) { return; }

    onOpenSignUpModal();
  }

  handleRequestClose = () => {
    const { onCloseSignUpModal } = this.props;

    this.setState({ shouldShowAuthModal: false });

    if (!onCloseSignUpModal) { return; }

    onCloseSignUpModal();
  }

  renderLoggedIn() {
    return (
      <div>
        <Typography variant="body1" gutterBottom>
          Great! You are logged in.
        </Typography>

        <Button
          className={this.classes.button}
          color="primary"
          onClick={this.props.onNextStep}
          size="large"
          variant="contained"
        >
          {/* TODO: i18n */}
          Next step
        </Button>
      </div>
    );
  }

  renderAnonymous() {
    return (
      <div>
        <Typography variant="body1" gutterBottom>
          First things first, please login.
        </Typography>

        <Typography variant="body1" gutterBottom>
          Using your Untappd account, we can import your brewery and beers
          automatically.
        </Typography>

        {/* <VelocityComponent animation="callout.shake" runOnMount={true}> */}
        <Button
          className={this.classes.button}
          color="primary"
          onClick={this.props.onLogin}
          size="large"
          variant="contained"
        >
          {/* TODO: i18n */}
            Login with Untappd
        </Button>
        {/* </VelocityComponent> */}

        <Divider />

        <Typography variant="body1" gutterBottom>
          We use information from Untappd to
        </Typography>
        <ol>
          <li>create your account (using your email)</li>
          <li>create your shop (using name, description, website, etc.)</li>
          <li>import the beers that you choose</li>
        </ol>
        <Typography variant="body1" gutterBottom>
          We chose Untappd for your convenience and as a way to verify Brewery
          ownership.
        </Typography>

        <Typography variant="body1" gutterBottom>
          We do not post, toast, or otherwise change content on your behalf.
        </Typography>

        <Typography variant="body1" gutterBottom>
          <Button
            className={this.classes.button}
            data-event-category="accounts"
            onClick={this.handleClickSignUp}
            variant="text"
          >
            {/* i18nKeyLabel="onboarding.manualShopCreationCta" */}
            Prefer to set up your account manually? click here.
          </Button>
        </Typography>

        <Modal
          isOpen={this.state.shouldShowAuthModal}
          onRequestClose={this.handleRequestClose}
          size="sm"
        >
          <Login
            loginFormCurrentView="loginFormSignUpView"
          />
        </Modal>
      </div>
    );
  }

  render() {
    let content;

    if (!_.isEmpty(this.props.loggedInUser)) {
      content = this.renderLoggedIn();
    } else {
      content = this.renderAnonymous();
    }

    return (
      <div className="onboarding__step brewline-onboarding__login">
        <Typography variant="title" gutterBottom>
          Create an account on Brewline
        </Typography>

        {content}
      </div>
    );
  }
}

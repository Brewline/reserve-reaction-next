import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";
import Onboarding from "../../custom/onboarding";

export default class OnboardingPage extends Component {
  static propTypes = {
    classes: PropTypes.object,
    shop: PropTypes.object
  };

  render() {
    const { shop } = this.props;
    return (
      <Fragment>
        <Helmet
          title={`Welcome to Brewline | ${shop && shop.name}`}
          meta={[
            { name: "description", content: "Craft Brewers taking Can Releases online" }
          ]}
        />
        <main>
          <Onboarding {...this.props} />
        </main>
      </Fragment>
    );
  }
}

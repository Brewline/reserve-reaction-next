import _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import { withStyles } from "@material-ui/core/styles";
import About from "./aboutComponent";
import { typeBrewery, typeCustomer } from "./onboardingLinks";
import * as BreweryComponents from "./brewery";
import * as CustomerComponents from "./customer";

const Components = {
  [typeBrewery]: BreweryComponents,
  [typeCustomer]: CustomerComponents
};

const backgroundImage = "https://brewline.s3.amazonaws.com/uploads/2018/03/brewline-bg-pattern-1.png";
const backgroundColor1 = "rgba(46,73,182,1)";
const backgroundColor2 = "rgba(42,67,167,1)";
/* eslint-disable quote-props */
const styles = (theme) => ({
  "@global": {
    body: {
      backgroundPosition: "center top",
      backgroundRepeat: "repeat",
      background: `url('${backgroundImage}'), radial-gradient(${backgroundColor1}, ${backgroundColor2})`,
      color: theme.palette.background.default, // theme.palette.text.inverted

      "& h1, & p": {
        color: theme.palette.background.default
      }
    }
  }
});

// @withStyles(styles)
@withStyles(styles, { withTheme: true }) // temporarily add theme while developing
export default class Onboarding extends Component {
  static propTypes = {
    classes: PropTypes.object.isRequired,
    router: PropTypes.object
  };

  constructor(props) {
    super(props);

    console.log({ props });
  }

  getComponents(type) {
    return Components[type] || {};
  }

  renderDefault() {
    return <About {...this.props}/>;
  }

  renderTemplate() {
    const { router: { query: { type, page } = {} } = {} } = this.props;

    const TypedComponents = this.getComponents(type);
    const matchedTemplateName =
      Object.keys(TypedComponents).find((k) => k.toLowerCase() === page);

    if (!matchedTemplateName) {
      const TypedDefaultComponent = TypedComponents.defaultComponent;

      if (TypedDefaultComponent) {
        return <TypedDefaultComponent {...this.props} />;
      }

      return this.renderDefault();
    }

    const TemplateComponent = TypedComponents[matchedTemplateName];

    return <TemplateComponent {...this.props} />;
  }

  render() {
    const { router: { query: { type, page } = {} } = {} } = this.props;
    const containerClassName =
      `onboarding__steps-container type-${_.kebabCase(type)} page-${_.kebabCase(page)}`;

    return (
      <div className="onboarding-container">
        <div className={containerClassName}>
          {this.renderTemplate()}
        </div>
      </div>
    );
  }
}

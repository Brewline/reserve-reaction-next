import _ from "lodash";
import React, { Component } from "react";
import PropTypes from "prop-types";
// import { VelocityComponent } from "velocity-react";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";

const FEATURES = [{
  icon: "shopping-cart",
  title: "Reserve Online",
  description: "Get the name and email address of every customer"
}, {
  icon: "flag-checkered",
  title: "Skip the Line",
  description: "Show up to the brewery on your time and pick up without waiting"
}, {
  icon: "trophy",
  title: "Early Access",
  description: "Be notified before the general public of upcoming beer releases"
}, {
  icon: "gift",
  title: "Earn Free Stuff",
  description: "Breweries reward their most loyal customers with swag and invite-only events"
}];

export default class About extends Component {
  static propTypes = {
    classes: PropTypes.object,
    onNextStep: PropTypes.func
  };

  get classes() {
    const { classes = {} } = this.props;

    return classes;
  }

  renderHero() {
    return (
      <div className="hero-wrapper">
        <Typography variant="display1" gutterBottom>
          Your direct line to the hottest beer releases
        </Typography>

        <div className="hero-content">
          <Typography variant="subtitle" gutterBottom>
            Many of today&rsquo;s most popular breweries sell product on-site at
            specific times&hellip; usually when you are at work!
          </Typography>

          <Typography variant="body1" gutterBottom>
            {"With Brewline, you reserve online and pick up at "}
            <em>your</em>
            {" convenience."}
          </Typography>

          <Typography variant="body1" gutterBottom>
            Reserve online. Skip the line. Brewline
          </Typography>

          {this.renderButton()}
        </div>
      </div>
    );
  }

  renderFeatures() {
    return (
      <div className="features-wrapper">
        <div className="features-content">
          <div className="features">
            <div className="row">
              {_.map(FEATURES, (feature, index) => (
                <div
                  className="col-sm-12 col-md-6 media"
                  key={index}
                >
                  <div className="media-left">
                    <i className={`icon fa fa-4x pull-left fa-${feature.icon}`} />
                  </div>
                  <div className="media-body">
                    <h4 className="media-heading">{feature.title}</h4>
                    <Typography variant="body1" gutterBottom>
                      {feature.description}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderCta() {
    return (
      <div className="cta-wrapper">
        <Typography variant="body1" gutterBottom>
          Find out whether your favorite brewery is already on Brewline!
        </Typography>

        {this.renderButton()}
      </div>
    );
  }

  renderButton() {
    // <VelocityComponent animation="callout.shake" runOnMount={true}>
    return (
      <Button
        className={this.classes.button}
        color="primary"
        onClick={this.props.onNextStep}
        size="large"
        variant="contained"
      >
        {/* TODO: i18n */}
          Search Breweries
      </Button>
    );
    // </VelocityComponent>
  }

  render() {
    return (
      <div className="onboarding__step brewline-onboarding__about">
        {this.renderHero()}

        {this.renderFeatures()}

        {this.renderCta()}
      </div>
    );
  }
}

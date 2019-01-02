import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
// import {
//   VelocityComponent,
//   VelocityTransitionGroup,
//   velocityHelpers
// } from "velocity-react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Typography from "@material-ui/core/Typography";

import { OnboardingBreweryLoginLink } from "../onboardingLinks";

const ROTATION_SPEED = 5000;

// const Animations = {
//   // Register these with UI Pack so that we can use stagger later.
//   In: velocityHelpers.registerEffect({
//     calls: [
//       [
//         {
//           transformPerspective: [800, 800],
//           transformOriginX: ["50%", "50%"],
//           transformOriginY: ["100%", "100%"],
//           marginBottom: 0,
//           opacity: 1,
//           rotateX: [0, 130]
//         },
//         1,
//         {
//           easing: "ease-out",
//           display: "block"
//         }
//       ]
//     ]
//   }),

//   Out: velocityHelpers.registerEffect({
//     calls: [
//       [
//         {
//           transformPerspective: [800, 800],
//           transformOriginX: ["50%", "50%"],
//           transformOriginY: ["0%", "0%"],
//           marginBottom: -30,
//           opacity: 0,
//           rotateX: -70
//         },
//         1,
//         {
//           easing: "ease-out",
//           display: "block"
//         }
//       ]
//     ]
//   })
// };

const Answers = {
  everyCustomer: [
    "Check out our next Beer Release",
    "Share a pic on social… tag us and we will re-post",
    "You bought a Saison last time, a fresh batch is ready at the taproom!",
    "Check-in on Untappd",
    "We have leftover inventory on sale now",
    "Do you have any suggestions?"
  ],
  bestCustomers: [
    "Give us a five-star review",
    "Join us for a private tasting with the Brewer",
    "Join our loyalty program",
    "Refer your friends and get free brewery swag"
  ]
};

const FEATURES = [{
  icon: "at",
  title: "Customer Engagement",
  description: "Get the name and email address of every customer"
}, {
  icon: "exclamation-triangle",
  title: "FOMO & Urgency",
  description: "Capitalize on customer excitement by taking orders as soon as you announce"
}, {
  icon: "users",
  title: "Network Effects",
  description: "Sharing on Facebook, Instagram, Twitter, and Untappd helps spread the word"
}, {
  icon: "thumbs-up",
  title: "Reviews",
  description: "Follow up with customers to garner reviews on Facebook, Yelp, Google, and Foursquare"
}, {
  icon: "line-chart",
  title: "Data Analysis",
  description: "Learn more about your customers"
}, {
  icon: "cogs",
  title: "Inventory Control",
  description: "Set limits, Schedule pickup times"
}];

const initialAnswerIndexes = {};
Object.keys(Answers).forEach((key) => {
  initialAnswerIndexes[key] = 0;
});

const styles = {};
// .teasers-container {
//   background: @black02;
//   color: @text-color;
//   padding: 40px 0;
//   width: 100%;

//   @media @mobile {
//     padding: 20px;
//   }
// }

// .teasers {
//   width: 1000px;
//   margin: 0 auto;

//   @media @mobile {
//     width: 100%;
//   }

//   .divider {
//     margin-left: auto;
//     margin-right: auto;
//     border-color: @text-color;

//     hr {
//       border-color: @text-color;
//     }

//     &.rui.separator.labeled .label {
//       color: @text-color;
//       font-style: italic;
//       text-transform: none;
//     }
//   }
// }

// .teaser {
//   display: flex;
//   flex-direction: row;

//   @media @mobile {
//     width: 100%;
//     flex-direction: column;
//   }

//   & + & {
//     margin-top: 20px;
//   }

//   &.best-customers {
//     .teaser-question {
//       margin-left: 20px;
//     }

//     .teaser-answers {
//       order: -1;
//     }

//     @media @mobile {
//       .teaser-question {
//         margin-left: 0;
//       }

//       .teaser-answers {
//         order: 1;
//       }
//     }
//   }

//   &.every-customer {
//     .teaser-question {
//       margin-right: 20px;
//     }

//     @media @mobile {
//       .teaser-question {
//         margin-right: 0;
//       }
//     }
//   }

//   &-question {
//     color: @gray;
//     flex: 3;
//     font-size: @font-size-h4;
//     line-height: @font-size-h2;
//     text-align: center;

//     @media @mobile {
//       padding: 0 0 20px 0;
//     }

//     .primary {
//       // color: @gray-darker;
//       color: @bgColor1;
//       display: block;
//       font-size: @font-size-h2;
//       font-weight: bold;
//     }

//     .secondary {
//       color: @gray-dark;
//       display: block;
//       font-size: @font-size-h3;
//       font-style: italic;
//     }
//   }

//   &-answers {
//     background: @black10;
//     border-radius: 5px;
//     // color: @white;
//     flex: 2;
//     min-height: 4 * @font-size-h2;
//     padding: 10px;
//   }

//   &-answer {
//     border-left: 5px solid currentColor;
//     font-size: @font-size-h4;
//     padding-left: 20px;
//   }
// }

@withStyles(styles, { withTheme: true })
export default class About extends Component {
  static propTypes = {
    classes: PropTypes.object,
    onNextStep: PropTypes.func
  };

  constructor(props) {
    super(props);

    this.intervalPtr = {};
    this.state = {
      currentAnswerIndexes: initialAnswerIndexes,
      duration: 500
    };
  }

  componentDidMount() {
    Object.keys(Answers).forEach((key, inx, keys) => {
      const delay = ROTATION_SPEED * inx / keys.length;
      setTimeout(() => this.resumeInterval(key), delay);
    });
  }

  componentWillUnmount() {
    Object.keys(this.intervalPtr).forEach((key) => this.pauseInterval(key));
  }

  get classes() {
    const { classes = {} } = this.props;

    return classes;
  }

  resumeInterval = (questionKey) => {
    if (this.intervalPtr[questionKey]) { return; }

    this.intervalPtr[questionKey] =
      setInterval(() => this.rotateAnswers(questionKey), ROTATION_SPEED);
  }

  pauseInterval = (questionKey) => {
    clearInterval(this.intervalPtr[questionKey]);
    this.intervalPtr[questionKey] = null;
  }

  renderHero() {
    return (
      <div className="hero-wrapper">
        <Typography variant="display1" gutterBottom>
          Brewline: the Beer Release platform made for Craft Brewers
        </Typography>

        <div className="hero-content">
          <Typography variant="subtitle" gutterBottom>
            We all know that beer releases are a great way to move product, test
            new lines, and build excitement for your beer.
            Take it to the next level with Brewline.
          </Typography>

          {this.renderButton()}
        </div>
      </div>
    );
  }

  rotateAnswers = (questionKey) => {
    const { currentAnswerIndexes } = this.state;
    const currentIndex = currentAnswerIndexes[questionKey];

    currentAnswerIndexes[questionKey] =
      (currentIndex + 1) % Answers[questionKey].length;

    this.setState({ currentAnswerIndexes });
  }

  renderAnswers(questionKey) {
    const answer =
      Answers[questionKey][this.state.currentAnswerIndexes[questionKey]];
    const answers = [
      <Typography variant="subtitle" gutterBottom key={answer}>
        &ldquo;{answer}&rdquo;
      </Typography>
    ];

    // const enterAnimation = {
    //   animation: Animations.In,
    //   stagger: this.state.duration,
    //   duration: this.state.duration,
    //   backwards: true,
    //   display: "block",
    //   style: {
    //     // Since we're staggering, we want to keep the display at "none" until Velocity runs
    //     // the display attribute at the start of the animation.
    //     display: "none"
    //   }
    // };

    // const leaveAnimation = {
    //   animation: Animations.Out,
    //   stagger: this.state.duration,
    //   duration: this.state.duration,
    //   backwards: true
    // };

    return (
      <div
        className="teaser-answers"
        onMouseOver={() => this.pauseInterval(questionKey)}
        onFocus={() => this.pauseInterval(questionKey)}
        onMouseOut={() => this.resumeInterval(questionKey)}
        onBlur={() => this.resumeInterval(questionKey)}
      >
        {/* <VelocityTransitionGroup
          component="div"
          className="flex-1 teaser-answer-container"
          enter={enterAnimation}
          leave={leaveAnimation}
        > */}
        {answers}
        {/* </VelocityTransitionGroup> */}

        {/* TODO: add bar which grows over time and resets on the interval */}
      </div>
    );
  }

  renderTeaserEveryCustomer() {
    const questionKey = "everyCustomer";

    return (
      <div className="teaser every-customer">
        <div className="teaser-question">
          {" if you could "}

          <span className="primary">
            contact every customer
          </span>

          {" from your can releases, "}

          <br />

          <span className="secondary">
            what would you say to them?
          </span>
        </div>

        {this.renderAnswers(questionKey)}
      </div>
    );
  }

  renderTeaserBestCustomers() {
    const questionKey = "bestCustomers";

    return (
      <div className="teaser best-customers">
        <div className="teaser-question">
          {" what if you had a list of your "}

          <span className="primary">
            best customers
          </span>

          {" based on sales data… "}

          <br />

          <span className="secondary">
            what would you say then?
          </span>
        </div>

        {this.renderAnswers(questionKey)}
      </div>
    );
  }

  renderTeasers() {
    return (
      <div className="teasers-container">
        <div className="teasers">
          {this.renderTeaserEveryCustomer()}

          <Divider
            id="auth-divider"
            label="and then..."
          />

          {this.renderTeaserBestCustomers()}
        </div>
      </div>
    );
  }

  renderFeatures() {
    return (
      <div className="features-wrapper">
        <div className="features-content">
          <h3>All the features you need</h3>

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
          Ready to start your next beer release online?
        </Typography>

        {this.renderButton()}
      </div>
    );
  }

  renderButton() {
    return (
      <div className="button-with-annotation">
        {/* <VelocityComponent animation="callout.shake" runOnMount={true}> */}
        <Button
          color="primary"
          className={this.classes.button}
          component={OnboardingBreweryLoginLink}
          size="large"
          variant="contained"
        >
          {/* TODO: i18n */}
            Set up my brewery
        </Button>
        {/* </VelocityComponent> */}

        <em className="annotation">{"(done in minutes)"}</em>
      </div>
    );
  }

  render() {
    return (
      <Fragment>
        {this.renderTeasers()}

        <div className="onboarding__step brewline-onboarding__about">
          {this.renderHero()}

          {this.renderFeatures()}

          {this.renderCta()}
        </div>
      </Fragment>
    );
  }
}

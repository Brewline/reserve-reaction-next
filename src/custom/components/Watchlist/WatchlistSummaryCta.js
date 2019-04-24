import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import WatchlistSummary from "./WatchlistSummary";

const styles = (theme) => ({
  summaryList: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  }
});

// @withStyles(styles, { withTheme: true, name: "Onboarding" })
@withStyles(styles)
export default class WatchlistSummaryCta extends Component {
  static propTypes = {
    classes: PropTypes.object,
    watchlistName: PropTypes.string
  };

  render() {
    const { classes, watchlistName } = this.props;

    return (
      <Fragment>
        <Typography className={classes.heroTitle} gutterBottom={true} variant="h6">
          Help me help you...
        </Typography>

        <Typography className={classes.heroCta} component="h2" gutterBottom={true} variant="caption">
          Is there a local brewery you would like to see run can releases online?
        </Typography>

        <Grid container spacing={8}>
          <Grid item xs={12} sm={3} />
          <Grid item xs={12} sm={6}>
            <WatchlistSummary watchlistName={watchlistName} />
          </Grid>
        </Grid>
      </Fragment>
    );
  }
}

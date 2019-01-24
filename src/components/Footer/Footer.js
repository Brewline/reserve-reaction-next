import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";

const date = new Date();

const styles = (theme) => ({
  footer: {
    alignItems: "center",
    display: "flex",
    justifyContent: "center",

    // #brewlinecustom
    padding: theme.spacing.unit * 2,
    // copied from header
    backgroundColor: theme.palette.reaction.white,
    borderTop: `solid 1px ${theme.palette.reaction.black05}`,
    color: theme.palette.reaction.coolGrey500
  }
});

const Footer = ({ ...props }) => (
  <footer className={props.classes.footer}>
    <Typography variant="caption">
      {/* #brewlinecustom */}
      &copy; {date.getFullYear()} Brewline, LLC
    </Typography>
  </footer>
);

Footer.propTypes = {
  classes: PropTypes.object
};

export default withStyles(styles, { name: "SkFooter" })(Footer);

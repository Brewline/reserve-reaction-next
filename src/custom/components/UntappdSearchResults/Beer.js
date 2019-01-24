import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Typography from "@material-ui/core/Typography";
import track from "lib/tracking/track";

const styles = (_theme) => ({
  inline: {
    display: "inline"
  },

  avatarSmall: {
    height: 40,
    width: 40
  },

  avatarMedium: {
    height: 60,
    width: 60
  },

  avatarLarge: {
    height: 80,
    width: 80
  }
});

@withStyles(styles)
export default class UntappdBeerSearchResult extends Component {
  static propTypes = {
    avatarSizeClassName: PropTypes.string,
    classes: PropTypes.object,
    onClick: PropTypes.func,
    searchResult: PropTypes.shape({
    /* eslint-disable camelcase */
      beer: PropTypes.shape({
        bid: PropTypes.number,
        beer_label: PropTypes.string,
        beer_name: PropTypes.string,
        beer_style: PropTypes.string
      }),
      brewery: PropTypes.shape({
        brewery_name: PropTypes.string
      })
      /* eslint-enable camelcase */
    })
  };

  static defaultProps = {
    avatarSizeClassName: "avatarSmall"
  };

  _handleClick() {
    const { onClick, searchResult } = this.props;

    if (!onClick) { return; }

    onClick(searchResult);
  }

  @track(() => ({
    action: "Beer Search Result Clicked"
  }))
  handleClick = (event) => {
    this._handleClick(event);
  }

  @track(() => ({
    action: "Beer Search Result Enter Key Down"
  }))
  handleKeyDown = (event) => {
    if (event.key !== "Enter") { return; }

    this._handleClick(event);
  }

  render() {
    const { classes, avatarSizeClassName, searchResult } = this.props;
    const { beer, brewery } = searchResult;
    const {
      beer_name: beerName,
      beer_label: beerLabel,
      beer_style: beerStyle
    } = beer;
    const { brewery_name: breweryName } = brewery;

    const className = classes[avatarSizeClassName];

    return (
      <ListItem
        button={true}
        divider={true}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
      >
        <ListItemAvatar>
          <Avatar className={className} alt={`${beerName} by ${breweryName}`} src={beerLabel} />
        </ListItemAvatar>

        <ListItemText
          primary={
            <React.Fragment>
              {beerName}
              <Typography component="span" className={classes.inline} color="textPrimary">
                {` — ${beerStyle}`}
              </Typography>
            </React.Fragment>
          }
          secondary={breweryName}
        />
      </ListItem>
    );
  }
}

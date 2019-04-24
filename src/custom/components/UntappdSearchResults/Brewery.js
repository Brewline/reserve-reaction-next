import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
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
export default class UntappdBrewerySearchResult extends Component {
  static propTypes = {
    avatarSizeClassName: PropTypes.string,
    classes: PropTypes.object,
    onClick: PropTypes.func,
    searchResult: PropTypes.shape({
    /* eslint-disable camelcase */
      brewery: PropTypes.shape({
        brewery_id: PropTypes.number,
        brewery_name: PropTypes.string,
        brewery_label: PropTypes.string,
        location: PropTypes.shape({
          brewery_city: PropTypes.string,
          brewery_state: PropTypes.string
        })
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
    action: "Brewery Search Result Clicked"
  }))
  handleClick = (event) => {
    this._handleClick(event);
  }

  @track(() => ({
    action: "Brewery Search Result Enter Key Down"
  }))
  handleKeyDown = (event) => {
    if (event.key !== "Enter") { return; }

    this._handleClick(event);
  }

  render() {
    const { classes, avatarSizeClassName, searchResult } = this.props;
    const { brewery } = searchResult;
    const {
      brewery_name: breweryName,
      brewery_label: breweryLabel,
      location: { brewery_city: city, brewery_state: state } = {}
    } = brewery;
    const breweryLocation = `${city}, ${state}`;

    const className = classes[avatarSizeClassName];

    return (
      <ListItem
        button={true}
        divider={true}
        onClick={this.handleClick}
        onKeyDown={this.handleKeyDown}
      >
        <ListItemAvatar>
          <Avatar
            className={className}
            alt={`${breweryName} - ${breweryLocation}`}
            src={breweryLabel}
          />
        </ListItemAvatar>

        <ListItemText
          primary={breweryName}
          secondary={breweryLocation}
        />
      </ListItem>
    );
  }
}

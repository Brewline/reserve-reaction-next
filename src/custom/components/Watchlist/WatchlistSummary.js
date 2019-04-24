import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { debounce, some } from "lodash";
import { observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import ListItemText from "@material-ui/core/ListItemText";
import ListSubheader from "@material-ui/core/ListSubheader";
import Slide from "@material-ui/core/Slide";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import IconAdd from "mdi-material-ui/Plus";
import IconStarFilled from "mdi-material-ui/Star";
import IconUntappd from "mdi-material-ui/Untappd";
import IconStarOutline from "mdi-material-ui/StarOutline";

import UntappdSearchResults from "custom/components/UntappdSearchResults/UntappdSearchResults";
import UntappdBrewerySearchResult from "custom/components/UntappdSearchResults/Brewery";
import withUntappdShopSearch from "custom/containers/untappd/withUntappdShopSearch";
import withWatchlistSummary from "../../containers/watchlists/withWatchlistSummary";
import withWatchlistUserItems from "../../containers/watchlists/withWatchlistUserItems";

const styles = (theme) => ({
  summaryList: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },

  watchCount: {
    display: "inline"
  },

  isNotUserFavorite: {
    color: theme.palette.reaction.coolGrey
  },

  isUserFavorite: {
    color: theme.palette.reaction.yellow
  },

  starCountAlignment: {
    alignItems: "flex-end",
    display: "flex"
  }
});

// @withStyles(styles, { withTheme: true, name: "Onboarding" })
@withStyles(styles)
@withWatchlistSummary
@withWatchlistUserItems
@observer
@withUntappdShopSearch
export default class WatchlistSummary extends Component {
  static propTypes = {
    brewerySearchResults: PropTypes.arrayOf(PropTypes.shape({
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
    })),
    classes: PropTypes.object,
    hasMoreResults: PropTypes.bool,
    isLoading: PropTypes.bool,
    isSearchingBrewery: PropTypes.bool,
    loadMoreResults: PropTypes.func,
    onBrewerySearch: PropTypes.func,
    onCreateWatchlistItem: PropTypes.func.isRequired,
    onCreateWatchlistItemForUntappdShop: PropTypes.func.isRequired,
    onRemoveWatchlistItem: PropTypes.func.isRequired,
    refetchResults: PropTypes.func,
    watchlist: PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
      summary: PropTypes.shape({
        totalCount: PropTypes.int,
        nodes: PropTypes.arrayOf(PropTypes.shape({
          itemId: PropTypes.string,
          displayName: PropTypes.string,
          label: PropTypes.string,
          count: PropTypes.int
        }))
      })
    }),
    watchlistName: PropTypes.string.isRequired,
    watchlistUserItems: PropTypes.arrayOf(PropTypes.shape({
      itemId: PropTypes.string.isRequired
    }))
  };

  state = {}
  inputRefs = {}

  handleThrottledBrewerySearch = debounce(this.props.onBrewerySearch, 500);

  handleBrewerySearch = (event) => {
    const { currentTarget: { value } } = event;

    return this.handleThrottledBrewerySearch(value);
  }

  // TODO: load userWatchlistItems on load to component page cacheable (and
  // remove `items` from the query)
  // componentDidMount() {}

  isOnUserWatchlist(itemId) {
    const { watchlistUserItems = [] } = this.props;
    return some(watchlistUserItems, ({ itemId: id }) => id === itemId);
  }

  handleCreate = (itemId, item) => {
    const { watchlistName, onCreateWatchlistItem } = this.props;

    const { itemMetadata, displayName, label } = item;
    const itemInput = { itemMetadata, displayName, label };

    onCreateWatchlistItem(watchlistName, itemId, itemInput);
  }

  handleRemove = (itemId) => {
    const { watchlistName, onRemoveWatchlistItem } = this.props;

    onRemoveWatchlistItem(watchlistName, itemId);
  }

  handleSearchClick = () => {
    this.setState({ displaySearchForm: true });
  }

  handleSearchComplete = () => {
    this.setState({ displaySearchForm: false });
  }

  handleChooseBrewery = (selectedSearchResult) => {
    const {
      onCreateWatchlistItemForUntappdShop,
      watchlist: { name: watchlistName } = {}
    } = this.props;
    const { brewery: { brewery_id: untappdId } = {} } = selectedSearchResult;

    onCreateWatchlistItemForUntappdShop(watchlistName, untappdId);

    // TODO: pass this as a callback to happen on-complete
    this.handleSearchComplete();
  }

  renderSearchButton() {
    return (
      <Grid container>
        <Grid item xs={12} sm={2} />
        <Grid item xs={12} sm={8}>
          <Button
            color="primary"
            fullWidth
            onClick={this.handleSearchClick}
            variant="contained"
          >
            <IconAdd fontSize="inherit" />
            Search for a brewery
          </Button>
        </Grid>
      </Grid>
    );
  }

  renderSummaryItemListItem = (item) => {
    const { classes } = this.props;

    const { itemId, displayName, label, count } = item;
    let IconClass;
    let iconClassName;
    let clickHandler;

    if (this.isOnUserWatchlist(itemId)) {
      IconClass = IconStarFilled;
      iconClassName = classes.isUserFavorite;
      clickHandler = this.handleRemove;
    } else {
      IconClass = IconStarOutline;
      iconClassName = classes.isNotUserFavorite;
      clickHandler = this.handleCreate;
    }

    return (
      <ListItem
        key={itemId}
        button
        divider
        onClick={() => clickHandler(itemId, item)}
      >
        <ListItemAvatar>
          <Avatar alt={displayName} src={label} />
        </ListItemAvatar>
        <ListItemText primary={displayName} />
        <ListItemSecondaryAction className={classes.starCountAlignment}>
          <IconClass className={iconClassName} />
          <Typography component="span" className={classes.watchCount}>
            {` (${count})`}
          </Typography>
        </ListItemSecondaryAction>
      </ListItem>
    );
  }

  renderSummary() {
    const {
      classes,
      watchlist: { name, summary = {} } = {}
    } = this.props;
    const { totalCount = 0, nodes } = summary;

    const subheader = (
      <ListSubheader>Top {name} ({totalCount})</ListSubheader>
    );

    return (
      <List subheader={subheader} dense className={classes.summaryList}>
        {nodes.map(this.renderSummaryItemListItem)}
      </List>
    );
  }

  renderBreweryPicker() {
    const { brewerySearchResults, classes, isSearchingBrewery } = this.props;

    const helperText = (
      <Fragment>
        Search powered by Untappd
        <IconUntappd fontSize="inherit" style={{ verticalAlign: "bottom" }} />
        {isSearchingBrewery && <em>{" Loading..."}</em>}
      </Fragment>
    );

    return (
      <Fragment>
        <TextField
          id="brewery-search"
          className={classes.textField}
          fullWidth
          helperText={helperText}
          inputRef={(input) => { this.inputRefs.brewerySearch = input; }}
          label="Search for your brewery by name"
          margin="normal"
          onChange={this.handleBrewerySearch}
          onKeyDown={this.handleKeyDown}
          type="text"
          variant="filled"

          InputLabelProps={{
            shrink: true
          }}
        />

        <UntappdSearchResults
          ItemComponent={UntappdBrewerySearchResult}
          className={classes.root}
          isLoading={isSearchingBrewery}
          onClickItem={this.handleChooseBrewery}
          searchResults={brewerySearchResults}
        />
      </Fragment>
    );
  }

  renderSearchForm() {
    return this.renderBreweryPicker();
  }

  render() {
    const { displaySearchForm } = this.state;
    return (
      <Fragment>
        <Slide direction="down" in={!displaySearchForm} mountOnEnter unmountOnExit>
          <Fragment>
            {this.renderSummary()}

            {this.renderSearchButton()}
          </Fragment>
        </Slide>

        <Slide direction="up" in={displaySearchForm} mountOnEnter unmountOnExit>
          {this.renderSearchForm()}
        </Slide>
      </Fragment>
    );
  }
}

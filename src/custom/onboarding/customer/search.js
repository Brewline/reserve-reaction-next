import _ from "lodash";
import React, { Component } from "react";
import PropTypes from "prop-types";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";

// import UntappdMarketplaceShop from "@brewline/untappd-connector/client/settings/untappd-marketplace-shop-component";
// import { FavoritesBar } from "@brewline/theme/client/components";

function UntappdMarketplaceShop() {}
function FavoritesBar() {}

export default class Search extends Component {
  static propTypes = {
    classes: PropTypes.object,
    inputRef: PropTypes.func,
    onAddShop: PropTypes.func.isRequired,
    onNextStep: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    searchResults: PropTypes.arrayOf(PropTypes.shape({
      brewery: PropTypes.object
    })),
    watchlistItems: PropTypes.arrayOf(PropTypes.shape({
      displayName: PropTypes.string
    }))
  };

  get classes() {
    const { classes = {} } = this.props;

    return classes;
  }

  handleSearch = (e) => {
    e.preventDefault();

    this.props.onSearch(this.qInput.value);

    return false;
  }

  handleSearchThrottled = _.throttle(this.handleSearch, 600);

  renderSearchResult = (brewery, index) => (
    <ListItem
      className="panel-search-results__shop"
      key={index}
    >
      <UntappdMarketplaceShop
        brewery={brewery.brewery}
        onAddShop={this.props.onAddShop}
      />
    </ListItem>
  );

  renderSearchResults() {
    if (_.get(this.props, "searchResults.length", 0) <= 0) { return; }

    return (
      <div className="panel-search-results">
        <h4>
          Search Results
        </h4>

        <Typography variant="body1" gutterBottom>
          Tap the breweries you&rsquo;d like to see do online beer releases.
        </Typography>

        <List className="panel-search-results__list">
          {this.props.searchResults.map(this.renderSearchResult)}
        </List>
      </div>
    );
  }

  renderSearch() {
    const { inputRef } = this.props;

    return (
      <div>
        <form onSubmit={this.handleSearch}>
          <div className="form-group" data-required="true">
            <input
              type="text"
              placeholder="Enter brewery name (results via Untappd)"
              ref={(ref) => {
                // create a local pointer
                this.qInput = ref;

                // call the parent method
                inputRef(ref);
              }}
              onChange={this.handleSearchThrottled}
            />
          </div>

          <Button
            className={this.classes.button}
            color="primary"
            size="large"
            type="submit"
            variant="contained"
          >
            {/* i18nKeyLabel="admin.untappdConnectSettings.startImport" */}
            {/* icon="search" */}
            Search
          </Button>
        </form>

        {this.renderSearchResults()}
      </div>
    );
  }

  renderFavorites() {
    const { watchlistItems } = this.props;

    return (
      <FavoritesBar
        favorites={watchlistItems}
        onFavoriteClick={this.handleFavoriteClick}
      />
    );
  }

  renderNext() {
    // const buttonProps = {};
    const { watchlistItems = [], onNextStep } = this.props;

    if (!watchlistItems.length) {
      return;
    }
    // //   buttonProps.bezelStyle = "flat";
    // //   buttonProps.label = "Skip";
    // //   buttonProps.i18nKeyLabel = "onboarding.skip";
    // //   buttonProps.primary = false;
    // //   buttonProps.status = "default";
    // // } else {
    // buttonProps.bezelStyle = "solid";
    // buttonProps.label = "Next";
    // buttonProps.;
    // buttonProps.primary = true;
    // buttonProps.status = "primary";
    // // }

    return (
      <Button
        action={onNextStep}
        className={this.classes.button}
        color="primary"
        icon="arrow-right"
        iconAfter={true}
        variant="contained"
      >
        {/* i18nKeyLabel = "onboarding.next" */}
        Next
      </Button>
    );
  }

  render() {
    return (
      <div className="admin-controls-content onboarding__step brewline-onboarding__search">
        <Typography variant="display1" gutterBottom>
          Search for your favorite Breweries
        </Typography>

        {this.renderFavorites()}

        <Divider label="search" i18nKeyLabel="accountsUI.search" />

        {this.renderSearch()}

        <Divider />

        <div>
          <div className="pull-right">
            {this.renderNext()}
          </div>
        </div>
      </div>
    );
  }
}

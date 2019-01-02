import _ from "lodash";
import PropTypes from "prop-types";
import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";

// import UntappdMarketplaceShop from "@brewline/untappd-connector/client/settings/untappd-marketplace-shop-component";
function UntappdMarketplaceShop() {}

export default class Search extends Component {
  static propTypes = {
    classes: PropTypes.object,
    currentBrewery: PropTypes.object,
    onAddShop: PropTypes.func.isRequired,
    onNextStep: PropTypes.func.isRequired,
    onSearch: PropTypes.func.isRequired,
    searchResults: PropTypes.arrayOf(PropTypes.object),
    userBrewery: PropTypes.object
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

  renderSearchResult(brewery, index) {
    // <i className="fa fa-cloud-download"></i>
    return (
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
  }

  renderSearchResults() {
    if (_.get(this.props, "searchResults.length", 0) <= 0) { return; }

    return (
      <div className="panel-search-results">
        <h4>
          Search Results
        </h4>

        <Typography variant="body1" gutterBottom>
          Tap your brewery to create a shop.
        </Typography>

        <List className="panel-search-results__list">
          {
            this.props.searchResults.map((r, i) => this.renderSearchResult(r, i))
          }
        </List>
      </div>
    );
  }

  renderStepComplete() {
    const shopName = _.get(this.props, "currentBrewery.name", "Your brewery");

    return (
      <div>
        <Typography variant="body1" gutterBottom>
          Great! {shopName} has already been created.
        </Typography>

        <Button
          action={this.props.onNextStep}
          className={this.classes.button}
          color="primary"
          size="large"
          variant="contained"
        >
          {/* TODO: i18n */}
          Next step
        </Button>
      </div>
    );
  }

  renderAutoComplete() {
    const breweryId = _.get(this.props, "userBrewery.brewery_id");
    return (
      <div>
        <Typography variant="body1" gutterBottom>
          Great! Using your brewery&rsquo;s Untappd account, we can create it
          automatically.
        </Typography>

        <Button
          action={() => this.props.onAddShop(breweryId)}
          className={this.classes.button}
          color="primary"
          size="large"
          variant="contained"
        >
          {/* TODO: i18n */}
          Next step
        </Button>
      </div>
    );
  }

  renderStepIncomplete() {
    return (
      <div>
        <form onSubmit={this.handleSearch}>
          <div className="form-group" data-required="true">
            <label htmlFor="untappd-search" className="control-label">Name</label>

            <input
              id="untappd-search"
              type="text"
              placeholder="search"
              ref={(i) => { this.qInput = i; }}
              onChange={this.handleSearchThrottled}
            />
          </div>

          <Button
            icon="search"
            className={this.classes.button}
            color="primary"
            size="large"
            type="submit"
            variant="contained"
          >
            <span data-i18n="admin.untappdConnectSettings.startImport">
              Search
            </span>
          </Button>
        </form>

        {this.renderSearchResults()}
      </div>
    );
  }

  render() {
    let content;

    if (this.props.currentBrewery) {
      content = this.renderStepComplete();
    } else if (this.props.userBrewery) {
      content = this.renderAutoComplete();
    } else {
      content = this.renderStepIncomplete();
    }

    return (
      <div className="admin-controls-content onboarding__step brewline-onboarding__search">
        <Typography variant="title" gutterBottom>
          Search for your Brewery
        </Typography>

        {content}
      </div>
    );
  }
}

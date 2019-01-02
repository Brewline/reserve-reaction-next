import _ from "lodash";
import React, { Component } from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Typography from "@material-ui/core/Typography";

// import UntappdConnectorProduct from "@brewline/untappd-connector/client/settings/untappd-connector-product-component";
function UntappdConnectorProduct() {}

export default class Products extends Component {
  static propTypes = {
    children: PropTypes.node,
    onAddProduct: PropTypes.func.isRequired,
    searchResults: PropTypes.arrayOf(PropTypes.object)
  };

  renderSearchResult(product, index) {
    // <i className="fa fa-cloud-download"></i>
    return (
      <ListItem
        className="panel-search-results__shop"
        key={index}
      >
        <UntappdConnectorProduct
          product={product}
          onAddProduct={this.props.onAddProduct}
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
          Tap the beer you are selling to import it.
        </Typography>

        <List className="panel-search-results__list">
          {
            this.props.searchResults
              .map((r, i) => this.renderSearchResult(r, i))
          }
        </List>
      </div>
    );
  }

  render() {
    let content;
    const { children } = this.props;

    if (children) {
      content = children;
    } else {
      content = (
        <div>
          <Typography variant="title" gutterBottom>
            Set up your Beer Release
          </Typography>

          <Typography variant="body1" gutterBottom>
            Choose the beer you are selling.
            If the beer you wish to release is not in this list, it can be added
            manually later.
          </Typography>
        </div>
      );
    }

    return (
      <div className="onboarding__step brewline-onboarding__products">
        {content}

        {this.renderSearchResults()}
      </div>
    );
  }
}

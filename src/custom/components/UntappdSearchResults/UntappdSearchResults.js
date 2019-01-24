import React, { Component } from "react";
import PropTypes from "prop-types";
import List from "@material-ui/core/List";

export default class UntappdSearchResults extends Component {
  static propTypes = {
    ItemComponent: PropTypes.func.isRequired,
    avatarSizeClassName: PropTypes.string,
    className: PropTypes.string,
    isLoading: PropTypes.bool,
    onClickItem: PropTypes.func,
    searchResults: PropTypes.array
  };

  render() {
    const {
      ItemComponent,
      avatarSizeClassName,
      className,
      onClickItem,
      searchResults
    } = this.props;

    if (!Array.isArray(searchResults)) { return null; }

    const listItems = searchResults.filter((r) => r).map((r, i) => (
      <ItemComponent
        avatarSizeClassName={avatarSizeClassName}
        key={i}
        searchResult={r}
        onClick={onClickItem}
      />
    ));

    return (
      <List className={className}>{listItems}</List>
    );
  }
}

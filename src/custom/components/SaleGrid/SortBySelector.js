import React, { Component } from "react";
import PropTypes from "prop-types";
import Select from "components/Select";

const SORT_BY = [
  {
    name: "Begin Date",
    value: "beginsAt-asc"
  },
  {
    name: "End Date",
    value: "endsAt-asc"
  },
  {
    name: "Name",
    value: "headline-asc"
  }
];

class SortBySelector extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    sortBy: PropTypes.string.isRequired
  }

  static defaultProps = {
    sortBy: SORT_BY[0].value
  }

  handleChange = (event) => {
    this.props.onChange(event.target.value);
  }

  render() {
    const { sortBy } = this.props;

    return (
      <Select
        value={sortBy}
        options={SORT_BY}
        inputProps={{
          name: "sortBy",
          id: "sort-by"
        }}
        onChange={this.handleChange}
      />
    );
  }
}

export default SortBySelector;

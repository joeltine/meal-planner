import React from "react";
import PropTypes from "prop-types";

export class FilterAnyAll extends React.Component {
  constructor(props) {
    super(props);
    this.selectRef = React.createRef();
  }

  getValue() {
    return this.selectRef.current.value;
  }

  render() {
    return (
        <div className="form-group col-md-12 form-inline">
          Filter on
          <select id="inputAnyAll"
                  ref={this.selectRef}
                  defaultValue={this.props.defaultValue || "OR"}
                  className="form-control mr-2 ml-2">
            <option value="OR">Any</option>
            <option value="AND">All</option>
          </select>
          of the following conditions:
        </div>
    );
  }
}

FilterAnyAll.propTypes = {
  defaultValue: PropTypes.string
};
import PropTypes from "prop-types";
import React from "react";

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
                  defaultValue={this.props.defaultValue || "AND"}
                  className="form-control me-2 ms-2">
            <option value="AND">All</option>
            <option value="OR">Any</option>
          </select>
          of the following conditions:
        </div>
    );
  }
}

FilterAnyAll.propTypes = {
  defaultValue: PropTypes.string
};

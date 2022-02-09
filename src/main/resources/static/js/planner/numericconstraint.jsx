import React from "react";
import PropTypes from "prop-types";

export class NumericConstraint extends React.Component {
  constructor(props) {
    super(props);
    this.constraintRef = React.createRef();
  }

  getValue() {
    return this.constraintRef.current.value;
  }

  render() {
    return (
        <select name="inputConstraint"
                className="form-control"
                ref={this.constraintRef}
                defaultValue={this.props.defaultValue || '<'}>
          <option value="<">Less Than</option>
          <option value=">">Greater Than</option>
          <option value="=">Is Equal To</option>
        </select>
    );
  }
}

NumericConstraint.propTypes = {
  defaultValue: PropTypes.string
};
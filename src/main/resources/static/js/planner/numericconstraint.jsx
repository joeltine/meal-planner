import PropTypes from 'prop-types';
import React from 'react';

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
                defaultValue={this.props.defaultValue || '<='}>
          <option value="<=">Less Than or Equal To</option>
          <option value=">=">Greater Than or Equal To</option>
          <option value="=">Is Equal To</option>
        </select>
    );
  }
}

NumericConstraint.propTypes = {
  defaultValue: PropTypes.string
};

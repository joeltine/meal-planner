import React from "react";

export class IncludesConstraint extends React.Component {
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
                defaultValue={this.props.defaultValue || 'includes'}>
          <option value="includes">Includes</option>
          <option value="doesNotInclude">Does Not Include</option>
        </select>
    );
  }
}
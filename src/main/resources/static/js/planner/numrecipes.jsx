import PropTypes from "prop-types";
import React from "react";

export class NumRecipes extends React.Component {
  constructor(props) {
    super(props);
    this.inputRef = React.createRef();
  }

  getValue() {
    return this.inputRef.current.value;
  }

  render() {
    return (
        <React.Fragment>
          <label htmlFor="inputNumRecipes"
                 className="col-md-auto col-form-label">
            How many recipes do you need?
          </label>
          <div className="col-md-auto ps-0">
            <input type="number"
                   className="form-control ms-2"
                   ref={this.inputRef}
                   name="inputNumRecipes"
                   min="1" max="30"
                   defaultValue={this.props.defaultValue || 3}
                   required/>
          </div>
        </React.Fragment>
    );
  }
}

NumRecipes.propTypes = {
  defaultValue: PropTypes.number
};

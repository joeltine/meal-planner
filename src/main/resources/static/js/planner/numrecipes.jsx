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
        <div className="form-group col-md-12 form-inline">
          <label htmlFor="inputNumRecipes">
            How many recipes do you need?
          </label>
          <input type="number"
                 className="form-control ml-2"
                 ref={this.inputRef}
                 name="inputNumRecipes"
                 min="1" max="30"
                 defaultValue={this.props.defaultValue || 3}
                 required/>
        </div>
    );
  }
}
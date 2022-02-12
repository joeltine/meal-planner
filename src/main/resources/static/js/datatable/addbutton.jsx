import PropTypes from "prop-types";
import React from 'react';

export class AddButton extends React.Component {
  render() {
    return (
        <button onClick={this.props.onAddClick} type="button"
                className="btn btn-success">
          <svg className="feather me-1" viewBox="0 0 24 24">
            <use href="#icon-plus"/>
          </svg>
          Add New Row
        </button>
    );
  }
}

AddButton.propTypes = {
  onAddClick: PropTypes.func
};

import PropTypes from "prop-types";
import React from 'react';

export class DeleteButton extends React.Component {
  render() {
    return (
        <button onClick={this.props.onDeleteClick} type="button"
                className="btn btn-danger">
          <svg className="feather me-1" viewBox="0 0 24 24">
            <use href="#icon-trash"/>
          </svg>
          Delete Selected
        </button>
    );
  }
}

DeleteButton.propTypes = {
  onDeleteClick: PropTypes.func
};

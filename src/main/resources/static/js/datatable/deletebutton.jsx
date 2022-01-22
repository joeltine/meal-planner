import React from 'react';
import PropTypes from "prop-types";

export class DeleteButton extends React.Component {
  render() {
    return (
        <button onClick={this.props.onDeleteClick} type="button"
                className="btn btn-danger">
          <svg className="feather mr-1" viewBox="0 0 24 24">
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

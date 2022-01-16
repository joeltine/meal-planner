import React from 'react';

export class DeleteButton extends React.Component {
  render() {
    return (
        <button type="button" className="btn btn-danger">
          <svg className="feather mr-1" viewBox="0 0 24 24">
            <use href="#icon-trash"/>
          </svg>
          Delete Selected
        </button>
    );
  }
}
import React from 'react';

export class AddButton extends React.Component {
  render() {
    return (
        <button type="button" className="btn btn-success">
          <svg className="feather mr-1" viewBox="0 0 24 24">
            <use href="#icon-plus"/>
          </svg>
          Add New Row
        </button>
    );
  }
}
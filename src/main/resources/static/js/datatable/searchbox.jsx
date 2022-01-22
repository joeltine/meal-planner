import React from 'react';
import PropTypes from "prop-types";

export class SearchBox extends React.Component {
  render() {
    return (
        <div className="input-group">
          <input type="text" className="form-control"
                 placeholder="Search..."
                 onChange={(e) => {
                   this.props.onSearchChange(e.target.value)
                 }}/>
        </div>
    );
  }
}

SearchBox.propTypes = {
  onSearchChange: PropTypes.func
};
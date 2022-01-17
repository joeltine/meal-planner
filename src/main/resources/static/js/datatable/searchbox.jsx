import React from 'react';

export class SearchBox extends React.Component {
  render() {
    return (
        <div className="input-group">
          <input type="text" className="form-control"
                 placeholder="Search..."
                 onChange={(e) => {
                   this.props.onSearchChange(e.target.value)
                 }}/>
          <div className="input-group-append">
            <button className="btn btn-primary" type="button" id="search">
              Search
            </button>
          </div>
        </div>
    );
  }
}
import PropTypes from 'prop-types';
import React from 'react';

export class FilterAnyAll extends React.Component {
  constructor(props) {
    super(props);
    this.selectRef = React.createRef();
  }

  getValue() {
    return this.selectRef.current.value;
  }

  render() {
    return (
        <React.Fragment>
          <div className="col-md-auto align-self-center">
            <span>Filter on</span>
          </div>
          <div className="col-md-auto ps-1 pe-1">
            <select id="inputAnyAll"
                    ref={this.selectRef}
                    defaultValue={this.props.defaultValue || 'AND'}
                    className="form-control">
              <option value="AND">All</option>
              <option value="OR">Any</option>
            </select>
          </div>
          <div className="col-md-auto align-self-center">
            <span>of the following conditions:</span>
          </div>
        </React.Fragment>
    );
  }
}

FilterAnyAll.propTypes = {
  defaultValue: PropTypes.string
};

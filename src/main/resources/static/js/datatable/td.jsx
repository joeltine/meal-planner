import PropTypes from 'prop-types';
import React from 'react';

export class Td extends React.Component {
  constructor(props) {
    super(props);
    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.state = {inEditMode: false};
  }

  onDoubleClick() {
    if (!this.props.editable) {
      return;
    }
    this.setState({
      inEditMode: true
    });
  }

  onKeyUp(e) {
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      this.setState({
        inEditMode: false
      });

      if (e.key === 'Enter') {
        this.props.onValueUpdate(e.currentTarget.value);
      }
    }
  }

  render() {
    if (this.state.inEditMode) {
      // TODO: Handle different input types based on the data type.
      return (
          <td>
            <input type="text"
                   className="form-control w-auto editableCell"
                   defaultValue={this.props.value}
                   onKeyUp={this.onKeyUp} autoFocus/>
          </td>
      );
    } else {
      return (
          <td onDoubleClick={this.onDoubleClick}>{this.props.value}</td>
      );
    }
  }
}

Td.propTypes = {
  value: PropTypes.any.isRequired,
  onValueUpdate: PropTypes.func,
  editable: PropTypes.bool
};

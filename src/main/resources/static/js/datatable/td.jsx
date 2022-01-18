import React from "react";

export class Td extends React.Component {
  constructor(props) {
    super(props);
    this.onDoubleClick = this.onDoubleClick.bind(this);
    this.onKeyUp = this.onKeyUp.bind(this);
    this.state = {editable: false};
  }

  onDoubleClick() {
    this.setState({
      editable: true
    });
  }

  onKeyUp(e) {
    if (e.key === 'Enter' || e.key === 'Escape') {
      e.preventDefault();
      e.stopPropagation();
      this.setState({
        editable: false
      });

      if (e.key === 'Enter') {
        this.props.onValueUpdate(e.currentTarget.value);
      }
    }
  }

  render() {
    if (this.state.editable) {
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
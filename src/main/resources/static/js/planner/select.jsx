import React from "react";
import PropTypes from "prop-types";

export class Select extends React.Component {
  constructor(props) {
    super(props);
    this.selectRef = React.createRef();
  }

  getValue() {
    return this.selectRef.current.value;
  }

  buildOptions() {
    return Object.entries(this.props.options).map(([val, text]) => {
      return <option value={val} key={val}>{text}</option>
    });
  }

  render() {
    return (
        <select name={this.props.name}
                className="form-control"
                ref={this.selectRef}
                onChange={(e) => {
                  if (this.props.onSelectChange) {
                    this.props.onSelectChange(e.target.value);
                  }
                }}
                defaultValue={this.props.defaultValue}>
          {this.buildOptions()}
        </select>
    );
  }
}

Select.propTypes = {
  options: PropTypes.arrayOf(PropTypes.object).isRequired,
  name: PropTypes.string.isRequired,
  onSelectChange: PropTypes.func,
  defaultValue: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ])
};
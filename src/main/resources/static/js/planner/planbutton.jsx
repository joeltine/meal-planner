import React from "react";
import PropTypes from "prop-types";

export class PlanButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<button type="button" className="btn btn-primary"
                    onClick={this.props.onButtonClick}>Plan</button>);
  }
}

PlanButton.propTypes = {
  onButtonClick: PropTypes.func.isRequired
};
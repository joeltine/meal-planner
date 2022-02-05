import React from "react";

export class PlanButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (<button type="button" className="btn btn-primary"
                    onClick={this.props.onButtonClick}>Plan</button>);
  }
}
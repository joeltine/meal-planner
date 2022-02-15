import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React from 'react';

export class PlanButton extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <Button variant="contained" onClick={this.props.onButtonClick}>
          Generate Meal Plan
        </Button>
    );
  }
}

PlanButton.propTypes = {
  onButtonClick: PropTypes.func.isRequired
};

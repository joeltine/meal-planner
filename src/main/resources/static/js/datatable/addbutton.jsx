import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';
import PropTypes from "prop-types";
import React from 'react';

export class AddButton extends React.Component {
  render() {
    return (
        <Button startIcon={<AddIcon/>}
                variant="contained"
                onClick={this.props.onAddClick}>
          Add New Row
        </Button>
    );
  }
}

AddButton.propTypes = {
  onAddClick: PropTypes.func
};

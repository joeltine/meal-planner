import DeleteIcon from '@mui/icons-material/Delete';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React from 'react';

export class DeleteButton extends React.Component {
  render() {
    return (
        <Button startIcon={<DeleteIcon/>}
                color="error"
                variant="contained"
                onClick={this.props.onDeleteClick}>
          Delete Selected
        </Button>
    );
  }
}

DeleteButton.propTypes = {
  onDeleteClick: PropTypes.func
};

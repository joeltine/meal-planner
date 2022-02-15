import DownloadIcon from '@mui/icons-material/Download';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React from 'react';

export class HeaderButtons extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
        <React.Fragment>
          <Button id="resetForm"
                  className="ms-1"
                  startIcon={<RestartAltIcon/>}
                  variant="contained"
                  color="error"
                  onClick={this.props.onResetFormClick}>
            Reset Form
          </Button>
          <Button id="importRecipeModalButton"
                  className="ms-1"
                  startIcon={<DownloadIcon/>}
                  variant="contained"
                  onClick={this.props.onImportRecipeClick}>
            Import Recipe
          </Button>
        </React.Fragment>
    );
  }
}

HeaderButtons.propTypes = {
  onResetFormClick: PropTypes.func.isRequired,
  onImportRecipeClick: PropTypes.func.isRequired
};

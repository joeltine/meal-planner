import {LinearProgress, TextField} from '@mui/material';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import PropTypes from 'prop-types';
import React from 'react';

export class ImportRecipeDialog extends React.Component {
  constructor(props) {
    super(props);
    this.state = {url: '', helperText: '', error: false};
    this.onUrlChange = this.onUrlChange.bind(this);
  }

  onUrlChange(e) {
    let error = false;
    let helperText = '';
    if (!e.target.checkValidity()) {
      error = true;
      helperText = 'Invalid URL. Must be of form "https://...".';
    }
    this.setState({
      url: e.target.value,
      error: error,
      helperText: helperText
    });
  }

  render() {
    return (
        <Dialog open={this.props.open} onClose={this.props.handleCloseClick}>
          <DialogTitle>Import Recipe Via URL</DialogTitle>
          <DialogContent>
            <TextField
                className="m-2"
                id="importUrl"
                required
                type="url"
                error={this.state.error}
                disabled={this.props.disabled}
                helperText={this.state.helperText}
                value={this.state.url}
                onChange={this.onUrlChange}
                placeholder="https://..."
                inputProps={{
                  pattern: "https?://.*"
                }}
                label="URL"
            />
            {this.props.inProgress && <LinearProgress/>}
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.handleCloseClick}>Cancel</Button>
            <Button onClick={() => {
              if (!this.state.url) {
                this.setState({
                  error: true,
                  helperText: 'URL cannot be empty.'
                });
              } else if (!this.state.error) {
                this.props.handleImportClick(this.state.url);
              }
            }}>
              Import
            </Button>
          </DialogActions>
        </Dialog>
    );
  }
}

ImportRecipeDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleCloseClick: PropTypes.func.isRequired,
  handleImportClick: PropTypes.func.isRequired,
  inProgress: PropTypes.bool.isRequired,
  disabled: PropTypes.bool.isRequired
};

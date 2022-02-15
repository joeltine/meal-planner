import {TextField} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import {getValidityMessage, ValidityStates} from './validation';

const INSTRUCTIONS_ERRORS = {
  [ValidityStates.VALUE_MISSING]: 'Instructions are required!'
};

export class Instructions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {instructionsError: ''};
  }

  updateInstructionsError(event) {
    this.setState({
      instructionsError: getValidityMessage(INSTRUCTIONS_ERRORS, event.target)
    });
  }

  render() {
    return (
        <React.Fragment>
          <div className="row">
            <h3>Instructions</h3>
          </div>
          <div className="row">
            <div className="col-md-12">
              <TextField
                  id="inputInstructions"
                  name="inputInstructions"
                  label="Instructions"
                  multiline
                  rows={6}
                  inputProps={{maxLength: 65535}}
                  fullWidth
                  onInvalid={this.updateInstructionsError.bind(this)}
                  helperText={this.state.instructionsError}
                  error={!!this.state.instructionsError}
                  required
                  onChange={(e) => {
                    if (this.props.onInstructionsChange) {
                      this.props.onInstructionsChange(e.target.value);
                    }
                    this.updateInstructionsError(e);
                  }}
                  value={this.props.instructions || ''}/>
            </div>
          </div>
        </React.Fragment>
    );
  }
}

Instructions.propTypes = {
  instructions: PropTypes.string,
  onInstructionsChange: PropTypes.func
};

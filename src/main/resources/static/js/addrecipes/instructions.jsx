import {TextField} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

export class Instructions extends React.Component {
  constructor(props) {
    super(props);
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
                  onChange={(e) => {
                    if (this.props.onInstructionsChange) {
                      this.props.onInstructionsChange(e.target.value);
                    }
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

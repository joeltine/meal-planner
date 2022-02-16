import {TextField} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import {getValidityMessage, ValidityStates} from './validation';

const NAME_ERRORS = {
  [ValidityStates.VALUE_MISSING]: 'Missing recipe name!'
};

export class BasicInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {nameError: ''};
  }

  updateNameError(event) {
    this.setState({
      nameError: getValidityMessage(NAME_ERRORS, event.target)
    });
  }

  render() {
    return (
        <React.Fragment>
          <div className="row">
            <h3>Basic Info</h3>
          </div>

          <div className="row">
            <div className="col-md-12">
              <TextField id="inputRecipeName"
                         name="inputRecipeName"
                         fullWidth
                         label="Recipe name"
                         size="small"
                         variant="outlined"
                         value={this.props.name || ''}
                         inputProps={{maxLength: 255}}
                         required
                         onInvalid={this.updateNameError.bind(this)}
                         helperText={this.state.nameError}
                         error={!!this.state.nameError}
                         onChange={(e) => {
                           if (this.props.onRecipeNameChange) {
                             this.props.onRecipeNameChange(e.target.value);
                           }
                           this.updateNameError(e);
                         }}/>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <TextField
                  id="inputDescription"
                  name="inputDescription"
                  label="Recipe description"
                  multiline
                  rows={4}
                  value={this.props.description || ''}
                  inputProps={{maxLength: 65535}}
                  onChange={(e) => {
                    if (this.props.onDescriptionChange) {
                      this.props.onDescriptionChange(e.target.value);
                    }
                  }}
                  fullWidth/>
            </div>
          </div>

        </React.Fragment>
    );
  }
}

BasicInfo.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
  onRecipeNameChange: PropTypes.func,
  onDescriptionChange: PropTypes.func
};

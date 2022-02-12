import {TextField} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

export class BasicInfo extends React.Component {
  constructor(props) {
    super(props);
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
                         onChange={(e) => {
                           if (this.props.onRecipeNameChange) {
                             this.props.onRecipeNameChange(e.target.value);
                           }
                         }}
                         required/>
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

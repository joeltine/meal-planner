import {InputAdornment, TextField} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import {sendAjax} from '../common/ajax';
import {ChipMultiSelect} from './chipmultiselect';
import {getValidityMessage, ValidityStates} from './validation';

const PREP_TIME_ERRORS = {
  [ValidityStates.PATTERN_MISMATCH]: 'Invalid integer!',
  [ValidityStates.VALUE_MISSING]: 'Missing prep time!'
};

const COOK_TIME_ERRORS = {
  [ValidityStates.PATTERN_MISMATCH]: 'Invalid integer!',
  [ValidityStates.VALUE_MISSING]: 'Missing cook time!'
};

export class OtherInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      recipeTypes: [],
      mealTypes: [],
      recipeCategories: [],
      prepTimeError: '',
      cookTimeError: '',
      recipeTypeError: '',
      mealTypeError: ''
    };
  }

  updatePrepTimeValidity(event) {
    this.setState({
      prepTimeError: getValidityMessage(PREP_TIME_ERRORS, event.target)
    });
  }

  updateCookTimeValidity(event) {
    this.setState({
      cookTimeError: getValidityMessage(COOK_TIME_ERRORS, event.target)
    });
  }

  updateRecipeTypeValidity(values) {
    this.setState({
      recipeTypeError: values.length ? '' : 'Missing recipe type!'
    });
  }

  updateMealTypeValidity(values) {
    this.setState({
      mealTypeError: values.length ? '' : 'Missing meal type!'
    });
  }

  componentDidMount() {
    sendAjax('/recipeTypes').done((types) => {
      this.setState({
        recipeTypes: types
      });
    });

    sendAjax('/mealTypes').done((types) => {
      this.setState({
        mealTypes: types
      });
    });

    sendAjax('/recipeCategories').done((categories) => {
      this.setState({
        recipeCategories: categories
      });
    });
  }

  render() {
    return (
        <React.Fragment>
          <div className="row">
            <h3>Other info</h3>
          </div>

          <div className="row gy-2">
            <div className="col-md-3">
              <TextField
                  label="Prep time"
                  id="inputPrepTime"
                  name="inputPrepTime"
                  fullWidth
                  size="small"
                  required
                  value={this.props.prepTime || ''}
                  error={!!this.state.prepTimeError}
                  helperText={this.state.prepTimeError}
                  onInvalid={this.updatePrepTimeValidity.bind(this)}
                  onChange={(e) => {
                    if (this.props.onPrepTimeChange) {
                      this.props.onPrepTimeChange(e.target.value);
                    }
                    this.updatePrepTimeValidity(e);
                  }}
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '^[0-9]+$'
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment
                        position="end">min</InputAdornment>,
                  }}/>
            </div>
            <div className="col-md-3">
              <TextField
                  label="Cook time"
                  id="inputCookTime"
                  name="inputCookTime"
                  fullWidth
                  size="small"
                  required
                  value={this.props.cookTime || ''}
                  error={!!this.state.cookTimeError}
                  helperText={this.state.cookTimeError}
                  onInvalid={this.updateCookTimeValidity.bind(this)}
                  onChange={(e) => {
                    if (this.props.onCookTimeChange) {
                      this.props.onCookTimeChange(e.target.value);
                    }
                    this.updateCookTimeValidity(e);
                  }}
                  inputProps={{
                    inputMode: 'numeric',
                    pattern: '^[0-9]+$'
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment
                        position="end">min</InputAdornment>,
                  }}/>
            </div>
          </div>

          <div className="row gy-2">
            <div className="col-md-4">
              <ChipMultiSelect id="inputRecipeType"
                               label="Recipe types"
                               required={true}
                               helperText={this.state.recipeTypeError}
                               onInvalid={() => {
                                 this.updateRecipeTypeValidity([]);
                               }}
                               values={this.props.recipeTypes || []}
                               options={this.state.recipeTypes}
                               onChange={(e) => {
                                 this.props.onRecipeTypesChange(e.target.value);
                                 this.updateRecipeTypeValidity(e.target.value);
                               }}/>
            </div>
            <div className="col-md-4">
              <ChipMultiSelect id="inputMealType"
                               label="Meal types"
                               required={true}
                               helperText={this.state.mealTypeError}
                               onInvalid={() => {
                                 this.updateMealTypeValidity([]);
                               }}
                               values={this.props.mealTypes || []}
                               options={this.state.mealTypes}
                               onChange={(e) => {
                                 this.props.onMealTypesChange(e.target.value);
                                 this.updateMealTypeValidity(e.target.value);
                               }}/>
            </div>
            <div className="col-md-4">
              <ChipMultiSelect id="inputRecipeCategories"
                               label="Other categories"
                               values={this.props.recipeCategories || []}
                               options={this.state.recipeCategories}
                               onChange={(e) => {
                                 this.props.onRecipeCategoriesChange(
                                     e.target.value);
                               }}/>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12">
              <TextField label="External link"
                         id="inputExternalLink"
                         name="inputExternalLink"
                         placeholder="https://..."
                         fullWidth
                         type="url"
                         inputProps={{
                           pattern: 'https?://.*'
                         }}
                         value={this.props.externalLink || ''}
                         onChange={(e) => {
                           if (this.props.onExternalLinkChange) {
                             this.props.onExternalLinkChange(e.target.value);
                           }
                         }}
                         size="small"/>
            </div>
          </div>
        </React.Fragment>
    );
  }
}

OtherInfo.propTypes = {
  cookTime: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  prepTime: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
  ]),
  externalLink: PropTypes.string,
  recipeTypes: PropTypes.arrayOf(PropTypes.number),
  mealTypes: PropTypes.arrayOf(PropTypes.number),
  recipeCategories: PropTypes.arrayOf(PropTypes.number),
  onRecipeCategoriesChange: PropTypes.func.isRequired,
  onMealTypesChange: PropTypes.func.isRequired,
  onRecipeTypesChange: PropTypes.func.isRequired,
  onPrepTimeChange: PropTypes.func,
  onCookTimeChange: PropTypes.func,
  onExternalLinkChange: PropTypes.func
};

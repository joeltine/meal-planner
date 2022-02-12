import {InputAdornment, TextField} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import {sendAjax} from '../common/ajax';
import {ChipMultiSelect} from './chipmultiselect';

export class OtherInfo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {recipeTypes: [], mealTypes: [], recipeCategories: []};
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
                  onChange={(e) => {
                    if (this.props.onPrepTimeChange) {
                      this.props.onPrepTimeChange(e.target.value);
                    }
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
                  onChange={(e) => {
                    if (this.props.onCookTimeChange) {
                      this.props.onCookTimeChange(e.target.value);
                    }
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
                               values={this.props.recipeTypes || []}
                               options={this.state.recipeTypes}
                               onChange={this.props.onRecipeTypesChange}/>
            </div>
            <div className="col-md-4">
              <ChipMultiSelect id="inputMealType"
                               label="Meal types"
                               required={true}
                               values={this.props.mealTypes || []}
                               options={this.state.mealTypes}
                               onChange={this.props.onMealTypesChange}/>
            </div>
            <div className="col-md-4">
              <ChipMultiSelect id="inputRecipeCategories"
                               label="Other categories"
                               values={this.props.recipeCategories || []}
                               options={this.state.recipeCategories}
                               onChange={this.props.onRecipeCategoriesChange}/>
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
                           pattern: "https?://.*"
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

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {IconButton, TextField} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import {IngredientAutoComplete} from './ingredientautocomplete';
import {OutlinedSelect} from './outlinedselect';
import {getValidityMessage, ValidityStates} from './validation';

const QUANTITY_ERRORS = {
  [ValidityStates.PATTERN_MISMATCH]: 'Invalid number!',
  [ValidityStates.VALUE_MISSING]: 'Missing quantity!'
};

export class IngredientRow extends React.Component {

  constructor(props) {
    super(props);
    this.state = {quantityError: '', unitError: ''};
  }

  updateQuantityValidity(event) {
    this.setState({
      quantityError: getValidityMessage(QUANTITY_ERRORS, event.target)
    });
  }

  render() {
    return (
        <div className="row ingredientInputRow" id="ingredientInputRow">
          <div className="row gy-2">
            <div className="col-md-auto">
              <TextField id="inputQuantity"
                         name="inputQuantity"
                         label="Quantity"
                         size="small"
                         variant="outlined"
                         value={this.props.quantity || ''}
                         sx={{width: '15ch'}}
                         error={!!this.state.quantityError}
                         helperText={this.state.quantityError}
                         onInvalid={this.updateQuantityValidity.bind(this)}
                         inputProps={{
                           inputMode: 'numeric',
                           pattern: '^([0-9]+\\.?[0-9]*|\\.[0-9]+)$'
                         }}
                         onChange={(e) => {
                           if (this.props.onQuantityChange) {
                             this.props.onQuantityChange(e.target.value);
                           }
                           this.updateQuantityValidity(e);
                         }}
                         required/>
            </div>
            <div className="col-md-auto">
              <OutlinedSelect label="Units"
                              options={this.props.unitOptions}
                              id="inputUnits"
                              name="inputUnits"
                              helperText={this.state.unitError}
                              onInvalid={() => {
                                this.setState({
                                  unitError: 'Missing unit!'
                                });
                              }}
                              value={this.props.unit
                                  ? this.props.unit.toString() : ''}
                              onChange={(e) => {
                                if (this.props.onUnitsChange) {
                                  this.props.onUnitsChange(e.target.value);
                                }
                                // If they're setting a value, it inherently
                                // can't be an error.
                                this.setState({
                                  unitError: ''
                                });
                              }}
                              required={true}/>
            </div>
            <div className="col-md w-100">
              <IngredientAutoComplete
                  selectedIngredient={this.props.ingredient}
                  onChange={this.props.onIngredientChange}
                  onInputChange={this.props.onIngredientInputChange}
                  ingredients={this.props.ingredientOptions}/>
            </div>
            <div className="col-md w-100">
              <TextField id="inputIngredientDisplayName"
                         name="inputIngredientDisplayName"
                         label="Display name"
                         size="small"
                         value={this.props.displayName || ''}
                         fullWidth
                         variant="outlined"
                         onChange={(e) => {
                           if (this.props.onDisplayNameChange) {
                             this.props.onDisplayNameChange(e.target.value);
                           }
                         }}/>
            </div>
            <div className="col-md-auto p-0 text-center">
              <IconButton aria-label="delete"
                          onClick={this.props.onDeleteClick}>
                <RemoveCircleOutlineIcon/>
              </IconButton>
              <IconButton aria-label="add" onClick={this.props.onAddClick}>
                <AddCircleOutlineIcon/>
              </IconButton>
            </div>
          </div>
          {this.props.originalName &&
              <div className="row ingredientOriginalTextRow">
                <div className="col-md-12">
                  <div className="alert alert-light p-0 ingredientOriginalText"
                       role="alert">
                    (Original: {this.props.originalName})
                  </div>
                </div>
              </div>
          }
        </div>
    );
  }
}

IngredientRow.propTypes = {
  onAddClick: PropTypes.func.isRequired,
  onDeleteClick: PropTypes.func.isRequired,
  quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ingredient: PropTypes.exact({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  }),
  ingredientOptions: PropTypes.arrayOf(PropTypes.exact({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })),
  unit: PropTypes.number,
  unitOptions: PropTypes.arrayOf(PropTypes.exact({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  displayName: PropTypes.string,
  originalName: PropTypes.string,
  onIngredientChange: PropTypes.func,
  onIngredientInputChange: PropTypes.func,
  onDisplayNameChange: PropTypes.func,
  onQuantityChange: PropTypes.func,
  onUnitsChange: PropTypes.func
};

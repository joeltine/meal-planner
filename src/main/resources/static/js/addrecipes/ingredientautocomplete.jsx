import {Autocomplete, TextField} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

import {getValidityMessage, ValidityStates} from './validation';

const INGREDIENT_ERRORS = {
  [ValidityStates.VALUE_MISSING]: 'Missing ingredient!'
};

export class IngredientAutoComplete extends React.Component {
  constructor(props) {
    super(props);
    this.state = {ingredientError: ''};
    this.updateIngredientError = this.updateIngredientError.bind(this);
  }

  updateIngredientError(event) {
    this.setState({
      ingredientError: getValidityMessage(INGREDIENT_ERRORS, event.target)
    });
  }

  render() {
    return (
        <Autocomplete
            size="small"
            id="inputIngredient"
            options={this.props.ingredients || []}
            clearOnEscape
            autoHighlight
            fullWidth
            selectOnFocus
            clearOnBlur
            getOptionLabel={(option) => option.name}
            value={this.props.selectedIngredient}
            onChange={this.props.onChange}
            isOptionEqualToValue={(option, value) => {
              return option.id === value.id;
            }}
            onInputChange={(event, newInputValue) => {
              this.props.onInputChange(newInputValue);
            }}
            renderInput={(params) => {
              return (
                  <React.Fragment>
                    <TextField {...params}
                               label="Ingredient"
                               name="inputIngredient"
                               onBlur={this.updateIngredientError}
                               onChange={this.updateIngredientError}
                               onInvalid={this.updateIngredientError}
                               helperText={this.state.ingredientError}
                               error={!!this.state.ingredientError}
                               required/>
                  </React.Fragment>
              );
            }}
            // Required for search as you type implementations:
            // https://mui.com/components/autocomplete/#search-as-you-type
            filterOptions={(x) => x}
        />
    );
  }
}

IngredientAutoComplete.propTypes = {
  ingredients: PropTypes.arrayOf(PropTypes.exact({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })),
  onInputChange: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  selectedIngredient: PropTypes.exact({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })
};


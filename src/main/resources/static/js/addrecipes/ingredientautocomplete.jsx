import {Autocomplete, TextField} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';

export class IngredientAutoComplete extends React.Component {
  constructor(props) {
    super(props);
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
              // Hidden input so that FormData can find the value of this input.
              return (
                  <React.Fragment>
                    <TextField {...params}
                               label="Ingredient"
                               required/>
                    <input type="hidden"
                           name="inputIngredient"
                           value={this.props.selectedIngredient
                               ? this.props.selectedIngredient.id
                               : ''}/>
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


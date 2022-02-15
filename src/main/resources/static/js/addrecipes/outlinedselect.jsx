import {FormHelperText, InputLabel, MenuItem, Select} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import PropTypes from 'prop-types';
import React from 'react';

export class OutlinedSelect extends React.Component {
  constructor(props) {
    super(props);
  }

  buildMenuItems() {
    return this.props.options.map((option) => {
      return (
          <MenuItem key={option.id}
                    value={option.id}>
            {option.name}
          </MenuItem>
      );
    });
  }

  render() {
    return (
        <FormControl fullWidth size="small"
                     required={this.props.required}
                     error={!!this.props.helperText}>
          <InputLabel
              id={`${this.props.id}Label`}>{this.props.label}</InputLabel>
          <Select
              labelId={`${this.props.id}Label`}
              id={this.props.id}
              name={this.props.name}
              defaultValue=""
              sx={{minWidth: 140}}
              onInvalid={this.props.onInvalid}
              onChange={(e) => {
                if (this.props.onChange) {
                  this.props.onChange(e);
                }
              }}
              value={this.props.value || ''}
              label={this.props.label}>
            {this.buildMenuItems()}
          </Select>
          <FormHelperText>{this.props.helperText}</FormHelperText>
        </FormControl>
    );
  }
}

OutlinedSelect.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.exact({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  required: PropTypes.bool,
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func,
  onInvalid: PropTypes.func.isRequired,
  helperText: PropTypes.string.isRequired
};

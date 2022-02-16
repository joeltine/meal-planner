import {
  Box,
  Chip,
  FormHelperText,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select
} from '@mui/material';
import FormControl from '@mui/material/FormControl';
import PropTypes from 'prop-types';
import React from 'react';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export class ChipMultiSelect extends React.Component {
  constructor(props) {
    super(props);
  }

  getStyles(newValue, values) {
    return {
      fontWeight:
          values.indexOf(newValue) === -1 ?
              'normal' :
              'bold'
    };
  }

  buildMenuItems() {
    return this.props.options.map((option) => {
      return (
          <MenuItem key={option.id}
                    value={option.id}
                    style={this.getStyles(option.id, this.props.values)}>
            {option.name}
          </MenuItem>
      );
    });
  }

  findNameForId(value) {
    return this.props.options.find((el) => el.id === value).name;
  }

  getChips(selected) {
    return selected.map((value) => {
      return <Chip key={value} label={this.findNameForId(value)}/>;
    });
  }

  render() {
    return (
        <FormControl fullWidth size="small"
                     required={this.props.required}
                     error={!!this.props.helperText}>
          <InputLabel
              id={`${this.props.id}Label`}>
            {this.props.label}
          </InputLabel>
          <Select
              labelId={`${this.props.id}Label`}
              id={this.props.id}
              name={this.props.id}
              multiple
              label={this.props.label}
              value={this.props.values || []}
              onInvalid={this.props.onInvalid || (() => {
              })}
              onChange={this.props.onChange}
              input={<OutlinedInput id={`${this.props.id}Chip`}
                                    label={this.props.label}/>}
              renderValue={(selected) => {
                return (
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 0.5}}>
                      {this.getChips(selected)}
                    </Box>
                );
              }}
              MenuProps={MenuProps}>
            {this.buildMenuItems()}
          </Select>
          <FormHelperText>{this.props.helperText}</FormHelperText>
        </FormControl>
    );
  }
}

ChipMultiSelect.propTypes = {
  label: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.exact({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired
  })).isRequired,
  required: PropTypes.bool,
  id: PropTypes.string.isRequired,
  values: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func.isRequired,
  onInvalid: PropTypes.func,
  helperText: PropTypes.string
};


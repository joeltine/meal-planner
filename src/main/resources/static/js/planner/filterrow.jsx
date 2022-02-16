import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import {IconButton} from '@mui/material';
import PropTypes from 'prop-types';
import React from 'react';
import {Typeahead} from 'react-bootstrap-typeahead';

import {sendAjax} from '../common/ajax';
import {IncludesConstraint} from './includesconstraint';
import {NumericConstraint} from './numericconstraint';
import {Select} from './select';

const FilterTypes = {
  RECIPE_TYPES: 'recipeTypes',
  RECIPE_CATEGORIES: 'recipeCategories',
  MEAL_TYPES: 'mealTypes',
  INGREDIENTS: 'ingredients',
  TOTAL_TIME: 'totalTime',
  COOK_TIME: 'cookTime',
  PREP_TIME: 'prepTime'
};

const ConstraintTypes = {
  INCLUDES: IncludesConstraint,
  NUMERIC: NumericConstraint
};

const ConstraintValueInputs = {
  SELECT: 'Select',
  NUMERIC: 'Numeric',
  TYPEAHEAD: 'Typeahead'
};

// TODO: Convert these to single object.

const FilterTypesToText = {
  [FilterTypes.RECIPE_TYPES]: 'Recipe Types',
  [FilterTypes.RECIPE_CATEGORIES]: 'Recipe Categories',
  [FilterTypes.MEAL_TYPES]: 'Meal Types',
  [FilterTypes.INGREDIENTS]: 'Ingredients',
  [FilterTypes.TOTAL_TIME]: 'Total Time (min)',
  [FilterTypes.COOK_TIME]: 'Cook Time (min)',
  [FilterTypes.PREP_TIME]: 'Prep Time (min)'
};

const FilterTypesToConstraint = {
  [FilterTypes.RECIPE_TYPES]: ConstraintTypes.INCLUDES,
  [FilterTypes.RECIPE_CATEGORIES]: ConstraintTypes.INCLUDES,
  [FilterTypes.MEAL_TYPES]: ConstraintTypes.INCLUDES,
  [FilterTypes.INGREDIENTS]: ConstraintTypes.INCLUDES,
  [FilterTypes.TOTAL_TIME]: ConstraintTypes.NUMERIC,
  [FilterTypes.COOK_TIME]: ConstraintTypes.NUMERIC,
  [FilterTypes.PREP_TIME]: ConstraintTypes.NUMERIC
};

const FilterTypesToValueInput = {
  [FilterTypes.RECIPE_TYPES]: ConstraintValueInputs.SELECT,
  [FilterTypes.RECIPE_CATEGORIES]: ConstraintValueInputs.SELECT,
  [FilterTypes.MEAL_TYPES]: ConstraintValueInputs.SELECT,
  [FilterTypes.INGREDIENTS]: ConstraintValueInputs.TYPEAHEAD,
  [FilterTypes.TOTAL_TIME]: ConstraintValueInputs.NUMERIC,
  [FilterTypes.COOK_TIME]: ConstraintValueInputs.NUMERIC,
  [FilterTypes.PREP_TIME]: ConstraintValueInputs.NUMERIC
};

const DATA_CACHE = {};

export class FilterRow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterTypeValue: FilterTypes.RECIPE_TYPES,
      filterTypeData: {
        [FilterTypes.RECIPE_CATEGORIES]: {},
        [FilterTypes.RECIPE_TYPES]: {},
        [FilterTypes.MEAL_TYPES]: {},
        [FilterTypes.INGREDIENTS]: []
      }
    };
    this.filterTypeSelectRef = React.createRef();
    this.constraintRef = React.createRef();
    this.constraintValueRef = React.createRef();
    this.onFilterTypeChange = this.onFilterTypeChange.bind(this);
    this.addFilterRowClick = this.addFilterRowClick.bind(this);
    this.removeFilterRowClick = this.removeFilterRowClick.bind(this);
  }

  addFilterRowClick() {
    this.props.addRowClick(this.props.identifier);
  }

  removeFilterRowClick() {
    this.props.removeRowClick(this.props.identifier);
  }

  componentDidMount() {
    Promise.all([
      this.getRecipeCategories(),
      this.getRecipesTypes(),
      this.getMealTypes(),
      this.getIngredients()
    ]).then((results) => {
      this.setState({
        filterTypeData: {
          [FilterTypes.RECIPE_CATEGORIES]: results[0],
          [FilterTypes.RECIPE_TYPES]: results[1],
          [FilterTypes.MEAL_TYPES]: results[2],
          [FilterTypes.INGREDIENTS]: results[3]
        }
      });
    });
  }

  getEndpointWithDataAggregator(endpoint, aggregator) {
    return new Promise((resolve, reject) => {
      if (DATA_CACHE[endpoint]) {
        resolve(DATA_CACHE[endpoint]);
      } else {
        sendAjax(endpoint).done((data) => {
          const dataObj = aggregator(data);
          DATA_CACHE[endpoint] = dataObj;
          resolve(dataObj);
        }).fail(reject);
      }
    });
  }

  aggregateAsArrayOfObjectsWithIdAndName(data) {
    const dataObj = [];
    for (let i = 0; i < data.length; i++) {
      dataObj.push({id: data[i].id, name: data[i].name});
    }
    return dataObj;
  }

  aggregateAsSingleObjIdToName(data) {
    const dataObj = {};
    for (let i = 0; i < data.length; i++) {
      dataObj[Number(data[i].id)] = data[i].name;
    }
    return dataObj;
  }

  getRecipeCategories() {
    return this.getEndpointWithDataAggregator(FilterTypes.RECIPE_CATEGORIES,
        this.aggregateAsSingleObjIdToName);
  }

  getRecipesTypes() {
    return this.getEndpointWithDataAggregator(FilterTypes.RECIPE_TYPES,
        this.aggregateAsSingleObjIdToName);
  }

  getMealTypes() {
    return this.getEndpointWithDataAggregator(FilterTypes.MEAL_TYPES,
        this.aggregateAsSingleObjIdToName);
  }

  getIngredients() {
    return this.getEndpointWithDataAggregator(FilterTypes.INGREDIENTS,
        this.aggregateAsArrayOfObjectsWithIdAndName);
  }

  onFilterTypeChange(value) {
    this.setState({
      filterTypeValue: value
    });
  }

  buildFilterTypeSelect() {
    return (
        <Select name="filterType"
                options={FilterTypesToText}
                ref={this.filterTypeSelectRef}
                defaultValue={FilterTypes.RECIPE_TYPES}
                onSelectChange={this.onFilterTypeChange}/>
    );
  }

  buildConstraint() {
    const ConstraintComponent =
        FilterTypesToConstraint[this.state.filterTypeValue];
    return <ConstraintComponent ref={this.constraintRef}/>;
  }

  buildConstraintValues() {
    const filterType = this.state.filterTypeValue;
    const inputName = `${filterType}ConstraintValue`;
    const inputType = FilterTypesToValueInput[filterType];
    const options = this.state.filterTypeData[filterType];

    if (inputType === ConstraintValueInputs.TYPEAHEAD) {
      return (
          <Typeahead
              id={inputName}
              labelKey="name"
              options={options}
              maxResults={10}
              paginationText="More results..."
              placeholder="Type to search..."
              inputProps={{required: true}}
              ref={this.constraintValueRef}
          />
      );
    } else if (inputType === ConstraintValueInputs.SELECT) {
      return (<Select name={inputName} options={options}
                      ref={this.constraintValueRef}/>);
    } else if (inputType === ConstraintValueInputs.NUMERIC) {
      return (
          <input name={inputName} type="number" min="1" className="form-control"
                 ref={this.constraintValueRef}
                 required/>
      );
    }
  }

  getRowData() {
    const rowData = {};
    rowData.filterType = this.filterTypeSelectRef.current.getValue();
    rowData.constraint = this.constraintRef.current.getValue();
    rowData.value = this.getConstraintValue();
    return rowData;
  }

  getConstraintValue() {
    let val = 0;
    switch (FilterTypesToValueInput[this.state.filterTypeValue]) {
      case ConstraintValueInputs.SELECT:
        val = Number(this.constraintValueRef.current.getValue());
        break;
      case ConstraintValueInputs.NUMERIC:
        val = Number(this.constraintValueRef.current.value);
        break;
      case ConstraintValueInputs.TYPEAHEAD:
        val = this.constraintValueRef.current.state.selected[0].id ||
            0;
        break;
    }
    return val;
  }

  getValueInputColumnWidth() {
    return FilterTypesToValueInput[this.state.filterTypeValue] ===
    ConstraintValueInputs.TYPEAHEAD ? 'col-md w-100' : 'col-md-auto';
  }

  render() {
    return (
        <div className="row pb-3 g-3">
          <div className="form-group col-md-auto">
            {this.buildFilterTypeSelect()}
          </div>

          <div className="form-group col-md-auto">
            {this.buildConstraint()}
          </div>

          <div className={`form-group ${this.getValueInputColumnWidth()}`}>
            {this.buildConstraintValues()}
          </div>

          <div className="col-md-auto">
            <IconButton aria-label="delete"
                        onClick={this.removeFilterRowClick}>
              <RemoveCircleOutlineIcon/>
            </IconButton>
            <IconButton aria-label="add" onClick={this.addFilterRowClick}>
              <AddCircleOutlineIcon/>
            </IconButton>
          </div>
        </div>
    );
  }
}

FilterRow.propTypes = {
  addRowClick: PropTypes.func.isRequired,
  removeRowClick: PropTypes.func.isRequired,
  identifier: PropTypes.number.isRequired
};

import PropTypes from 'prop-types';
import React from 'react';

import {sendAjax} from '../common/ajax';
import {IngredientRow} from './ingredientrow';

const DATA_CACHE = {};

export class Ingredients extends React.Component {
  constructor(props) {
    super(props);
    this.state = {unitOptions: []};
  }

  componentDidMount() {
    this.getUnits();
  }

  getUnits() {
    this.cachedAjax('/units').then((units) => {
      this.setState({unitOptions: units});
    });
  }

  cachedAjax(endpoint) {
    return new Promise((resolve, reject) => {
      if (DATA_CACHE[endpoint]) {
        resolve(DATA_CACHE[endpoint]);
      } else {
        sendAjax(endpoint).done((data) => {
          DATA_CACHE[endpoint] = data;
          resolve(data);
        }).fail(reject);
      }
    });
  }

  getIngredientRows() {
    return this.props.ingredients.map((row) => {
      return <IngredientRow key={row.uid}
                            quantity={row.quantity}
                            ingredient={row.ingredient}
                            unit={row.unit}
                            unitOptions={this.state.unitOptions}
                            displayName={row.ingredientDisplayName}
                            originalName={row.originalName}
                            ingredientOptions={row.ingredientOptions}
                            onAddClick={this.props.addIngredientRow}
                            onDeleteClick={() => {
                              this.props.deleteIngredientRow(row.uid);
                            }}
                            onIngredientChange={(e, newIngredient) => {
                              this.props.onIngredientRowValueChange(
                                  'ingredient', row.uid, newIngredient);
                            }}
                            onIngredientInputChange={(newVal) => {
                              this.props.onIngredientInputChange(row.uid,
                                  newVal);
                            }}
                            onDisplayNameChange={(newDisplayName) => {
                              this.props.onIngredientRowValueChange(
                                  'ingredientDisplayName', row.uid,
                                  newDisplayName);
                            }}
                            onQuantityChange={(newQuantity) => {
                              this.props.onIngredientRowValueChange(
                                  'quantity', row.uid, newQuantity);
                            }}
                            onUnitsChange={(newUnit) => {
                              this.props.onIngredientRowValueChange(
                                  'unit', row.uid, newUnit);
                            }}/>;
    });
  }

  render() {
    return (
        <React.Fragment>
          <div className="row pb-0">
            <h3>Ingredients</h3>
          </div>
          {this.getIngredientRows()}
        </React.Fragment>
    );
  }
}

Ingredients.propTypes = {
  ingredients: PropTypes.arrayOf(PropTypes.exact({
    uid: PropTypes.number.isRequired,
    quantity: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    ingredient: PropTypes.exact({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    }),
    unit: PropTypes.number,
    ingredientDisplayName: PropTypes.string,
    originalName: PropTypes.string,
    ingredientOptions: PropTypes.arrayOf(PropTypes.exact({
      id: PropTypes.number.isRequired,
      name: PropTypes.string.isRequired
    }))
  })),
  addIngredientRow: PropTypes.func.isRequired,
  deleteIngredientRow: PropTypes.func.isRequired,
  onIngredientInputChange: PropTypes.func.isRequired,
  onIngredientRowValueChange: PropTypes.func.isRequired
};

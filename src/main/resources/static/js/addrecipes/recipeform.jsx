import {LinearProgress} from '@mui/material';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React from 'react';

import {BasicInfo} from './basicinfo';
import {Ingredients} from './ingredients';
import {Instructions} from './instructions';
import {OtherInfo} from './otherinfo';

export class RecipeForm extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    const formData = this.props.formData;
    return (
        <form id="recipeForm" onSubmit={this.props.onSubmit}
              onKeyDown={(event) => {
                if (event.key === 'Enter' && event.target.type !== 'textarea') {
                  event.preventDefault();
                }
              }} noValidate>
          <BasicInfo name={formData.name}
                     description={formData.description}
                     onRecipeNameChange={(name) => {
                       this.props.onFormDataValueChange('name', name);
                     }}
                     onDescriptionChange={(description) => {
                       this.props.onFormDataValueChange('description',
                           description);
                     }}/>
          <Ingredients ingredients={formData.ingredientLists}
                       addIngredientRow={this.props.addIngredientRow}
                       deleteIngredientRow={this.props.deleteIngredientRow}
                       onIngredientInputChange={this.props.onIngredientInputChange}
                       onIngredientRowValueChange={this.props.onIngredientRowValueChange}/>
          <Instructions instructions={formData.instructions}
                        onInstructionsChange={(newInstructions) => {
                          this.props.onFormDataValueChange('instructions',
                              newInstructions);
                        }}/>
          <OtherInfo prepTime={formData.prepTimeMin}
                     cookTime={formData.cookTimeMin}
                     externalLink={formData.externalLink}
                     recipeTypes={formData.recipeTypes}
                     mealTypes={formData.mealTypes}
                     recipeCategories={formData.recipeCategories}
                     onPrepTimeChange={(newPrepTime) => {
                       this.props.onFormDataValueChange('prepTimeMin',
                           newPrepTime);
                     }}
                     onCookTimeChange={(newCookTime) => {
                       this.props.onFormDataValueChange('cookTimeMin',
                           newCookTime);
                     }}
                     onRecipeTypesChange={(types) => {
                       this.props.onFormDataValueChange('recipeTypes', types);
                     }}
                     onRecipeCategoriesChange={(categories) => {
                       this.props.onFormDataValueChange('recipeCategories',
                           categories);
                     }}
                     onMealTypesChange={(types) => {
                       this.props.onFormDataValueChange('mealTypes', types);
                     }}
                     onExternalLinkChange={(newExternalLink) => {
                       this.props.onFormDataValueChange('externalLink',
                           newExternalLink);
                     }}/>
          <div className="row">
            <div className="col-md-12">
              {this.props.isSubmitting && <LinearProgress/>}
            </div>
          </div>
          <div className="row">
            <div className="col-md-auto">
              <Button id="submit"
                      variant="contained"
                      type="submit">
                Add Recipe
              </Button>
            </div>
          </div>
        </form>
    );
  }
}

RecipeForm.propTypes = {
  formData: PropTypes.exact({
    name: PropTypes.string,
    description: PropTypes.string,
    ingredientLists: PropTypes.arrayOf(PropTypes.exact({
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
    instructions: PropTypes.string,
    prepTimeMin: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    cookTimeMin: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
    ]),
    recipeTypes: PropTypes.arrayOf(PropTypes.number),
    mealTypes: PropTypes.arrayOf(PropTypes.number),
    recipeCategories: PropTypes.arrayOf(PropTypes.number),
    externalLink: PropTypes.string
  }).isRequired,
  addIngredientRow: PropTypes.func.isRequired,
  deleteIngredientRow: PropTypes.func.isRequired,
  onIngredientInputChange: PropTypes.func.isRequired,
  onIngredientRowValueChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onFormDataValueChange: PropTypes.func.isRequired,
  isSubmitting: PropTypes.bool
};

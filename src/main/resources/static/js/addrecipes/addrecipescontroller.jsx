import '../../css/addrecipes/addrecipes.css';

import React from 'react';

import {sendAjax} from '../common/ajax';
import {debounce} from '../common/utils';
import {HeaderButtons} from './headerbuttons';
import {ImportRecipeDialog} from './importrecipedialog';
import {RecipeForm} from './recipeform';

let FORM_UID = 0;

let INGREDIENT_ROW_UID = 1;

const DEFAULT_FORM_DATA = {
  name: '',
  description: '',
  ingredients: [
    {
      uid: INGREDIENT_ROW_UID,
      quantity: null,
      ingredient: null, // {id: num, name: string}
      unit: null,
      displayName: '',
      originalName: '',
      ingredientOptions: null // [{id: num, name: string}, ...]
    }
  ],
  instructions: '',
  prepTime: null,
  cookTime: null,
  recipeTypes: [],
  mealTypes: [],
  recipeCategories: [],
  externalLink: ''
};

// TODO: Improve performance of AddRecipesController. Right now, every key
//       stroke of an input field re-renders everything that looks at formData.
//       Likely need to flatten formData into state and mark components as
//       PureComponents where possible (i.e., components that only work with
//       simple flattened properties).

export class AddRecipesController extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isDialogOpen: false,
      formUID: FORM_UID,
      importingRecipe: false,
      // Make copy of DEFAULT_FORM_DATA, so we don't modify it directly and
      // can reuse it later to reset form.
      formData: this.cloneObject(DEFAULT_FORM_DATA)
    };

    this.closeDialog = this.closeDialog.bind(this);
    this.openDialog = this.openDialog.bind(this);
    this.importRecipe = this.importRecipe.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.addIngredientRow = this.addIngredientRow.bind(this);
    this.deleteIngredientRow = this.deleteIngredientRow.bind(this);
    this.onIngredientInputChange = debounce(
        this.onIngredientInputChange.bind(this));
    this.handleSubmit = this.handleSubmit.bind(this);
    this.updateFormDataValue = this.updateFormDataValue.bind(this);
    this.updateIngredientRowValue = this.updateIngredientRowValue.bind(this);
  }

  cloneObject(object) {
    return JSON.parse(JSON.stringify(object));
  }

  updateIngredientRowValue(rowKey, uid, newVal) {
    const ingredientRow = this.state.formData.ingredients[
        this.getIngredientRowIndexForUid(uid)];
    ingredientRow[rowKey] = newVal;
    this.setState({
      formData: this.state.formData
    });
  }

  /**
   * Handles populating auto-complete options on typing into ingredient input.
   * @param rowUid Unique id of the ingredient row.
   * @param query The input term to search on the server.
   */
  onIngredientInputChange(rowUid, query) {
    sendAjax('/ingredientsAc', {
      data: {
        q: query
      }
    }).then((newOptions) => {
      const ingredientRow = this.state.formData.ingredients[
          this.getIngredientRowIndexForUid(rowUid)];
      ingredientRow.ingredientOptions = newOptions;
      this.setState({
        formData: this.state.formData
      });
    });
  }

  getIngredientRowIndexForUid(uid) {
    return this.state.formData.ingredients.findIndex(
        (ingredient) => ingredient.uid === uid);
  }

  deleteIngredientRow(uid) {
    const ingredients = this.state.formData.ingredients;
    if (ingredients.length > 1) {
      ingredients.splice(this.getIngredientRowIndexForUid(uid), 1);
      this.setState({
        formData: this.state.formData
      });
    }
  }

  addIngredientRow() {
    this.state.formData.ingredients.push({
      uid: ++INGREDIENT_ROW_UID,
      quantity: null,
      ingredient: null,
      unit: null,
      displayName: '',
      originalName: ''
    });
    this.setState({
      formData: this.state.formData
    });
  }

  resetForm() {
    this.setState({
      formUID: ++FORM_UID,
      formData: this.cloneObject(DEFAULT_FORM_DATA)
    });
  }

  truncatePrecision(num) {
    if (num == null || typeof num !== 'number') {
      return num;
    }
    if (num % 1 !== 0) {
      // If it's a decimal with more than 2 decimals, truncate precision.
      const numDecimals = num.toString().split(".")[1].length;
      num = numDecimals > 2 ? Number(num.toFixed(2)) : num;
    }
    return num;
  }

  getIngredientDisplayName(parsedIngredient) {
    let displayProduct = '';
    if (parsedIngredient['product']) {
      displayProduct = parsedIngredient['product'];
    } else if (parsedIngredient['ingredientId']) {
      displayProduct = parsedIngredient['name'];
    }
    const prepNotes = parsedIngredient['preparationNotes']
        ? `, ${parsedIngredient['preparationNotes']}` : '';
    return `${displayProduct}${prepNotes}`;
  }

  buildIngredientsData(scrapedIngredients) {
    const ingredients = [];
    for (const ingredient of scrapedIngredients) {
      const parsedIngredient = ingredient['ingredientParsed'];
      const selectedIngredient = parsedIngredient['ingredientId'] ? {
        id: parsedIngredient['ingredientId'],
        name: parsedIngredient['name']
      } : null;
      ingredients.push({
        uid: INGREDIENT_ROW_UID++,
        quantity: this.truncatePrecision(parsedIngredient['quantity']),
        ingredient: selectedIngredient,
        unit: parsedIngredient['unitId'] || null,
        displayName: this.getIngredientDisplayName(parsedIngredient),
        originalName: ingredient['ingredientRaw'],
        ingredientOptions: selectedIngredient !== null ? [selectedIngredient]
            : null
      });
    }
    return ingredients;
  }

  buildFormDataFromScrapedRecipe(scrapedRecipe) {
    const formData = {};
    formData.name = scrapedRecipe['title'];
    formData.description = ''; // Scraped recipes never contain a description.
    formData.instructions = scrapedRecipe['instructions'];
    formData.ingredients = this.buildIngredientsData(
        scrapedRecipe['ingredients']);
    formData.prepTime = scrapedRecipe['prep_time'];
    formData.cookTime = scrapedRecipe['cook_time'];
    formData.recipeTypes = scrapedRecipe['recipe_types'];
    formData.mealTypes = scrapedRecipe['meal_types'];
    formData.recipeCategories = scrapedRecipe['recipe_categories'];
    formData.externalLink = scrapedRecipe['canonical_url'];
    return formData;
  }

  importRecipe(url) {
    this.setState({
      importingRecipe: true
    });

    sendAjax('/scrapeRecipe', {data: {url: url}})
        .done((scrapedRecipe) => {
          this.setState({
            formData: this.buildFormDataFromScrapedRecipe(scrapedRecipe)
          });
        })
        .always(() => {
          this.setState({
            importingRecipe: false
          });
          this.closeDialog();
        });
  }

  openDialog() {
    this.setState({
      isDialogOpen: true
    });
  }

  closeDialog() {
    this.setState({
      isDialogOpen: false
    });
  }

  handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    for (let [key, value] of formData.entries()) {
      console.log(key, value);
    }

    /*
    // TODO: show loading indicator and disable form while loading.
    // TODO: disable inputs
    sendAjax('/recipes', {
      data: JSON.stringify(data),
      contentType: 'application/json',
      method: 'POST',
      processData: false
    })
        .done(() => {

        });
     */
  }

  updateFormDataValue(formDataKey, value) {
    const formData = this.state.formData;
    formData[formDataKey] = value;
    this.setState({
      formData: formData
    });
  }

  render() {
    return (
        <React.Fragment>
          <div className="d-flex align-items-center pb-2 mb-3 border-bottom">
            <h1 className="h2 flex-grow-1">Add New Recipes</h1>
            <HeaderButtons onResetFormClick={this.resetForm}
                           onImportRecipeClick={this.openDialog}/>
          </div>
          <RecipeForm key={this.state.formUID}
                      formData={this.state.formData}
                      addIngredientRow={this.addIngredientRow}
                      deleteIngredientRow={this.deleteIngredientRow}
                      onIngredientInputChange={this.onIngredientInputChange}
                      onIngredientRowValueChange={this.updateIngredientRowValue}
                      onFormDataValueChange={this.updateFormDataValue}
                      onSubmit={this.handleSubmit}/>
          <ImportRecipeDialog open={this.state.isDialogOpen}
                              disabled={this.state.importingRecipe}
                              inProgress={this.state.importingRecipe}
                              handleCloseClick={this.closeDialog}
                              handleImportClick={this.importRecipe}/>
        </React.Fragment>
    );
  }
}

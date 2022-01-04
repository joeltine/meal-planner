import 'bootstrap-autocomplete';
import {CommonController} from '../common/common';

export class AddRecipesController {
  constructor() {
    this.recipeForm = $('#recipeForm');
    this.inputRecipeName = this.recipeForm.find('#inputRecipeName');
    this.inputDescription = this.recipeForm.find('#inputDescription');
    this.inputInstructions = this.recipeForm.find('#inputInstructions');
    this.main = $('#main');
    this.ingredientRowClone = $('#ingredientInputRow').clone();
    this.successAlert = $(`
      <div class="alert alert-success alert-dismissible fade show" role="alert"
           id="successAlert">
        <strong>Success!</strong> A new recipe has been added.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`);
    this.failureAlert = $(`
      <div class="alert alert-danger alert-dismissible fade show" role="alert"
           id="failureAlert">
        <strong>Failure!</strong> Something went wrong: <span id="failureText"></span>
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`);
    this.spinner = $(
        `<span class="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>`);
    this.importUrlInput = $('#importUrl');
    this.importRecipeModal = $('#importRecipeModal');
    this.importRecipeButton = $('#importRecipe');
    this.bindFormControls();
  }

  init() {
    new CommonController();
  }

  bindFormControls() {
    this.recipeForm.on('click', '#submit',
        this.handleSubmit.bind(this));

    this.recipeForm.on('click', '#addIngredient',
        this.handleAddIngredient.bind(this));

    this.recipeForm.on('blur', '#inputQuantity',
        this.scrapeAndValidateForm.bind(this));

    this.main.on('click', '#importRecipe', this.importRecipe.bind(this));

    this.createAutocomplete(this.recipeForm.find('#inputIngredient'));
  }

  importRecipe() {
    const url = this.importUrlInput.val();
    const newSpinner = this.spinner.clone();
    this.importUrlInput.prop('disabled', true);
    this.importRecipeButton.prop('disabled', true);
    this.importRecipeButton.text('Importing...');
    this.importRecipeButton.prepend(newSpinner);
    this.sendAjax('/scrapeRecipe', {data: {url: url}})
        .always(() => {
          this.importUrlInput.prop('disabled', false);
          this.importRecipeButton.prop('disabled', false);
          newSpinner.remove();
          this.importRecipeButton.text('Import');
        })
        .done((data) => {
          // {"title": "Spinach and Feta Turkey Burgers", "total_time": 35, "cook_time": 15,
          // "prep_time": 20, "ingredients": ["2 eggs, beaten", "2 cloves garlic, minced",
          // "4 ounces feta cheese", "1 (10 ounce) box frozen chopped spinach, thawed and squeezed dry",
          // "2 pounds ground turkey"], "instructions": "Preheat an outdoor grill for medium-high heat and lightly oil grate.\nWhile the grill is preheating, mix together eggs, garlic, feta cheese, spinach, and turkey in a large bowl until well combined; form into 8 patties.\nCook on preheated grill until no longer pink in the center, 15 to 20 minutes.",
          // "canonical_url": "https://www.allrecipes.com/recipe/158968/spinach-and-feta-turkey-burgers/",
          // "category": "Meat and Poultry,Turkey,Ground Turkey Recipes"}

          this.resetForm();

          this.inputRecipeName.val(data.title);
          this.inputInstructions.val(data.instructions);

          // TODO: process instructions on server and do ingredient/unit/quantity lookups/conversions
          // NOTE: on ingredient lookup algorith, first do an exact match search, then split on the comma
          // and do an exact match, if that doesn't work fall back to natural language mode search.
          // potentially present user top N results and let them choose if the algo isn't sure of the result.
          // TODO: add prep/total/cook time, category, canonical url to recipe input form.
          /**
           * TODO: dealing with issues where preparation hints are in the ingredient from the site
           * eg, "2 cloves garlic, minced", and the instructions just say something like
           * "mix in the garlic". We don't have a "garlic, minced" in the ingredient DB, but we do
           * have "garlic". So if we assign just "2 cloves garlic" to the recipe, we miss critical
           * "minced" preparation step. Options:
           * 1) Add an additional "display name" attribute to the ingredient list, this will be the
           *    name as it was taken from the recipe site. Still requires mapping to canonical ingredient
           *    in the DB.
           * 2) Create a preparation type entry in ingredients for "garlic, minced"... really don't like
           *    this for several reasons (ie combinatorial explosion, doesnt scale).
           * 3) Do nothing, and rely on human to add "minced" to the instructions manually.
           */
          this.importRecipeModal.modal('hide');
        })
        .fail(() => {
          this.importRecipeModal.modal('hide');
        });
  }

  createAutocomplete(element) {
    element.autoComplete({
      resolverSettings: {
        url: '/ingredients'
      }
    });
  }

  handleAddIngredient() {
    const newInput = this.ingredientRowClone.clone();
    newInput.insertBefore('#addNewIngredientRow');
    this.createAutocomplete(newInput.find('#inputIngredient'));
  }

  handleSubmit(event) {
    event.preventDefault();

    const formData = this.scrapeAndValidateForm();

    if (this.recipeForm.get(0).checkValidity()) {
      this.sendRecipeToServer(formData);
    }

    this.recipeForm.removeClass('needs-validation').addClass('was-validated');
  }

  scrapeAndValidateForm() {
    const formData = {};
    const name = this.inputRecipeName.val();
    const description = this.inputDescription.val();
    const instructions = this.inputInstructions.val();

    formData.name = name;
    formData.description = description;
    formData.instructions = instructions;

    formData.ingredients = [];

    this.recipeForm.find('.ingredientInputRow').each(function () {
      const row = $(this);
      const quantityInput = row.find('#inputQuantity');
      const quantity = quantityInput.val();
      const unit = row.find('#inputUnit').val();
      const ingredient = row.find('input[name="inputIngredient"]').val();

      if (quantity <= 0) {
        quantityInput.get(0).setCustomValidity('Quantity must be > 0');
      } else {
        quantityInput.get(0).setCustomValidity('');
      }

      formData.ingredients.push({
        quantity: quantity,
        unit: unit,
        ingredient: ingredient
      })
    });

    return formData;
  }

  sendRecipeToServer(data) {
    const inputs = this.recipeForm.find(':input');
    inputs.prop('disabled', true);

    this.sendAjax('/addrecipes', {
      data: JSON.stringify(data),
      contentType: 'application/json',
      method: 'PUT',
      processData: false
    })
        .done((data, textStatus) => {
          this.showSuccessAlert();
        })
        .always(() => {
          inputs.prop('disabled', false);
          this.resetForm();
        });
  }

  resetForm() {
    this.recipeForm.removeClass('was-validated').addClass(
        'needs-validation');
    this.recipeForm.find(':input')
        .not(':button, :submit')
        .val('');
    this.recipeForm.find('.ingredientInputRow').remove();
    const newRow = this.ingredientRowClone.clone();
    newRow.insertBefore('#addNewIngredientRow');
    this.createAutocomplete(newRow.find('#inputIngredient'));
  }

  showFailureAlert(errorMsg) {
    const newAlert = this.failureAlert.clone();
    newAlert.find('#failureText').text(errorMsg);
    newAlert.appendTo(this.recipeForm);
    setTimeout(() => {
      newAlert.alert('close');
    }, 10000)
  }

  showSuccessAlert() {
    const newAlert = this.successAlert.clone();
    newAlert.appendTo(this.recipeForm);
    setTimeout(() => {
      newAlert.alert('close');
    }, 4000)
  }

  sendAjax(endpoint, extraOptions) {
    const headers = {};
    headers[CSRF_HEADER_NAME] = CSRF_TOKEN;
    const options = {
      method: 'GET',
      headers: headers
    };

    $.extend(options, extraOptions);

    return $.ajax(endpoint, options)
        .fail((jqXHR, textStatus, errorThrown) => {
          const response = JSON.parse(jqXHR.responseText);
          this.showFailureAlert(
              `${textStatus}: ${response.path} ${response.error}, ${response.message}`);
        });
  }
}

(new AddRecipesController()).init();
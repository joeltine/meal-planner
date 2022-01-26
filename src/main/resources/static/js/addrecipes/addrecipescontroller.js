import 'bootstrap-autocomplete';
import {CommonController} from '../common/common';
import {Toast} from "../toasts/toast";
import {sendAjax} from "../common/ajax";

export class AddRecipesController {
  constructor() {
    this.recipeForm = $('#recipeForm');
    this.inputRecipeName = this.recipeForm.find('#inputRecipeName');
    this.inputDescription = this.recipeForm.find('#inputDescription');
    this.inputInstructions = this.recipeForm.find('#inputInstructions');
    this.inputPrepTime = this.recipeForm.find('#inputPrepTime');
    this.inputCookTime = this.recipeForm.find('#inputCookTime');
    this.inputCategories = this.recipeForm.find('#inputCategories');
    this.inputExternalLink = this.recipeForm.find('#inputExternalLink');
    this.addIngredient = this.recipeForm.find('#addIngredient');
    this.main = $('#main');
    this.ingredientRowClone = $('#ingredientInputRow').clone();
    this.spinner = $(
        `<span class="spinner-border spinner-border-sm mr-1" role="status" aria-hidden="true"></span>`);
    this.importUrlInput = $('#importUrl');
    this.importRecipeModal = $('#importRecipeModal').modal(
        {focus: false, show: false});
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

    this.main.on('click', '#importRecipeModalButton',
        this.showModal.bind(this));

    this.main.on('click', '#resetForm', this.resetForm.bind(this));

    this.recipeForm.on('click', '.closeIngredientRow',
        this.closeIngredientRow.bind(this));

    this.createAutocomplete(this.recipeForm.find('#inputIngredient'));
  }

  showModal() {
    this.importRecipeModal.modal('show');
  }

  closeIngredientRow(e) {
    if ($('.ingredientInputRow').length > 1) {
      $(e.currentTarget).closest('.ingredientInputRow').remove();
    }
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
          this.resetForm();

          // Populate simple data;
          this.inputRecipeName.val(data['title']);
          this.inputInstructions.val(data['instructions']);
          this.inputPrepTime.val(data['prep_time']);
          this.inputCookTime.val(data['cook_time']);
          this.inputExternalLink.val(data['canonical_url']);
          this.inputCategories.val(data['category']);

          // Populate all ingredient rows.
          this.populateIngredientRowsFromParsed(data['ingredients']);

          // Cleanup modal.
          this.importUrlInput.val('');
          this.importRecipeModal.modal('hide');
        })
        .fail(() => {
          this.importRecipeModal.modal('hide');
        });
  }

  populateIngredientRowsFromParsed(ingredients) {
    ingredients.forEach((item, index) => {
      const parsedInfo = item['ingredientParsed'];
      const rawOriginalText = item['ingredientRaw'];
      const row = this.recipeForm.find('.ingredientInputRow').eq(index);
      const originalTextRow = row.find('.ingredientOriginalTextRow');
      originalTextRow.removeClass('d-none');
      originalTextRow.find('.ingredientOriginalText').text(
          `(Original: ${rawOriginalText})`);
      row.find('#inputQuantity').val(parsedInfo['quantity']);

      // If we found a matching unit in DB, choose it in select.
      if (parsedInfo['unitId'] != null) {
        row.find('#inputUnit').val(parsedInfo['unitId']);
      }

      // If we found an ingredient id in DB, populate ingredient field.
      if (parsedInfo['ingredientId'] != null) {
        row.find(
            'input[id="inputIngredient"]').autoComplete('set',
            {
              value: parsedInfo['ingredientId'],
              text: parsedInfo['name']
            });
      }

      // Calculate and populate ingredient display name.
      this.populateIngredientDisplayNameFromParsed(row, parsedInfo);

      if (index < ingredients.length - 1) {
        this.addIngredient.click();
      }
    });
  }

  populateIngredientDisplayNameFromParsed(row, parsedInfo) {
    let displayProduct = '';
    if (parsedInfo['product']) {
      displayProduct = parsedInfo['product'];
    } else if (parsedInfo['ingredientId']) {
      displayProduct = parsedInfo['name'];
    }
    row.find('input[id="inputIngredientDisplayName"]').val(
        displayProduct + (parsedInfo['preparationNotes']
            ? `, ${parsedInfo['preparationNotes']}` : ''));
  }

  createAutocomplete(element) {
    element.autoComplete({
      resolverSettings: {
        url: '/ingredientsAc'
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
    } else {
      Toast.showNewErrorToast('Recipe submit failed!',
          'One of your recipe inputs was invalid. Check the form for '
          + 'a field highlighted in red.', {delay: 5000});
    }

    this.recipeForm.removeClass('needs-validation').addClass('was-validated');
  }

  scrapeAndValidateForm() {
    const formData = {};
    const name = this.inputRecipeName.val();
    const description = this.inputDescription.val();
    const instructions = this.inputInstructions.val();
    const prepTime = this.inputPrepTime.val();
    const cookTime = this.inputCookTime.val();
    const categories = this.inputCategories.val();
    const externalLink = this.inputExternalLink.val();

    formData.name = name;
    formData.description = description;
    formData.instructions = instructions;
    formData.prepTime = prepTime;
    formData.cookTime = cookTime;
    const categoryArray = categories ? categories.split(',').map(
        category => category.trim().toLowerCase()) : [];
    formData.categories = categoryArray;
    formData.externalLink = externalLink;

    formData.ingredients = [];

    this.recipeForm.find('.ingredientInputRow').each(function () {
      const row = $(this);
      const quantityInput = row.find('#inputQuantity');
      const quantity = quantityInput.val();
      const unit = row.find('#inputUnit').val();
      const ingredient = row.find('input[name="inputIngredient"]').val();
      const displayName = row.find(
          'input[id="inputIngredientDisplayName"]').val();

      if (quantity <= 0) {
        quantityInput.get(0).setCustomValidity('Quantity must be > 0');
      } else {
        quantityInput.get(0).setCustomValidity('');
      }

      formData.ingredients.push({
        quantity: quantity,
        unit: unit,
        ingredient: ingredient,
        displayName: displayName
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
        .done(() => {
          this.showSuccessAlert(data);
          this.resetForm();
        })
        .always(() => {
          inputs.prop('disabled', false);
        });
  }

  resetForm() {
    this.recipeForm.removeClass('was-validated').addClass(
        'needs-validation');
    this.recipeForm.find(':input')
        .not(':button, :submit')
        .val('');
    this.recipeForm.find('.ingredientInputRow').remove();
    this.recipeForm.find('.ingredientOriginalTextRow').addClass('d-none');
    const newRow = this.ingredientRowClone.clone();
    newRow.insertBefore('#addNewIngredientRow');
    this.createAutocomplete(newRow.find('#inputIngredient'));
  }

  showFailureAlert(errorMsg) {
    Toast.showNewErrorToast('Error!', `Something went wrong: ${errorMsg}`,
        {autohide: false});
  }

  showSuccessAlert(recipe) {
    Toast.showNewSuccessToast('Recipe added!',
        `Successfully added ${recipe.name}!`);
  }

  dispose() {
    this.importRecipeModal.modal('dispose');
    this.recipeForm.off();
    this.main.off();
  }

  sendAjax(endpoint, extraOptions) {
    return sendAjax(endpoint, extraOptions);
  }
}

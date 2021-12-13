class AddRecipesController {
  constructor() {
    this.recipeForm = $('#recipeForm');
    this.ingredientRowClone = $('#ingredientInputRow').clone();
    this.bindFormControls();
  }

  bindFormControls() {
    this.recipeForm.on('click', '#submit',
        this.handleSubmit.bind(this));

    this.recipeForm.on('click', '#addIngredient',
        this.handleAddIngredient.bind(this));
  }

  handleAddIngredient() {
    this.ingredientRowClone.clone().insertBefore('#addNewIngredientRow');
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
    const name = this.recipeForm.find('#inputRecipeName').val();
    const description = this.recipeForm.find('#inputDescription').val();
    const instructions = this.recipeForm.find('#inputInstructions').val();

    formData.name = name;
    formData.description = description;
    formData.instructions = instructions;

    formData.ingredients = [];

    this.recipeForm.find('.ingredientInputRow').each(function () {
      const row = $(this);
      const quantityInput = row.find('#inputQuantity');
      const quantity = quantityInput.val();
      const unit = row.find('#inputUnit').val();
      const ingredient = row.find('#inputIngredient').val();

      if (quantity <= 0) {
        quantityInput.get(0).setCustomValidity('Quantity must be > 0');
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
    const headers = {};
    headers[CSRF_HEADER_NAME] = CSRF_TOKEN;

    const inputs = this.recipeForm.find(':input');
    inputs.prop('disabled', true);

    $.ajax("/addrecipes", {
      data: JSON.stringify(data),
      contentType: 'application/json',
      method: 'PUT',
      headers: headers,
      processData: false
    })
    .done((data, textStatus) => {
      console.log("success", data, textStatus);
    })
    .fail((jqXHR, textStatus, errorThrown) => {
      console.log("error", textStatus, errorThrown);
    })
    .always(() => {
      inputs.prop('disabled', false);
    });
  }
}

const addRecipesController = new AddRecipesController();
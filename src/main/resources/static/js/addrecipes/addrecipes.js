class AddRecipesController {
  constructor() {
    this.recipeForm = $('#recipeForm');
    this.ingredientRowClone = $('#ingredientInputRow').clone();
    this.successAlert = $(`
      <div class="alert alert-success alert-dismissible fade show" role="alert"
           id="successAlert">
        <strong>Success!</strong> A new recipe has been added.
        <button type="button" class="close" data-dismiss="alert" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>`);
    this.bindFormControls();
  }

  bindFormControls() {
    this.recipeForm.on('click', '#submit',
        this.handleSubmit.bind(this));

    this.recipeForm.on('click', '#addIngredient',
        this.handleAddIngredient.bind(this));

    this.recipeForm.on('blur', '#inputQuantity',
        this.scrapeAndValidateForm.bind(this));

    this.createAutocomplete(this.recipeForm.find('#inputIngredient'));
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
          this.resetForm();
          this.showSuccessAlert();
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

  showSuccessAlert() {
    const newAlert = this.successAlert.clone();
    newAlert.appendTo(this.recipeForm);
    setTimeout(() => {
      newAlert.alert('close');
    }, 4000)
  }
}

const addRecipesController = new AddRecipesController();
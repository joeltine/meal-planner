class AddRecipesController {
  constructor() {
    this.recipeForm = $('#recipeForm');
    this.ingredientInputRow = $('#ingredientInputRow');
    this.bindFormControls();
  }

  bindFormControls() {
    this.recipeForm.on('click', '#submit',
        this.handleSubmit.bind(this));

    this.recipeForm.on('click', '#addIngredient',
        this.handleAddIngredient.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();
    
    console.log(this.recipeForm.serializeArray());
  }

  handleAddIngredient() {
    this.ingredientInputRow.clone().insertBefore('#addNewIngredientRow');
  }
}

const addRecipesController = new AddRecipesController();
import 'jasmine-ajax';
import {AddRecipesController} from './addrecipes';

describe('AddRecipesController test suite', function () {
  let controller;
  let recipeForm;
  let inputRecipeName;
  let inputDescription;
  let inputInstructions;
  let ingredientRow;
  let submitButton;

  beforeAll(function () {
    window.CSRF_HEADER_NAME = 'csrf-header-name';
    window.CSRF_TOKEN = 'csrf-token';
  });

  beforeEach(function () {
    const html = window.__html__['addrecipes/addrecipes_test.html'];
    $('body').append(html);
    recipeForm = $('#recipeForm');
    inputRecipeName = $('#inputRecipeName');
    inputDescription = $('#inputDescription');
    inputInstructions = $('#inputInstructions');
    ingredientRow = $('#ingredientInputRow');
    submitButton = $('#submit');
    controller = new AddRecipesController();
    jasmine.Ajax.install();
  });

  afterEach(function () {
    $('body').empty();
    controller = null;
    jasmine.Ajax.uninstall();
  });

  it('submitting empty form is invalid', function () {
    submitButton.click();
    // TODO: Expect was-validated class and all fields are bad validity.
    let request = jasmine.Ajax.requests;
    expect(request.count()).toBe(0);
  });

  it('ingredient quantity must be > 0', function () {
    inputRecipeName.val('Chicken soup');
    inputDescription.val('It\'s soup');
    inputInstructions.val('Put it in a pot');
    ingredientRow.find('#inputQuantity').val('-1');
    ingredientRow.find('#inputUnit').val('1');
    ingredientRow.find('#inputIngredient').autoComplete('set',
        {value: "1", text: "Milk"});
    submitButton.click();
    let requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(0);

    ingredientRow.find('#inputQuantity').val('1.75');
    submitButton.click();
    expect(requests.count()).toBe(1);
    let request = requests.mostRecent();
    expect(request.url).toBe('/addrecipes');
    expect(request.method).toBe('PUT');
  });
});

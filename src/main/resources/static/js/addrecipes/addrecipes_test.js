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
  let addIngredientButton;

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
    addIngredientButton = $('#addIngredient');
    controller = new AddRecipesController();
    jasmine.Ajax.install();
  });

  afterEach(function () {
    $('body').empty();
    controller = null;
    jasmine.Ajax.uninstall();
  });

  it('submitting empty form does nothing', function () {
    submitButton.click();
    let request = jasmine.Ajax.requests;
    expect(request.count()).toBe(0);
  });

  it('recipe name is required to submit', function () {
    inputDescription.val('It\'s soup');
    inputInstructions.val('Put it in a pot');
    ingredientRow.find('#inputQuantity').val('1.25');
    ingredientRow.find('#inputUnit').val('1');
    ingredientRow.find('#inputIngredient').autoComplete('set',
        {value: "1", text: "Milk"});
    submitButton.click();
    let requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(0);
  });

  it('ingredient quantity must be > 0 to submit', function () {
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

    ingredientRow.find('#inputQuantity').val('0');
    submitButton.click();
    expect(requests.count()).toBe(0);
  });

  it('recipe description is optional to submit', function () {
    inputRecipeName.val('Chicken soup');
    inputInstructions.val('Put it in a pot');
    ingredientRow.find('#inputQuantity').val('1');
    ingredientRow.find('#inputUnit').val('1');
    ingredientRow.find('#inputIngredient').autoComplete('set',
        {value: "1", text: "Milk"});
    submitButton.click();
    let requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(1);
  });

  it('ingredient unit is required to submit', function () {
    inputRecipeName.val('Chicken soup');
    inputInstructions.val('Put it in a pot');
    ingredientRow.find('#inputQuantity').val('1');
    ingredientRow.find('#inputIngredient').autoComplete('set',
        {value: "1", text: "Milk"});
    submitButton.click();
    let requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(0);
  });

  it('ingredient name is required to submit', function () {
    inputRecipeName.val('Chicken soup');
    inputInstructions.val('Put it in a pot');
    ingredientRow.find('#inputQuantity').val('1');
    ingredientRow.find('#inputUnit').val('1');
    submitButton.click();
    let requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(0);
  });

  it('add ingredient button adds new ingredient input row', function () {
    expect($('.ingredientInputRow').length).toBe(1);
    let addIngredientButton = $('#addIngredient');
    addIngredientButton.click();
    expect($('.ingredientInputRow').length).toBe(2);
    addIngredientButton.click();
    addIngredientButton.click();
    expect($('.ingredientInputRow').length).toBe(4);
  });
});

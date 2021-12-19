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
    ingredientRow = $('.ingredientInputRow');
    submitButton = $('#submit');
    addIngredientButton = $('#addIngredient');
    controller = new AddRecipesController();
    jasmine.Ajax.install();
    jasmine.clock().install();
  });

  afterEach(function () {
    $('body').empty();
    controller = null;
    jasmine.Ajax.uninstall();
    jasmine.clock().uninstall();
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
        {value: '1', text: 'Milk'});
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
        {value: '1', text: 'Milk'});
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
        {value: '1', text: 'Milk'});
    submitButton.click();
    let requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(1);
    let request = requests.mostRecent();
    expect(request.url).toBe('/addrecipes');
    expect(request.method).toBe('PUT');
    expect(request.data()).toEqual({
      'name': 'Chicken soup',
      'description': '',
      'instructions': 'Put it in a pot',
      'ingredients': [{'quantity': '1', 'unit': '1', 'ingredient': '1'}]
    });
  });

  it('ingredient unit is required to submit', function () {
    inputRecipeName.val('Chicken soup');
    inputInstructions.val('Put it in a pot');
    ingredientRow.find('#inputQuantity').val('1');
    ingredientRow.find('#inputIngredient').autoComplete('set',
        {value: '1', text: 'Milk'});
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

  it('add ingredient button adds new ingredient input row with autoComplete',
      function () {
        expect($('.ingredientInputRow').length).toBe(1);
        expect($('.ingredientInputRow').eq(0).find('#inputIngredient').data(
            'autoComplete')).toBeTruthy();
        addIngredientButton.click();
        expect($('.ingredientInputRow').length).toBe(2);
        expect($('.ingredientInputRow').eq(1).find('#inputIngredient').data(
            'autoComplete')).toBeTruthy();
        addIngredientButton.click();
        expect($('.ingredientInputRow').eq(2).find('#inputIngredient').data(
            'autoComplete')).toBeTruthy();
        addIngredientButton.click();
        expect($('.ingredientInputRow').length).toBe(4);
        expect($('.ingredientInputRow').eq(3).find('#inputIngredient').data(
            'autoComplete')).toBeTruthy();
      });

  it('all populated form fields are present in request', function () {
    inputRecipeName.val('Chicken soup');
    inputDescription.val('It\'s soup');
    inputInstructions.val('Put it in a pot');
    ingredientRow.eq(0).find('#inputQuantity').val('1');
    ingredientRow.eq(0).find('#inputUnit').val('1');
    ingredientRow.eq(0).find('#inputIngredient').autoComplete('set',
        {value: '1', text: 'Milk'});
    addIngredientButton.click();
    ingredientRow = $('.ingredientInputRow');
    ingredientRow.eq(1).find('#inputQuantity').val('21');
    ingredientRow.eq(1).find('#inputUnit').val('2');
    ingredientRow.eq(1).find('#inputIngredient').autoComplete('set',
        {value: '3', text: 'Chicken'});
    submitButton.click();
    let requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(1);
    let request = requests.mostRecent();
    expect(request.url).toBe('/addrecipes');
    expect(request.method).toBe('PUT');
    expect(request.data()).toEqual({
      'name': 'Chicken soup',
      'description': 'It\'s soup',
      'instructions': 'Put it in a pot',
      'ingredients': [{'quantity': '1', 'unit': '1', 'ingredient': '1'},
        {'quantity': '21', 'unit': '2', 'ingredient': '3'}]
    });
    expect(request.requestHeaders[window.CSRF_HEADER_NAME]).toEqual(
        window.CSRF_TOKEN);
    expect(request.requestHeaders['Content-Type']).toEqual('application/json');
  });

  it('successful addrecipe resets form and shows success', function () {
    inputRecipeName.val('Chicken soup');
    inputDescription.val('It\'s soup');
    inputInstructions.val('Put it in a pot');
    ingredientRow.eq(0).find('#inputQuantity').val('1');
    ingredientRow.eq(0).find('#inputUnit').val('1');
    ingredientRow.eq(0).find('#inputIngredient').autoComplete('set',
        {value: '1', text: 'Milk'});
    addIngredientButton.click();
    ingredientRow = $('.ingredientInputRow');
    expect(ingredientRow.length).toBe(2);
    ingredientRow.eq(1).find('#inputQuantity').val('21');
    ingredientRow.eq(1).find('#inputUnit').val('2');
    ingredientRow.eq(1).find('#inputIngredient').autoComplete('set',
        {value: '3', text: 'Chicken'});
    submitButton.click();
    let requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(1);
    const inputs = recipeForm.find(':input');
    expect(inputs.each(function () {
      expect($(this).prop('disabled')).toBeTrue();
    }));
    jasmine.Ajax.requests.mostRecent().respondWith({
      'status': 200,
      'contentType': 'text/plain',
      'responseText': 'success'
    });
    expect(inputs.each(function () {
      expect($(this).prop('disabled')).toBeFalse();
    }));
    recipeForm.find(':input').each(function () {
      expect($(this).val()).toBe('');
    });
    expect($('.ingredientInputRow').length).toBe(1);
    expect($('#successAlert').is(':visible')).toBeTrue();
    jasmine.clock().tick(5000);
    expect($('#successAlert').is(':visible')).toBeFalse();
    expect($('.ingredientInputRow').eq(0).find('#inputIngredient').data(
        'autoComplete')).toBeTruthy();
  });

  it('failed addrecipe resets form and shows failure', function () {
    inputRecipeName.val('Chicken soup');
    inputDescription.val('It\'s soup');
    inputInstructions.val('Put it in a pot');
    ingredientRow.eq(0).find('#inputQuantity').val('1');
    ingredientRow.eq(0).find('#inputUnit').val('1');
    ingredientRow.eq(0).find('#inputIngredient').autoComplete('set',
        {value: '1', text: 'Milk'});
    submitButton.click();
    let requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(1);
    const inputs = recipeForm.find(':input');
    expect(inputs.each(function () {
      expect($(this).prop('disabled')).toBeTrue();
    }));
    jasmine.Ajax.requests.mostRecent().respondWith({
      'status': 500,
      'contentType': 'application/json',
      'responseText': '{"status":500,"error":"bad stuff",'
          + '"message":"err message","path":"/addrecipes"}'
    });
    expect(inputs.each(function () {
      expect($(this).prop('disabled')).toBeFalse();
    }));
    recipeForm.find(':input').each(function () {
      expect($(this).val()).toBe('');
    });
    expect($('.ingredientInputRow').length).toBe(1);
    expect($('#failureAlert').is(':visible')).toBeTrue();
    expect($('#failureText').text()).toEqual(
        'error: /addrecipes bad stuff, err message');
    jasmine.clock().tick(5000);
    expect($('#failureAlert').is(':visible')).toBeFalse();
  });
});

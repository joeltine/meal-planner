import 'jasmine-ajax';
import {AddRecipesController} from './addrecipes';

describe('AddRecipesController test suite', function () {
  let controller;
  let recipeForm;
  let inputRecipeName;
  let inputDescription;
  let inputInstructions;
  let inputPrepTime;
  let inputCookTime;
  let inputCategories;
  let inputExternalLink;
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
    inputPrepTime = $('#inputPrepTime');
    inputCookTime = $('#inputCookTime');
    inputCategories = $('#inputCategories');
    inputExternalLink = $('#inputExternalLink');
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
    inputCookTime.val('99');
    inputPrepTime.val('3');
    ingredientRow.find('#inputQuantity').val('1.25');
    ingredientRow.find('#inputUnit').val('1');
    ingredientRow.find('#inputIngredient').autoComplete('set',
        {value: '1', text: 'Milk'});
    submitButton.click();
    let requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(0);
    inputRecipeName.val('Some soup');
    submitButton.click();
    expect(requests.count()).toBe(1);
  });

  it('prep time is required to submit', function () {
    inputRecipeName.val('Soup');
    inputDescription.val('It\'s soup');
    inputInstructions.val('Put it in a pot');
    inputCookTime.val('99');
    ingredientRow.find('#inputQuantity').val('1.25');
    ingredientRow.find('#inputUnit').val('1');
    ingredientRow.find('#inputIngredient').autoComplete('set',
        {value: '1', text: 'Milk'});
    submitButton.click();
    let requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(0);
    inputPrepTime.val('99');
    submitButton.click();
    expect(requests.count()).toBe(1);
  });

  it('cook time is required to submit', function () {
    inputRecipeName.val('Soup');
    inputDescription.val('It\'s soup');
    inputInstructions.val('Put it in a pot');
    inputPrepTime.val('99');
    ingredientRow.find('#inputQuantity').val('1.25');
    ingredientRow.find('#inputUnit').val('1');
    ingredientRow.find('#inputIngredient').autoComplete('set',
        {value: '1', text: 'Milk'});
    submitButton.click();
    let requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(0);
    inputCookTime.val('99');
    submitButton.click();
    expect(requests.count()).toBe(1);
  });

  it('cook/prep time must be >= 1 to submit', function () {
    inputRecipeName.val('Some soup');
    inputDescription.val('It\'s soup');
    inputInstructions.val('Put it in a pot');
    inputPrepTime.val('0');
    inputCookTime.val('0');
    ingredientRow.find('#inputQuantity').val('1.25');
    ingredientRow.find('#inputUnit').val('1');
    ingredientRow.find('#inputIngredient').autoComplete('set',
        {value: '1', text: 'Milk'});
    submitButton.click();
    let requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(0);
    inputPrepTime.val('0');
    inputCookTime.val('3');
    submitButton.click();
    expect(requests.count()).toBe(0);
    inputPrepTime.val('3');
    inputCookTime.val('0');
    submitButton.click();
    expect(requests.count()).toBe(0);
    inputPrepTime.val('3');
    inputCookTime.val('99');
    submitButton.click();
    expect(requests.count()).toBe(1);
  });

  it('ingredient quantity must be > 0 to submit', function () {
    inputRecipeName.val('Chicken soup');
    inputDescription.val('It\'s soup');
    inputInstructions.val('Put it in a pot');
    inputCookTime.val('99');
    inputPrepTime.val('3');
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

    ingredientRow.find('#inputQuantity').val('1');
    submitButton.click();
    expect(requests.count()).toBe(1);
  });

  it('recipe description is optional to submit', function () {
    inputRecipeName.val('Chicken soup');
    inputInstructions.val('Put it in a pot');
    inputCookTime.val('99');
    inputPrepTime.val('3');
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
      'externalLink': '',
      'categories': [],
      'prepTime': '3',
      'cookTime': '99',
      'instructions': 'Put it in a pot',
      'ingredients': [{
        'quantity': '1',
        'unit': '1',
        'ingredient': '1',
        'displayName': ''
      }]
    });
  });

  it('ingredient unit is required to submit', function () {
    inputRecipeName.val('Chicken soup');
    inputInstructions.val('Put it in a pot');
    inputCookTime.val('99');
    inputPrepTime.val('3');
    ingredientRow.find('#inputQuantity').val('1');
    ingredientRow.find('#inputIngredient').autoComplete('set',
        {value: '1', text: 'Milk'});
    submitButton.click();
    let requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(0);
    ingredientRow.find('#inputUnit').val('1');
    submitButton.click();
    expect(requests.count()).toBe(1);
  });

  it('ingredient name is required to submit', function () {
    inputRecipeName.val('Chicken soup');
    inputInstructions.val('Put it in a pot');
    inputCookTime.val('99');
    inputPrepTime.val('3');
    ingredientRow.find('#inputQuantity').val('1');
    ingredientRow.find('#inputUnit').val('1');
    submitButton.click();
    let requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(0);
    ingredientRow.find('#inputIngredient').autoComplete('set',
        {value: '1', text: 'Milk'});
    submitButton.click();
    expect(requests.count()).toBe(1);
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
    inputCookTime.val('99');
    inputPrepTime.val('3');
    inputExternalLink.val('http://www.example.com');
    inputCategories.val('italian, breakfast');
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
    ingredientRow.eq(1).find('#inputIngredientDisplayName').val(
        'chicken breast, cubed');
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
      'prepTime': '3',
      'cookTime': '99',
      'categories': ['italian', 'breakfast'],
      'externalLink': 'http://www.example.com',
      'ingredients': [{
        'quantity': '1',
        'unit': '1',
        'ingredient': '1',
        'displayName': ''
      },
        {
          'quantity': '21',
          'unit': '2',
          'ingredient': '3',
          'displayName': 'chicken breast, cubed'
        }]
    });
    expect(request.requestHeaders[window.CSRF_HEADER_NAME]).toEqual(
        window.CSRF_TOKEN);
    expect(request.requestHeaders['Content-Type']).toEqual('application/json');
  });

  it('successful add recipe resets form and shows success', function () {
    inputRecipeName.val('Chicken soup');
    inputDescription.val('It\'s soup');
    inputInstructions.val('Put it in a pot');
    inputCookTime.val('99');
    inputPrepTime.val('3');
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

  it('failed add recipe does not reset form and shows failure', function () {
    inputRecipeName.val('Chicken soup');
    inputDescription.val('It\'s soup');
    inputInstructions.val('Put it in a pot');
    inputCookTime.val('99');
    inputPrepTime.val('3');
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
    expect(inputRecipeName.val()).toBe('Chicken soup');
    expect(inputDescription.val()).toBe('It\'s soup');
    expect(inputInstructions.val()).toBe('Put it in a pot');
    expect(inputCookTime.val()).toBe('99');
    expect(inputPrepTime.val()).toBe('3');
    expect(ingredientRow.eq(0).find('#inputQuantity').val()).toBe('1');
    expect(ingredientRow.eq(0).find('#inputUnit').val()).toBe('1');
    expect(ingredientRow.eq(0).find('#inputIngredient').val()).toBe('Milk');
    expect($('.ingredientInputRow').length).toBe(1);
    expect($('#failureAlert').is(':visible')).toBeTrue();
    expect($('#failureText').text()).toEqual(
        'error: /addrecipes bad stuff, err message');
  });
});

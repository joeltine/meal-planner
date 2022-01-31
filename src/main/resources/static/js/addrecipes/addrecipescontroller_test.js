import 'jasmine-ajax';
import {AddRecipesController} from './addrecipescontroller';
import JasmineDOM from "@testing-library/jasmine-dom";

const fetaBurgersJson = {
  "title": "Spinach and Feta Turkey Burgers",
  "total_time": 35,
  "cook_time": 15,
  "prep_time": 20,
  "ingredients": [
    {
      "confidence": 0.9764371000000001,
      "error": null,
      "ingredientParsed": {
        "ingredientId": 24,
        "name": "eggs",
        "preparationNotes": "beaten",
        "product": "eggs",
        "productSizeModifier": null,
        "quantity": 2.0,
        "unit": null,
        "usdaInfo": {
          "category": "Dairy and Egg Products",
          "description": "Egg, whole, raw, fresh",
          "fdcId": "171287",
          "matchMethod": "exact"
        }
      },
      "ingredientRaw": "2 eggs, beaten"
    },
    {
      "confidence": 0.9817117,
      "error": null,
      "ingredientParsed": {
        "ingredientId": 69,
        "name": "garlic cloves",
        "preparationNotes": "minced",
        "product": "garlic",
        "productSizeModifier": null,
        "quantity": 2.0,
        "unit": "clove",
        "usdaInfo": {
          "category": null,
          "description": "Garlic, raw",
          "fdcId": "787793",
          "matchMethod": "exact"
        }
      },
      "ingredientRaw": "2 cloves garlic, minced"
    },
    {
      "confidence": 0.9916780000000001,
      "error": null,
      "ingredientParsed": {
        "preparationNotes": null,
        "product": "feta cheese",
        "productSizeModifier": null,
        "quantity": 4.0,
        "unit": "ounce",
        "usdaInfo": {
          "category": "Dairy and Egg Products",
          "description": "Cheese, feta",
          "fdcId": "173420",
          "matchMethod": "exact"
        }
      },
      "ingredientRaw": "4 ounces feta cheese"
    },
    {
      "confidence": 0.334193,
      "error": null,
      "ingredientParsed": {
        "preparationNotes": "thawed and squeezed dry",
        "product": null,
        "productSizeModifier": null,
        "quantity": 1.0,
        "unit": "box",
        "usdaInfo": null
      },
      "ingredientRaw": "1 (10 ounce) box frozen chopped spinach, thawed and squeezed dry"
    },
    {
      "confidence": 0.9139855,
      "error": null,
      "ingredientParsed": {
        "preparationNotes": "ground",
        "product": "turkey",
        "productSizeModifier": null,
        "quantity": 2.0,
        "unitId": 4,
        "unit": "pound",
        "usdaInfo": {
          "category": "Poultry Products",
          "description": "Turkey, whole, light meat, raw",
          "fdcId": "171490",
          "matchMethod": "closestUnbranded"
        }
      },
      "ingredientRaw": "2 pounds ground turkey"
    }
  ],
  "instructions": "Preheat grill.\nCook burgers.",
  "canonical_url": "https://www.allrecipes.com/recipe/158968/spinach-and-feta-turkey-burgers/",
  "recipe_categories": [2],
  "recipe_types": [3, 8],
  "meal_types": [1, 3],
};

describe('AddRecipesController test suite', function () {
  let controller;
  let recipeForm;
  let inputRecipeName;
  let inputDescription;
  let inputInstructions;
  let inputPrepTime;
  let inputCookTime;
  let inputCategories;
  let inputRecipeTypes;
  let inputMealTypes;
  let inputExternalLink;
  let ingredientRow;
  let submitButton;
  let addIngredientButton;
  let resetFormButton;
  let importRecipeModalButton;
  let importUrl;
  let dismissImportModal;
  let importRecipeButton;
  let importRecipeModal;
  let uiContainer = $('<div></div>');

  beforeAll(function () {
    jasmine.getEnv().addMatchers(JasmineDOM);
    $('body').append(uiContainer);
    window.CSRF_HEADER_NAME = 'csrf-header-name';
    window.CSRF_TOKEN = 'csrf-token';
  });

  afterAll(function () {
    uiContainer.remove();
  });

  beforeEach(function () {
    const html = window.__html__['js/addrecipes/addrecipescontroller_test.html'];
    uiContainer.append(html);
    recipeForm = $('#recipeForm');
    inputRecipeName = $('#inputRecipeName');
    inputDescription = $('#inputDescription');
    inputInstructions = $('#inputInstructions');
    ingredientRow = $('.ingredientInputRow');
    inputPrepTime = $('#inputPrepTime');
    inputCookTime = $('#inputCookTime');
    inputCategories = $('#inputRecipeCategories');
    inputRecipeTypes = $('#inputRecipeType');
    inputMealTypes = $('#inputMealType');
    inputExternalLink = $('#inputExternalLink');
    submitButton = $('#submit');
    addIngredientButton = $('#addIngredient');
    resetFormButton = $('#resetForm');
    importRecipeModalButton = $('#importRecipeModalButton');
    importRecipeModal = $('#importRecipeModal');
    importUrl = $('#importUrl');
    dismissImportModal = $('#dismissImportModal');
    importRecipeButton = $('#importRecipe');
    jasmine.Ajax.install();
    jasmine.clock().install();
    controller = new AddRecipesController();
  });

  afterEach(function () {
    controller.dispose();
    uiContainer.empty();
    controller = null;
    jasmine.Ajax.uninstall();
    jasmine.clock().uninstall();
  });

  it('submitting empty form does nothing', function () {
    submitButton.click();
    let request = jasmine.Ajax.requests;
    expect(request.count()).toBe(0);
  });

  it('enter button does not submit form', function () {
    const submitSpy = spyOn(controller, 'handleSubmit');
    const e = jQuery.Event('keypress');
    e.which = 13; // Enter
    e.keyCode = 13;
    inputRecipeName.trigger(e);
    expect(recipeForm[0]).not.toHaveClass('was-validated');
    let requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(0);
    expect(submitSpy).not.toHaveBeenCalled();
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
    inputRecipeTypes.val([1, 3, 5]);
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
    inputRecipeTypes.val([1, 3, 5]);
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
    inputRecipeTypes.val([1, 3, 5]);
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
    inputRecipeTypes.val([1, 3, 5]);
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
    inputRecipeTypes.val([1, 3, 5]);
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
    inputRecipeTypes.val([1, 3, 5]);
    inputPrepTime.val('3');
    ingredientRow.find('#inputQuantity').val('1');
    ingredientRow.find('#inputUnit').val('1');
    ingredientRow.find('#inputIngredient').autoComplete('set',
        {value: '1', text: 'Milk'});
    submitButton.click();
    let requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(1);
    let request = requests.mostRecent();
    expect(request.url).toBe('/recipes');
    expect(request.method).toBe('POST');
    expect(request.data()).toEqual({
      'name': 'Chicken soup',
      'description': '',
      'externalLink': '',
      'recipeCategories': [],
      'mealTypes': [],
      'recipeTypes': [
        {'recipeType': {'id': 5}},
        {'recipeType': {'id': 1}},
        {'recipeType': {'id': 3}}
      ],
      'prepTimeMin': 3,
      'cookTimeMin': 99,
      'instructions': 'Put it in a pot',
      'ingredientLists': [{
        'quantity': 1,
        'unit': {'id': 1},
        'ingredient': {'id': 1},
        'ingredientDisplayName': ''
      }]
    });
  });

  it('ingredient unit is required to submit', function () {
    inputRecipeName.val('Chicken soup');
    inputInstructions.val('Put it in a pot');
    inputCookTime.val('99');
    inputPrepTime.val('3');
    inputRecipeTypes.val([1, 3, 5]);
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

  it('recipe type is required to submit', function () {
    inputRecipeName.val('Chicken soup');
    inputInstructions.val('Put it in a pot');
    inputCookTime.val('99');
    inputPrepTime.val('3');
    ingredientRow.find('#inputQuantity').val('1');
    ingredientRow.find('#inputIngredient').autoComplete('set',
        {value: '1', text: 'Milk'});
    ingredientRow.find('#inputUnit').val('1');
    submitButton.click();
    let requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(0);
    inputRecipeTypes.val([1, 3, 5]);
    submitButton.click();
    expect(requests.count()).toBe(1);
  });

  it('ingredient name is required to submit', function () {
    inputRecipeName.val('Chicken soup');
    inputInstructions.val('Put it in a pot');
    inputCookTime.val('99');
    inputPrepTime.val('3');
    inputRecipeTypes.val([1, 3, 5]);
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
    inputCategories.val([5, 10]);
    inputMealTypes.val([1, 2]);
    inputRecipeTypes.val([2, 4]);
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
    expect(request.url).toBe('/recipes');
    expect(request.method).toBe('POST');
    expect(request.data()).toEqual({
      'name': 'Chicken soup',
      'description': 'It\'s soup',
      'instructions': 'Put it in a pot',
      'prepTimeMin': 3,
      'cookTimeMin': 99,
      'recipeCategories': [{'recipeCategory': {'id': 5}},
        {'recipeCategory': {'id': 10}}],
      'mealTypes': [{'mealType': {'id': 1}}, {'mealType': {'id': 2}}],
      'recipeTypes': [{'recipeType': {'id': 2}}, {'recipeType': {'id': 4}}],
      'externalLink': 'http://www.example.com',
      'ingredientLists': [
        {
          'quantity': 1,
          'unit': {'id': 1},
          'ingredient': {'id': 1},
          'ingredientDisplayName': ''
        },
        {
          'quantity': 21,
          'unit': {'id': 2},
          'ingredient': {'id': 3},
          'ingredientDisplayName': 'chicken breast, cubed'
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
    inputRecipeTypes.val([2, 4]);
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
      const el = $(this);
      if (el.is('select') && el.prop('multiple')) {
        expect($(this).val()).toEqual([]);
      } else {
        expect($(this).val()).toEqual('');
      }
    });
    expect($('.ingredientInputRow').length).toBe(1);
    expect($('.toast-success').is(':visible')).toBeTrue(
        'Success toast visibility expected to be true');
    jasmine.clock().tick(5000);
    expect($('.toast-success').is(':visible')).toBeFalse(
        'Success toast visibility expected to be false');
    expect($('.ingredientInputRow').eq(0).find('#inputIngredient').data(
        'autoComplete')).toBeTruthy();
  });

  it('failed add recipe does not reset form and shows failure', function () {
    inputRecipeName.val('Chicken soup');
    inputDescription.val('It\'s soup');
    inputInstructions.val('Put it in a pot');
    inputCookTime.val('99');
    inputPrepTime.val('3');
    inputRecipeTypes.val([2, 4]);
    inputMealTypes.val([1, 2]);
    inputCategories.val([3, 8]);
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
    expect(inputRecipeTypes.val()).toEqual(['2', '4']);
    expect(inputMealTypes.val()).toEqual(['1', '2']);
    expect(inputCategories.val()).toEqual(['3', '8']);
    expect(ingredientRow.eq(0).find('#inputQuantity').val()).toBe('1');
    expect(ingredientRow.eq(0).find('#inputUnit').val()).toBe('1');
    expect(ingredientRow.eq(0).find('#inputIngredient').val()).toBe('Milk');
    expect($('.ingredientInputRow').length).toBe(1);
    expect($('.toast-error').is(':visible')).toBeTrue();
    expect($('.toast-error').text()).toContain('bad stuff');
  });

  it('should remove ingredient row clicking close button', function () {
    addIngredientButton.click();
    addIngredientButton.click();
    addIngredientButton.click();
    addIngredientButton.click();
    let rows = $('.ingredientInputRow');
    expect(rows.length).toBe(5);
    const row1 = rows.eq(1);
    row1.find('.closeIngredientRow').click();
    expect(row1[0]).not.toBeInTheDocument();
    rows = $('.ingredientInputRow');
    expect(rows.length).toBe(4);
    rows.eq(0).find('.closeIngredientRow').click();
    rows.eq(1).find('.closeIngredientRow').click();
    rows.eq(2).find('.closeIngredientRow').click();
    rows = $('.ingredientInputRow');
    expect(rows.length).toBe(1);
    // Trying to delete last row does nothing
    rows.eq(0).find('.closeIngredientRow').click();
    expect(rows.length).toBe(1);
  });

  it('should reset form on clicking reset form button', function () {
    addIngredientButton.click();
    inputRecipeName.val('Some soup');
    inputDescription.val('It\'s soup');
    inputInstructions.val('Put it in a pot');
    inputCookTime.val('99');
    inputPrepTime.val('3');
    inputRecipeTypes.val([2, 4]);
    inputMealTypes.val([2, 3]);
    inputCategories.val([2, 4]);
    ingredientRow.find('#inputQuantity').val('1.25');
    ingredientRow.find('#inputUnit').val('1');
    ingredientRow.find('#inputIngredient').autoComplete('set',
        {value: '1', text: 'Milk'});
    inputExternalLink.val('http://www.example.com');
    resetFormButton.click();
    recipeForm.find(':input').each(function () {
      const el = $(this);
      if (el.is('select') && el.prop('multiple')) {
        expect($(this).val()).toEqual([]);
      } else {
        expect($(this).val()).toEqual('');
      }
    });
    expect($('.ingredientInputRow').length).toBe(1);
  });

  it('should dismiss import recipe modal', function (done) {
    importRecipeModal.on('hidden.bs.modal', function (event) {
      expect(importRecipeModal[0]).not.toBeVisible();
      done();
    });
    importRecipeModal.on('shown.bs.modal', function (event) {
      expect(importRecipeModal[0]).toBeVisible();
      dismissImportModal.click();
    });

    importRecipeModalButton.click();
  });

  it('should import recipe correctly', function (done) {
    importRecipeModal.on('hidden.bs.modal', function (event) {
      expect(importRecipeModal[0]).not.toBeVisible();
      done();
    });
    importRecipeModal.on('shown.bs.modal', function (event) {
      expect(importRecipeModal[0]).toBeVisible();
      const url = 'https://recipes.com/fetacheeseburgers';
      importUrl.val(url);
      importRecipeButton.click();

      const request = jasmine.Ajax.requests.mostRecent();
      expect(request.url).toBe(`/scrapeRecipe?url=${encodeURIComponent(url)}`);
      expect(request.method).toBe('GET');
      request.respondWith({
        'status': 200,
        'contentType': 'application/json',
        'responseText': JSON.stringify(fetaBurgersJson)
      });

      expect(inputRecipeName[0]).toHaveValue('Spinach and Feta Turkey Burgers');
      expect(inputPrepTime[0]).toHaveValue(20);
      expect(inputCookTime[0]).toHaveValue(15);
      expect(inputInstructions[0]).toHaveValue('Preheat grill.\nCook burgers.');
      expect(inputExternalLink[0]).toHaveValue(
          'https://www.allrecipes.com/recipe/158968/spinach-and-feta-turkey-burgers/');
      expect(inputCategories.val()).toEqual(['2']);
      expect(inputMealTypes.val()).toEqual(['1', '3']);
      expect(inputRecipeTypes.val()).toEqual(['8', '3']);

      const ingredientRows = $('.ingredientInputRow');
      const eggs = ingredientRows.eq(0);
      expect(eggs.find('#inputQuantity').val()).toEqual('2');
      expect(eggs.find('#inputUnit').val()).toEqual('');
      expect(eggs.find('#inputIngredient').val()).toEqual('eggs');
      expect(eggs.find('#inputIngredientDisplayName').val()).toEqual(
          'eggs, beaten');

      const garlic = ingredientRows.eq(1);
      expect(garlic.find('#inputQuantity').val()).toEqual('2');
      expect(garlic.find('#inputUnit').val()).toEqual('');
      expect(garlic.find('#inputIngredient').val()).toEqual('garlic cloves');
      expect(garlic.find('#inputIngredientDisplayName').val()).toEqual(
          'garlic, minced');

      const feta = ingredientRows.eq(2);
      expect(feta.find('#inputQuantity').val()).toEqual('4');
      expect(feta.find('#inputUnit').val()).toEqual('');
      expect(feta.find('#inputIngredient').val()).toEqual('');
      expect(feta.find('#inputIngredientDisplayName').val()).toEqual(
          'feta cheese');

      const spinach = ingredientRows.eq(3);
      expect(spinach.find('#inputQuantity').val()).toEqual('1');
      expect(spinach.find('#inputUnit').val()).toEqual('');
      expect(spinach.find('#inputIngredient').val()).toEqual('');
      // TODO: Improve the algo for display name so we get something better here.
      expect(spinach.find('#inputIngredientDisplayName').val()).toEqual(
          ', thawed and squeezed dry');

      const turkey = ingredientRows.eq(4);
      expect(turkey.find('#inputQuantity').val()).toEqual('2');
      expect(turkey.find('#inputUnit').val()).toEqual('4');
      expect(turkey.find('#inputIngredient').val()).toEqual('');
      expect(turkey.find('#inputIngredientDisplayName').val()).toEqual(
          'turkey, ground');
    });

    importRecipeModalButton.click();
  });
});

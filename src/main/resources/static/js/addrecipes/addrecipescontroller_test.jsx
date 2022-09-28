import 'jasmine-ajax';

import {autocompleteClasses} from '@mui/material';
import JasmineDOM from '@testing-library/jasmine-dom';
import {fireEvent, render, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {click} from '@testing-library/user-event/dist/click';
import {keyboard} from '@testing-library/user-event/dist/keyboard';
import {Toast} from 'bootstrap';
import React from 'react';

import {AddRecipesController} from './addrecipescontroller';

// TODO: DO NOT COMMIT, make this describe
fdescribe('AddRecipesController test suite', function() {
  let toastContainer;

  beforeAll(function() {
    jasmine.getEnv().addMatchers(JasmineDOM);
    window.CSRF_HEADER_NAME = 'csrf-header-name';
    window.CSRF_TOKEN = 'csrf-token';
    toastContainer = document.createElement('div');
    toastContainer.setAttribute('id', 'toastContainer');
    document.body.appendChild(toastContainer);
  });

  afterAll(() => {
    toastContainer.remove();
  });

  beforeEach(function() {
    jasmine.Ajax.install();
    jasmine.clock().install();
  });

  afterEach(function() {
    jasmine.Ajax.uninstall();
    // Clear any toasts on timers hanging around.
    jasmine.clock().tick(5000);
    jasmine.clock().uninstall();
    // Clear any permanent toasts still on the page.
    const toasts = Array.from(
        document.getElementById('toastContainer').querySelectorAll('.toast'));
    toasts.forEach((toast) => {
      Toast.getInstance(toast).dispose();
      toast.remove();
    });
  });

  function stubAjax() {
    jasmine.Ajax.stubRequest('/units').andReturn({
      'status': 200,
      'contentType': 'application/json',
      'responseText': JSON.stringify(UNITS_JSON)
    });
    jasmine.Ajax.stubRequest('/recipeTypes').andReturn({
      'status': 200,
      'contentType': 'application/json',
      'responseText': JSON.stringify(RECIPE_TYPES_JSON)
    });
    jasmine.Ajax.stubRequest('/mealTypes').andReturn({
      'status': 200,
      'contentType': 'application/json',
      'responseText': JSON.stringify(MEAL_TYPES_JSON)
    });
    jasmine.Ajax.stubRequest('/recipeCategories').andReturn({
      'status': 200,
      'contentType': 'application/json',
      'responseText': JSON.stringify(RECIPE_CATEGORIES_JSON)
    });
    jasmine.Ajax.stubRequest('/ingredientsAc').andReturn({
      'status': 200,
      'contentType': 'application/json',
      'responseText': JSON.stringify(INGREDIENTS_JSON)
    });
  }

  it('should render properly and be functional', async function() {
    stubAjax();
    const {getByRole} = render(<AddRecipesController/>);
    const requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(4);
    // Expected elements are present.
    expect(getByRole('button', {name: /reset form/i})).toBeInTheDocument();
    expect(getByRole('button', {name: /import recipe/i})).toBeInTheDocument();
    expect(getByRole('textbox', {name: /recipe name/i})).toBeInTheDocument();
    expect(getByRole('textbox',
        {name: /recipe description/i})).toBeInTheDocument();
    expect(getByRole('textbox', {name: /quantity/i})).toBeInTheDocument();
    // Select component are controlled by buttons.
    expect(getByRole('button', {name: /units/i})).toBeInTheDocument();
    expect(getByRole('combobox', {name: /ingredient/i})).toBeInTheDocument();
    expect(getByRole('textbox', {name: /display name/i})).toBeInTheDocument();
    expect(getByRole('textbox', {name: /instructions/i})).toBeInTheDocument();
    expect(getByRole('textbox', {name: /prep time/i})).toBeInTheDocument();
    expect(getByRole('textbox', {name: /cook time/i})).toBeInTheDocument();
    expect(getByRole('button', {name: /recipe types/i})).toBeInTheDocument();
    expect(getByRole('button', {name: /meal types/i})).toBeInTheDocument();
    expect(
        getByRole('button', {name: /other categories/i})).toBeInTheDocument();
    expect(getByRole('textbox', {name: /external link/i})).toBeInTheDocument();
    expect(getByRole('button', {name: /add recipe/i})).toBeInTheDocument();

    // Unit select is populated asynchronously.
    fireEvent.mouseDown(getByRole('button', {name: /units/i}));
    const unitList = within(getByRole('listbox', {name: /units/i}));
    await unitList.findAllByRole('option').then((options) => {
      expect(options.length).toBe(6);
      keyboard('[Escape]');
    });

    // Figure out why this isn't working!
    const ingredientAc = getByRole('combobox', {name: /ingredient/i});
    click(ingredientAc);
    await userEvent.type(ingredientAc, 'ch');
    // autocompleteClasses
    expect(
        document.querySelector(
            `.${autocompleteClasses.paper}`)).toHaveTextContent(
        'No options');

    /*
    const ingredientList = within(getByRole('listbox', {name: /ingredient/i}));
    await ingredientList.findAllByRole('option').then((options) => {
      expect(options.length).toBe(5);
      // expect(ingredientAc.value).toBe('foo');
    });
     */
  });

  /*
   Material UI select component example interaction in a test:
   https://github.com/mui/material-ui/blob/master/packages/mui-material/src/Select/Select.test.js
   */
});

const INGREDIENTS_JSON = [
  {'name': 'cheesecake mix', 'id': 852}, {'name': 'chunk chicken', 'id': 679},
  {'name': 'chablis wine', 'id': 816}, {'name': 'chardonnay', 'id': 829},
  {'name': 'chuck fillet', 'id': 455},
  {'name': 'chartreuse liqueur', 'id': 830}, {'name': 'chai spice', 'id': 818},
  {'name': 'champagne', 'id': 824}, {'name': 'cheese soup', 'id': 847},
  {'name': 'cherry pie filling', 'id': 863},
  {'name': 'challah rolls', 'id': 822}, {'name': 'chai tea bags', 'id': 821},
  {'name': 'cheese curd', 'id': 843}, {'name': 'cheese pumpkin', 'id': 845},
  {'name': 'Chambord cordial', 'id': 823}, {'name': 'cherry juice', 'id': 862},
  {'name': 'cherry jam', 'id': 864},
  {'name': 'chanterelle mushrooms', 'id': 827},
  {'name': 'cheerios oat cereal', 'id': 839},
  {'name': 'cherry gelatin', 'id': 860}
];

const RECIPE_TYPES_JSON = [
  {'id': 1, 'name': 'condiment'}, {'id': 2, 'name': 'sauce'},
  {'id': 3, 'name': 'entree'}, {'id': 4, 'name': 'side dish'},
  {'id': 5, 'name': 'appetizer'}, {'id': 6, 'name': 'dessert'},
  {'id': 7, 'name': 'snack'}, {'id': 8, 'name': 'baked good'},
  {'id': 9, 'name': 'beverage'}, {'id': 10, 'name': 'soup'},
  {'id': 11, 'name': 'salad'}, {'id': 12, 'name': 'preserving'},
  {'id': 13, 'name': 'bread'}
];

const MEAL_TYPES_JSON = [
  {'id': 1, 'name': 'breakfast'}, {'id': 2, 'name': 'lunch'},
  {'id': 3, 'name': 'dinner'}, {'id': 4, 'name': 'brunch'}
];

const RECIPE_CATEGORIES_JSON = [
  {'id': 17, 'name': 'American'}, {'id': 11, 'name': 'BBQ'},
  {'id': 4, 'name': 'Chinese'}, {'id': 21, 'name': 'Cajun'},
  {'id': 15, 'name': 'European'}, {'id': 19, 'name': 'French'},
  {'id': 2, 'name': 'Italian'}, {'id': 5, 'name': 'Indian'},
  {'id': 9, 'name': 'Japanese'}, {'id': 18, 'name': 'Middle Eastern'},
  {'id': 16, 'name': 'Mediterranean'}, {'id': 1, 'name': 'Mexican'},
  {'id': 20, 'name': 'Spanish'}, {'id': 3, 'name': 'Thai'},
  {'id': 10, 'name': 'Vietnamese'}, {'id': 23, 'name': 'comfort food'},
  {'id': 12, 'name': 'dairy-free'}, {'id': 13, 'name': 'gluten-free'},
  {'id': 6, 'name': 'holidays'}, {'id': 14, 'name': 'low-calorie'},
  {'id': 8, 'name': 'low-carb'}, {'id': 25, 'name': 'slow-cooked'},
  {'id': 7, 'name': 'vegetarian'}, {'id': 22, 'name': 'vegan'}
];

const UNITS_JSON = [
  {'id': 1, 'name': 'grams'},
  {'id': 2, 'name': 'ounces'},
  {'id': 3, 'name': 'pounds'},
  {'id': 4, 'name': 'milligrams'},
  {'id': 5, 'name': 'teaspoons'},
  {'id': 6, 'name': 'sprigs'}
];

// eslint-disable-next-line no-unused-vars
const FETA_BURGERS_JSON = {
  'title': 'Spinach and Feta Turkey Burgers',
  'total_time': 35,
  'cook_time': 15,
  'prep_time': 20,
  'ingredients': [
    {
      'confidence': 0.9764371000000001,
      'error': null,
      'ingredientParsed': {
        'ingredientId': 24,
        'name': 'eggs',
        'preparationNotes': 'beaten',
        'product': 'eggs',
        'productSizeModifier': null,
        'quantity': 2.0,
        'unit': null,
        'usdaInfo': {
          'category': 'Dairy and Egg Products',
          'description': 'Egg, whole, raw, fresh',
          'fdcId': '171287',
          'matchMethod': 'exact'
        }
      },
      'ingredientRaw': '2 eggs, beaten'
    },
    {
      'confidence': 0.9817117,
      'error': null,
      'ingredientParsed': {
        'ingredientId': 69,
        'name': 'garlic cloves',
        'preparationNotes': 'minced',
        'product': 'garlic',
        'productSizeModifier': null,
        'quantity': 2.0,
        'unit': 'clove',
        'usdaInfo': {
          'category': null,
          'description': 'Garlic, raw',
          'fdcId': '787793',
          'matchMethod': 'exact'
        }
      },
      'ingredientRaw': '2 cloves garlic, minced'
    },
    {
      'confidence': 0.9916780000000001,
      'error': null,
      'ingredientParsed': {
        'preparationNotes': null,
        'product': 'feta cheese',
        'productSizeModifier': null,
        'quantity': 4.0,
        'unit': 'ounce',
        'usdaInfo': {
          'category': 'Dairy and Egg Products',
          'description': 'Cheese, feta',
          'fdcId': '173420',
          'matchMethod': 'exact'
        }
      },
      'ingredientRaw': '4 ounces feta cheese'
    },
    {
      'confidence': 0.334193,
      'error': null,
      'ingredientParsed': {
        'preparationNotes': 'thawed and squeezed dry',
        'product': null,
        'productSizeModifier': null,
        'quantity': 1.0,
        'unit': 'box',
        'usdaInfo': null
      },
      'ingredientRaw': '1 (10 ounce) box frozen chopped spinach, thawed and ' +
          'squeezed dry'
    },
    {
      'confidence': 0.9139855,
      'error': null,
      'ingredientParsed': {
        'preparationNotes': 'ground',
        'product': 'turkey',
        'productSizeModifier': null,
        'quantity': 2.33333333,
        'unitId': 4,
        'unit': 'pound',
        'usdaInfo': {
          'category': 'Poultry Products',
          'description': 'Turkey, whole, light meat, raw',
          'fdcId': '171490',
          'matchMethod': 'closestUnbranded'
        }
      },
      'ingredientRaw': '2 pounds ground turkey'
    }
  ],
  'instructions': 'Preheat grill.\nCook burgers.',
  'canonical_url': 'https://www.allrecipes.com/recipe/158968/spinach-and-feta-turkey-burgers/',
  'recipe_categories': [2],
  'recipe_types': [3, 8],
  'meal_types': [1, 3]
};

import 'jasmine-ajax';

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
      'ingredientRaw': '1 (10 ounce) box frozen chopped spinach, thawed and squeezed dry'
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
  'meal_types': [1, 3],
};

describe('AddRecipesController test suite', function () {

  beforeAll(function () {
    window.CSRF_HEADER_NAME = 'csrf-header-name';
    window.CSRF_TOKEN = 'csrf-token';
  });

  beforeEach(function () {

  });

  afterEach(function () {

  });

  it('does stuff and things', function () {

  });
});

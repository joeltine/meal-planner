import json
import unittest
from unittest.mock import patch

from recipe_scraper import RecipeScraper

ALL_RECIPES_FETA_BURGERS_URL = 'https://www.allrecipes.com/recipe/158968/spinach-and-feta-turkey-burgers/'


class TestScraper:

  def title(self):
    return 'Feta burgers'

  def total_time(self):
    return 35

  def cook_time(self):
    return 15

  def prep_time(self):
    raise NotImplementedError('no prep_time!')

  def ingredients(self):
    return ['Turkey', 'Buns', 'Feta']

  def instructions(self):
    return 'Do some stuff\nThen do more'

  def canonical_url(self):
    return ALL_RECIPES_FETA_BURGERS_URL

  def category(self):
    return 'Meat and Poultry,Turkey'


class RecipeScraperTest(unittest.TestCase):

  @classmethod
  def setUpClass(cls):
    with open('testing/parse_ingredients_test.json', 'r') as file:
      cls.parse_ingredients_json = file.read()

  @patch('recipe_scraper.scrape_me')
  def test_scrape_invokes_scrape_me(self, scrape_me_mock):
    scraper = RecipeScraper(ALL_RECIPES_FETA_BURGERS_URL)
    scraper.scrape()
    scrape_me_mock.assert_called_once_with(ALL_RECIPES_FETA_BURGERS_URL,
                                           wild_mode=True)

  @patch('recipe_scraper.parse_ingredient_list')
  @patch('recipe_scraper.scrape_me')
  def test_converting_scraper_results_to_json(self, scrape_me_mock,
      parse_ingredients_list_mock):
    scrape_me_mock.return_value = TestScraper()
    parsed_ingredients = json.loads(self.parse_ingredients_json)
    parse_ingredients_list_mock.return_value = parsed_ingredients
    scraper = RecipeScraper(ALL_RECIPES_FETA_BURGERS_URL)
    scraper.scrape()
    recipe_json = scraper.to_json()
    parse_ingredients_list_mock.assert_called_once_with(
      ['Turkey', 'Buns', 'Feta'])
    self.assertEqual('Feta burgers', recipe_json['title'])
    self.assertEqual(35, recipe_json['total_time'])
    self.assertEqual(15, recipe_json['cook_time'])
    self.assertEqual(None, recipe_json['prep_time'])  # impl raises Error
    self.assertEqual(parsed_ingredients['results'], recipe_json['ingredients'])
    self.assertEqual('Do some stuff\nThen do more', recipe_json['instructions'])
    self.assertEqual(ALL_RECIPES_FETA_BURGERS_URL, recipe_json['canonical_url'])
    self.assertEqual('Meat and Poultry,Turkey', recipe_json['category'])

  @patch('recipe_scraper.parse_ingredient_list')
  @patch('recipe_scraper.scrape_me')
  def test_scraper_results_to_json_ingredient_parse_error(self, scrape_me_mock,
      parse_ingredients_list_mock):
    scrape_me_mock.return_value = TestScraper()
    parse_ingredients_list_mock.return_value = {'error': 'foo'}
    scraper = RecipeScraper(ALL_RECIPES_FETA_BURGERS_URL)
    scraper.scrape()
    recipe_json = scraper.to_json()
    parse_ingredients_list_mock.assert_called_once_with(
      ['Turkey', 'Buns', 'Feta'])
    self.assertEqual('Feta burgers', recipe_json['title'])
    self.assertEqual(35, recipe_json['total_time'])
    self.assertEqual(15, recipe_json['cook_time'])
    self.assertEqual(None, recipe_json['prep_time'])  # impl raises Error
    self.assertEqual([], recipe_json['ingredients'])
    self.assertEqual('Do some stuff\nThen do more', recipe_json['instructions'])
    self.assertEqual(ALL_RECIPES_FETA_BURGERS_URL, recipe_json['canonical_url'])
    self.assertEqual('Meat and Poultry,Turkey', recipe_json['category'])


if __name__ == '__main__':
  unittest.main()

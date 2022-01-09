# Scrapes passed recipe URL and outputs results as JSON.
#
# Example usage:
#   python3 scrape_recipe.py \
#     https://www.allrecipes.com/recipe/158968/spinach-and-feta-turkey-burgers/
# TODO: Write some unit tests.

import argparse
import json

from recipe_scrapers import scrape_me
from recipe_scrapers._exceptions import SchemaOrgException

from parse_ingredients import parse_ingredient_list

parser = argparse.ArgumentParser()
parser.add_argument("recipeUrl", help="The URL of the recipe to scrape.")
args = parser.parse_args()
recipeUrl = args.recipeUrl

try:
  scraper = scrape_me(recipeUrl, wild_mode=True)
except Exception as err:
  print(err)
  exit(1)

outJson = {}
fields = ['title', 'total_time', 'cook_time', 'prep_time', 'ingredients',
          'instructions', 'canonical_url', 'category']

for f in fields:
  try:
    fieldValue = getattr(scraper, f)()
    if f == 'ingredients':
      parsed = parse_ingredient_list(fieldValue)
      if parsed['error']:
        outJson[f] = []
      else:
        # results format at https://zestfuldata.com/docs
        outJson[f] = parsed['results']
    else:
      outJson[f] = fieldValue
  except (SchemaOrgException, NotImplementedError) as err:
    outJson[f] = None
  except Exception as err:
    print(err)
    exit(1)

try:
  recipeJson = json.dumps(outJson)
except Exception as err:
  print(err)
  exit(1)

print(recipeJson)
exit(0)

# Scrapes passed recipe URL and outputs results as JSON.
#
# Example usage:
#   python3 scrape_recipe.py \
#     https://www.allrecipes.com/recipe/158968/spinach-and-feta-turkey-burgers/

import argparse
import json
from recipe_scrapers import scrape_me

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
    outJson[f] = getattr(scraper, f)()
  except Exception:
    outJson[f] = ''

try:
  recipeJson = json.dumps(outJson)
except Exception as err:
  print(err)
  exit(1)

print(recipeJson)
exit(0)

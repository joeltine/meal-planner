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
    print(err.message)
    exit(1)

outJson = {}

try:
    outJson['title'] = scraper.title()
    outJson['total_time'] = scraper.total_time()
    outJson['cook_time'] = scraper.cook_time()
    outJson['prep_time'] = scraper.prep_time()
    outJson['ingredients'] = scraper.ingredients()
    outJson['instructions'] = scraper.instructions()
    outJson['canonical_url'] = scraper.canonical_url()
    outJson['category'] = scraper.category()
except Exception as err:
    print(err.message)
    exit(1)

try:
    recipeJson = json.dumps(outJson)
except Exception as err:
    print(err.message)
    exit(1)

print(recipeJson)
exit(0)

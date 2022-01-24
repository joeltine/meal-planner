# Scrapes passed recipe URL and outputs results as JSON.
#
# Example usage:
#   python3 scrape_recipe.py \
#     https://www.allrecipes.com/recipe/158968/spinach-and-feta-turkey-burgers/

import argparse
import json

from recipe_scraper import RecipeScraper

parser = argparse.ArgumentParser()
parser.add_argument("recipeUrl", help="The URL of the recipe to scrape.")
args = parser.parse_args()
recipeUrl = args.recipeUrl


def main():
  scraper = RecipeScraper(recipeUrl)

  try:
    scraper.scrape()
  except Exception as err:
    print(err)
    exit(1)

  try:
    recipe_json = scraper.to_json()
  except Exception as err:
    print(err)
    exit(1)

  print(json.dumps(recipe_json))
  exit(0)


if __name__ == '__main__':
  main()

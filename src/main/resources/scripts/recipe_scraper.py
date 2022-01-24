from recipe_scrapers import scrape_me
from recipe_scrapers._exceptions import SchemaOrgException

from parse_ingredients import parse_ingredient_list


class RecipeScraper:
  """A scraper to parse external recipe pages on the web."""

  def __init__(self, url):
    self.scraper = None
    self.url = url
    self.fields = ['title', 'total_time', 'cook_time', 'prep_time',
                   'ingredients', 'instructions', 'canonical_url', 'category']

  def scrape(self):
    self.scraper = scrape_me(self.url, wild_mode=True)

  def to_json(self):
    out_json = {}

    for f in self.fields:
      try:
        field_value = getattr(self.scraper, f)()
        if f == 'ingredients':
          parsed = parse_ingredient_list(field_value)
          if parsed['error']:
            out_json[f] = []
          else:
            # results format at https://zestfuldata.com/docs
            out_json[f] = parsed['results']
        else:
          out_json[f] = field_value
      except (SchemaOrgException, NotImplementedError):
        # These just mean the fields aren't supported by the site, we don't
        # want to fail on this.
        out_json[f] = None

    return out_json

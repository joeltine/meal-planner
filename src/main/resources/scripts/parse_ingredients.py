"""Library to parse raw ingredient text and return structured data.

Uses Zestful data API for parsing ingredients: https://zestfuldata.com/docs.
The API key for zestful must be present in environment variable
ZESTFUL_API_KEY or the script will raise an exception.
"""

import http.client
import json
import os

HEADERS = {
  'content-type': 'application/json',
  'x-rapidapi-host': 'zestful.p.rapidapi.com',
  'x-rapidapi-key': os.environ['ZESTFUL_API_KEY']
}


def parse_ingredient_list(ingredient_list):
  connection = http.client.HTTPSConnection('zestful.p.rapidapi.com')

  payload = {'ingredients': ingredient_list}

  connection.request('POST', '/parseIngredients', json.dumps(payload), HEADERS)

  res = connection.getresponse()
  data = res.read()

  return json.loads(data.decode('utf-8'))

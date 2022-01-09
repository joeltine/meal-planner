# Library to parse raw ingredient text and return structured data. Uses
# Zestful data API for parsing ingredients: https://zestfuldata.com/docs.
import http.client
import json

HEADERS = {
  'content-type': 'application/json',
  'x-rapidapi-host': 'zestful.p.rapidapi.com',
  # TODO: Hide this API key.
  'x-rapidapi-key': 'ff1a2def8cmsh57f7cf808321f06p185419jsn3809ded16a09'
}


def parse_ingredient_list(ingredient_list):
  connection = http.client.HTTPSConnection('zestful.p.rapidapi.com')

  payload = {'ingredients': ingredient_list}

  connection.request('POST', '/parseIngredients', json.dumps(payload), HEADERS)

  res = connection.getresponse()
  data = res.read()

  return json.loads(data.decode('utf-8'))

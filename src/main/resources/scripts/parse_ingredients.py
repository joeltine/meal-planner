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

STUB_JSON = """
{
  "results": [
    {
      "ingredientRaw": "3 large Granny Smith apples",
      "ingredientParsed": {
        "quantity": 3.0,
        "unit": null,
        "productSizeModifier": "large",
        "product": "Granny Smith apples",
        "preparationNotes": null,
        "usdaInfo": {
          "category": "Fruits and Fruit Juices",
          "description": "Apples, raw, granny smith, with skin (Includes foods for USDA's Food Distribution Program)",
          "fdcId": "168203",
          "matchMethod": "exact"
        }
      },
      "confidence": 0.9242,
      "error": null
    },
    {
      "ingredientRaw": "2 1/2 tablespoons finely chopped parsley",
      "ingredientParsed": {
        "quantity": 2.5,
        "unit": "tablespoon",
        "productSizeModifier": null,
        "product": "parsley",
        "preparationNotes": "finely chopped",
        "usdaInfo": {
          "category": "Vegetables and Vegetable Products",
          "description": "Parsley, fresh",
          "fdcId": "170416",
          "matchMethod": "exact"
        }
      },
      "confidence": 0.9453,
      "error": null
    },
    {
      "ingredientRaw": "½ tsp brown sugar",
      "ingredientParsed": {
        "quantity": 0.5,
        "unit": "teaspoon",
        "productSizeModifier": null,
        "product": "brown sugar",
        "preparationNotes": null,
        "usdaInfo": {
          "category": "Sweets",
          "description": "Sugars, brown",
          "fdcId": "168833",
          "matchMethod": "exact"
        }
      },
      "confidence": 0.9262,
      "error": null
    }
  ],
  "requestsRemaining": 27,
  "error": null
}"""

STUB_MODE = True


def parse_ingredient_list(ingredient_list):
  if STUB_MODE:
    return json.loads(STUB_JSON)

  connection = http.client.HTTPSConnection('zestful.p.rapidapi.com')

  payload = {'ingredients': ingredient_list}

  connection.request('POST', '/parseIngredients', json.dumps(payload), HEADERS)

  res = connection.getresponse()
  data = res.read()

  return json.loads(data.decode('utf-8'))

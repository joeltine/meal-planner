/**
 * Class for Meal Planner's communication with Google Docs REST API. Assumes
 * gapi.client.docs has been initialized.
 *
 * gapi JS docs @ https://github.com/google/google-api-javascript-client.
 */
import {GoogleDocument} from "./googledocument";

export class GoogleDocsClient {

  constructor() {
    if (!gapi || !gapi.client || !gapi.client.docs) {
      throw new Error('No gapi docs client detected!');
    }
  }

  printDocBody() {
    gapi.client.docs.documents.get({
      documentId: '1n6CruLbPkKijx5KPxrray0krAewGso99hi5FKbJcS0U'
    }).then(function (response) {
      var doc = response.result;
      console.log(JSON.stringify(doc, null, 4));
    }, function (response) {
      console.error('Error: ' + response.result.error.message);
    });
  }

  /*
  [{
  "id": 2,
  "name": "Asian Chicken Lettuce Wraps",
  "instructions": "Whisk together sauce ingredients until well combined. If you use a firmer peanut butter you may need to microwave the mixture for 30-60 seconds in order to melt it and ensure everything is well-mixed.\n\nHeat 2 TBS peanut oil in a frying pan. Once hot, add ground chicken.\n\nCook until some pieces are starting to brown. Add onion and cook for 5 minutes or until the onion is becoming translucent.\n\nAdd the peppers and water chestnuts and cook about 5 minutes or until peppers are becoming soft.\n\nAdd sauce and simmer on low heat until the chicken and veggies are evenly coated and everything is heated through.\n\nServe in lettuce leaves, on top of your favorite Asian salad, or over noodles or rice!",
  "description": "Asian Chicken Lettuce Wraps (better than P.F. Chang's)! A quick (less than 30 minutes), easy, and healthy dinner that tastes delicious! Gluten and dairy-free!",
  "externalLink": "https://joyfoodsunshine.com/asian-chicken-lettuce-wraps/",
  "prepTimeMin": 10,
  "cookTimeMin": 20,
  "ingredientLists": [{
    "id": 26,
    "ingredient": {
      "id": 2374,
      "name": "hoisin sauce",
      "apiId": 6175,
      "aisle": ["Ethnic Foods"],
      "categories": ["sauce"],
      "image": "dark-sauce.jpg"
    },
    "unit": {"id": 3, "name": "tablespoons"},
    "quantity": 3.0,
    "ingredientDisplayName": "hoisin sauce"
  },
  ...
  ]
  ...}]
   */

  createNewMealPlanDoc(recipes) {
    const doc = new GoogleDocument(
        `Meal Plan for ${new Date().toLocaleDateString()}`);

    for (const recipe of recipes) {
      doc.heading1(recipe.name);
    }

    return doc.writeDoc();
  }
}
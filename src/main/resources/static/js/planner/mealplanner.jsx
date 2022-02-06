import React from "react";
import {PlannerForm} from "./plannerform";
import {PlannerResults} from "./plannerresults";

const RenderModes = {
  FORM: 'FORM',
  RESULTS: 'RESULTS'
};

const FAKE = [{
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
  }, {
    "id": 32,
    "ingredient": {
      "id": 1989,
      "name": "garlic powder",
      "apiId": 1022020,
      "aisle": ["Spices and Seasonings"],
      "categories": ["dehydrated garlic", "spices"],
      "image": "garlic-powder.png"
    },
    "unit": {"id": 4, "name": "teaspoons"},
    "quantity": 0.5,
    "ingredientDisplayName": "garlic powder"
  }, {
    "id": 28,
    "ingredient": {
      "id": 4576,
      "name": "rice wine vinegar",
      "apiId": 1022053,
      "aisle": ["Ethnic Foods", "Oil, Vinegar, Salad Dressing"],
      "categories": ["vinegar"],
      "image": "rice-vinegar.png"
    },
    "unit": {"id": 3, "name": "tablespoons"},
    "quantity": 1.0,
    "ingredientDisplayName": "rice vinegar"
  }, {
    "id": 24,
    "ingredient": {
      "id": 4696,
      "name": "canned water chestnuts",
      "apiId": 11590,
      "aisle": ["Canned and Jarred", "Ethnic Foods"],
      "categories": ["water chestnuts"],
      "image": "water-chestnuts.png"
    },
    "unit": {"id": 5, "name": "ounces"},
    "quantity": 8.0,
    "ingredientDisplayName": "water chestnuts, drained and minced"
  }, {
    "id": 33,
    "ingredient": {
      "id": 4981,
      "name": "ground ginger",
      "apiId": 2021,
      "aisle": ["Spices and Seasonings"],
      "categories": ["ginger", "spices"],
      "image": "ginger.png"
    },
    "unit": {"id": 4, "name": "teaspoons"},
    "quantity": 0.25,
    "ingredientDisplayName": "powdered ginger"
  }, {
    "id": 20,
    "ingredient": {
      "id": 4980,
      "name": "ground chicken",
      "apiId": 5062,
      "aisle": ["Meat"],
      "categories": ["chicken", "poultry", "meat"],
      "image": "meat-ground.jpg"
    },
    "unit": {"id": 1, "name": "pounds"},
    "quantity": 1.0,
    "ingredientDisplayName": "chicken, ground"
  }, {
    "id": 35,
    "ingredient": {
      "id": 2653,
      "name": "lettuce leaves",
      "apiId": 93623,
      "aisle": ["Produce"],
      "categories": ["lettuce", "greens", "vegetable"],
      "image": "iceberg-lettuce.jpg"
    },
    "unit": {"id": 14, "name": "whole"},
    "quantity": 1.0,
    "ingredientDisplayName": "your favorite lettuce leaves"
  }, {
    "id": 30,
    "ingredient": {
      "id": 3876,
      "name": "honey",
      "apiId": 19296,
      "aisle": ["Nut butters, Jams, and Honey"],
      "categories": ["unrefined sweetener", "sweetener"],
      "image": "honey.png"
    },
    "unit": {"id": 3, "name": "tablespoons"},
    "quantity": 1.0,
    "ingredientDisplayName": "honey"
  }, {
    "id": 22,
    "ingredient": {
      "id": 4753,
      "name": "white onions",
      "apiId": 10611282,
      "aisle": ["Produce"],
      "categories": ["onion"],
      "image": "white-onion.png"
    },
    "unit": {"id": 14, "name": "whole"},
    "quantity": 0.5,
    "ingredientDisplayName": "onion, minced"
  }, {
    "id": 29,
    "ingredient": {
      "id": 3254,
      "name": "peanut butter",
      "apiId": 16098,
      "aisle": ["Nut butters, Jams, and Honey"],
      "categories": ["nut butter", "spread"],
      "image": "peanut-butter.png"
    },
    "unit": {"id": 3, "name": "tablespoons"},
    "quantity": 1.0,
    "ingredientDisplayName": "peanut butter"
  }, {
    "id": 34,
    "ingredient": {
      "id": 3264,
      "name": "peanut",
      "apiId": 16091,
      "aisle": ["Nuts", "Savory Snacks"],
      "categories": ["nuts"],
      "image": "peanuts.png"
    },
    "unit": {"id": 6, "name": "cups"},
    "quantity": 0.25,
    "ingredientDisplayName": "peanuts crushed"
  }, {
    "id": 23,
    "ingredient": {
      "id": 2174,
      "name": "green bell pepper",
      "apiId": 11333,
      "aisle": ["Produce"],
      "categories": ["bell pepper", "sweet pepper", "peppers", "vegetable"],
      "image": "green-pepper.jpg"
    },
    "unit": {"id": 6, "name": "cups"},
    "quantity": 1.0,
    "ingredientDisplayName": "red or green pepper diced"
  }, {
    "id": 25,
    "ingredient": {
      "id": 4961,
      "name": "soy sauce",
      "apiId": 16424,
      "aisle": ["Ethnic Foods", "Condiments"],
      "categories": ["soy sauce", "condiment"],
      "image": "soy-sauce.jpg"
    },
    "unit": {"id": 3, "name": "tablespoons"},
    "quantity": 3.0,
    "ingredientDisplayName": "soy sauce"
  }, {
    "id": 27,
    "ingredient": {
      "id": 4012,
      "name": "sesame oil",
      "apiId": 4058,
      "aisle": ["Ethnic Foods"],
      "categories": ["cooking oil", "cooking fat"],
      "image": "sesame-oil.png"
    },
    "unit": {"id": 3, "name": "tablespoons"},
    "quantity": 1.0,
    "ingredientDisplayName": "sesame oil"
  }, {
    "id": 21,
    "ingredient": {
      "id": 4934,
      "name": "peanut oil",
      "apiId": 4042,
      "aisle": ["Oil, Vinegar, Salad Dressing"],
      "categories": ["cooking oil", "cooking fat"],
      "image": "peanut-oil.jpg"
    },
    "unit": {"id": 3, "name": "tablespoons"},
    "quantity": 1.0,
    "ingredientDisplayName": "peanut oil"
  }, {
    "id": 31,
    "ingredient": {
      "id": 964,
      "name": "chili sauce",
      "apiId": 6972,
      "aisle": ["Ethnic Foods"],
      "categories": [],
      "image": "tomato-sauce-or-pasta-sauce.jpg"
    },
    "unit": {"id": 4, "name": "teaspoons"},
    "quantity": 2.0,
    "ingredientDisplayName": "sweet chili sauce"
  }],
  "recipeTypes": [{"id": 4, "recipeType": {"id": 5, "name": "appetizer"}},
    {"id": 3, "recipeType": {"id": 3, "name": "entree"}}],
  "mealTypes": [{"id": 3, "mealType": {"id": 2, "name": "lunch"}},
    {"id": 4, "mealType": {"id": 3, "name": "dinner"}}],
  "recipeCategories": [{
    "id": 4,
    "recipeCategory": {"id": 12, "name": "dairy-free"}
  }, {"id": 3, "recipeCategory": {"id": 14, "name": "low-calorie"}},
    {"id": 2, "recipeCategory": {"id": 4, "name": "Chinese"}}]
}, {
  "id": 4,
  "name": "Beef Stroganoff",
  "instructions": "Bring a large pot of salted water to a boil.\n\nSeason the beef with 1 teaspoon salt and a generous amount of freshly ground black pepper. Heat the vegetable oil in a large skillet over medium-high heat. Add the beef and cook, untouched, until starting to turn brown in some spots, about 1 minute. Use tongs to flip the pieces and continue cooking until deep golden brown but still undercooked in the center, about 1 minute (the beef will finish cooking in the sauce). Transfer the beef to a bowl and return the skillet to the stovetop on medium-high.\n\nAdd 1 tablespoon butter to the skillet. Add the onion and 1/2 teaspoon salt and cook, stirring occasionally to scrape up the browned bits in the pan, until the onions are softened, 4 to 5 minutes. Add 2 tablespoons butter, the button mushrooms, shiitakes and thyme and cook, stirring occasionally scraping up any browned bits, until the mushrooms have released some liquid and are starting to crisp up, 5 to 6 minutes. Stir in the garlic and cook until fragrant, about 1 minute. Pour in the wine and bring to a boil. Reduce the heat to medium and simmer until evaporated, about 5 minutes.\n\nSprinkle the flour over the vegetables and stir until incorporated. Fold in the sour cream, Dijon, Worcestershire sauce and 1/4 teaspoon freshly ground black pepper. Pour in the beef broth and stir until smooth. Bring to a simmer and cook, stirring occasionally, until the sauce has thickened, about 5 minutes.\n\nMeanwhile, while the sauce reduces, cook the egg noodles according to the package directions for al dente. Drain and toss with the remaining 2 tablespoons butter, the chopped parsley and chives.\n\nFold the beef and any accumulated juices from the bowl into the sauce and cook, stirring occasionally, until the beef is cooked through but still slightly pink on the inside, about 1 minute.\n\nDivide the noodles between 4 bowls and top with the sauce and beef. Sprinkle with more chives, if desired.",
  "description": "We used a marbled, tender piece of ribeye as the star of this comfort food classic. Two kinds of mushrooms are cooked until crispy to add an extra element of flavor. The whole dish is brought together with a rich, tangy sauce made with sour cream and Dijon and served over egg noodles.\n",
  "externalLink": "https://www.foodnetwork.com/recipes/food-network-kitchen/the-best-beef-stroganoff-8051437",
  "prepTimeMin": 20,
  "cookTimeMin": 25,
  "ingredientLists": [{
    "id": 54,
    "ingredient": {
      "id": 4949,
      "name": "garlic cloves",
      "apiId": 11215,
      "aisle": ["Produce"],
      "categories": [],
      "image": "garlic.png"
    },
    "unit": {"id": 14, "name": "whole"},
    "quantity": 1.0,
    "ingredientDisplayName": "garlic, minced"
  }, {
    "id": 56,
    "ingredient": {
      "id": 4564,
      "name": "all purpose flour",
      "apiId": 20581,
      "aisle": ["Baking"],
      "categories": ["all purpose flour", "wheat flour", "flour product"],
      "image": "flour.png"
    },
    "unit": {"id": 3, "name": "tablespoons"},
    "quantity": 2.0,
    "ingredientDisplayName": "all-purpose flour"
  }, {
    "id": 46,
    "ingredient": {
      "id": 1059,
      "name": "ribeye steak",
      "apiId": 23145,
      "aisle": ["Meat"],
      "categories": ["steak", "main dish"],
      "image": "ribeye-raw.jpg"
    },
    "unit": {"id": 1, "name": "pounds"},
    "quantity": 1.0,
    "ingredientDisplayName": "ribeye steak, trimmed of excess fat and cut into 2-by-1 /2-inch strips"
  }, {
    "id": 47,
    "ingredient": {
      "id": 3915,
      "name": "salt and black pepper",
      "apiId": 1102047,
      "aisle": ["Spices and Seasonings"],
      "categories": ["spices"],
      "image": "salt-and-pepper.jpg"
    },
    "unit": {"id": 14, "name": "whole"},
    "quantity": 1.0,
    "ingredientDisplayName": "Kosher salt and black pepper, freshly ground, to taste"
  }, {
    "id": 48,
    "ingredient": {
      "id": 4982,
      "name": "vegetable oil",
      "apiId": 1014582,
      "aisle": ["Oil, Vinegar, Salad Dressing"],
      "categories": ["vegetable oil", "cooking oil", "cooking fat"],
      "image": "vegetable-oil.jpg"
    },
    "unit": {"id": 3, "name": "tablespoons"},
    "quantity": 2.0,
    "ingredientDisplayName": "vegetable oil"
  }, {
    "id": 59,
    "ingredient": {
      "id": 4855,
      "name": "worcestershire sauce",
      "apiId": 6971,
      "aisle": ["Condiments"],
      "categories": ["condiment"],
      "image": "dark-sauce.jpg"
    },
    "unit": {"id": 3, "name": "tablespoons"},
    "quantity": 1.0,
    "ingredientDisplayName": "Worcestershire sauce"
  }, {
    "id": 51,
    "ingredient": {
      "id": 4751,
      "name": "white mushrooms",
      "apiId": 11260,
      "aisle": ["Produce"],
      "categories": ["mushrooms"],
      "image": "mushrooms-white.jpg"
    },
    "unit": {"id": 5, "name": "ounces"},
    "quantity": 8.0,
    "ingredientDisplayName": "white button mushrooms, quartered"
  }, {
    "id": 61,
    "ingredient": {
      "id": 1252,
      "name": "wide egg noodles",
      "apiId": 20410,
      "aisle": ["Pasta and Rice"],
      "categories": ["egg noodles", "cooked pasta", "pasta"],
      "image": "egg-noodles.jpg"
    },
    "unit": {"id": 5, "name": "ounces"},
    "quantity": 10.0,
    "ingredientDisplayName": "wide egg noodles"
  }, {
    "id": 55,
    "ingredient": {
      "id": 4767,
      "name": "dry white wine",
      "apiId": 14106,
      "aisle": ["Alcoholic Beverages"],
      "categories": ["white wine", "wine", "alcoholic drink", "drink"],
      "image": "white-wine.jpg"
    },
    "unit": {"id": 6, "name": "cups"},
    "quantity": 0.5,
    "ingredientDisplayName": "dry white wine"
  }, {
    "id": 53,
    "ingredient": {
      "id": 4446,
      "name": "fresh thyme",
      "apiId": 2049,
      "aisle": ["Produce", "Spices and Seasonings"],
      "categories": ["herbs"],
      "image": "thyme.jpg"
    },
    "unit": {"id": 3, "name": "tablespoons"},
    "quantity": 1.0,
    "ingredientDisplayName": "fresh thyme, chopped"
  }, {
    "id": 49,
    "ingredient": {
      "id": 4570,
      "name": "unsalted butter",
      "apiId": 1145,
      "aisle": ["Milk, Eggs, Other Dairy"],
      "categories": ["butter", "cooking fat"],
      "image": "butter-sliced.jpg"
    },
    "unit": {"id": 3, "name": "tablespoons"},
    "quantity": 5.0,
    "ingredientDisplayName": "unsalted butter"
  }, {
    "id": 63,
    "ingredient": {
      "id": 1532,
      "name": "dried chives",
      "apiId": 11615,
      "aisle": ["Spices and Seasonings"],
      "categories": ["chives", "herbs"],
      "image": "chives-dried.jpg"
    },
    "unit": {"id": 3, "name": "tablespoons"},
    "quantity": 1.0,
    "ingredientDisplayName": "chives, chopped"
  }, {
    "id": 58,
    "ingredient": {
      "id": 4952,
      "name": "dijon mustard",
      "apiId": 10099227,
      "aisle": ["Condiments"],
      "categories": ["dijon mustard", "mustard", "condiment"],
      "image": "regular-mustard.jpg"
    },
    "unit": {"id": 3, "name": "tablespoons"},
    "quantity": 1.0,
    "ingredientDisplayName": "Dijon mustard"
  }, {
    "id": 57,
    "ingredient": {
      "id": 4951,
      "name": "sour cream",
      "apiId": 1179,
      "aisle": ["Milk, Eggs, Other Dairy"],
      "categories": ["sour cream"],
      "image": "sour-cream.jpg"
    },
    "unit": {"id": 6, "name": "cups"},
    "quantity": 0.75,
    "ingredientDisplayName": "sour cream"
  }, {
    "id": 50,
    "ingredient": {
      "id": 4885,
      "name": "yellow onions",
      "apiId": 10511282,
      "aisle": ["Produce"],
      "categories": ["onion"],
      "image": "brown-onion.png"
    },
    "unit": {"id": 14, "name": "whole"},
    "quantity": 1.0,
    "ingredientDisplayName": "yellow onion, sliced"
  }, {
    "id": 62,
    "ingredient": {
      "id": 3208,
      "name": "fresh parsley",
      "apiId": 11297,
      "aisle": ["Produce", "Spices and Seasonings"],
      "categories": ["herbs"],
      "image": "parsley.jpg"
    },
    "unit": {"id": 6, "name": "cups"},
    "quantity": 0.5,
    "ingredientDisplayName": "fresh flat-leaf parsley leaves, chopped"
  }, {
    "id": 52,
    "ingredient": {
      "id": 4035,
      "name": "fresh shiitake mushrooms",
      "apiId": 11238,
      "aisle": ["Produce"],
      "categories": ["fresh mushrooms", "mushrooms"],
      "image": "shiitake-mushrooms.png"
    },
    "unit": {"id": 5, "name": "ounces"},
    "quantity": 7.0,
    "ingredientDisplayName": "shiitakes, caps sliced (stems removed and discarded)"
  }, {
    "id": 60,
    "ingredient": {
      "id": 4627,
      "name": "beef stock",
      "apiId": 6170,
      "aisle": ["Canned and Jarred"],
      "categories": ["stock"],
      "image": "beef-broth.png"
    },
    "unit": {"id": 6, "name": "cups"},
    "quantity": 1.5,
    "ingredientDisplayName": "beef broth stock, or beef"
  }],
  "recipeTypes": [{"id": 7, "recipeType": {"id": 3, "name": "entree"}}],
  "mealTypes": [{"id": 7, "mealType": {"id": 3, "name": "dinner"}}],
  "recipeCategories": [{
    "id": 9,
    "recipeCategory": {"id": 15, "name": "European"}
  }, {"id": 8, "recipeCategory": {"id": 23, "name": "comfort food"}}]
}, {
  "id": 5,
  "name": "Chicken Marsala",
  "instructions": "Place the flour, 3/4 teaspoon salt, and 1/4 teaspoon pepper in a ziplock bag. Add the chicken to the bag; seal bag tightly and shake to coat chicken evenly. Set aside.\n\nHeat the oil and 2 tablespoons of the butter in a large skillet over medium-high heat. (Use a stainless steel pan for the best browning. Nonstick will work too, but you won’t get that nice golden color on the chicken.) Place the flour-dusted chicken in the pan, shaking off any excess first, and cook, turning once, until the chicken is golden and just barely cooked through, about 5 to 6 minutes total. Transfer the chicken to a plate and set aside.\n\nMelt the remaining tablespoon of butter in the pan. Add the mushrooms and cook, stirring frequently, until the mushrooms begin to brown, 3 to 4 minutes. Add the shallots, garlic, and 1/4 teaspoon of salt; cook for 1 to 2 minutes more. Add the broth, Marsala, heavy cream, thyme, 1/4 teaspoon salt, and 1/8 teaspoon of pepper; use a wooden spoon to scrape any brown bits from the pan into the liquid. Bring the liquid to a boil, then reduce the heat to medium and gently boil, uncovered, until the sauce is reduced by about half, slightly thickened, and darkened in color, 10 to 15 minutes (you’re going for a thin cream sauce; it won’t start to thicken until the very end of the cooking time). Add the chicken back to the pan, along with any juices that accumulated on the plate. Reduce the heat to low and simmer until the chicken is warmed through and the sauce thickens a bit more, 2 to 3 minutes. Sprinkle with parsley, if using, and serve.\n\nNote: If your chicken breasts are large (like the ones in the photos that are about 3/4 lb. each), it’s best to first cut them horizontally to form four flat fillets, then pound them to an even 1/4-inch thickness. If you pound large chicken breasts without first halving them, they’ll be huge. Of course, you could also pound them thin first and then cut them in half vertically; the only drawback is that they’ll lose their natural shape (which, admittedly, is not a big deal!).",
  "description": "",
  "externalLink": "https://www.onceuponachef.com/recipes/chicken-marsala.html",
  "prepTimeMin": 15,
  "cookTimeMin": 30,
  "ingredientLists": [{
    "id": 68,
    "ingredient": {
      "id": 1699,
      "name": "extra-virgin olive oil",
      "apiId": 1034053,
      "aisle": ["Oil, Vinegar, Salad Dressing"],
      "categories": ["olive oil", "cooking oil", "cooking fat"],
      "image": "olive-oil.jpg"
    },
    "unit": {"id": 3, "name": "tablespoons"},
    "quantity": 1.0,
    "ingredientDisplayName": "olive oil"
  }, {
    "id": 71,
    "ingredient": {
      "id": 4016,
      "name": "shallots",
      "apiId": 11677,
      "aisle": ["Produce"],
      "categories": ["onion"],
      "image": "shallots.jpg"
    },
    "unit": {"id": 3, "name": "tablespoons"},
    "quantity": 3.0,
    "ingredientDisplayName": "shallots, finely chopped, from 1 medium shallot"
  }, {
    "id": 72,
    "ingredient": {
      "id": 4949,
      "name": "garlic cloves",
      "apiId": 11215,
      "aisle": ["Produce"],
      "categories": [],
      "image": "garlic.png"
    },
    "unit": {"id": 14, "name": "whole"},
    "quantity": 2.0,
    "ingredientDisplayName": "garlic, minced"
  }, {
    "id": 67,
    "ingredient": {
      "id": 3294,
      "name": "black pepper",
      "apiId": 1002030,
      "aisle": ["Spices and Seasonings"],
      "categories": ["pepper", "spices"],
      "image": "pepper.jpg"
    },
    "unit": {"id": 3, "name": "tablespoons"},
    "quantity": 1.0,
    "ingredientDisplayName": "black pepper, Freshly ground"
  }, {
    "id": 76,
    "ingredient": {
      "id": 4446,
      "name": "fresh thyme",
      "apiId": 2049,
      "aisle": ["Produce", "Spices and Seasonings"],
      "categories": ["herbs"],
      "image": "thyme.jpg"
    },
    "unit": {"id": 4, "name": "teaspoons"},
    "quantity": 2.0,
    "ingredientDisplayName": "fresh thyme, chopped"
  }, {
    "id": 66,
    "ingredient": {
      "id": 4383,
      "name": "salt",
      "apiId": 2047,
      "aisle": ["Spices and Seasonings"],
      "categories": [],
      "image": "salt.jpg"
    },
    "unit": {"id": 3, "name": "tablespoons"},
    "quantity": 1.0,
    "ingredientDisplayName": "Salt"
  }, {
    "id": 64,
    "ingredient": {
      "id": 4087,
      "name": "boneless skinless chicken breasts",
      "apiId": 1055062,
      "aisle": ["Meat"],
      "categories": ["chicken breast", "chicken", "poultry", "meat"],
      "image": "chicken-breasts.png"
    },
    "unit": {"id": 1, "name": "pounds"},
    "quantity": 1.5,
    "ingredientDisplayName": "boneless skinless chicken breasts, pounded ¼-inch thick, or chicken tenderloins"
  }, {
    "id": 69,
    "ingredient": {
      "id": 4570,
      "name": "unsalted butter",
      "apiId": 1145,
      "aisle": ["Milk, Eggs, Other Dairy"],
      "categories": ["butter", "cooking fat"],
      "image": "butter-sliced.jpg"
    },
    "unit": {"id": 3, "name": "tablespoons"},
    "quantity": 3.0,
    "ingredientDisplayName": "unsalted butter, divided"
  }, {
    "id": 73,
    "ingredient": {
      "id": 900,
      "name": "chicken broth",
      "apiId": 6194,
      "aisle": ["Canned and Jarred"],
      "categories": ["broth"],
      "image": "chicken-broth.png"
    },
    "unit": {"id": 6, "name": "cups"},
    "quantity": 0.66,
    "ingredientDisplayName": "chicken broth"
  }, {
    "id": 74,
    "ingredient": {
      "id": 2880,
      "name": "marsala wine",
      "apiId": 14057,
      "aisle": ["Alcoholic Beverages"],
      "categories": ["red wine", "wine", "alcoholic drink", "drink"],
      "image": "red-wine.jpg"
    },
    "unit": {"id": 6, "name": "cups"},
    "quantity": 0.66,
    "ingredientDisplayName": "dry Marsala wine"
  }, {
    "id": 75,
    "ingredient": {
      "id": 4724,
      "name": "heavy whipping cream",
      "apiId": 1001053,
      "aisle": ["Milk, Eggs, Other Dairy"],
      "categories": ["cream"],
      "image": "fluid-cream.jpg"
    },
    "unit": {"id": 6, "name": "cups"},
    "quantity": 0.66,
    "ingredientDisplayName": "heavy cream"
  }, {
    "id": 77,
    "ingredient": {
      "id": 3208,
      "name": "fresh parsley",
      "apiId": 11297,
      "aisle": ["Produce", "Spices and Seasonings"],
      "categories": ["herbs"],
      "image": "parsley.jpg"
    },
    "unit": {"id": 3, "name": "tablespoons"},
    "quantity": 2.0,
    "ingredientDisplayName": "fresh Italian parsley, chopped"
  }, {
    "id": 70,
    "ingredient": {
      "id": 4983,
      "name": "baby bella mushrooms",
      "apiId": 11266,
      "aisle": ["Produce"],
      "categories": ["mushrooms"],
      "image": "mushrooms.png"
    },
    "unit": {"id": 5, "name": "ounces"},
    "quantity": 8.0,
    "ingredientDisplayName": "button or bella mushrooms"
  }, {
    "id": 65,
    "ingredient": {
      "id": 4564,
      "name": "all purpose flour",
      "apiId": 20581,
      "aisle": ["Baking"],
      "categories": ["all purpose flour", "wheat flour", "flour product"],
      "image": "flour.png"
    },
    "unit": {"id": 3, "name": "tablespoons"},
    "quantity": 3.0,
    "ingredientDisplayName": "all-purpose flour"
  }],
  "recipeTypes": [{"id": 8, "recipeType": {"id": 3, "name": "entree"}}],
  "mealTypes": [{"id": 8, "mealType": {"id": 3, "name": "dinner"}}],
  "recipeCategories": [{
    "id": 10,
    "recipeCategory": {"id": 2, "name": "Italian"}
  }]
}];

export class MealPlanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {renderMode: RenderModes.RESULTS, resultData: FAKE};
    this.onResultUpdate = this.onResultUpdate.bind(this);
    this.goToForm = this.goToForm.bind(this);
  }

  goToForm() {
    this.setState({
      renderMode: RenderModes.FORM
    });
  }

  onResultUpdate(results) {
    this.setState({
      resultData: results,
      renderMode: RenderModes.RESULTS
    });
  }

  render() {
    return (
        <React.Fragment>
          {this.state.renderMode === RenderModes.RESULTS &&
              <PlannerResults
                  results={this.state.resultData}
                  goBackButtonClick={this.goToForm}/>}
          <div className={this.state.renderMode === RenderModes.FORM ? ''
              : 'd-none'}>
            <PlannerForm onResultUpdate={this.onResultUpdate}/>
          </div>
        </React.Fragment>
    );
  }
}

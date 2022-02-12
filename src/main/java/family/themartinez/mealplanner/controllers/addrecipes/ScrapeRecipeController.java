package family.themartinez.mealplanner.controllers.addrecipes;

import com.google.common.collect.ImmutableMap;
import family.themartinez.mealplanner.data.ingredients.Ingredient;
import family.themartinez.mealplanner.data.ingredients.IngredientRepository;
import family.themartinez.mealplanner.data.mealtypes.MealType;
import family.themartinez.mealplanner.data.mealtypes.MealTypeRepository;
import family.themartinez.mealplanner.data.recipecategories.RecipeCategory;
import family.themartinez.mealplanner.data.recipecategories.RecipeCategoryRepository;
import family.themartinez.mealplanner.data.recipetypes.RecipeType;
import family.themartinez.mealplanner.data.recipetypes.RecipeTypeRepository;
import family.themartinez.mealplanner.data.units.Unit;
import family.themartinez.mealplanner.data.units.UnitRepository;
import family.themartinez.mealplanner.scraper.ExternalRecipeScraper;
import family.themartinez.mealplanner.scraper.IngredientParsed;
import family.themartinez.mealplanner.scraper.ScrapedIngredient;
import family.themartinez.mealplanner.scraper.ScrapedRecipe;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class ScrapeRecipeController {

  Logger logger = LoggerFactory.getLogger(ScrapeRecipeController.class);

  @Autowired private UnitRepository unitRepository;
  @Autowired private IngredientRepository ingredientRepository;
  @Autowired private RecipeCategoryRepository recipeCategoryRepository;
  @Autowired private MealTypeRepository mealTypeRepository;
  @Autowired private RecipeTypeRepository recipeTypeRepository;

  private final ExternalRecipeScraper scraper;

  // Map of common product names to their canonical names in the DB. This map is for very common
  // ingredients who are often referred to by their colloquial names, but we don't want to change
  // the actual DB name for clarity reasons. Use this rarely.
  // TODO: Ideally the natural language lookup was good enough to not need this map.
  private final ImmutableMap<String, String> commonNameConversions =
      ImmutableMap.of(
          "garlic",
          "garlic cloves",
          "pepper",
          "black pepper",
          "sugar",
          "white sugar",
          "onion",
          "yellow onion",
          // TODO: Make it so you don't have to specify plural variations here.
          "onions",
          "yellow onion",
          "parsley",
          "fresh parsley",
          "milk",
          "whole milk",
          // TODO: Make it so you can specify multiple common names to a single canonical name.
          "spinach",
          "spinach leaves",
          "baby spinach",
          "spinach leaves");

  // Map of units that should be mapped to something else. Typically, used when the unit given is
  // too specific to have an entry of its own in the DB. E.g., instead of adding the unit "cloves"
  // to the DB, we just say the unit is "whole" and the ingredient is "garlic cloves".
  private final ImmutableMap<String, String> unitNameConversions =
      ImmutableMap.of("clove", "whole", "cloves", "whole");

  ScrapeRecipeController(ExternalRecipeScraper scraper) {
    this.scraper = scraper;
  }

  @GetMapping(path = "/scrapeRecipe")
  public ScrapedRecipe scrapeRecipe(@RequestParam String url) throws Exception {
    logger.info("Attempting to scrape recipe from {}.", url);
    ScrapedRecipe scrapedRecipe = this.scraper.scrapeRecipe(url);
    logger.info("Successfully scraped recipe with output: {}.", scrapedRecipe.toString());
    maybeLookUpIngredientInfo(scrapedRecipe);
    maybeLookUpCategoricals(scrapedRecipe);
    return scrapedRecipe;
  }

  private void maybeLookUpIngredientInfo(ScrapedRecipe scrapedRecipe) {
    List<ScrapedIngredient> ingredients = scrapedRecipe.getIngredients();
    for (ScrapedIngredient ingredient : ingredients) {
      logger.info("Processing raw ingredient line: \"{}\".", ingredient.getIngredientRaw());

      IngredientParsed ingredientParsed = ingredient.getIngredientParsed();

      // Attempt unit lookup from DB.
      Unit foundUnit = maybeFindUnit(ingredientParsed);
      if (foundUnit != null) {
        ingredientParsed.setUnitId(foundUnit.getId());
        ingredientParsed.setUnit(foundUnit.getName());
      }

      // Attempt ingredient lookup from DB.
      Ingredient foundIngredient = maybeFindIngredient(ingredient);
      if (foundIngredient != null) {
        ingredientParsed.setIngredientId(foundIngredient.getId());
        ingredientParsed.setName(foundIngredient.getName());
      }
    }
  }

  private void maybeLookUpCategoricals(ScrapedRecipe scrapedRecipe) {
    if (scrapedRecipe.getCategory() != null && !scrapedRecipe.getCategory().isEmpty()) {
      logger.info(
          "Found category string, \"{}\", attempting to match to DB categories.",
          scrapedRecipe.getCategory());
      List<String> categories =
          Arrays.stream(scrapedRecipe.getCategory().split(","))
              .map(String::trim)
              .collect(Collectors.toList());
      for (String category : categories) {
        List<RecipeCategory> recipeCategories = recipeCategoryRepository.findByName(category);
        if (recipeCategories.size() > 0) {
          logger.info("Found match for \"{}\" in recipe_categories.", category);
          scrapedRecipe.addToRecipeCategories(
              recipeCategories.stream().map(RecipeCategory::getId).collect(Collectors.toList()));
          continue;
        }

        List<MealType> mealTypes = mealTypeRepository.findByName(category);
        if (mealTypes.size() > 0) {
          logger.info("Found match for \"{}\" in meal_types.", category);
          scrapedRecipe.addToMealTypes(
              mealTypes.stream().map(MealType::getId).collect(Collectors.toList()));
          continue;
        }

        List<RecipeType> recipeTypes = recipeTypeRepository.findByName(category);
        if (recipeTypes.size() > 0) {
          logger.info("Found match for \"{}\" in recipe_types.", category);
          scrapedRecipe.addToRecipeTypes(
              recipeTypes.stream().map(RecipeType::getId).collect(Collectors.toList()));
        }
      }
    }
  }

  private Unit maybeFindUnit(IngredientParsed ingredientParsed) {
    List<Unit> units;
    Unit foundUnit = null;
    if (ingredientParsed.getUnit() != null) {
      String lookupUnit = ingredientParsed.getUnit();
      if (unitNameConversions.containsKey(ingredientParsed.getUnit())) {
        lookupUnit = unitNameConversions.get(ingredientParsed.getUnit());
        logger.info(
            "Found unit name conversion for \"{}\", mapping to \"{}\".",
            ingredientParsed.getUnit(),
            lookupUnit);
      }
      logger.info("Mapping parsed unit \"{}\" to database equivalent.", lookupUnit);
      units = unitRepository.findByNameStartingWith(lookupUnit);
    } else {
      logger.info("No unit parsed from ingredient line, assuming \"whole\".");
      units = unitRepository.findByNameStartingWith("whole");
    }
    if (units != null && units.size() > 0) {
      foundUnit = units.get(0);
      logger.info("Unit mapped to \"{}\".", foundUnit.getName());
    } else {
      logger.info("Wasn't able to match unit to anything in the DB.");
    }
    return foundUnit;
  }

  private String maybeConvertCommonIngredientName(String ingredientName) {
    if (ingredientName == null) {
      return null;
    }
    if (commonNameConversions.containsKey(ingredientName)) {
      String newName = commonNameConversions.get(ingredientName);
      logger.info(
          "Found common name conversion for \"{}\". Converting it to \"{}\".",
          ingredientName,
          newName);
      return newName;
    }
    return ingredientName;
  }

  private Ingredient maybeFindIngredient(ScrapedIngredient ingredient) {
    IngredientParsed ingredientParsed = ingredient.getIngredientParsed();
    String ingredientLookupName =
        ingredientParsed.getProduct() == null || ingredientParsed.getProduct().isEmpty()
            ? ingredient.getIngredientRaw()
            : ingredientParsed.getProduct();
    // Maybe do conversion from colloquial common name to canonical DB name.
    ingredientLookupName = maybeConvertCommonIngredientName(ingredientLookupName);
    Ingredient foundIngredient = null;
    logger.info("Trying to find exact db match for ingredient \"{}\".", ingredientLookupName);
    // First attempt to find an exact ingredient match by name (including plural).
    List<Ingredient> exactMatch =
        ingredientRepository.findByNameIncludingPlural(ingredientLookupName);
    if (exactMatch.size() > 0) {
      foundIngredient = exactMatch.get(0);
      logger.info("Found exact match: \"{}\"!", foundIngredient.getName());
    } else {
      // Otherwise, attempt a natural language lookup best attempt.
      // TODO: Add feature where if we have multiple results w/ the same match score, we return
      //       all results and let the client choose one.
      logger.info(
          "Unable to find exact match, attempting natural language lookup for: \"{}\".",
          ingredientLookupName);
      List<Ingredient> naturalLanguageMatches =
          ingredientRepository.findTop5ByNameUsingNaturalLanguage(ingredientLookupName);
      if (naturalLanguageMatches.size() > 0) {
        foundIngredient = naturalLanguageMatches.get(0);
        logger.info(
            "Returning top natural language ingredient result: \"{}\".", foundIngredient.getName());
      } else {
        logger.info("Natural language lookup produced no results.");
      }
    }

    return foundIngredient;
  }
}

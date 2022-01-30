package family.themartinez.mealplanner.controllers.addrecipes;

import family.themartinez.mealplanner.data.ingredients.Ingredient;
import family.themartinez.mealplanner.data.ingredients.IngredientRepository;
import family.themartinez.mealplanner.data.units.Unit;
import family.themartinez.mealplanner.data.units.UnitRepository;
import family.themartinez.mealplanner.scraper.ExternalRecipeScraper;
import family.themartinez.mealplanner.scraper.IngredientParsed;
import family.themartinez.mealplanner.scraper.ScrapedIngredient;
import family.themartinez.mealplanner.scraper.ScrapedRecipe;
import java.util.List;
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

  private final ExternalRecipeScraper scraper;

  ScrapeRecipeController(ExternalRecipeScraper scraper) {
    this.scraper = scraper;
  }

  @GetMapping(path = "/scrapeRecipe")
  public ScrapedRecipe scrapeRecipe(@RequestParam String url) throws Exception {
    logger.info("Attempting to scrape recipe from {}.", url);
    ScrapedRecipe scrapedRecipe = this.scraper.scrapeRecipe(url);
    logger.info("Successfully scraped recipe with output: {}.", scrapedRecipe.toString());

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

    if (scrapedRecipe.getCategory() != null && !scrapedRecipe.getCategory().isEmpty()) {
      scrapedRecipe.getCategory().split(",");
      // TODO: Finish me.
    }

    return scrapedRecipe;
  }

  private Unit maybeFindUnit(IngredientParsed ingredientParsed) {
    List<Unit> units;
    Unit foundUnit = null;
    if (ingredientParsed.getUnit() != null) {
      logger.info("Mapping parsed unit \"{}\" to database equivalent.", ingredientParsed.getUnit());
      units = unitRepository.findByNameStartingWith(ingredientParsed.getUnit());
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

  private Ingredient maybeFindIngredient(ScrapedIngredient ingredient) {
    IngredientParsed ingredientParsed = ingredient.getIngredientParsed();
    String ingredientLookupName =
        ingredientParsed.getProduct() == null || ingredientParsed.getProduct().isEmpty()
            ? ingredient.getIngredientRaw()
            : ingredientParsed.getProduct();
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

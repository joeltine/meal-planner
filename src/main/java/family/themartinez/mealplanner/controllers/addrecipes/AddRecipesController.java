package family.themartinez.mealplanner.controllers.addrecipes;

import com.google.common.collect.ImmutableList;
import family.themartinez.mealplanner.data.ingredientlists.IngredientList;
import family.themartinez.mealplanner.data.ingredientlists.IngredientListRepository;
import family.themartinez.mealplanner.data.ingredients.Ingredient;
import family.themartinez.mealplanner.data.ingredients.IngredientRepository;
import family.themartinez.mealplanner.data.recipes.Recipe;
import family.themartinez.mealplanner.data.recipes.RecipeRepository;
import family.themartinez.mealplanner.data.units.Unit;
import family.themartinez.mealplanner.data.units.UnitRepository;
import family.themartinez.mealplanner.scraper.ExternalRecipeScraper;
import family.themartinez.mealplanner.scraper.IngredientParsed;
import family.themartinez.mealplanner.scraper.ScrapedIngredient;
import family.themartinez.mealplanner.scraper.ScrapedRecipe;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class AddRecipesController {
  private static final String PATH = "/addrecipes";

  Logger logger = LoggerFactory.getLogger(AddRecipesController.class);

  @Autowired private UnitRepository unitRepository;
  @Autowired private RecipeRepository recipeRepository;
  @Autowired private IngredientListRepository ingredientListRepository;
  @Autowired private IngredientRepository ingredientRepository;

  private ImmutableList<Unit> unitsList;
  private final ExternalRecipeScraper scraper;

  AddRecipesController(ExternalRecipeScraper scraper) {
    this.scraper = scraper;
  }

  @GetMapping(PATH)
  public String addRecipePage(Model model) {
    model.addAttribute("units", getUnitsList());
    return "addrecipes/addrecipes";
  }

  @PutMapping(path = PATH, produces = "application/json")
  @Transactional
  public @ResponseBody void putRecipe(@RequestBody Map<String, Object> body) {
    Recipe recipe = new Recipe();
    recipe.setName((String) body.get("name"));
    recipe.setDescription((String) body.get("description"));
    recipe.setInstructions((String) body.get("instructions"));
    recipe.setCookTimeMin(Integer.valueOf((String) body.get("cookTime")));
    recipe.setPrepTimeMin(Integer.valueOf((String) body.get("prepTime")));
    Collection categories = (Collection) body.get("categories");
    if (categories != null) {
      recipe.setCategories(ImmutableList.copyOf(categories));
    }
    recipe.setExternalLink((String) body.get("externalLink"));
    recipeRepository.save(recipe);

    ImmutableList<Map<String, String>> ingredients =
        ImmutableList.copyOf((List<Map<String, String>>) body.get("ingredients"));
    for (Map<String, String> ingredient : ingredients) {
      IngredientList list = new IngredientList();
      list.setRecipe(recipe);
      list.setQuantity(Double.valueOf(ingredient.get("quantity")));
      list.setUnit(unitRepository.findById(Integer.valueOf(ingredient.get("unit"))).get());
      list.setIngredient(
          ingredientRepository.findById(Integer.valueOf(ingredient.get("ingredient"))).get());
      list.setIngredientDisplayName(ingredient.get("displayName"));
      ingredientListRepository.save(list);
    }
  }

  private ImmutableList<Unit> getUnitsList() {
    if (this.unitsList == null) {
      this.unitsList = ImmutableList.copyOf(unitRepository.findAllByOrderByNameAsc());
    }
    return this.unitsList;
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

  @GetMapping(path = "/scrapeRecipe")
  public @ResponseBody ScrapedRecipe scrapeRecipe(@RequestParam String url) throws Exception {
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

    return scrapedRecipe;
  }
}

package family.themartinez.mealplanner.controllers.addrecipes;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import family.themartinez.mealplanner.data.ingredientlists.IngredientList;
import family.themartinez.mealplanner.data.ingredientlists.IngredientListRepository;
import family.themartinez.mealplanner.data.ingredients.Ingredient;
import family.themartinez.mealplanner.data.ingredients.IngredientRepository;
import family.themartinez.mealplanner.data.recipes.Recipe;
import family.themartinez.mealplanner.data.recipes.RecipeRepository;
import family.themartinez.mealplanner.data.units.Unit;
import family.themartinez.mealplanner.data.units.UnitRepository;
import family.themartinez.mealplanner.scraper.ExternalRecipeScraper;
import java.io.IOException;
import java.util.Collection;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.util.Pair;
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

  AddRecipesController() throws IOException {
    this.scraper = new ExternalRecipeScraper();
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

  @GetMapping(path = "/scrapeRecipe")
  public @ResponseBody Map<String, Object> scrapeRecipe(@RequestParam String url) throws Exception {
    logger.info("Attempting to scrape recipe from {}.", url);
    Pair<Integer, String> output = this.scraper.scrapeRecipe(url);
    Integer exitCode = output.getFirst();
    if (exitCode != 0) {
      throw new RuntimeException(output.getSecond());
    } else {
      String scrapedResults = output.getSecond();
      logger.info("Successfully scraped recipe with output: {}.", scrapedResults);
      JSONObject results = new JSONObject(scrapedResults);
      JSONArray ingredients = results.getJSONArray("ingredients");
      Iterator<Object> iterator = ingredients.iterator();
      while (iterator.hasNext()) {
        JSONObject ingredientInfo = (JSONObject) iterator.next();
        JSONObject ingredientParsed = ingredientInfo.getJSONObject("ingredientParsed");
        logger.info(
            "Attempting processing on raw ingredient line: {}.",
            ingredientInfo.getString("ingredientRaw"));
        Integer unitId = -1;
        List<Unit> unit;
        if (!ingredientParsed.isNull("unit")) {
          logger.info(
              "Mapping parsed unit {} to database equivalent.", ingredientParsed.getString("unit"));
          unit = unitRepository.findByNameStartingWith(ingredientParsed.getString("unit"));
        } else {
          logger.info("No unit parsed from ingredient line, assuming whole.");
          unit = unitRepository.findByNameStartingWith("whole");
        }
        if (unit != null && unit.size() > 0) {
          logger.info("Unit mapped to {}.", unit.get(0).getName());
          unitId = unit.get(0).getId();
        }
        ingredientParsed.put("unitDbLookup", unitId);

        // If "product" is null, just try lookups with the raw input name.
        String ingredientLookupName =
            ingredientParsed.isNull("product")
                ? ingredientInfo.getString("ingredientRaw")
                : ingredientParsed.getString("product");
        Integer ingredientId = -1;
        String ingredientName = "";

        logger.info("Trying to find exact db match for ingredient {}.", ingredientLookupName);
        List<Ingredient> exactMatch = ingredientRepository.findByName(ingredientLookupName);
        // First attempt to find an exact ingredient match by name.
        if (exactMatch.size() > 0) {
          ingredientId = exactMatch.get(0).getId();
          ingredientName = exactMatch.get(0).getName();
          logger.info("Found exact match: {}!", ingredientName);
        }
        // Otherwise, attempt a natural language lookup best attempt.
        else {
          // TODO: Add feature where if we have multiple results w/ the same match score, we return
          // all results and let the client choose one.
          logger.info(
              "Unable to find exact match, attempting natural language lookup for: {}.",
              ingredientLookupName);
          List<Ingredient> naturalLanguageMatches =
              ingredientRepository.findTop5ByNameUsingNaturalLanguage(ingredientLookupName);
          if (naturalLanguageMatches.size() > 0) {
            ingredientId = naturalLanguageMatches.get(0).getId();
            ingredientName = naturalLanguageMatches.get(0).getName();
            logger.info("Returning top natural language ingredient result: {}.", ingredientName);
          } else {
            logger.info("Natural language lookup produced no results.");
          }
        }
        ingredientParsed.put(
            "ingredientDbLookup", ImmutableMap.of("id", ingredientId, "name", ingredientName));
      }
      return results.toMap();
    }
  }
}

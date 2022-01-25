package family.themartinez.mealplanner.scraper;

import static org.junit.jupiter.api.Assertions.assertEquals;

import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

class ScrapedRecipeTest {

  private static String testScraperOutput;

  private ObjectMapper objectMapper = new ObjectMapper();

  @BeforeAll
  public static void beforeAll() throws IOException {
    testScraperOutput =
        Files.readString(
            Path.of(
                System.getProperty("user.dir"),
                "src/test/java/family/themartinez/mealplanner/scraper/test_scrape_recipe_output.json"));
  }

  @Test
  void testCanBeConstructedFromDeserializedJson() throws IOException {
    ScrapedRecipe scrapedRecipe = objectMapper.readValue(testScraperOutput, ScrapedRecipe.class);
    assertEquals("Spinach and Feta Turkey Burgers", scrapedRecipe.getTitle());
    assertEquals(35, scrapedRecipe.getTotalTime());
    assertEquals(15, scrapedRecipe.getCookTime());
    assertEquals(20, scrapedRecipe.getPrepTime());
    assertEquals("Preheat a grill.\nGrill burgers.", scrapedRecipe.getInstructions());
    assertEquals(
        "https://www.allrecipes.com/recipe/158968/spinach-and-feta-turkey-burgers/",
        scrapedRecipe.getCanonicalUrl());
    assertEquals("Meat and Poultry,Turkey,Ground Turkey Recipes", scrapedRecipe.getCategory());
    List<ScrapedIngredient> ingredients = scrapedRecipe.getIngredients();
    assertEquals(3, ingredients.size());

    ScrapedIngredient eggs = ingredients.get(0);
    assertEquals(0.9764371000000001, eggs.getConfidence());
    assertEquals(null, eggs.getError());
    assertEquals("2 eggs, beaten", eggs.getIngredientRaw());
    IngredientParsed eggParsed = eggs.getIngredientParsed();
    assertEquals("beaten", eggParsed.getPreparationNotes());
    assertEquals("eggs", eggParsed.getProduct());
    assertEquals(null, eggParsed.getProductSizeModifier());
    assertEquals(Float.valueOf(2.0F), eggParsed.getQuantity());
    assertEquals(null, eggParsed.getUnit());
    UsdaInfo eggUsda = eggParsed.getUsdaInfo();
    assertEquals("Dairy and Egg Products", eggUsda.getCategory());
    assertEquals("Egg, whole, raw, fresh", eggUsda.getDescription());
    assertEquals("171287", eggUsda.getFdcId());
    assertEquals("exact", eggUsda.getMatchMethod());

    ScrapedIngredient garlic = ingredients.get(1);
    assertEquals(0.9817117, garlic.getConfidence());
    assertEquals(null, garlic.getError());
    assertEquals("2 cloves garlic, minced", garlic.getIngredientRaw());
    IngredientParsed garlicParsed = garlic.getIngredientParsed();
    assertEquals("minced", garlicParsed.getPreparationNotes());
    assertEquals("garlic", garlicParsed.getProduct());
    assertEquals(null, garlicParsed.getProductSizeModifier());
    assertEquals(Float.valueOf(2.0F), garlicParsed.getQuantity());
    assertEquals("clove", garlicParsed.getUnit());
    UsdaInfo garlicUsda = garlicParsed.getUsdaInfo();
    assertEquals(null, garlicUsda.getCategory());
    assertEquals("Garlic, raw", garlicUsda.getDescription());
    assertEquals("787793", garlicUsda.getFdcId());
    assertEquals("exact", garlicUsda.getMatchMethod());

    ScrapedIngredient feta = ingredients.get(2);
    assertEquals(0.9916780000000001, feta.getConfidence());
    assertEquals(null, feta.getError());
    assertEquals("4 ounces feta cheese", feta.getIngredientRaw());
    IngredientParsed fetaParsed = feta.getIngredientParsed();
    assertEquals(null, fetaParsed.getPreparationNotes());
    assertEquals("feta cheese", fetaParsed.getProduct());
    assertEquals(null, fetaParsed.getProductSizeModifier());
    assertEquals(Float.valueOf(4.0F), fetaParsed.getQuantity());
    assertEquals("ounce", fetaParsed.getUnit());
    UsdaInfo fetaUsda = fetaParsed.getUsdaInfo();
    assertEquals("Dairy and Egg Products", fetaUsda.getCategory());
    assertEquals("Cheese, feta", fetaUsda.getDescription());
    assertEquals("173420", fetaUsda.getFdcId());
    assertEquals("exact", fetaUsda.getMatchMethod());
  }
}

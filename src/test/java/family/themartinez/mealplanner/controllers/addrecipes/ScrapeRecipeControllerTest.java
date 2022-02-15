package family.themartinez.mealplanner.controllers.addrecipes;

import static org.hamcrest.CoreMatchers.anyOf;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.empty;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.guava.GuavaModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.google.common.collect.ImmutableList;
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
import family.themartinez.mealplanner.scraper.ScrapedIngredient;
import family.themartinez.mealplanner.scraper.ScrapedRecipe;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

// TODO: Set it up so we import a "real" ingredient database into this test. That way we can do
//       better verifications on the natural language lookup algorithm and things like the
//       name conversion lookup.

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class ScrapeRecipeControllerTest {

  private static String fetaBurgersJson;
  private static String beefWellingtonJson;

  private final ObjectMapper mapper =
      new ObjectMapper().registerModules(new GuavaModule(), new JavaTimeModule());

  @MockBean ExternalRecipeScraper scraperMock;

  @Autowired private UnitRepository unitRepository;
  @Autowired private IngredientRepository ingredientRepository;
  @Autowired private RecipeCategoryRepository recipeCategoryRepository;
  @Autowired private RecipeTypeRepository recipeTypeRepository;
  @Autowired private MealTypeRepository mealTypeRepository;

  @Autowired private MockMvc mockMvc;

  @BeforeAll
  static void beforeAll() throws IOException {
    fetaBurgersJson =
        Files.readString(
            Path.of(
                System.getProperty("user.dir"),
                "src/test/java/family/themartinez/mealplanner/controllers/addrecipes/feta_burgers_recipe_test.json"));

    beefWellingtonJson =
        Files.readString(
            Path.of(
                System.getProperty("user.dir"),
                "src/test/java/family/themartinez/mealplanner/controllers/addrecipes/beef_wellington_recipe_test.json"));
  }

  @BeforeEach
  void setUp() {
    populateRecipeCategoryRepository();
    populateMealTypeRepository();
    populateRecipeTypeRepository();
    populateUnitRepository();
    populateIngredientRepository();
  }

  @AfterEach
  void tearDown() {
    ingredientRepository.deleteAll();
    unitRepository.deleteAll();
    recipeCategoryRepository.deleteAll();
    recipeTypeRepository.deleteAll();
    mealTypeRepository.deleteAll();
  }

  @Test
  public void scrapeRecipeShouldReturnResults() throws Exception {
    ScrapedRecipe scrapedRecipe = mapper.readValue(fetaBurgersJson, ScrapedRecipe.class);
    when(scraperMock.scrapeRecipe(any())).thenReturn(scrapedRecipe);
    this.mockMvc
        .perform(get("/scrapeRecipe").param("url", "https://www.recipes.com/fetaburgers"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andReturn();
    verify(scraperMock).scrapeRecipe("https://www.recipes.com/fetaburgers");

    assertEquals("https://www.recipes.com/fetaburgers", scrapedRecipe.getCanonicalUrl());
    assertEquals("Preheat grill\nCook burgers", scrapedRecipe.getInstructions());
    assertEquals("Spinach and Feta Turkey Burgers", scrapedRecipe.getTitle());
    assertEquals(20, scrapedRecipe.getPrepTime());
    assertEquals(15, scrapedRecipe.getCookTime());
    assertEquals(35, scrapedRecipe.getTotalTime());

    RecipeCategory americanCateogry = recipeCategoryRepository.findByName("American").get(0);
    RecipeCategory meatCategory = recipeCategoryRepository.findByName("meat and poultry").get(0);
    MealType lunchType = mealTypeRepository.findByName("lunch").get(0);
    RecipeType entreeType = recipeTypeRepository.findByName("entree").get(0);

    assertThat(
        scrapedRecipe.getRecipeCategories(),
        containsInAnyOrder(americanCateogry.getId(), meatCategory.getId()));
    assertThat(scrapedRecipe.getMealTypes(), containsInAnyOrder(lunchType.getId()));
    assertThat(scrapedRecipe.getRecipeTypes(), containsInAnyOrder(entreeType.getId()));

    List<ScrapedIngredient> ingredients = scrapedRecipe.getIngredients();
    ScrapedIngredient eggs = ingredients.get(0);
    assertEquals("2 eggs, beaten", eggs.getIngredientRaw());
    assertNotNull(eggs.getIngredientParsed().getIngredientId());
    assertEquals("eggs", eggs.getIngredientParsed().getName());
    assertNotNull(eggs.getIngredientParsed().getUnitId());
    assertEquals("whole", eggs.getIngredientParsed().getUnit());

    ScrapedIngredient garlic = ingredients.get(1);
    assertEquals("2 cloves garlic, minced", garlic.getIngredientRaw());
    assertNotNull(garlic.getIngredientParsed().getIngredientId());
    assertEquals("garlic cloves", garlic.getIngredientParsed().getName());
    assertNotNull(garlic.getIngredientParsed().getUnitId());
    assertEquals("whole", garlic.getIngredientParsed().getUnit());

    ScrapedIngredient feta = ingredients.get(2);
    assertEquals("4 ounces feta cheese", feta.getIngredientRaw());
    assertNotNull(feta.getIngredientParsed().getIngredientId());
    assertEquals("feta", feta.getIngredientParsed().getName());
    assertNotNull(feta.getIngredientParsed().getUnitId());
    assertEquals("ounces", feta.getIngredientParsed().getUnit());

    ScrapedIngredient frozenSpinach = ingredients.get(3);
    assertEquals(
        "1 (10 ounce) box frozen chopped spinach, thawed and squeezed dry",
        frozenSpinach.getIngredientRaw());
    // At least w/ this data set, it should find frozen spinach w/ a natural language lookup.
    assertNotNull(frozenSpinach.getIngredientParsed().getIngredientId());
    assertEquals("frozen spinach", frozenSpinach.getIngredientParsed().getName());
    // unit is unclear "ounce vs. box", not found in DB, but original name "box" is preserved.
    assertNull(frozenSpinach.getIngredientParsed().getUnitId());
    assertEquals("box", frozenSpinach.getIngredientParsed().getUnit());

    ScrapedIngredient groundTurkey = ingredients.get(4);
    assertEquals("2 pounds ground turkey", groundTurkey.getIngredientRaw());
    assertNotNull(groundTurkey.getIngredientParsed().getIngredientId());
    assertEquals("ground turkey", groundTurkey.getIngredientParsed().getName());
    assertNotNull(groundTurkey.getIngredientParsed().getUnitId());
    assertEquals("pounds", groundTurkey.getIngredientParsed().getUnit());
  }

  @Test
  public void scrapeRecipeShouldReturnResultsForComplexRecipe() throws Exception {
    ScrapedRecipe scrapedRecipe = mapper.readValue(beefWellingtonJson, ScrapedRecipe.class);
    when(scraperMock.scrapeRecipe(any())).thenReturn(scrapedRecipe);
    this.mockMvc
        .perform(get("/scrapeRecipe").param("url", "https://www.recipes.com/beefwellington"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andReturn();
    verify(scraperMock).scrapeRecipe("https://www.recipes.com/beefwellington");

    MealType dinnerType = mealTypeRepository.findByName("dinner").get(0);
    RecipeType entreeType = recipeTypeRepository.findByName("entree").get(0);

    assertThat(scrapedRecipe.getRecipeCategories(), empty());
    assertThat(scrapedRecipe.getMealTypes(), containsInAnyOrder(dinnerType.getId()));
    assertThat(scrapedRecipe.getRecipeTypes(), containsInAnyOrder(entreeType.getId()));

    List<ScrapedIngredient> ingredients = scrapedRecipe.getIngredients();
    ScrapedIngredient whiteMushrooms = ingredients.get(0);
    assertEquals(
        "3 pints (1 1/2 pounds) white button mushrooms", whiteMushrooms.getIngredientRaw());
    assertNotNull(whiteMushrooms.getIngredientParsed().getIngredientId());
    assertEquals("white mushrooms", whiteMushrooms.getIngredientParsed().getName());
    assertNotNull(whiteMushrooms.getIngredientParsed().getUnitId());
    assertEquals("pints", whiteMushrooms.getIngredientParsed().getUnit());

    ScrapedIngredient choppedShallots = ingredients.get(1);
    assertEquals("2 shallots, peeled and roughly chopped", choppedShallots.getIngredientRaw());
    assertNotNull(choppedShallots.getIngredientParsed().getIngredientId());
    assertEquals("shallots", choppedShallots.getIngredientParsed().getName());
    assertNotNull(choppedShallots.getIngredientParsed().getUnitId());
    assertEquals("whole", choppedShallots.getIngredientParsed().getUnit());

    ScrapedIngredient freshThyme = ingredients.get(3);
    assertEquals("2 sprigs fresh thyme, leaves only", freshThyme.getIngredientRaw());
    assertNotNull(freshThyme.getIngredientParsed().getIngredientId());
    assertEquals("fresh thyme", freshThyme.getIngredientParsed().getName());
    assertNotNull(freshThyme.getIngredientParsed().getUnitId());
    assertEquals("sprigs", freshThyme.getIngredientParsed().getUnit());

    ScrapedIngredient unsaltedButter = ingredients.get(4);
    assertEquals("2 tablespoons unsalted butter", unsaltedButter.getIngredientRaw());
    assertNotNull(unsaltedButter.getIngredientParsed().getIngredientId());
    assertEquals("butter", unsaltedButter.getIngredientParsed().getName());
    assertNotNull(unsaltedButter.getIngredientParsed().getUnitId());
    assertEquals("tablespoons", unsaltedButter.getIngredientParsed().getUnit());

    ScrapedIngredient evoo = ingredients.get(5);
    assertEquals("2 tablespoons extra-virgin olive oil", evoo.getIngredientRaw());
    assertNotNull(evoo.getIngredientParsed().getIngredientId());
    assertEquals("extra-virgin olive oil", evoo.getIngredientParsed().getName());
    assertNotNull(evoo.getIngredientParsed().getUnitId());
    assertEquals("tablespoons", evoo.getIngredientParsed().getUnit());

    ScrapedIngredient saltAndPepper = ingredients.get(6);
    assertEquals("Kosher salt and freshly ground black pepper", saltAndPepper.getIngredientRaw());
    assertNotNull(saltAndPepper.getIngredientParsed().getIngredientId());
    // This one confuses the natural language look up, it can find "kosher salt" or just "salt".
    // As a heuristic, just make sure the result contains "salt".
    assertThat(saltAndPepper.getIngredientParsed().getName(), containsString("salt"));
    assertNotNull(saltAndPepper.getIngredientParsed().getUnitId());
    assertEquals("whole", saltAndPepper.getIngredientParsed().getUnit());

    ScrapedIngredient beefTenderloin = ingredients.get(7);
    assertEquals(
        "One 3-pound center cut beef tenderloin (filet mignon), trimmed",
        beefTenderloin.getIngredientRaw());
    assertNotNull(beefTenderloin.getIngredientParsed().getIngredientId());
    // This one also can confuse natural language, beef tenderloins and filet mignon steaks are both
    // valid results here.
    assertThat(
        beefTenderloin.getIngredientParsed().getName(),
        anyOf(is("filet mignon steaks"), is("beef tenderloins")));
    assertNotNull(beefTenderloin.getIngredientParsed().getUnitId());
    assertEquals(3.0F, beefTenderloin.getIngredientParsed().getQuantity());
    assertEquals("pounds", beefTenderloin.getIngredientParsed().getUnit());

    ScrapedIngredient flourForPastry = ingredients.get(13);
    assertEquals("Flour, for rolling out puff pastry", flourForPastry.getIngredientRaw());
    assertNotNull(flourForPastry.getIngredientParsed().getIngredientId());
    assertEquals("all purpose flour", flourForPastry.getIngredientParsed().getName());
    assertNotNull(flourForPastry.getIngredientParsed().getUnitId());
    assertEquals("whole", flourForPastry.getIngredientParsed().getUnit());

    ScrapedIngredient chives = ingredients.get(17);
    assertEquals("Minced chives, for garnish", chives.getIngredientRaw());
    assertNotNull(chives.getIngredientParsed().getIngredientId());
    assertEquals("fresh chives", chives.getIngredientParsed().getName());
    assertNotNull(chives.getIngredientParsed().getUnitId());
    assertEquals("whole", chives.getIngredientParsed().getUnit());

    ScrapedIngredient grainyMustard = ingredients.get(28);
    assertEquals("2 tablespoons grainy mustard", grainyMustard.getIngredientRaw());
    assertNotNull(grainyMustard.getIngredientParsed().getIngredientId());
    // This one is hard. Lookup can find anything like "dijon mustard" or "whole-grain mustard".
    assertThat(grainyMustard.getIngredientParsed().getName(), containsString("mustard"));
    assertNotNull(grainyMustard.getIngredientParsed().getUnitId());
    assertEquals("tablespoons", grainyMustard.getIngredientParsed().getUnit());
  }

  private void populateIngredientRepository() {
    ImmutableList<String> ingredientNames =
        ImmutableList.of(
            "whole milk",
            "water",
            "boneless skinless chicken breasts",
            "eggs",
            "garlic cloves",
            "feta",
            "frozen spinach",
            "ground turkey",
            "white mushrooms",
            "shallots",
            "fresh thyme",
            "butter",
            "extra-virgin olive oil",
            "kosher salt",
            "salt",
            "black pepper",
            "filet mignon steaks",
            "beef tenderloins",
            "prosciutto",
            "dijon mustard",
            "all purpose flour",
            "puff pastry dough",
            "coarse sea salt",
            "fresh chives",
            "fingerling potatoes",
            "brandy",
            "beef stock",
            "cream",
            "whole-grain mustard",
            "green peppercorns",
            "fresh rosemary",
            "fresh sage",
            "honey",
            "balsamic vinegar",
            "walnuts",
            "pomegranate seeds");
    ImmutableList.Builder<Ingredient> toAdd = ImmutableList.builder();
    for (String ingredient : ingredientNames) {
      Ingredient newIngredient = new Ingredient();
      newIngredient.setName(ingredient);
      toAdd.add(newIngredient);
    }
    ingredientRepository.saveAll(toAdd.build());
  }

  private void populateUnitRepository() {
    ImmutableList.Builder<Unit> unitsToAdd = ImmutableList.builder();
    ImmutableList<String> unitNames =
        ImmutableList.of(
            "liters",
            "cups",
            "slices",
            "pints",
            "grams",
            "ounces",
            "pounds",
            "sprigs",
            "teaspoons",
            "tablespoons",
            "whole");
    for (String name : unitNames) {
      Unit u = new Unit();
      u.setName(name);
      unitsToAdd.add(u);
    }
    unitRepository.saveAll(unitsToAdd.build());
  }

  private void populateRecipeCategoryRepository() {
    ImmutableList.Builder<RecipeCategory> toAdd = ImmutableList.builder();
    ImmutableList<String> names =
        ImmutableList.of(
            "Italian",
            "Thai",
            "Chinese",
            "Indian",
            "holidays",
            "American",
            "vegan",
            "vegetarian",
            "low-carb",
            "Japanese",
            "Vietnamese",
            "meat and poultry");
    for (String name : names) {
      RecipeCategory category = new RecipeCategory();
      category.setName(name);
      toAdd.add(category);
    }
    recipeCategoryRepository.saveAll(toAdd.build());
  }

  private void populateMealTypeRepository() {
    ImmutableList.Builder<MealType> toAdd = ImmutableList.builder();
    ImmutableList<String> names = ImmutableList.of("breakfast", "lunch", "dinner");
    for (String name : names) {
      MealType type = new MealType();
      type.setName(name);
      toAdd.add(type);
    }
    mealTypeRepository.saveAll(toAdd.build());
  }

  private void populateRecipeTypeRepository() {
    ImmutableList.Builder<RecipeType> toAdd = ImmutableList.builder();
    ImmutableList<String> names = ImmutableList.of("entree", "sauce", "condiment");
    for (String name : names) {
      RecipeType type = new RecipeType();
      type.setName(name);
      toAdd.add(type);
    }
    recipeTypeRepository.saveAll(toAdd.build());
  }
}

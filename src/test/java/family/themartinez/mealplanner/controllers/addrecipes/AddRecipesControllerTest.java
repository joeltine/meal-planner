package family.themartinez.mealplanner.controllers.addrecipes;

import static org.hamcrest.CoreMatchers.anyOf;
import static org.hamcrest.CoreMatchers.containsString;
import static org.hamcrest.CoreMatchers.is;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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
import family.themartinez.mealplanner.scraper.ScrapedIngredient;
import family.themartinez.mealplanner.scraper.ScrapedRecipe;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpServletResponse;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.testcontainers.shaded.com.fasterxml.jackson.databind.ObjectMapper;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
class AddRecipesControllerTest {

  @Autowired private UnitRepository unitRepository;
  @Autowired private IngredientRepository ingredientRepository;
  @Autowired private RecipeRepository recipeRepository;
  @Autowired private IngredientListRepository ingredientListRepository;
  @Autowired private MockMvc mockMvc;

  @MockBean ExternalRecipeScraper scraperMock;

  private static String fetaBurgersJson;
  private static String beefWellingtonJson;

  private ObjectMapper mapper = new ObjectMapper();

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
    populateUnitRepository();
    populateIngredientRepository();
  }

  @AfterEach
  void tearDown() {
    ingredientListRepository.deleteAll();
    ingredientRepository.deleteAll();
    recipeRepository.deleteAll();
    unitRepository.deleteAll();
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
            "pomegranate seeds",
            "parmesan cheese");
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

  @Test
  public void putAddsNewRecipeAllFieldsPresent() throws Exception {
    ImmutableList<Unit> units = ImmutableList.copyOf(unitRepository.findAll());
    ImmutableList<Ingredient> ingredients = ImmutableList.copyOf(ingredientRepository.findAll());

    this.mockMvc
        .perform(
            put("/addrecipes")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    "{\"name\": \"Chicken soup\", \"description\": \"Some delicious soup\", "
                        + "\"prepTime\": \"20\", \"cookTime\": \"30\", "
                        + "\"externalLink\": \"https://www.example.com/\", "
                        + "\"categories\": [\"breakfast\", \"mexican\"], "
                        + "\"instructions\": \"Do some stuff\", \"ingredients\": "
                        + "[{\"quantity\": \"1\", \"unit\": \""
                        + units.get(0).getId()
                        + "\", \"ingredient\": \""
                        + ingredients.get(0).getId()
                        + "\"},"
                        + "{\"quantity\": \"42.5\", \"unit\": \""
                        + units.get(1).getId()
                        + "\", \"ingredient\": \""
                        + ingredients.get(1).getId()
                        + "\"},"
                        + "{\"quantity\": \".75\", \"unit\": \""
                        + units.get(2).getId()
                        + "\", \"ingredient\": \""
                        + ingredients.get(2).getId()
                        + "\", \"displayName\": \"pure water, mixed\"}"
                        + "]}"))
        .andExpect(status().isOk());

    ImmutableList<Recipe> recipeList = ImmutableList.copyOf(recipeRepository.findAll());
    assertEquals(1, recipeList.size());

    Recipe chickenSoup = recipeList.get(0);
    assertEquals("Chicken soup", chickenSoup.getName());
    assertEquals("Some delicious soup", chickenSoup.getDescription());
    assertEquals("Do some stuff", chickenSoup.getInstructions());
    assertEquals(20, chickenSoup.getPrepTimeMin());
    assertEquals(30, chickenSoup.getCookTimeMin());
    assertEquals("https://www.example.com/", chickenSoup.getExternalLink());
    assertEquals(ImmutableList.of("breakfast", "mexican"), chickenSoup.getCategories());

    ImmutableList<IngredientList> ingredientLists =
        ImmutableList.copyOf(ingredientListRepository.findAll());
    assertEquals(3, ingredientLists.size());
    IngredientList list1 = ingredientLists.get(0);
    assertEquals(chickenSoup.getId(), list1.getRecipe().getId());
    assertEquals(units.get(0).getId(), list1.getUnit().getId());
    assertEquals(ingredients.get(0).getId(), list1.getIngredient().getId());
    assertEquals(1, list1.getQuantity());
    assertNull(list1.getIngredientDisplayName());

    IngredientList list2 = ingredientLists.get(1);
    assertEquals(chickenSoup.getId(), list2.getRecipe().getId());
    assertEquals(units.get(1).getId(), list2.getUnit().getId());
    assertEquals(ingredients.get(1).getId(), list2.getIngredient().getId());
    assertEquals(42.5, list2.getQuantity());
    assertNull(list2.getIngredientDisplayName());

    IngredientList list3 = ingredientLists.get(2);
    assertEquals(chickenSoup.getId(), list3.getRecipe().getId());
    assertEquals(units.get(2).getId(), list3.getUnit().getId());
    assertEquals(ingredients.get(2).getId(), list3.getIngredient().getId());
    assertEquals(.75, list3.getQuantity());
    assertEquals("pure water, mixed", list3.getIngredientDisplayName());
  }

  @Test
  public void putAddsNewRecipeOnlyRequiredFields() throws Exception {
    ImmutableList<Unit> units = ImmutableList.copyOf(unitRepository.findAll());
    ImmutableList<Ingredient> ingredients = ImmutableList.copyOf(ingredientRepository.findAll());

    this.mockMvc
        .perform(
            put("/addrecipes")
                .with(csrf())
                .contentType(MediaType.APPLICATION_JSON)
                .content(
                    "{\"name\": \"Chicken soup\", "
                        + "\"prepTime\": \"20\", \"cookTime\": \"30\", "
                        + "\"instructions\": \"Do some stuff\", \"ingredients\": "
                        + "[{\"quantity\": \"1\", \"unit\": \""
                        + units.get(0).getId()
                        + "\", \"ingredient\": \""
                        + ingredients.get(0).getId()
                        + "\"},"
                        + "{\"quantity\": \"42.5\", \"unit\": \""
                        + units.get(1).getId()
                        + "\", \"ingredient\": \""
                        + ingredients.get(1).getId()
                        + "\"},"
                        + "{\"quantity\": \".75\", \"unit\": \""
                        + units.get(2).getId()
                        + "\", \"ingredient\": \""
                        + ingredients.get(2).getId()
                        + "\"}"
                        + "]}"))
        .andExpect(status().isOk());

    ImmutableList<Recipe> recipeList = ImmutableList.copyOf(recipeRepository.findAll());
    assertEquals(1, recipeList.size());

    Recipe chickenSoup = recipeList.get(0);
    assertEquals("Chicken soup", chickenSoup.getName());
    assertNull(chickenSoup.getDescription());
    assertEquals("Do some stuff", chickenSoup.getInstructions());
    assertEquals(20, chickenSoup.getPrepTimeMin());
    assertEquals(30, chickenSoup.getCookTimeMin());
    assertNull(chickenSoup.getExternalLink());
    assertEquals(ImmutableList.of(), chickenSoup.getCategories());

    ImmutableList<IngredientList> ingredientLists =
        ImmutableList.copyOf(ingredientListRepository.findAll());
    assertEquals(3, ingredientLists.size());
    IngredientList list1 = ingredientLists.get(0);
    assertEquals(chickenSoup.getId(), list1.getRecipe().getId());
    assertEquals(units.get(0).getId(), list1.getUnit().getId());
    assertEquals(ingredients.get(0).getId(), list1.getIngredient().getId());
    assertEquals(1, list1.getQuantity());
    assertNull(list1.getIngredientDisplayName());

    IngredientList list2 = ingredientLists.get(1);
    assertEquals(chickenSoup.getId(), list2.getRecipe().getId());
    assertEquals(units.get(1).getId(), list2.getUnit().getId());
    assertEquals(ingredients.get(1).getId(), list2.getIngredient().getId());
    assertEquals(42.5, list2.getQuantity());
    assertNull(list2.getIngredientDisplayName());

    IngredientList list3 = ingredientLists.get(2);
    assertEquals(chickenSoup.getId(), list3.getRecipe().getId());
    assertEquals(units.get(2).getId(), list3.getUnit().getId());
    assertEquals(ingredients.get(2).getId(), list3.getIngredient().getId());
    assertEquals(.75, list3.getQuantity());
    assertNull(list3.getIngredientDisplayName());
  }

  @Test
  public void pageRendersUnitsSelectList() throws Exception {
    MvcResult result =
        this.mockMvc
            .perform(get("/addrecipes"))
            .andExpect(status().isOk())
            .andExpect(content().contentType("text/html;charset=UTF-8"))
            .andReturn();

    String html = result.getResponse().getContentAsString();
    Document doc = Jsoup.parse(html);
    Elements options = doc.getElementById("inputUnit").children();
    assertEquals("cups", options.get(1).text());
    assertEquals("grams", options.get(2).text());
    assertEquals("liters", options.get(3).text());
    assertEquals("ounces", options.get(4).text());
    assertEquals("pints", options.get(5).text());
    assertEquals("pounds", options.get(6).text());
    assertEquals("slices", options.get(7).text());
    assertEquals("sprigs", options.get(8).text());
    assertEquals("tablespoons", options.get(9).text());
    assertEquals("teaspoons", options.get(10).text());
  }

  @Test
  public void scrapeRecipeShouldReturnResults() throws Exception {
    ScrapedRecipe scrapedRecipe = mapper.readValue(fetaBurgersJson, ScrapedRecipe.class);
    when(scraperMock.scrapeRecipe(any())).thenReturn(scrapedRecipe);
    MvcResult result =
        this.mockMvc
            .perform(get("/scrapeRecipe").param("url", "https://www.recipes.com/fetaburgers"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andReturn();
    MockHttpServletResponse response = result.getResponse();
    verify(scraperMock).scrapeRecipe("https://www.recipes.com/fetaburgers");

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
    assertNull(garlic.getIngredientParsed().getUnitId()); // "clove" doesn't match anything in db
    assertEquals("clove", garlic.getIngredientParsed().getUnit());

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
    MvcResult result =
        this.mockMvc
            .perform(get("/scrapeRecipe").param("url", "https://www.recipes.com/beefwellington"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andReturn();
    MockHttpServletResponse response = result.getResponse();
    verify(scraperMock).scrapeRecipe("https://www.recipes.com/beefwellington");

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
}

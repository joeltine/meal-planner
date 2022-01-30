package family.themartinez.mealplanner.controllers.addrecipes;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.google.common.collect.ImmutableList;
import family.themartinez.mealplanner.data.mealtypes.MealType;
import family.themartinez.mealplanner.data.mealtypes.MealTypeRepository;
import family.themartinez.mealplanner.data.recipecategories.RecipeCategory;
import family.themartinez.mealplanner.data.recipecategories.RecipeCategoryRepository;
import family.themartinez.mealplanner.data.recipetypes.RecipeType;
import family.themartinez.mealplanner.data.recipetypes.RecipeTypeRepository;
import family.themartinez.mealplanner.data.units.Unit;
import family.themartinez.mealplanner.data.units.UnitRepository;
import java.util.Objects;
import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.select.Elements;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AddRecipesControllerTest {

  @Autowired private UnitRepository unitRepository;
  @Autowired private MealTypeRepository mealTypeRepository;
  @Autowired private RecipeTypeRepository recipeTypeRepository;
  @Autowired private RecipeCategoryRepository recipeCategoryRepository;

  @Autowired private MockMvc mockMvc;

  @BeforeEach
  void setUp() {
    populateUnitRepository();
    populateMealTypeRepository();
    populateRecipeTypeRepository();
    populateRecipeCategoryRepository();
  }

  @AfterEach
  void tearDown() {
    unitRepository.deleteAll();
    mealTypeRepository.deleteAll();
    recipeCategoryRepository.deleteAll();
    recipeTypeRepository.deleteAll();
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
    Elements options = Objects.requireNonNull(doc.getElementById("inputUnit")).children();
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
  public void pageRendersMealTypes() throws Exception {
    MvcResult result =
        this.mockMvc
            .perform(get("/addrecipes"))
            .andExpect(status().isOk())
            .andExpect(content().contentType("text/html;charset=UTF-8"))
            .andReturn();

    String html = result.getResponse().getContentAsString();
    Document doc = Jsoup.parse(html);
    Elements options = Objects.requireNonNull(doc.getElementById("inputMealType")).children();
    assertEquals("breakfast", options.get(0).text());
    assertEquals("lunch", options.get(1).text());
    assertEquals("dinner", options.get(2).text());
  }

  @Test
  public void pageRendersRecipeTypes() throws Exception {
    MvcResult result =
        this.mockMvc
            .perform(get("/addrecipes"))
            .andExpect(status().isOk())
            .andExpect(content().contentType("text/html;charset=UTF-8"))
            .andReturn();

    String html = result.getResponse().getContentAsString();
    Document doc = Jsoup.parse(html);
    Elements options = Objects.requireNonNull(doc.getElementById("inputRecipeType")).children();
    assertEquals("condiment", options.get(0).text());
    assertEquals("entree", options.get(1).text());
    assertEquals("sauce", options.get(2).text());
  }

  @Test
  public void pageRendersRecipeCategories() throws Exception {
    MvcResult result =
        this.mockMvc
            .perform(get("/addrecipes"))
            .andExpect(status().isOk())
            .andExpect(content().contentType("text/html;charset=UTF-8"))
            .andReturn();

    String html = result.getResponse().getContentAsString();
    Document doc = Jsoup.parse(html);
    Elements options =
        Objects.requireNonNull(doc.getElementById("inputRecipeCategories")).children();
    assertEquals("Mexican", options.get(0).text());
    assertEquals("vegan", options.get(1).text());
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

  private void populateMealTypeRepository() {
    ImmutableList.Builder<MealType> typesToAdd = ImmutableList.builder();
    ImmutableList<String> typeNames = ImmutableList.of("breakfast", "lunch", "dinner");
    for (String name : typeNames) {
      MealType m = new MealType();
      m.setName(name);
      typesToAdd.add(m);
    }
    mealTypeRepository.saveAll(typesToAdd.build());
  }

  private void populateRecipeTypeRepository() {
    ImmutableList.Builder<RecipeType> typesToAdd = ImmutableList.builder();
    ImmutableList<String> typeNames = ImmutableList.of("condiment", "entree", "sauce");
    for (String name : typeNames) {
      RecipeType r = new RecipeType();
      r.setName(name);
      typesToAdd.add(r);
    }
    recipeTypeRepository.saveAll(typesToAdd.build());
  }

  private void populateRecipeCategoryRepository() {
    ImmutableList.Builder<RecipeCategory> toAdd = ImmutableList.builder();
    ImmutableList<String> typeNames = ImmutableList.of("Mexican", "vegan");
    for (String name : typeNames) {
      RecipeCategory c = new RecipeCategory();
      c.setName(name);
      toAdd.add(c);
    }
    recipeCategoryRepository.saveAll(toAdd.build());
  }
}

package family.themartinez.mealplanner.controllers.recipes;

import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.containsInAnyOrder;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.not;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.csrf;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.guava.GuavaModule;
import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableSet;
import family.themartinez.mealplanner.data.ingredientlists.IngredientList;
import family.themartinez.mealplanner.data.ingredientlists.IngredientListRepository;
import family.themartinez.mealplanner.data.ingredients.Ingredient;
import family.themartinez.mealplanner.data.ingredients.IngredientRepository;
import family.themartinez.mealplanner.data.mealtypes.MealType;
import family.themartinez.mealplanner.data.mealtypes.MealTypeAssociation;
import family.themartinez.mealplanner.data.mealtypes.MealTypeRepository;
import family.themartinez.mealplanner.data.recipecategories.RecipeCategory;
import family.themartinez.mealplanner.data.recipecategories.RecipeCategoryAssociation;
import family.themartinez.mealplanner.data.recipecategories.RecipeCategoryAssociationRepository;
import family.themartinez.mealplanner.data.recipecategories.RecipeCategoryRepository;
import family.themartinez.mealplanner.data.recipes.Recipe;
import family.themartinez.mealplanner.data.recipes.RecipeRepository;
import family.themartinez.mealplanner.data.recipetypes.RecipeType;
import family.themartinez.mealplanner.data.recipetypes.RecipeTypeAssociation;
import family.themartinez.mealplanner.data.recipetypes.RecipeTypeRepository;
import family.themartinez.mealplanner.data.units.Unit;
import family.themartinez.mealplanner.data.units.UnitRepository;
import java.util.List;
import java.util.Set;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@AutoConfigureMockMvc
@ActiveProfiles("test")
class RecipesControllerTest {
  @Autowired private MockMvc mockMvc;

  @Autowired private RecipeRepository recipeRepository;
  @Autowired private RecipeCategoryRepository recipeCategoryRepository;
  @Autowired private RecipeCategoryAssociationRepository recipeCategoryAssociationRepository;
  @Autowired private RecipeTypeRepository recipeTypeRepository;
  @Autowired private MealTypeRepository mealTypeRepository;
  @Autowired private UnitRepository unitRepository;
  @Autowired private IngredientRepository ingredientRepository;
  @Autowired private IngredientListRepository ingredientListRepository;

  private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new GuavaModule());

  @BeforeEach
  void setUp() {
    populateIngredientRepository();
    populateUnitRepository();
    populateRecipeCategoryRepository();
    populateRecipeTypeRepository();
    populateMealTypeRepository();
    populateRecipeRepository();
  }

  @AfterEach
  void tearDown() {
    recipeCategoryAssociationRepository.deleteAll();
    ingredientListRepository.deleteAll();
    recipeCategoryRepository.deleteAll();
    recipeTypeRepository.deleteAll();
    mealTypeRepository.deleteAll();
    ingredientRepository.deleteAll();
    unitRepository.deleteAll();
    recipeRepository.deleteAll();
  }

  @Test
  void getRecipesReturnsAllRecipes() throws Exception {
    this.mockMvc
        .perform(get("/recipes"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$", hasSize(3)))
        .andExpect(jsonPath("$[0].name", equalTo("Chicken Chili")))
        .andExpect(jsonPath("$[0].instructions", equalTo("Do lots of stuff")))
        .andExpect(jsonPath("$[0].description", equalTo("Some delicious chili")))
        .andExpect(jsonPath("$[0].externalLink", equalTo("https://recipes.com/chili")))
        .andExpect(jsonPath("$[0].prepTimeMin", equalTo(30)))
        .andExpect(jsonPath("$[0].cookTimeMin", equalTo(20)))
        .andExpect(jsonPath("$[0].recipeCategories", hasSize(2)))
        .andExpect(
            jsonPath(
                "$[0].recipeCategories[*].recipeCategory.name",
                containsInAnyOrder("vegan", "Mexican")))
        .andExpect(jsonPath("$[0].recipeTypes", hasSize(1)))
        .andExpect(jsonPath("$[0].recipeTypes[*].recipeType.name", containsInAnyOrder("entree")))
        .andExpect(jsonPath("$[0].mealTypes", hasSize(2)))
        .andExpect(
            jsonPath("$[0].mealTypes[*].mealType.name", containsInAnyOrder("dinner", "lunch")))
        .andExpect(jsonPath("$[1].name", equalTo("Beef Tacos")))
        .andExpect(jsonPath("$[1].instructions", equalTo("Taco the stuff\nThen eat them.")))
        .andExpect(jsonPath("$[1].description", equalTo("")))
        .andExpect(jsonPath("$[1].externalLink", equalTo("https://recipes.com/tacos")))
        .andExpect(jsonPath("$[1].prepTimeMin", equalTo(123)))
        .andExpect(jsonPath("$[1].cookTimeMin", equalTo(67)))
        .andExpect(jsonPath("$[1].recipeCategories", hasSize(2)))
        .andExpect(
            jsonPath(
                "$[1].recipeCategories[*].recipeCategory.name",
                containsInAnyOrder("spicy", "Mexican")))
        .andExpect(jsonPath("$[1].recipeTypes", hasSize(1)))
        .andExpect(jsonPath("$[1].recipeTypes[*].recipeType.name", containsInAnyOrder("entree")))
        .andExpect(jsonPath("$[1].mealTypes", hasSize(1)))
        .andExpect(jsonPath("$[1].mealTypes[*].mealType.name", containsInAnyOrder("dinner")))
        .andExpect(jsonPath("$[2].name", equalTo("Omelettes")))
        .andExpect(jsonPath("$[2].instructions", equalTo("Break eggs\nThen scramble.")))
        .andExpect(jsonPath("$[2].description", equalTo("A breakfast to remember")))
        .andExpect(jsonPath("$[2].externalLink", equalTo("https://google.com/eggsnstuff")))
        .andExpect(jsonPath("$[2].prepTimeMin", equalTo(99)))
        .andExpect(jsonPath("$[2].cookTimeMin", equalTo(32)))
        .andExpect(jsonPath("$[2].recipeCategories", hasSize(0)))
        .andExpect(jsonPath("$[2].recipeTypes", hasSize(1)))
        .andExpect(jsonPath("$[2].recipeTypes[*].recipeType.name", containsInAnyOrder("condiment")))
        .andExpect(jsonPath("$[2].mealTypes", hasSize(1)))
        .andExpect(jsonPath("$[2].mealTypes[*].mealType.name", containsInAnyOrder("breakfast")));
  }

  @Test
  void deleteRecipesDeletesSingleRecipe() throws Exception {
    long totalRows = recipeRepository.count();
    assertTrue(totalRows > 0);
    ImmutableList<Recipe> list = ImmutableList.copyOf(recipeRepository.findAll());
    Recipe first = list.get(0);
    this.mockMvc
        .perform(
            delete("/recipes/" + first.getId())
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf()))
        .andExpect(status().isOk());
    assertEquals(totalRows - 1, recipeRepository.count());
    assertFalse(recipeRepository.findById(first.getId()).isPresent());
  }

  @Test
  void deleteRecipesDeletesMultipleRecipes() throws Exception {
    long totalRows = recipeRepository.count();
    assertTrue(totalRows > 1);
    ImmutableList<Recipe> list = ImmutableList.copyOf(recipeRepository.findAll());
    Recipe first = list.get(0);
    Recipe second = list.get(1);
    this.mockMvc
        .perform(
            delete("/recipes")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf())
                .content(objectMapper.writeValueAsString(ImmutableList.of(first, second))))
        .andExpect(status().isOk());
    assertEquals(totalRows - 2, recipeRepository.count());
    assertFalse(recipeRepository.findById(first.getId()).isPresent());
    assertFalse(recipeRepository.findById(second.getId()).isPresent());
  }

  @Test
  void deleteRecipesDeletesMultipleRecipesJustIds() throws Exception {
    long totalRows = recipeRepository.count();
    assertTrue(totalRows > 1);
    ImmutableList<Recipe> list = ImmutableList.copyOf(recipeRepository.findAll());
    Recipe first = list.get(0);
    Recipe second = list.get(1);
    String deleteJson = "[{\"id\": " + first.getId() + "},{\"id\": " + second.getId() + "}]";
    this.mockMvc
        .perform(
            delete("/recipes")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf())
                .content(deleteJson))
        .andExpect(status().isOk());
    assertEquals(totalRows - 2, recipeRepository.count());
    assertFalse(recipeRepository.findById(first.getId()).isPresent());
    assertFalse(recipeRepository.findById(second.getId()).isPresent());
  }

  @Test
  void putUpdatesRecipeRow() throws Exception {
    ImmutableList<Recipe> list = ImmutableList.copyOf(recipeRepository.findAll());
    Recipe first = list.get(0);
    first.setName("new name");
    first.setInstructions("new instructions");
    first.setDescription("new description");
    first.setExternalLink("new link");
    first.setPrepTimeMin(55);
    first.setCookTimeMin(42);
    // Remove first category
    RecipeCategoryAssociation category = first.getRecipeCategories().iterator().next();
    assertTrue(first.getRecipeCategories().remove(category));
    // Remove first ingredient
    IngredientList ingredientList = first.getIngredientLists().iterator().next();
    assertTrue(first.getIngredientLists().remove(ingredientList));
    this.mockMvc
        .perform(
            put(String.format("/recipes/%s", first.getId()))
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf())
                .content(objectMapper.writeValueAsString(first)))
        .andExpect(status().isOk());
    Recipe updatedRecipe = recipeRepository.findById(first.getId()).orElseThrow();
    assertEquals("new name", updatedRecipe.getName());
    assertEquals("new instructions", updatedRecipe.getInstructions());
    assertEquals("new description", updatedRecipe.getDescription());
    assertEquals("new link", updatedRecipe.getExternalLink());
    assertEquals(55, updatedRecipe.getPrepTimeMin());
    assertEquals(42, updatedRecipe.getCookTimeMin());
    List<RecipeCategoryAssociation> associations =
        recipeCategoryAssociationRepository.findAllByRecipeId(first.getId());
    assertEquals(1, associations.size());
    // Assert category removed.
    assertThat(associations, not(hasItem(category)));
    List<IngredientList> lists = ingredientListRepository.findAllByRecipeId(first.getId());
    assertEquals(1, lists.size());
    // Assert ingredient list removed.
    assertThat(lists, not(hasItem(ingredientList)));
  }

  @Test
  void postRecipesAddsNewRow() throws Exception {
    long totalRows = recipeRepository.count();
    Recipe first =
        buildNewRecipe(
            "new name",
            "new instructions",
            "new description",
            "a link",
            55,
            42,
            ImmutableSet.of("Mexican", "vegan"),
            ImmutableSet.of("breakfast", "lunch"),
            ImmutableSet.of("sauce"),
            ImmutableList.of(
                new IngredientObj("beef tenderloins", "beef", "pounds", 2.0),
                new IngredientObj("black pepper", "pepper", "teaspoons", 3.2)));

    MvcResult result =
        this.mockMvc
            .perform(
                post("/recipes")
                    .contentType(MediaType.APPLICATION_JSON)
                    .with(csrf())
                    .content(objectMapper.writeValueAsString(first)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andExpect(jsonPath("$.recipeTypes[*].recipeType.name", containsInAnyOrder("sauce")))
            .andExpect(
                jsonPath(
                    "$.recipeCategories[*].recipeCategory.name",
                    containsInAnyOrder("Mexican", "vegan")))
            .andExpect(
                jsonPath("$.mealTypes[*].mealType.name", containsInAnyOrder("breakfast", "lunch")))
            .andExpect(
                jsonPath(
                    "$.ingredientLists[*].ingredient.name",
                    containsInAnyOrder("beef tenderloins", "black pepper")))
            .andExpect(
                jsonPath(
                    "$.ingredientLists[*].unit.name", containsInAnyOrder("pounds", "teaspoons")))
            .andExpect(jsonPath("$.ingredientLists[*].quantity", containsInAnyOrder(2.0, 3.2)))
            .andExpect(
                jsonPath(
                    "$.ingredientLists[*].ingredientDisplayName",
                    containsInAnyOrder("beef", "pepper")))
            .andReturn();
    assertEquals(totalRows + 1, recipeRepository.count());
    String returnedJson = result.getResponse().getContentAsString();
    Recipe parsedRecipe = objectMapper.readValue(returnedJson, new TypeReference<>() {});
    Recipe newRecipe = recipeRepository.findById(parsedRecipe.getId()).orElseThrow();
    assertEquals(first.getName(), newRecipe.getName());
    assertEquals(first.getInstructions(), newRecipe.getInstructions());
    assertEquals(first.getDescription(), newRecipe.getDescription());
    assertEquals(first.getExternalLink(), newRecipe.getExternalLink());
    assertEquals(first.getPrepTimeMin(), newRecipe.getPrepTimeMin());
    assertEquals(first.getCookTimeMin(), newRecipe.getCookTimeMin());
  }

  private void populateRecipeRepository() {
    addNewRecipe(
        "Chicken Chili",
        "Do lots of stuff",
        "Some delicious chili",
        "https://recipes.com/chili",
        30,
        20,
        ImmutableSet.of("Mexican", "vegan"),
        ImmutableSet.of("dinner", "lunch"),
        ImmutableSet.of("entree"),
        ImmutableList.of(
            new IngredientObj("beef tenderloins", "beef", "pounds", 2.0),
            new IngredientObj("black pepper", "pepper", "teaspoons", 3.2)));

    addNewRecipe(
        "Beef Tacos",
        "Taco the stuff\nThen eat them.",
        "",
        "https://recipes.com/tacos",
        123,
        67,
        ImmutableSet.of("Mexican", "spicy"),
        ImmutableSet.of("dinner"),
        ImmutableSet.of("entree"),
        ImmutableList.of(
            new IngredientObj("beef tenderloins", "beef", "pounds", 2.0),
            new IngredientObj("tortillas", "torts", "whole", 5.0)));

    addNewRecipe(
        "Omelettes",
        "Break eggs\nThen scramble.",
        "A breakfast to remember",
        "https://google.com/eggsnstuff",
        99,
        32,
        ImmutableSet.of(),
        ImmutableSet.of("breakfast"),
        ImmutableSet.of("condiment"),
        ImmutableList.of(
            new IngredientObj("eggs", "eggs", "whole", 2.0),
            new IngredientObj("kosher salt", "salt", "grams", 11.0)));
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
    RecipeCategory mexican = new RecipeCategory();
    mexican.setName("Mexican");
    RecipeCategory vegan = new RecipeCategory();
    vegan.setName("vegan");
    RecipeCategory spicy = new RecipeCategory();
    spicy.setName("spicy");
    recipeCategoryRepository.saveAll(ImmutableList.of(mexican, vegan, spicy));
  }

  private void addNewRecipe(
      String name,
      String instructions,
      String description,
      String externalLink,
      Integer prepTimeMin,
      Integer cookTimeMin,
      Set<String> categories,
      Set<String> mealTypes,
      Set<String> recipeTypes,
      List<IngredientObj> ingredientObjs) {
    recipeRepository.save(
        buildNewRecipe(
            name,
            instructions,
            description,
            externalLink,
            prepTimeMin,
            cookTimeMin,
            categories,
            mealTypes,
            recipeTypes,
            ingredientObjs));
  }

  private Recipe buildNewRecipe(
      String name,
      String instructions,
      String description,
      String externalLink,
      Integer prepTimeMin,
      Integer cookTimeMin,
      Set<String> categories,
      Set<String> mealTypes,
      Set<String> recipeTypes,
      List<IngredientObj> ingredientObjs) {
    Recipe recipe = new Recipe();
    recipe.setName(name);
    recipe.setInstructions(instructions);
    recipe.setDescription(description);
    recipe.setExternalLink(externalLink);
    recipe.setPrepTimeMin(prepTimeMin);
    recipe.setCookTimeMin(cookTimeMin);

    setIngredientLists(recipe, ingredientObjs);
    setRecipeCategoryAssociations(recipe, categories);
    setRecipeTypeAssociations(recipe, recipeTypes);
    setMealTypeAssociations(recipe, mealTypes);

    return recipe;
  }

  private static class IngredientObj {
    public String ingredientName;
    public String ingredientDisplayName;
    public String unitName;
    public Double quantity;

    public IngredientObj(
        String ingredientName, String ingredientDisplayName, String unitName, Double quantity) {
      this.ingredientName = ingredientName;
      this.ingredientDisplayName = ingredientDisplayName;
      this.unitName = unitName;
      this.quantity = quantity;
    }
  }

  private void setIngredientLists(Recipe recipe, List<IngredientObj> objs) {
    ImmutableSet.Builder<IngredientList> lists = ImmutableSet.builder();

    for (IngredientObj ingredientObj : objs) {
      IngredientList ingredientList = new IngredientList();
      ingredientList.setRecipe(recipe);
      ingredientList.setIngredient(
          ingredientRepository.findByName(ingredientObj.ingredientName).get(0));
      ingredientList.setIngredientDisplayName(ingredientObj.ingredientDisplayName);
      ingredientList.setUnit(unitRepository.findByName(ingredientObj.unitName).get(0));
      ingredientList.setQuantity(ingredientObj.quantity);
      lists.add(ingredientList);
    }

    recipe.setIngredientLists(lists.build());
  }

  private void setRecipeTypeAssociations(Recipe recipe, Set<String> types) {
    ImmutableSet.Builder<RecipeTypeAssociation> associations = ImmutableSet.builder();
    for (String type : types) {
      RecipeTypeAssociation a = new RecipeTypeAssociation();
      a.setRecipe(recipe);
      a.setRecipeType(recipeTypeRepository.findByName(type).get(0));
      associations.add(a);
    }
    recipe.setRecipeTypes(associations.build());
  }

  private void setMealTypeAssociations(Recipe recipe, Set<String> types) {
    ImmutableSet.Builder<MealTypeAssociation> associations = ImmutableSet.builder();
    for (String type : types) {
      MealTypeAssociation a = new MealTypeAssociation();
      a.setRecipe(recipe);
      a.setMealType(mealTypeRepository.findByName(type).get(0));
      associations.add(a);
    }
    recipe.setMealTypes(associations.build());
  }

  private void setRecipeCategoryAssociations(Recipe recipe, Set<String> categories) {
    ImmutableSet.Builder<RecipeCategoryAssociation> associations = ImmutableSet.builder();
    for (String cat : categories) {
      RecipeCategoryAssociation a = new RecipeCategoryAssociation();
      a.setRecipe(recipe);
      a.setRecipeCategory(recipeCategoryRepository.findByName(cat).get(0));
      associations.add(a);
    }
    recipe.setRecipeCategories(associations.build());
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
            "tortillas",
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
}

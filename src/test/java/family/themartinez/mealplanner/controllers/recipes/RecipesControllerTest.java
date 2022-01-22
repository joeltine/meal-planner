package family.themartinez.mealplanner.controllers.recipes;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.hasSize;
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
import family.themartinez.mealplanner.data.recipes.Recipe;
import family.themartinez.mealplanner.data.recipes.RecipeRepository;
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

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class RecipesControllerTest {
  @Autowired private MockMvc mockMvc;

  @Autowired private RecipeRepository recipeRepository;

  private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new GuavaModule());

  @BeforeEach
  void setUp() {
    addNewRecipe(
        "Chicken Chili",
        "Do lots of stuff",
        "Some delicious chili",
        "https://recipes.com/chili",
        30,
        20,
        ImmutableList.of("Soups", "Chili", "Spicy"));

    addNewRecipe(
        "Beef Tacos",
        "Taco the stuff\nThen eat them.",
        "",
        "https://recipes.com/tacos",
        123,
        67,
        ImmutableList.of("Mexican", "Spicy"));

    addNewRecipe(
        "Omelettes",
        "Break eggs\nThen scramble.",
        "A breakfast to remember",
        "https://google.com/eggsnstuff",
        99,
        32,
        ImmutableList.of());
  }

  void addNewRecipe(
      String name,
      String instructions,
      String description,
      String externalLink,
      Integer prepTimeMin,
      Integer cookTimeMin,
      ImmutableList<String> categories) {
    Recipe recipe = new Recipe();
    recipe.setName(name);
    recipe.setInstructions(instructions);
    recipe.setDescription(description);
    recipe.setExternalLink(externalLink);
    recipe.setPrepTimeMin(prepTimeMin);
    recipe.setCookTimeMin(cookTimeMin);
    recipe.setCategories(categories);
    recipeRepository.save(recipe);
  }

  @AfterEach
  void tearDown() {
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
        .andExpect(jsonPath("$[0].categories", contains("Soups", "Chili", "Spicy")))
        .andExpect(jsonPath("$[1].name", equalTo("Beef Tacos")))
        .andExpect(jsonPath("$[1].instructions", equalTo("Taco the stuff\nThen eat them.")))
        .andExpect(jsonPath("$[1].description", equalTo("")))
        .andExpect(jsonPath("$[1].externalLink", equalTo("https://recipes.com/tacos")))
        .andExpect(jsonPath("$[1].prepTimeMin", equalTo(123)))
        .andExpect(jsonPath("$[1].cookTimeMin", equalTo(67)))
        .andExpect(jsonPath("$[1].categories", contains("Mexican", "Spicy")))
        .andExpect(jsonPath("$[2].name", equalTo("Omelettes")))
        .andExpect(jsonPath("$[2].instructions", equalTo("Break eggs\nThen scramble.")))
        .andExpect(jsonPath("$[2].description", equalTo("A breakfast to remember")))
        .andExpect(jsonPath("$[2].externalLink", equalTo("https://google.com/eggsnstuff")))
        .andExpect(jsonPath("$[2].prepTimeMin", equalTo(99)))
        .andExpect(jsonPath("$[2].cookTimeMin", equalTo(32)))
        .andExpect(jsonPath("$[2].categories").isEmpty());
  }

  @Test
  void deleteRecipesDeletesSingleRecipe() throws Exception {
    long totalRows = recipeRepository.count();
    assertTrue(totalRows > 0);
    ImmutableList<Recipe> list = ImmutableList.copyOf(recipeRepository.findAll());
    Recipe first = list.get(0);
    this.mockMvc
        .perform(
            delete("/recipes")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf())
                .content(objectMapper.writeValueAsString(ImmutableList.of(first))))
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
  void putUpdatesRecipeRow() throws Exception {
    ImmutableList<Recipe> list = ImmutableList.copyOf(recipeRepository.findAll());
    Recipe first = list.get(0);
    first.setName("new name");
    first.setInstructions("new instructions");
    first.setDescription("new description");
    first.setExternalLink("new link");
    first.setPrepTimeMin(55);
    first.setCookTimeMin(42);
    first.setCategories(ImmutableList.of("Cat1"));
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
    assertEquals(ImmutableList.of("Cat1"), updatedRecipe.getCategories());
  }

  @Test
  void postRecipesAddsNewRow() throws Exception {
    long totalRows = recipeRepository.count();
    Recipe first = new Recipe();
    first.setName("new name");
    first.setInstructions("new instructions");
    first.setDescription("new description");
    first.setExternalLink("new link");
    first.setPrepTimeMin(55);
    first.setCookTimeMin(42);
    first.setCategories(ImmutableList.of("Cat1"));
    MvcResult result =
        this.mockMvc
            .perform(
                post("/recipes")
                    .contentType(MediaType.APPLICATION_JSON)
                    .with(csrf())
                    .content(objectMapper.writeValueAsString(first)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andReturn();
    assertEquals(totalRows + 1, recipeRepository.count());
    Recipe parsedRecipe =
        objectMapper.readValue(result.getResponse().getContentAsString(), new TypeReference<>() {});
    Recipe newRecipe = recipeRepository.findById(parsedRecipe.getId()).orElseThrow();
    assertEquals(parsedRecipe.getName(), newRecipe.getName());
    assertEquals(parsedRecipe.getInstructions(), newRecipe.getInstructions());
    assertEquals(parsedRecipe.getDescription(), newRecipe.getDescription());
    assertEquals(parsedRecipe.getExternalLink(), newRecipe.getExternalLink());
    assertEquals(parsedRecipe.getPrepTimeMin(), newRecipe.getPrepTimeMin());
    assertEquals(parsedRecipe.getCookTimeMin(), newRecipe.getCookTimeMin());
    assertEquals(parsedRecipe.getCategories(), newRecipe.getCategories());
  }
}

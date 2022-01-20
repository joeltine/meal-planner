package family.themartinez.mealplanner.controllers.ingredients;

import static org.hamcrest.Matchers.contains;
import static org.hamcrest.Matchers.equalTo;
import static org.hamcrest.Matchers.everyItem;
import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.matchesPattern;
import static org.hamcrest.Matchers.nullValue;
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
import family.themartinez.mealplanner.data.ingredients.Ingredient;
import family.themartinez.mealplanner.data.ingredients.IngredientRepository;
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
public class IngredientsControllerTest {
  @Autowired private MockMvc mockMvc;

  @Autowired private IngredientRepository ingredientRepository;

  private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new GuavaModule());

  @BeforeEach
  public void setUp() {
    Ingredient potato = new Ingredient();
    potato.setName("Potato, raw");
    potato.setCategories(ImmutableList.of("Snacks", "Chips"));
    ingredientRepository.save(potato);

    Ingredient chicken = new Ingredient();
    chicken.setName("Chicken, raw");
    chicken.setApiId(123);
    ingredientRepository.save(chicken);

    Ingredient tomato = new Ingredient();
    tomato.setName("Sliced tomatoes");
    tomato.setImage("foo.png");
    ingredientRepository.save(tomato);

    Ingredient chips = new Ingredient();
    chips.setName("Sour cream and onion potato chips");
    chips.setAisle(ImmutableList.of("Chips"));
    ingredientRepository.save(chips);
  }

  @AfterEach
  public void tearDown() {
    ingredientRepository.deleteAll();
  }

  @Test
  public void getIngredientsReturnsAllResults() throws Exception {
    this.mockMvc
        .perform(get("/ingredients"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$", hasSize(4)))
        .andExpect(jsonPath("$[0].name", equalTo("Potato, raw")))
        .andExpect(jsonPath("$[0].apiId", nullValue()))
        .andExpect(jsonPath("$[0].aisle").isEmpty())
        .andExpect(jsonPath("$[0].categories", contains("Snacks", "Chips")))
        .andExpect(jsonPath("$[0].image", nullValue()))
        .andExpect(jsonPath("$[1].name", equalTo("Chicken, raw")))
        .andExpect(jsonPath("$[1].apiId", equalTo(123)))
        .andExpect(jsonPath("$[1].aisle").isEmpty())
        .andExpect(jsonPath("$[1].categories").isEmpty())
        .andExpect(jsonPath("$[1].image", nullValue()))
        .andExpect(jsonPath("$[2].name", equalTo("Sliced tomatoes")))
        .andExpect(jsonPath("$[2].apiId", nullValue()))
        .andExpect(jsonPath("$[2].aisle").isEmpty())
        .andExpect(jsonPath("$[2].categories").isEmpty())
        .andExpect(jsonPath("$[2].image", equalTo("foo.png")))
        .andExpect(jsonPath("$[3].name", equalTo("Sour cream and onion potato chips")))
        .andExpect(jsonPath("$[3].apiId", nullValue()))
        .andExpect(jsonPath("$[3].aisle", contains("Chips")))
        .andExpect(jsonPath("$[3].categories").isEmpty())
        .andExpect(jsonPath("$[3].image", nullValue()));
  }

  @Test
  public void deleteIngredientDeletesRowFromDb() throws Exception {
    long totalRows = ingredientRepository.count();
    assertTrue(totalRows > 0);
    ImmutableList<Ingredient> list = ImmutableList.copyOf(ingredientRepository.findAll());
    Ingredient first = list.get(0);
    this.mockMvc
        .perform(
            delete("/ingredients")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf())
                .content(objectMapper.writeValueAsString(ImmutableList.of(first))))
        .andExpect(status().isOk());
    assertEquals(totalRows - 1, ingredientRepository.count());
    assertFalse(ingredientRepository.findById(first.getId()).isPresent());
  }

  @Test
  public void deleteIngredientDeletesMultipleRowsFromDb() throws Exception {
    long totalRows = ingredientRepository.count();
    assertTrue(totalRows > 1);
    ImmutableList<Ingredient> list = ImmutableList.copyOf(ingredientRepository.findAll());
    Ingredient first = list.get(0);
    Ingredient second = list.get(1);
    this.mockMvc
        .perform(
            delete("/ingredients")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf())
                .content(objectMapper.writeValueAsString(ImmutableList.of(first, second))))
        .andExpect(status().isOk());
    assertEquals(totalRows - 2, ingredientRepository.count());
    assertFalse(ingredientRepository.findById(first.getId()).isPresent());
    assertFalse(ingredientRepository.findById(second.getId()).isPresent());
  }

  @Test
  public void putIngredientUpdatesRow() throws Exception {
    ImmutableList<Ingredient> list = ImmutableList.copyOf(ingredientRepository.findAll());
    Ingredient first = list.get(0);
    first.setName("new name");
    first.setAisle(ImmutableList.of("Blah", "Nah"));
    first.setCategories(ImmutableList.of("Cat1", "Cat2"));
    first.setApiId(765);
    first.setImage("snarf.jpg");
    this.mockMvc
        .perform(
            put(String.format("/ingredients/%s", first.getId()))
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf())
                .content(objectMapper.writeValueAsString(first)))
        .andExpect(status().isOk());
    Ingredient updatedIngredient = ingredientRepository.findById(first.getId()).orElseThrow();
    assertEquals("new name", updatedIngredient.getName());
    assertEquals(ImmutableList.of("Blah", "Nah"), updatedIngredient.getAisle());
    assertEquals(ImmutableList.of("Cat1", "Cat2"), updatedIngredient.getCategories());
    assertEquals(765, updatedIngredient.getApiId());
    assertEquals("snarf.jpg", updatedIngredient.getImage());
  }

  @Test
  public void postIngredientAddsNewRow() throws Exception {
    long totalRows = ingredientRepository.count();
    Ingredient first = new Ingredient();
    first.setName("new name");
    first.setAisle(ImmutableList.of("Blah", "Nah"));
    first.setCategories(ImmutableList.of("Cat1", "Cat2"));
    first.setApiId(765);
    first.setImage("snarf.jpg");
    MvcResult result =
        this.mockMvc
            .perform(
                post("/ingredients")
                    .contentType(MediaType.APPLICATION_JSON)
                    .with(csrf())
                    .content(objectMapper.writeValueAsString(first)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andReturn();
    assertEquals(totalRows + 1, ingredientRepository.count());
    Ingredient parsedIngredient =
        objectMapper.readValue(result.getResponse().getContentAsString(), new TypeReference<>() {});
    Ingredient newIngredient =
        ingredientRepository.findById(parsedIngredient.getId()).orElseThrow();
    assertEquals(parsedIngredient.getName(), newIngredient.getName());
    assertEquals(parsedIngredient.getAisle(), newIngredient.getAisle());
    assertEquals(parsedIngredient.getCategories(), newIngredient.getCategories());
    assertEquals(parsedIngredient.getApiId(), newIngredient.getApiId());
    assertEquals(parsedIngredient.getImage(), newIngredient.getImage());
  }

  @Test
  public void getIngredientsAutoCompleteShouldReturnResults() throws Exception {
    this.mockMvc
        .perform(get("/ingredientsAc").param("q", "pot"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$", hasSize(2)))
        .andExpect(jsonPath("$[0].text", equalTo("Potato, raw")))
        .andExpect(jsonPath("$[0].value", matchesPattern("\\d+")))
        .andExpect(jsonPath("$[1].text", equalTo("Sour cream and onion potato chips")))
        .andExpect(jsonPath("$[1].value", matchesPattern("\\d+")));
  }

  @Test
  public void getIngredientsAutoCompleteNoMatchesReturnsEmptyArray() throws Exception {
    this.mockMvc
        .perform(get("/ingredientsAc").param("q", "zooba"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(content().json("[]"));
  }

  @Test
  public void getIngredientsAutoCompleteOnlyReturnsTopResults() throws Exception {
    for (int i = 0; i < 25; i++) {
      Ingredient newCandy = new Ingredient();
      newCandy.setName(String.format("Candy%s", i));
      ingredientRepository.save(newCandy);
    }
    assertTrue(ingredientRepository.count() > 20);
    this.mockMvc
        .perform(get("/ingredientsAc").param("q", "candy"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$", hasSize(20)))
        .andExpect(jsonPath("$..text", everyItem(matchesPattern("Candy\\d+"))))
        .andExpect(jsonPath("$..value", everyItem(matchesPattern("\\d+"))));
  }

  @Test
  public void getIngredientsAutoCompleteMissingQueryThrowsError() throws Exception {
    this.mockMvc.perform(get("/ingredientsAc")).andExpect(status().is4xxClientError());
  }
}

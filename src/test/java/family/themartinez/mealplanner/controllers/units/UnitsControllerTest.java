package family.themartinez.mealplanner.controllers.units;

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
import family.themartinez.mealplanner.data.units.Unit;
import family.themartinez.mealplanner.data.units.UnitRepository;
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
class UnitsControllerTest {
  @Autowired private MockMvc mockMvc;

  @Autowired private UnitRepository unitRepository;

  private final ObjectMapper objectMapper = new ObjectMapper().registerModule(new GuavaModule());

  @BeforeEach
  void setUp() {
    Unit milligrams = new Unit();
    milligrams.setName("milligrams");

    Unit teaspoons = new Unit();
    teaspoons.setName("teaspoons");

    Unit ounces = new Unit();
    ounces.setName("ounces");

    Unit gallons = new Unit();
    gallons.setName("gallons");

    unitRepository.saveAll(ImmutableList.of(milligrams, teaspoons, ounces, gallons));
  }

  @AfterEach
  void tearDown() {
    unitRepository.deleteAll();
  }

  @Test
  void getUnitsReturnsAllUnits() throws Exception {
    this.mockMvc
        .perform(get("/units"))
        .andExpect(status().isOk())
        .andExpect(content().contentType(MediaType.APPLICATION_JSON))
        .andExpect(jsonPath("$", hasSize(4)))
        .andExpect(jsonPath("$[0].name", equalTo("milligrams")))
        .andExpect(jsonPath("$[1].name", equalTo("teaspoons")))
        .andExpect(jsonPath("$[2].name", equalTo("ounces")))
        .andExpect(jsonPath("$[3].name", equalTo("gallons")));
  }

  @Test
  void deleteUnitsDeletesSingleUnit() throws Exception {
    long totalRows = unitRepository.count();
    assertTrue(totalRows > 0);
    ImmutableList<Unit> list = ImmutableList.copyOf(unitRepository.findAll());
    Unit first = list.get(0);
    this.mockMvc
        .perform(
            delete("/units")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf())
                .content(objectMapper.writeValueAsString(ImmutableList.of(first))))
        .andExpect(status().isOk());
    assertEquals(totalRows - 1, unitRepository.count());
    assertFalse(unitRepository.findById(first.getId()).isPresent());
  }

  @Test
  void deleteUnitsDeletesMultipleUnits() throws Exception {
    long totalRows = unitRepository.count();
    assertTrue(totalRows > 1);
    ImmutableList<Unit> list = ImmutableList.copyOf(unitRepository.findAll());
    Unit first = list.get(0);
    Unit second = list.get(1);
    this.mockMvc
        .perform(
            delete("/units")
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf())
                .content(objectMapper.writeValueAsString(ImmutableList.of(first, second))))
        .andExpect(status().isOk());
    assertEquals(totalRows - 2, unitRepository.count());
    assertFalse(unitRepository.findById(first.getId()).isPresent());
    assertFalse(unitRepository.findById(second.getId()).isPresent());
  }

  @Test
  void putUpdatesUnitRow() throws Exception {
    ImmutableList<Unit> list = ImmutableList.copyOf(unitRepository.findAll());
    Unit first = list.get(0);
    first.setName("new name");
    this.mockMvc
        .perform(
            put(String.format("/units/%s", first.getId()))
                .contentType(MediaType.APPLICATION_JSON)
                .with(csrf())
                .content(objectMapper.writeValueAsString(first)))
        .andExpect(status().isOk());
    Unit updatedUnit = unitRepository.findById(first.getId()).orElseThrow();
    assertEquals("new name", updatedUnit.getName());
  }

  @Test
  void postUnitsAddsNewRow() throws Exception {
    long totalRows = unitRepository.count();
    Unit first = new Unit();
    first.setName("new name");
    MvcResult result =
        this.mockMvc
            .perform(
                post("/units")
                    .contentType(MediaType.APPLICATION_JSON)
                    .with(csrf())
                    .content(objectMapper.writeValueAsString(first)))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON))
            .andReturn();
    assertEquals(totalRows + 1, unitRepository.count());
    Unit parsedUnit =
        objectMapper.readValue(result.getResponse().getContentAsString(), new TypeReference<>() {});
    Unit newIngredient = unitRepository.findById(parsedUnit.getId()).orElseThrow();
    assertEquals(parsedUnit.getName(), newIngredient.getName());
  }
}

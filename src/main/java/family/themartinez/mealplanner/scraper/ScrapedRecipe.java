package family.themartinez.mealplanner.scraper;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.ArrayList;
import java.util.List;

/** Object representation of results returned from scrape_recipe.py. */
public class ScrapedRecipe {
  private String title;

  @JsonProperty("total_time")
  private Integer totalTime;

  @JsonProperty("cook_time")
  private Integer cookTime;

  @JsonProperty("prep_time")
  private Integer prepTime;

  private List<ScrapedIngredient> ingredients;

  private String instructions;

  private String category;

  @JsonProperty("canonical_url")
  private String canonicalUrl;

  @JsonProperty("recipe_categories")
  private List<Integer> recipeCategories = new ArrayList<>();

  @JsonProperty("recipe_types")
  private List<Integer> recipeTypes = new ArrayList<>();

  @JsonProperty("meal_types")
  private List<Integer> mealTypes = new ArrayList<>();

  public ScrapedRecipe() {}

  public ScrapedRecipe(
      String title,
      Integer totalTime,
      Integer cookTime,
      Integer prepTime,
      List<ScrapedIngredient> ingredients,
      String instructions,
      String canonicalUrl,
      String category,
      List<Integer> recipeCategories,
      List<Integer> recipeTypes,
      List<Integer> mealTypes) {
    this.title = title;
    this.totalTime = totalTime;
    this.cookTime = cookTime;
    this.prepTime = prepTime;
    this.ingredients = ingredients;
    this.instructions = instructions;
    this.canonicalUrl = canonicalUrl;
    this.category = category;
    this.recipeCategories = recipeCategories;
    this.recipeTypes = recipeTypes;
    this.mealTypes = mealTypes;
  }

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public Integer getTotalTime() {
    return totalTime;
  }

  public void setTotalTime(Integer totalTime) {
    this.totalTime = totalTime;
  }

  public Integer getCookTime() {
    return cookTime;
  }

  public void setCookTime(Integer cookTime) {
    this.cookTime = cookTime;
  }

  public Integer getPrepTime() {
    return prepTime;
  }

  public void setPrepTime(Integer prepTime) {
    this.prepTime = prepTime;
  }

  public List<ScrapedIngredient> getIngredients() {
    return ingredients;
  }

  public void setIngredients(List<ScrapedIngredient> ingredients) {
    this.ingredients = ingredients;
  }

  public String getInstructions() {
    return instructions;
  }

  public void setInstructions(String instructions) {
    this.instructions = instructions;
  }

  public String getCanonicalUrl() {
    return canonicalUrl;
  }

  public void setCanonicalUrl(String canonicalUrl) {
    this.canonicalUrl = canonicalUrl;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public List<Integer> getRecipeCategories() {
    return recipeCategories;
  }

  public void setRecipeCategories(List<Integer> recipeCategories) {
    this.recipeCategories = recipeCategories;
  }

  public void addToRecipeCategories(List<Integer> recipeCategories) {
    this.recipeCategories.addAll(recipeCategories);
  }

  public List<Integer> getRecipeTypes() {
    return recipeTypes;
  }

  public void setRecipeTypes(List<Integer> recipeTypes) {
    this.recipeTypes = recipeTypes;
  }

  public void addToRecipeTypes(List<Integer> recipeTypes) {
    this.recipeTypes.addAll(recipeTypes);
  }

  public List<Integer> getMealTypes() {
    return mealTypes;
  }

  public void setMealTypes(List<Integer> mealTypes) {
    this.mealTypes = mealTypes;
  }

  public void addToMealTypes(List<Integer> mealTypes) {
    this.mealTypes.addAll(mealTypes);
  }

  @Override
  public String toString() {
    ObjectMapper objectMapper = new ObjectMapper();
    try {
      return objectMapper.writeValueAsString(this);
    } catch (JsonProcessingException e) {
      e.printStackTrace();
    }
    return null;
  }
}

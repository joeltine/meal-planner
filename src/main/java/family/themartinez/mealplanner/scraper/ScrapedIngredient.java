package family.themartinez.mealplanner.scraper;

/** Object representation of zestful API ingredient result. See https://zestfuldata.com/docs. */
public class ScrapedIngredient {
  private Double confidence;
  private String error;
  private IngredientParsed ingredientParsed;
  private String ingredientRaw;

  public ScrapedIngredient() {}

  public ScrapedIngredient(
      Double confidence, String error, IngredientParsed ingredientParsed, String ingredientRaw) {
    this.confidence = confidence;
    this.error = error;
    this.ingredientParsed = ingredientParsed;
    this.ingredientRaw = ingredientRaw;
  }

  public Double getConfidence() {
    return confidence;
  }

  public void setConfidence(Double confidence) {
    this.confidence = confidence;
  }

  public String getError() {
    return error;
  }

  public void setError(String error) {
    this.error = error;
  }

  public IngredientParsed getIngredientParsed() {
    return ingredientParsed;
  }

  public void setIngredientParsed(IngredientParsed ingredientParsed) {
    this.ingredientParsed = ingredientParsed;
  }

  public String getIngredientRaw() {
    return ingredientRaw;
  }

  public void setIngredientRaw(String ingredientRaw) {
    this.ingredientRaw = ingredientRaw;
  }
}

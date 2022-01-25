package family.themartinez.mealplanner.scraper;

/**
 * Representation of "usdaInfo" Object from zestful API response. See https://zestfuldata.com/docs.
 */
public class UsdaInfo {
  private String category;
  private String description;
  private String fdcId;
  private String matchMethod;

  public UsdaInfo() {}

  public UsdaInfo(String category, String description, String fdcId, String matchMethod) {
    this.category = category;
    this.description = description;
    this.fdcId = fdcId;
    this.matchMethod = matchMethod;
  }

  public String getCategory() {
    return category;
  }

  public void setCategory(String category) {
    this.category = category;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getFdcId() {
    return fdcId;
  }

  public void setFdcId(String fdcId) {
    this.fdcId = fdcId;
  }

  public String getMatchMethod() {
    return matchMethod;
  }

  public void setMatchMethod(String matchMethod) {
    this.matchMethod = matchMethod;
  }
}

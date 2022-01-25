package family.themartinez.mealplanner.scraper;

/**
 * Representation of "ingredientParsed" Object from zestful API response. See
 * https://zestfuldata.com/docs.
 */
public class IngredientParsed {
  private Float quantity;
  private String unit;
  private String productSizeModifier;
  private String product;
  private String preparationNotes;
  private UsdaInfo usdaInfo;
  private Integer unitId; // Database Unit ID mapping
  private Integer ingredientId; // Database Ingredient ID mapping.
  private String name; // Ingredient name from DB.

  public IngredientParsed() {}

  public IngredientParsed(
      Float quantity,
      String unit,
      String productSizeModifier,
      String product,
      String preparationNotes,
      UsdaInfo usdaInfo,
      Integer unitId,
      Integer ingredientId,
      String name) {
    this.quantity = quantity;
    this.unit = unit;
    this.productSizeModifier = productSizeModifier;
    this.product = product;
    this.preparationNotes = preparationNotes;
    this.usdaInfo = usdaInfo;
    this.unitId = unitId;
    this.ingredientId = ingredientId;
    this.name = name;
  }

  public Float getQuantity() {
    return quantity;
  }

  public void setQuantity(Float quantity) {
    this.quantity = quantity;
  }

  public String getUnit() {
    return unit;
  }

  public void setUnit(String unit) {
    this.unit = unit;
  }

  public String getProductSizeModifier() {
    return productSizeModifier;
  }

  public void setProductSizeModifier(String productSizeModifier) {
    this.productSizeModifier = productSizeModifier;
  }

  public String getProduct() {
    return product;
  }

  public void setProduct(String product) {
    this.product = product;
  }

  public String getPreparationNotes() {
    return preparationNotes;
  }

  public void setPreparationNotes(String preparationNotes) {
    this.preparationNotes = preparationNotes;
  }

  public UsdaInfo getUsdaInfo() {
    return usdaInfo;
  }

  public void setUsdaInfo(UsdaInfo usdaInfo) {
    this.usdaInfo = usdaInfo;
  }

  public Integer getUnitId() {
    return unitId;
  }

  public void setUnitId(Integer unitId) {
    this.unitId = unitId;
  }

  public Integer getIngredientId() {
    return ingredientId;
  }

  public void setIngredientId(Integer ingredientId) {
    this.ingredientId = ingredientId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }
}

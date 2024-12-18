package family.themartinez.mealplanner.data.ingredientlists;

import com.fasterxml.jackson.annotation.JsonBackReference;
import family.themartinez.mealplanner.data.ingredients.Ingredient;
import family.themartinez.mealplanner.data.recipes.Recipe;
import family.themartinez.mealplanner.data.units.Unit;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name = "ingredient_lists")
public class IngredientList {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id", nullable = false)
  private Integer id;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "recipe_id", nullable = false)
  @JsonBackReference
  private Recipe recipe;

  @ManyToOne(optional = false)
  @JoinColumn(name = "ingredient_id", nullable = false)
  private Ingredient ingredient;

  @ManyToOne(optional = false)
  @JoinColumn(name = "unit_id", nullable = false)
  private Unit unit;

  @Column(name = "quantity", nullable = false)
  private Double quantity;

  @Column(name = "ingredient_display_name")
  private String ingredientDisplayName;

  public String getIngredientDisplayName() {
    return ingredientDisplayName;
  }

  public void setIngredientDisplayName(String ingredientDisplayName) {
    this.ingredientDisplayName = ingredientDisplayName;
  }

  public Double getQuantity() {
    return quantity;
  }

  public void setQuantity(Double quantity) {
    this.quantity = quantity;
  }

  public Unit getUnit() {
    return unit;
  }

  public void setUnit(Unit unit) {
    this.unit = unit;
  }

  public Ingredient getIngredient() {
    return ingredient;
  }

  public void setIngredient(Ingredient ingredient) {
    this.ingredient = ingredient;
  }

  public Recipe getRecipe() {
    return recipe;
  }

  public void setRecipe(Recipe recipe) {
    this.recipe = recipe;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }
}

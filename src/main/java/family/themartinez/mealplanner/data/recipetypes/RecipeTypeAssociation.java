package family.themartinez.mealplanner.data.recipetypes;

import com.fasterxml.jackson.annotation.JsonBackReference;
import family.themartinez.mealplanner.data.recipes.Recipe;
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
@Table(name = "recipe_type_associations")
public class RecipeTypeAssociation {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id", nullable = false)
  private Integer id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "recipe_type_id", nullable = false)
  private RecipeType recipeType;

  @ManyToOne(optional = false, fetch = FetchType.LAZY)
  @JoinColumn(name = "recipe_id", nullable = false)
  @JsonBackReference
  private Recipe recipe;

  public Recipe getRecipe() {
    return recipe;
  }

  public void setRecipe(Recipe recipe) {
    this.recipe = recipe;
  }

  public RecipeType getRecipeType() {
    return recipeType;
  }

  public void setRecipeType(RecipeType recipeType) {
    this.recipeType = recipeType;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }
}

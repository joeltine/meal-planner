package family.themartinez.mealplanner.data.recipecategories;

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
@Table(name = "recipe_category_associations")
public class RecipeCategoryAssociation {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id", nullable = false)
  private Integer id;

  @ManyToOne(optional = false)
  @JoinColumn(name = "recipe_category_id", nullable = false)
  private RecipeCategory recipeCategory;

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

  public RecipeCategory getRecipeCategory() {
    return recipeCategory;
  }

  public void setRecipeCategory(RecipeCategory recipeCategory) {
    this.recipeCategory = recipeCategory;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }
}

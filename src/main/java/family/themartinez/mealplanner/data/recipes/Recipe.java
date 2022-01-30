package family.themartinez.mealplanner.data.recipes;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.vladmihalcea.hibernate.type.json.JsonType;
import family.themartinez.mealplanner.data.ingredientlists.IngredientList;
import family.themartinez.mealplanner.data.mealtypes.MealTypeAssociation;
import family.themartinez.mealplanner.data.recipecategories.RecipeCategoryAssociation;
import family.themartinez.mealplanner.data.recipetypes.RecipeTypeAssociation;
import java.util.HashSet;
import java.util.Set;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;
import org.hibernate.annotations.Type;
import org.hibernate.annotations.TypeDef;
import org.hibernate.annotations.TypeDefs;

@TypeDefs({@TypeDef(name = "json", typeClass = JsonType.class)})
@Entity
@Table(name = "recipes")
public class Recipe {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  @Column(name = "id", nullable = false)
  private Integer id;

  @Column(name = "name", nullable = false)
  private String name;

  @Type(type = "text")
  @Column(name = "instructions", nullable = false)
  private String instructions;

  @Type(type = "text")
  @Column(name = "description")
  private String description;

  @Column(name = "external_link", length = 2048)
  private String externalLink;

  @Column(name = "prep_time_min", nullable = false)
  private Integer prepTimeMin;

  @Column(name = "cook_time_min", nullable = false)
  private Integer cookTimeMin;

  @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
  @Fetch(FetchMode.JOIN)
  @JsonManagedReference
  private Set<IngredientList> ingredientLists = new HashSet<>();

  @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
  @Fetch(FetchMode.JOIN)
  @JsonManagedReference
  private Set<RecipeTypeAssociation> recipeTypes = new HashSet<>();

  @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
  @Fetch(FetchMode.JOIN)
  @JsonManagedReference
  private Set<MealTypeAssociation> mealTypes = new HashSet<>();

  @OneToMany(mappedBy = "recipe", cascade = CascadeType.ALL, orphanRemoval = true)
  @Fetch(FetchMode.JOIN)
  @JsonManagedReference
  private Set<RecipeCategoryAssociation> recipeCategories = new HashSet<>();

  public Set<RecipeTypeAssociation> getRecipeTypes() {
    return recipeTypes;
  }

  public void setRecipeTypes(Set<RecipeTypeAssociation> recipeTypes) {
    this.recipeTypes.clear();
    if (recipeTypes != null) {
      this.recipeTypes.addAll(recipeTypes);
    }
  }

  public Set<MealTypeAssociation> getMealTypes() {
    return mealTypes;
  }

  public void setMealTypes(Set<MealTypeAssociation> mealTypes) {
    this.mealTypes.clear();
    if (mealTypes != null) {
      this.mealTypes.addAll(mealTypes);
    }
  }

  public Set<RecipeCategoryAssociation> getRecipeCategories() {
    return recipeCategories;
  }

  public void setRecipeCategories(Set<RecipeCategoryAssociation> recipeCategories) {
    this.recipeCategories.clear();
    if (recipeCategories != null) {
      this.recipeCategories.addAll(recipeCategories);
    }
  }

  public Set<IngredientList> getIngredientLists() {
    return ingredientLists;
  }

  public void setIngredientLists(Set<IngredientList> ingredientLists) {
    this.ingredientLists.clear();
    if (ingredientLists != null) {
      this.ingredientLists.addAll(ingredientLists);
    }
  }

  public Integer getCookTimeMin() {
    return cookTimeMin;
  }

  public void setCookTimeMin(Integer cookTimeMin) {
    this.cookTimeMin = cookTimeMin;
  }

  public Integer getPrepTimeMin() {
    return prepTimeMin;
  }

  public void setPrepTimeMin(Integer prepTimeMin) {
    this.prepTimeMin = prepTimeMin;
  }

  public String getExternalLink() {
    return externalLink;
  }

  public void setExternalLink(String externalLink) {
    this.externalLink = externalLink;
  }

  public String getDescription() {
    return description;
  }

  public void setDescription(String description) {
    this.description = description;
  }

  public String getInstructions() {
    return instructions;
  }

  public void setInstructions(String instructions) {
    this.instructions = instructions;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public Integer getId() {
    return id;
  }

  public void setId(Integer id) {
    this.id = id;
  }
}

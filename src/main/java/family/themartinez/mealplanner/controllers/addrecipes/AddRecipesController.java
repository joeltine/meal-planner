package family.themartinez.mealplanner.controllers.addrecipes;

import com.google.common.collect.ImmutableList;
import family.themartinez.mealplanner.data.mealtypes.MealType;
import family.themartinez.mealplanner.data.mealtypes.MealTypeRepository;
import family.themartinez.mealplanner.data.recipecategories.RecipeCategory;
import family.themartinez.mealplanner.data.recipecategories.RecipeCategoryRepository;
import family.themartinez.mealplanner.data.recipetypes.RecipeType;
import family.themartinez.mealplanner.data.recipetypes.RecipeTypeRepository;
import family.themartinez.mealplanner.data.units.Unit;
import family.themartinez.mealplanner.data.units.UnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class AddRecipesController {
  private static final String PATH = "/addrecipes";

  @Autowired private UnitRepository unitRepository;
  @Autowired private RecipeTypeRepository recipeTypeRepository;
  @Autowired private MealTypeRepository mealTypeRepository;
  @Autowired private RecipeCategoryRepository recipeCategoryRepository;

  @GetMapping(PATH)
  public String addRecipePage(Model model) {
    model.addAttribute("units", getUnitsList());
    model.addAttribute("recipeTypes", getRecipeTypesList());
    model.addAttribute("mealTypes", getMealTypesList());
    model.addAttribute("recipeCategories", getRecipeCategoriesList());
    return "addrecipes/addrecipes";
  }

  private ImmutableList<Unit> getUnitsList() {
    return ImmutableList.copyOf(this.unitRepository.findAllByOrderByNameAsc());
  }

  private ImmutableList<RecipeType> getRecipeTypesList() {
    return ImmutableList.copyOf(this.recipeTypeRepository.findAllByOrderByNameAsc());
  }

  private ImmutableList<MealType> getMealTypesList() {
    return ImmutableList.copyOf(this.mealTypeRepository.findAllByOrderByIdAsc());
  }

  private ImmutableList<RecipeCategory> getRecipeCategoriesList() {
    return ImmutableList.copyOf(this.recipeCategoryRepository.findAllOrderByNameAsciiAsc());
  }
}

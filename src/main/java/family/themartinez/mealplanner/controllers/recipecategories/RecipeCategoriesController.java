package family.themartinez.mealplanner.controllers.recipecategories;

import com.google.common.collect.ImmutableList;
import family.themartinez.mealplanner.data.recipecategories.RecipeCategory;
import family.themartinez.mealplanner.data.recipecategories.RecipeCategoryRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class RecipeCategoriesController {
  @Autowired private RecipeCategoryRepository recipeCategoryRepository;

  @GetMapping("/recipeCategories")
  public ImmutableList<RecipeCategory> getRecipeCategories() {
    return ImmutableList.copyOf(recipeCategoryRepository.findAllOrderByNameAsciiAsc());
  }

  @DeleteMapping("/recipeCategories")
  public void deleteRecipeCategories(@RequestBody List<RecipeCategory> recipeCategories) {
    List<Integer> ids =
        recipeCategories.stream()
            .map(recipeCategory -> recipeCategory.getId())
            .collect(Collectors.toList());
    recipeCategoryRepository.deleteAllById(ids);
  }

  @PutMapping("/recipeCategories/{id:[0-9]+}")
  public void updateRecipeCategory(
      @RequestBody RecipeCategory recipeCategory, @PathVariable Integer id) {
    RecipeCategory existingRecipeCategory = recipeCategoryRepository.findById(id).orElseThrow();
    existingRecipeCategory.setName(recipeCategory.getName());
    recipeCategoryRepository.save(existingRecipeCategory);
  }

  @PostMapping("/recipeCategories")
  public @ResponseBody RecipeCategory addRecipeCategory(
      @RequestBody RecipeCategory recipeCategory) {
    return recipeCategoryRepository.save(recipeCategory);
  }
}

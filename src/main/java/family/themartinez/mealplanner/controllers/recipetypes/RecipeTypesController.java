package family.themartinez.mealplanner.controllers.recipetypes;

import com.google.common.collect.ImmutableList;
import family.themartinez.mealplanner.data.recipetypes.RecipeType;
import family.themartinez.mealplanner.data.recipetypes.RecipeTypeRepository;
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
public class RecipeTypesController {
  @Autowired private RecipeTypeRepository recipeTypeRepository;

  @GetMapping("/recipeTypes")
  public ImmutableList<RecipeType> getRecipeTypes() {
    return ImmutableList.copyOf(recipeTypeRepository.findAll());
  }

  @DeleteMapping("/recipeTypes")
  public void deleteRecipeTypes(@RequestBody List<RecipeType> recipeTypes) {
    List<Integer> ids =
        recipeTypes.stream().map(recipeType -> recipeType.getId()).collect(Collectors.toList());
    recipeTypeRepository.deleteAllById(ids);
  }

  @PutMapping("/recipeTypes/{id:[0-9]+}")
  public void updateRecipeType(@RequestBody RecipeType recipeType, @PathVariable Integer id) {
    RecipeType existingRecipeType = recipeTypeRepository.findById(id).orElseThrow();
    existingRecipeType.setName(recipeType.getName());
    recipeTypeRepository.save(existingRecipeType);
  }

  @PostMapping("/recipeTypes")
  public @ResponseBody RecipeType addRecipeType(@RequestBody RecipeType recipeType) {
    return recipeTypeRepository.save(recipeType);
  }
}

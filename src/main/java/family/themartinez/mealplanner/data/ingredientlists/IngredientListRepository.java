package family.themartinez.mealplanner.data.ingredientlists;

import java.util.List;
import org.springframework.data.repository.CrudRepository;

// This will be AUTO IMPLEMENTED by Spring into a Bean called ingredientListRepository
public interface IngredientListRepository extends CrudRepository<IngredientList, Integer> {

  List<IngredientList> findAllByRecipeId(Integer recipeId);
}

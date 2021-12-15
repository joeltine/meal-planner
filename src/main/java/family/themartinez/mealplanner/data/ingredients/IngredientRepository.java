package family.themartinez.mealplanner.data.ingredients;

import java.util.List;
import org.springframework.data.repository.CrudRepository;

// This will be AUTO IMPLEMENTED by Spring into a Bean called ingredientRepository
public interface IngredientRepository extends CrudRepository<Ingredient, Integer> {
  List<IdAndNameOnly> findTop10ByNameLikeIgnoreCase(String name);
}

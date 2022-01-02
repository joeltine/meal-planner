package family.themartinez.mealplanner.data.ingredients;

import org.springframework.data.repository.CrudRepository;

import java.util.List;

// This will be AUTO IMPLEMENTED by Spring into a Bean called ingredientRepository
public interface IngredientRepository extends CrudRepository<Ingredient, Integer> {
  List<IdAndNameOnly> findTop20ByNameLikeIgnoreCase(String name);
}

package family.themartinez.mealplanner.data.recipes;

import java.util.List;
import org.springframework.data.repository.CrudRepository;

// This will be AUTO IMPLEMENTED by Spring into a Bean called RecipeTypeRepository
public interface MealTypeRepository extends CrudRepository<MealType, Integer> {
  List<MealType> findAllByOrderByIdAsc();
}

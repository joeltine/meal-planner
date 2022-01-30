package family.themartinez.mealplanner.data.recipetypes;

import java.util.List;
import org.springframework.data.repository.CrudRepository;

// This will be AUTO IMPLEMENTED by Spring into a Bean called RecipeTypeRepository
public interface RecipeTypeRepository extends CrudRepository<RecipeType, Integer> {
  List<RecipeType> findAllByOrderByNameAsc();

  List<RecipeType> findByName(String type);
}

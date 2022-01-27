package family.themartinez.mealplanner.data.recipes;

import org.springframework.data.repository.CrudRepository;

// This will be AUTO IMPLEMENTED by Spring into a Bean called RecipeTypeRepository
public interface RecipeTypeRepository extends CrudRepository<RecipeType, Integer> {}

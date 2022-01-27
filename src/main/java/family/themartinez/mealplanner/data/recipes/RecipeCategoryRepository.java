package family.themartinez.mealplanner.data.recipes;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

// This will be AUTO IMPLEMENTED by Spring into a Bean called recipeCategoryRepository
public interface RecipeCategoryRepository extends CrudRepository<RecipeCategory, Integer> {
  @Query(value = "SELECT * FROM recipe_categories ORDER BY ASCII(name) ASC", nativeQuery = true)
  List<RecipeCategory> findAllOrderByNameAsciiAsc();
}

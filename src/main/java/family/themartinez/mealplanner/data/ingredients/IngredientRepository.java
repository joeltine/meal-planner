package family.themartinez.mealplanner.data.ingredients;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

// This will be AUTO IMPLEMENTED by Spring into a Bean called ingredientRepository
public interface IngredientRepository extends CrudRepository<Ingredient, Integer> {
  List<IdAndNameOnly> findTop20ByNameLikeIgnoreCase(String name);

  List<Ingredient> findByName(String name);

  @Query(
      value =
          "SELECT * FROM ingredients "
              + "WHERE MATCH (name) AGAINST (?1 IN NATURAL LANGUAGE MODE) LIMIT 5",
      nativeQuery = true)
  List<Ingredient> findTop5ByNameUsingNaturalLanguage(String name);
}

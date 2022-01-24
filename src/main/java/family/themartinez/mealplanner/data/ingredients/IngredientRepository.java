package family.themartinez.mealplanner.data.ingredients;

import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

// This will be AUTO IMPLEMENTED by Spring into a Bean called ingredientRepository
public interface IngredientRepository extends CrudRepository<Ingredient, Integer> {

  @Query(
      value =
          "SELECT id, name FROM ingredients "
              + "WHERE name LIKE CONCAT('%', ?1, '%') "
              + "ORDER BY "
              + "CASE "
              + "WHEN name RLIKE CONCAT('^', ?1, '\\\\b') THEN 1 "
              + "WHEN name LIKE CONCAT(?1, '%') THEN 2 "
              + "WHEN name RLIKE CONCAT('\\\\b', ?1, '\\\\b') THEN 3 "
              + "ELSE 4 "
              + "END "
              + "LIMIT 20",
      nativeQuery = true)
  List<IdAndNameOnly> findTopByNameAutocompleteAlgorithm(String name);

  List<Ingredient> findByName(String name);

  @Query(
      value =
          "SELECT * FROM ingredients "
              + "WHERE MATCH (name) AGAINST (?1 IN NATURAL LANGUAGE MODE) LIMIT 5",
      nativeQuery = true)
  List<Ingredient> findTop5ByNameUsingNaturalLanguage(String name);
}

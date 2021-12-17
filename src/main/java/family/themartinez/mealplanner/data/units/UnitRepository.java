package family.themartinez.mealplanner.data.units;

import java.util.List;
import org.springframework.data.repository.CrudRepository;

// This will be AUTO IMPLEMENTED by Spring into a Bean called ingredientRepository
public interface UnitRepository extends CrudRepository<Unit, Integer> {
  List<Unit> findAllByOrderByNameAsc();
}

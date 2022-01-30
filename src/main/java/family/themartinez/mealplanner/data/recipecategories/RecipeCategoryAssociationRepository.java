package family.themartinez.mealplanner.data.recipecategories;

import java.util.List;
import org.springframework.data.repository.CrudRepository;

// This will be AUTO IMPLEMENTED by Spring into a Bean called recipeCategoryAssociationRepository
public interface RecipeCategoryAssociationRepository
    extends CrudRepository<RecipeCategoryAssociation, Integer> {

  List<RecipeCategoryAssociation> findAllByRecipeId(Integer id);
}

package family.themartinez.mealplanner.controllers.mealtypes;

import com.google.common.collect.ImmutableList;
import family.themartinez.mealplanner.data.mealtypes.MealType;
import family.themartinez.mealplanner.data.mealtypes.MealTypeRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class MealTypesController {
  @Autowired private MealTypeRepository mealTypeRepository;

  @GetMapping("/mealTypes")
  public ImmutableList<MealType> getMealTypes() {
    return ImmutableList.copyOf(mealTypeRepository.findAll());
  }

  @DeleteMapping("/mealTypes")
  public void deleteMealTypes(@RequestBody List<MealType> mealTypes) {
    List<Integer> ids =
        mealTypes.stream().map(mealType -> mealType.getId()).collect(Collectors.toList());
    mealTypeRepository.deleteAllById(ids);
  }

  @PutMapping("/mealTypes/{id:[0-9]+}")
  public void updateMealType(@RequestBody MealType mealType, @PathVariable Integer id) {
    MealType existingMealType = mealTypeRepository.findById(id).orElseThrow();
    existingMealType.setName(mealType.getName());
    mealTypeRepository.save(existingMealType);
  }

  @PostMapping("/mealTypes")
  public @ResponseBody MealType addMealType(@RequestBody MealType mealType) {
    return mealTypeRepository.save(mealType);
  }
}

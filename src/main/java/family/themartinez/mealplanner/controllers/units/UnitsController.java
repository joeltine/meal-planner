package family.themartinez.mealplanner.controllers.units;

import com.google.common.collect.ImmutableList;
import family.themartinez.mealplanner.data.units.Unit;
import family.themartinez.mealplanner.data.units.UnitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;

public class UnitsController {
  @Autowired private UnitRepository unitRepository;

  @GetMapping("/units")
  public ImmutableList<Unit> getUnits() {
    return ImmutableList.copyOf(unitRepository.findAll());
  }
}

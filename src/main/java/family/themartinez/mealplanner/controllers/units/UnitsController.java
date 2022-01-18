package family.themartinez.mealplanner.controllers.units;

import com.google.common.collect.ImmutableList;
import family.themartinez.mealplanner.data.units.Unit;
import family.themartinez.mealplanner.data.units.UnitRepository;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class UnitsController {
  @Autowired private UnitRepository unitRepository;

  @GetMapping("/units")
  public ImmutableList<Unit> getUnits() {
    return ImmutableList.copyOf(unitRepository.findAll());
  }

  @DeleteMapping("/units")
  public void deleteUnits(@RequestBody List<Unit> units) {
    List<Integer> ids = units.stream().map(unit -> unit.getId()).collect(Collectors.toList());
    unitRepository.deleteAllById(ids);
  }
}

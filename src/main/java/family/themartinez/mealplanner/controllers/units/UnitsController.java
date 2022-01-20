package family.themartinez.mealplanner.controllers.units;

import com.google.common.collect.ImmutableList;
import family.themartinez.mealplanner.data.units.Unit;
import family.themartinez.mealplanner.data.units.UnitRepository;
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

  @PutMapping("/units/{id:[0-9]+}")
  public void updateUnit(@RequestBody Unit unit, @PathVariable Integer id) {
    Unit existingUnit = unitRepository.findById(id).orElseThrow();
    existingUnit.setId(unit.getId());
    existingUnit.setCreatedAt(unit.getCreatedAt());
    existingUnit.setName(unit.getName());
    unitRepository.save(existingUnit);
  }

  @PostMapping("/units")
  public @ResponseBody Unit addUnit(@RequestBody Unit unit) {
    return unitRepository.save(unit);
  }
}

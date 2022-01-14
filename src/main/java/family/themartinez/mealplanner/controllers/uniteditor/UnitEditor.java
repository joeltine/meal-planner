package family.themartinez.mealplanner.controllers.uniteditor;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class UnitEditor {

  @GetMapping("/unitEditor")
  public String getUnitEditorPage() {
    return "uniteditor/unitEditor";
  }
}

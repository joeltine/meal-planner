package family.themartinez.mealplanner.controllers.planner;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class PlannerController {

  @GetMapping({"/", "/planner"})
  public String planner() {
    return "planner/planner";
  }
}

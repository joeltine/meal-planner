package family.themartinez.mealplanner.controllers;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
public class GlobalControllerAdvice {
  @Autowired private Environment environment;

  @Autowired
  @Qualifier("devMode")
  private boolean isDevelopment;

  @ModelAttribute("dbName")
  public String dbName() {
    return environment.getProperty("spring.datasource.url");
  }

  @ModelAttribute("activeProfile")
  public String activeProfile() {
    return String.join(", ", environment.getActiveProfiles());
  }

  @ModelAttribute("isDevelopment")
  public Boolean isDevelopment() {
    return isDevelopment;
  }
}

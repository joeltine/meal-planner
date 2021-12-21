package family.themartinez.mealplanner.controllers;

import java.util.Arrays;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;

@ControllerAdvice
public class GlobalControllerAdvice {
  @Autowired private Environment environment;

  @ModelAttribute("dbName")
  public String dbName() {
    return environment.getProperty("spring.cloud.gcp.sql.database-name");
  }

  @ModelAttribute("activeProfile")
  public String activeProfile() {
    return String.join(", ", environment.getActiveProfiles());
  }

  @ModelAttribute("isDevelopment")
  public Boolean isDevelopment() {
    List<String> profiles = Arrays.asList(environment.getActiveProfiles());
    return profiles.contains("dev") || profiles.contains("integration");
  }
}

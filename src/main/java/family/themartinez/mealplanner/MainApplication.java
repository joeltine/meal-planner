package family.themartinez.mealplanner;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;

/**
 * Main application bootstrap class.
 *
 * <p>Excludes UserDetailsService to disable generating temporary user on startup.
 */
@SpringBootApplication(exclude = {UserDetailsServiceAutoConfiguration.class})
public class MainApplication {

  public static void main(String[] args) {
    SpringApplication.run(MainApplication.class, args);
  }
}

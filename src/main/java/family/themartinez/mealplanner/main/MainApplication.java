package family.themartinez.mealplanner.main;

import nz.net.ultraq.thymeleaf.LayoutDialect;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.UserDetailsServiceAutoConfiguration;
import org.springframework.context.annotation.Bean;

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

  @Bean
  public LayoutDialect layoutDialect() {
    // Enables thymeleaf layout dialect.
    return new LayoutDialect();
  }
}

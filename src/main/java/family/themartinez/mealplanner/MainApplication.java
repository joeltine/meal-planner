package family.themartinez.mealplanner;

import com.fasterxml.jackson.datatype.guava.GuavaModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import nz.net.ultraq.thymeleaf.layoutdialect.LayoutDialect;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
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

  @Bean
  public Jackson2ObjectMapperBuilderCustomizer customize() {
    // Required so we can serialize/deserialize Guava types (eg ImmutableList)
    // to JSON in requests/responses.
    return builder -> builder.modules(new GuavaModule(), new JavaTimeModule());
  }
}

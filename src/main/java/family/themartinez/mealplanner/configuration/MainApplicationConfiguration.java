package family.themartinez.mealplanner.configuration;

import com.fasterxml.jackson.datatype.guava.GuavaModule;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import family.themartinez.mealplanner.scraper.ExternalRecipeScraper;
import java.util.Arrays;
import java.util.List;
import nz.net.ultraq.thymeleaf.layoutdialect.LayoutDialect;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;

@Configuration
public class MainApplicationConfiguration {
  @Autowired private Environment environment;

  @Bean
  public ExternalRecipeScraper externalRecipeScraper() {
    return new ExternalRecipeScraper();
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

  @Bean
  @Qualifier("devMode")
  public Boolean isDevelopment() {
    List<String> profiles = Arrays.asList(environment.getActiveProfiles());
    return profiles.contains("dev") || profiles.contains("integration");
  }
}

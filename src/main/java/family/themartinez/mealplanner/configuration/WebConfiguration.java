package family.themartinez.mealplanner.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.resource.VersionResourceResolver;

@Configuration
public class WebConfiguration implements WebMvcConfigurer {

  private static final String[] CLASSPATH_RESOURCE_LOCATIONS = {
    "classpath:/META-INF/resources/", "classpath:/resources/",
    "classpath:/static/", "classpath:/public/"
  };

  @Autowired
  @Qualifier("devMode")
  private boolean isDevelopment;

  @Override
  public void addResourceHandlers(ResourceHandlerRegistry registry) {
    // Adds a resource handler for everything under /resources/, /static/, /public/ to be served at
    // the root. E.g., something in /resources/static/js/foo.js will be served at /js/foo.js.
    // Also adds content versioning strategy to each, which uses MD5 hash on the file contents to
    // generate etags and serve versioned resources like, "/js/foo-12345656.js". See
    // TemplateEngineConfiguration where these links are re-written for use in Thyme templates.
    registry
        .addResourceHandler("/**")
        .addResourceLocations(CLASSPATH_RESOURCE_LOCATIONS)
        // Don't cache resource chain in dev.
        .resourceChain(!isDevelopment)
        .addResolver(new VersionResourceResolver().addContentVersionStrategy("/**"));
  }
}

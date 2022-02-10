package family.themartinez.mealplanner.configuration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.resource.ResourceUrlProvider;
import org.thymeleaf.context.IExpressionContext;
import org.thymeleaf.linkbuilder.StandardLinkBuilder;
import org.thymeleaf.spring5.SpringTemplateEngine;

@Configuration
public class TemplateEngineConfiguration {

  @Autowired
  public void configureTemplateEngine(
      SpringTemplateEngine engine, ResourceUrlProvider urlProvider) {
    engine.setLinkBuilder(new VersioningLinkBuilder(urlProvider));
  }

  // Rewrite links to their versioned name for injection into Thyme templates.
  class VersioningLinkBuilder extends StandardLinkBuilder {
    private final ResourceUrlProvider urlProvider;

    VersioningLinkBuilder(ResourceUrlProvider urlProvider) {
      this.urlProvider = urlProvider;
    }

    @Override
    public String processLink(IExpressionContext context, String link) {
      String lookedUpLink = urlProvider.getForLookupPath(link);
      if (lookedUpLink != null) {
        return super.processLink(context, lookedUpLink);
      } else {
        return super.processLink(context, link);
      }
    }
  }
}

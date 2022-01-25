package family.themartinez.mealplanner.scraper;

import java.io.IOException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class ExternalRecipeScraperTest {
  ExternalRecipeScraper scraper;

  @BeforeEach
  void setUp() throws IOException {
    scraper = new ExternalRecipeScraper();
  }

  @AfterEach
  void tearDown() {
    scraper = null;
  }

  @Test
  void scrapeRecipe() {
    // TODO: Write me after mocking out execPythonScraper.
  }
}

package family.themartinez.mealplanner.scraper;

import java.io.IOException;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.data.util.Pair;

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
  void scrapeRecipe() throws IOException, InterruptedException {
    Pair<Integer, String> out =
        scraper.scrapeRecipe(
            "https://www.allrecipes.com/recipe/158968/spinach-and-feta-turkey-burgers/");
    System.out.println(out);
  }
}

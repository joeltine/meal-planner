package family.themartinez.mealplanner.scraper;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.common.base.Charsets;
import com.google.common.io.CharStreams;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class ExternalRecipeScraper {

  private final File scrapeRecipeScript;

  private static final String PYTHON = "/usr/bin/python3";

  private static final String SCRAPER_PY = "src/main/resources/scripts/scrape_recipe.py";

  public ExternalRecipeScraper() {
    scrapeRecipeScript = new File(SCRAPER_PY);
  }

  /**
   * Tries to scrape external recipe URL and parses results to ScrapedRecipe object. Throws
   * RuntimeException if scraping fails.
   */
  public ScrapedRecipe scrapeRecipe(String recipeUrl) throws IOException, InterruptedException {
    String result = execPythonScraper(recipeUrl);
    ObjectMapper mapper = new ObjectMapper();
    return mapper.readValue(result, ScrapedRecipe.class);
  }

  private String execPythonScraper(String recipeUrl)
      throws IOException, RuntimeException, InterruptedException {
    Process process = execCommand(PYTHON, scrapeRecipeScript.getPath(), recipeUrl);
    String result =
        CharStreams.toString(new InputStreamReader(process.getInputStream(), Charsets.UTF_8));
    if (process.exitValue() != 0) {
      throw new ResponseStatusException(
          HttpStatus.BAD_REQUEST,
          String.format(
              "Recipe URL scraping failed. Recipe website likely isn't in standard recipe schema format. Url: %s",
              recipeUrl));
    }
    return result;
  }

  private Process execCommand(String... cmd) throws IOException, InterruptedException {
    ProcessBuilder pb = new ProcessBuilder(cmd);
    pb.redirectErrorStream(true);
    Process process = pb.start();
    process.waitFor();
    return process;
  }
}

package family.themartinez.mealplanner.scraper;

import com.google.common.base.Charsets;
import com.google.common.io.CharStreams;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import org.springframework.data.util.Pair;

public class ExternalRecipeScraper {

  private final File scrapeRecipeScript;

  private static final String PYTHON = "/usr/bin/python3";

  private static final String SCRAPER_PY = "src/main/resources/scripts/scrape_recipe.py";

  public ExternalRecipeScraper() {
    scrapeRecipeScript = new File(SCRAPER_PY);
  }

  /**
   * Tries to scrape external recipe URL and returns Pair representing exit code and output of
   * command. If exit code != 0, output string will be the error message. If exit code == 0, the
   * output is a JSON string representing the recipe data.
   */
  public Pair<Integer, String> scrapeRecipe(String recipeUrl)
      throws IOException, InterruptedException {
    Process process = execCommand(PYTHON, scrapeRecipeScript.getPath(), recipeUrl);
    String result =
        CharStreams.toString(new InputStreamReader(process.getInputStream(), Charsets.UTF_8));
    return Pair.of(process.exitValue(), result);
  }

  private Process execCommand(String... cmd) throws IOException, InterruptedException {
    ProcessBuilder pb = new ProcessBuilder(cmd);
    pb.redirectErrorStream(true);
    Process process = pb.start();
    process.waitFor();
    return process;
  }
}

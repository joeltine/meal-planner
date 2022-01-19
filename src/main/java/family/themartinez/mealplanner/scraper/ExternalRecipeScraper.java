package family.themartinez.mealplanner.scraper;

import com.google.common.base.Charsets;
import com.google.common.io.CharStreams;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.URL;
import org.springframework.data.util.Pair;

public class ExternalRecipeScraper {

  private File scrapeRecipeScript;

  private static String PYTHON = "/usr/bin/python3";

  public ExternalRecipeScraper() throws IOException {
    try {
      URL scrapeRecipePyUrl = getClass().getClassLoader().getResource("scripts/scrape_recipe.py");
      if (scrapeRecipePyUrl == null) {
        throw new IllegalArgumentException("scrape_recipe.py not found!");
      } else {
        scrapeRecipeScript = new File(scrapeRecipePyUrl.toURI());
      }
    } catch (Exception e) {
      System.out.println(e);
    }
  }

  /**
   * Tries to scrape external recipe URL and returns Pair representing exit code and output of
   * command. If exit code !=2 0, output string will be the error message. If exit code == 0, the
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

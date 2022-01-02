package family.themartinez.mealplanner.scraper;

import com.google.common.base.Charsets;
import com.google.common.io.CharStreams;
import org.springframework.core.io.ClassPathResource;
import org.springframework.data.util.Pair;

import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

public class ExternalRecipeScraper {

  /**
   * Tries to scrape external recipe URL and returns Pair representing exit code and output of
   * command. If exit code != 0, output string will be the error message. If exit code == 0, the
   * output is a JSON string representing the recipe data.
   */
  public Pair<Integer, String> scrapeRecipe(String recipeUrl)
      throws IOException, InterruptedException {
    File file = new ClassPathResource("scripts/scrape_recipe.py").getFile();
    Process process = execCommand("/usr/bin/python3", file.getPath(), recipeUrl);
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

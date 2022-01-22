package family.themartinez.mealplanner.controllers.addrecipes;

import static org.junit.jupiter.api.Assertions.assertTrue;

import family.themartinez.mealplanner.data.recipes.Recipe;
import family.themartinez.mealplanner.data.recipes.RecipeRepository;
import java.util.List;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.web.server.LocalServerPort;
import org.springframework.core.env.Environment;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.BrowserWebDriverContainer;
import org.testcontainers.junit.jupiter.Container;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("integration")
public class AddRecipesIntegrationTest {
  @Container
  public static BrowserWebDriverContainer<?> chrome =
      new BrowserWebDriverContainer<>().withCapabilities(new ChromeOptions());

  @LocalServerPort private int port;

  @Autowired private RecipeRepository recipeRepository;

  private static RemoteWebDriver driver;

  @BeforeAll
  static void beforeAll(@Autowired Environment environment) {
    org.testcontainers.Testcontainers.exposeHostPorts(
        environment.getProperty("local.server.port", Integer.class));
    chrome.start();
  }

  @AfterAll
  static void afterAll() {
    chrome.stop();
    driver.quit();
  }

  @AfterEach
  void afterEach() {
    List<Recipe> recipes = recipeRepository.findByName("Chicken chili casserole");
    recipeRepository.deleteAll(recipes);
  }

  // TODO: This test is fragile as it relies on the contents of the meal_planner_dev DB. E.g.,
  //       if "grams" unit gets deleted, this fails. Either populate the DB here or use a new
  //       mock DB.
  @Test
  void canSubmitFilledOutForm() {
    driver = chrome.getWebDriver();
    System.out.println("VNC URL is: " + chrome.getVncAddress());
    driver.get(String.format("http://host.testcontainers.internal:%d/addrecipes", port));
    // Make sure we're connected to dev DB.
    assertTrue(
        driver.findElement(By.id("devEnvironmentInfo")).getText().contains("meal_planner_dev"));
    driver.findElement(By.id("inputRecipeName")).sendKeys("Chicken chili casserole");
    driver.findElement(By.id("inputDescription")).sendKeys("Delicious chili");
    driver.findElement(By.id("inputQuantity")).sendKeys("2.5");
    new Select(driver.findElement(By.id("inputUnit"))).selectByVisibleText("grams");
    WebElement inputIngredient = driver.findElement(By.id("inputIngredient"));
    inputIngredient.sendKeys("chick");
    WebDriverWait wait = new WebDriverWait(driver, 10);
    wait.until(
        ExpectedConditions.visibilityOfElementLocated(By.className("bootstrap-autocomplete")));
    inputIngredient.sendKeys(Keys.ARROW_DOWN);
    inputIngredient.sendKeys(Keys.ENTER);
    driver.findElement(By.id("inputInstructions")).sendKeys("Do all the things");
    driver.findElement(By.id("inputPrepTime")).sendKeys("30");
    driver.findElement(By.id("inputCookTime")).sendKeys("25");
    driver.findElement(By.id("submit")).click();
    wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("toast-success")));
  }
}

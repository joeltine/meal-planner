package family.themartinez.mealplanner.controllers.addrecipes;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.testcontainers.containers.BrowserWebDriverContainer.VncRecordingMode.RECORD_FAILING;
import static org.testcontainers.shaded.org.awaitility.Awaitility.await;

import family.themartinez.mealplanner.data.recipes.Recipe;
import family.themartinez.mealplanner.data.recipes.RecipeRepository;
import java.io.File;
import java.time.Duration;
import java.util.List;
import java.util.Objects;
import java.util.concurrent.TimeUnit;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.remote.RemoteWebDriver;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.core.env.Environment;
import org.springframework.test.context.ActiveProfiles;
import org.testcontainers.containers.BrowserWebDriverContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("integration")
@Testcontainers
public class AddRecipesIntegrationTest {

  @Container
  BrowserWebDriverContainer chrome =
      new BrowserWebDriverContainer()
          .withCapabilities(new ChromeOptions())
          .withRecordingMode(RECORD_FAILING, new File("./target/"));

  @LocalServerPort private int port;

  @Autowired private RecipeRepository recipeRepository;

  private static RemoteWebDriver driver;

  @BeforeEach
  void beforeEach() {
    // TODO: Remove this when https://github.com/testcontainers/testcontainers-java/issues/5833 is
    //       fixed and present in this project. Use chrome.getWebDriver()
    //       instead.
    driver =
        await()
            .atMost(5, TimeUnit.MINUTES)
            .until(
                () -> {
                  return new RemoteWebDriver(chrome.getSeleniumAddress(), new ChromeOptions());
                },
                Objects::nonNull);
  }

  @BeforeAll
  static void beforeAll(@Autowired Environment environment) {
    org.testcontainers.Testcontainers.exposeHostPorts(
        environment.getProperty("local.server.port", Integer.class));
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
    driver.manage().window().maximize();
    driver.get(String.format("http://host.testcontainers.internal:%d/addrecipes", port));
    // Make sure we're connected to dev DB.
    assertTrue(
        driver.findElement(By.id("devEnvironmentInfo")).getText().contains("meal_planner_dev"));
    driver.findElement(By.id("inputRecipeName")).sendKeys("Chicken chili casserole");
    driver.findElement(By.id("inputDescription")).sendKeys("Delicious chili");
    driver.findElement(By.id("inputQuantity")).sendKeys("2.5");

    driver.findElement(By.id("inputUnits")).click();
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    wait.until(
        ExpectedConditions.visibilityOfElementLocated(
            By.cssSelector("ul.MuiMenu-list[aria-labelledby=\"inputUnitsLabel\"]")));
    driver
        .findElement(By.cssSelector("ul.MuiMenu-list[aria-labelledby=\"inputUnitsLabel\"]"))
        .findElement(By.xpath("//*[contains(text(),'grams')]"))
        .click();

    WebElement inputIngredient = driver.findElement(By.id("inputIngredient"));
    inputIngredient.sendKeys("chick");
    wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    wait.until(
        ExpectedConditions.textToBePresentInElementLocated(
            By.className("MuiAutocomplete-popper"), "chicken breasts"));
    driver.switchTo().activeElement().sendKeys(Keys.ARROW_DOWN);
    driver.switchTo().activeElement().sendKeys(Keys.ENTER);

    driver.findElement(By.id("inputInstructions")).sendKeys("Do all the things");
    driver.findElement(By.id("inputPrepTime")).sendKeys("30");
    driver.findElement(By.id("inputCookTime")).sendKeys("25");

    driver.findElement(By.id("inputRecipeType")).click();
    wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    wait.until(
        ExpectedConditions.visibilityOfElementLocated(
            By.cssSelector("ul.MuiMenu-list[aria-labelledby=\"inputRecipeTypeLabel\"]")));
    driver
        .findElement(By.cssSelector("ul.MuiMenu-list[aria-labelledby=\"inputRecipeTypeLabel\"]"))
        .findElement(By.xpath("//*[contains(text(),'entree')]"))
        .click();
    driver.switchTo().activeElement().sendKeys(Keys.ESCAPE);

    driver.findElement(By.id("inputMealType")).click();
    wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    wait.until(
        ExpectedConditions.visibilityOfElementLocated(
            By.cssSelector("ul.MuiMenu-list[aria-labelledby=\"inputMealTypeLabel\"]")));
    driver
        .findElement(By.cssSelector("ul.MuiMenu-list[aria-labelledby=\"inputMealTypeLabel\"]"))
        .findElement(By.xpath("//*[contains(text(),'breakfast')]"))
        .click();
    driver.switchTo().activeElement().sendKeys(Keys.ESCAPE);

    wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    wait.until(ExpectedConditions.elementToBeClickable(By.id("submit")));
    WebElement element = driver.findElement(By.id("submit"));
    // For whatever reason doing the click() in webdriver was giving me an error about element not
    // being clickable at point X, Y, so I do it in JS.
    ((JavascriptExecutor) driver)
        .executeScript("arguments[0].scrollIntoView(true); arguments[0].click();", element);

    wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("toast-success")));
  }
}

package family.themartinez.mealplanner.controllers.planner;

import com.google.common.collect.ImmutableList;
import com.google.common.collect.ImmutableMap;
import family.themartinez.mealplanner.data.recipes.Recipe;
import family.themartinez.mealplanner.data.recipes.RecipeRepository;
import java.util.Iterator;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.StringJoiner;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class PlannerController {

  @Autowired private RecipeRepository recipeRepository;
  @Autowired JdbcTemplate jdbcTemplate;

  private enum FilterTypes {
    RECIPE_TYPES("recipeTypes"),
    RECIPE_CATEGORIES("recipeCategories"),
    MEAL_TYPES("mealTypes"),
    INGREDIENTS("ingredients"),
    TOTAL_TIME("totalTime"),
    COOK_TIME("cookTime"),
    PREP_TIME("prepTime");

    private final String filterType;

    FilterTypes(String filterType) {
      this.filterType = filterType;
    }

    String getValue() {
      return this.filterType;
    }
  }

  private final ImmutableMap<String, String> constraintToSql =
      ImmutableMap.of(
          "includes", "=",
          "doesNotInclude", "!=",
          ">", ">",
          "<", "<",
          "=", "=");

  private final ImmutableMap<String, String> operatorToSql =
      ImmutableMap.of(
          "OR", "OR",
          "AND", "AND");

  @GetMapping({"/", "/planner"})
  public String getPlannerPage() {
    return "planner/planner";
  }

  @PostMapping({"/getMealPlan"})
  public @ResponseBody ImmutableList<Recipe> getMealPlan(@RequestBody MealPlanRequest request) {
    StringJoiner query = new StringJoiner(" ");
    query.add("SELECT r.id");
    query.add("FROM recipes r");
    query.add("INNER JOIN meal_type_associations mta on r.id = mta.recipe_id");
    query.add("INNER JOIN meal_types mt on mta.meal_type_id = mt.id");
    query.add("INNER JOIN recipe_category_associations rca on r.id = rca.recipe_id");
    query.add("INNER JOIN recipe_categories rc on rca.recipe_category_id = rc.id");
    query.add("INNER JOIN recipe_type_associations rta on r.id = rta.recipe_id");
    query.add("INNER JOIN recipe_types rt on rta.recipe_type_id = rt.id");
    query.add("INNER JOIN ingredient_lists il on r.id = il.recipe_id");
    query.add("INNER JOIN ingredients i on il.ingredient_id = i.id");
    query.add(buildWhereClause(request));
    query.add("GROUP BY r.id");
    // TODO: Is there a better way to return recipes besides randomly?
    query.add("ORDER BY RAND()");
    query.add("LIMIT ?");

    List<Integer> values =
        request.getFilters().stream().map(Filter::getValue).collect(Collectors.toList());
    values.add(request.getNumRecipes());

    List<Integer> recipeIds =
        jdbcTemplate.queryForList(query.toString(), Integer.class, values.toArray());

    return ImmutableList.copyOf(recipeRepository.findAllById(recipeIds));
  }

  private String buildWhereClause(MealPlanRequest request) {
    String operator = request.getFilterLogicalOperator();
    if (!operatorToSql.containsKey(operator)) {
      throw new NoSuchElementException(
          String.format(
              "Unsupported SQL operator '%s' building meal planner where clause.", operator));
    }
    String operatorSql = operatorToSql.get(operator);

    StringJoiner whereClause = new StringJoiner(" ");
    whereClause.add("WHERE");

    Iterator<Filter> filters = request.getFilters().iterator();
    while (filters.hasNext()) {
      Filter filter = filters.next();

      if (!constraintToSql.containsKey(filter.getConstraint())) {
        throw new NoSuchElementException(
            String.format(
                "Unsupported constraint '%s' in building meal planner where clause.",
                filter.getConstraint()));
      }

      String constraintSql = constraintToSql.get(filter.getConstraint());

      if (filter.getFilterType().equals(FilterTypes.RECIPE_TYPES.getValue())) {
        whereClause.add("rt.id " + constraintSql + " ?");
      } else if (filter.getFilterType().equals(FilterTypes.RECIPE_CATEGORIES.getValue())) {
        whereClause.add("rc.id " + constraintSql + " ?");
      } else if (filter.getFilterType().equals(FilterTypes.MEAL_TYPES.getValue())) {
        whereClause.add("mt.id " + constraintSql + " ?");
      } else if (filter.getFilterType().equals(FilterTypes.INGREDIENTS.getValue())) {
        whereClause.add("i.id " + constraintSql + " ?");
      } else if (filter.getFilterType().equals(FilterTypes.COOK_TIME.getValue())) {
        whereClause.add("r.cook_time_min " + constraintSql + " ?");
      } else if (filter.getFilterType().equals(FilterTypes.PREP_TIME.getValue())) {
        whereClause.add("r.prep_time_min " + constraintSql + " ?");
      } else if (filter.getFilterType().equals(FilterTypes.TOTAL_TIME.getValue())) {
        whereClause.add("(r.prep_time_min + r.cook_time_min) " + constraintSql + " ?");
      }

      if (filters.hasNext()) {
        whereClause.add(operatorSql);
      }
    }

    return whereClause.toString();
  }
}

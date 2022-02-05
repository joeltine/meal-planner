package family.themartinez.mealplanner.controllers.planner;

import java.util.List;

public class MealPlanRequest {
  private Integer numRecipes;

  private String filterLogicalOperator;

  private List<Filter> filters;

  public Integer getNumRecipes() {
    return numRecipes;
  }

  public void setNumRecipes(Integer numRecipes) {
    this.numRecipes = numRecipes;
  }

  public String getFilterLogicalOperator() {
    return filterLogicalOperator;
  }

  public void setFilterLogicalOperator(String filterLogicalOperator) {
    this.filterLogicalOperator = filterLogicalOperator;
  }

  public List<Filter> getFilters() {
    return filters;
  }

  public void setFilters(List<Filter> filters) {
    this.filters = filters;
  }
}

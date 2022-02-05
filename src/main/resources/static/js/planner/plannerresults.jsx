import React from "react";

export class PlannerResults extends React.Component {
  constructor(props) {
    super(props);
  }

  buildIngredientsList(ingredientLists) {
    const listItems = [];

    for (const ingredientListItem of ingredientLists) {
      const ingredient = ingredientListItem.ingredient;
      const unit = ingredientListItem.unit.name;

      listItems.push(
          <li key={`${ingredient.id}-${ingredientListItem.id}`}>
            {`${ingredientListItem.quantity} ${unit} ${ingredient.displayName
            || ingredient.name}`}
          </li>
      );
    }

    return (<ul>{listItems}</ul>);
  }

  maybeGetDescription(recipe) {
    if (!recipe.description) {
      return;
    }

    return (
        <React.Fragment>
          <div className="row">
            <h6>Description</h6>
          </div>
          <div className="row mb-2">
            <div className="col text-newlines">
              {recipe.description}
            </div>
          </div>
        </React.Fragment>
    );
  }

  getEmptyResultOutput() {
    return (
        <div className="jumbotron mt-3">
          <h1 className="display-5">No recipes found!</h1>
          <p className="lead">
            No recipes were found matching your given criteria. Try removing
            some filters or use less restrictive conditions.
          </p>
          <hr className="my-4"/>
          <p>
            Try again:
          </p>
          <button className="btn btn-primary btn-lg" role="button"
                  onClick={this.props.goBackButtonClick}>
            Go Back
          </button>
        </div>
    );
  }

  getResultButtons() {
    return (
        <div className="container" key="buttons">
          <div className="row">
            <button className="btn btn-primary"
                    onClick={this.props.goBackButtonClick}>
              Go Back
            </button>
            <button className="btn btn-primary ml-2">
              Export to Google Docs
            </button>
          </div>
        </div>
    );
  }

  buildResultOutput() {
    if (!this.props.results || !this.props.results.length) {
      return this.getEmptyResultOutput();
    }

    const recipeContainers = [this.getResultButtons()];

    for (const recipe of this.props.results) {
      recipeContainers.push(
          <div key={recipe.id}
               className="container mb-4 mt-4">
            <div className="row">
              <h4>{recipe.name}</h4>
            </div>
            <div className="row mb-2">
              <a target="_blank"
                 href={recipe.externalLink}>{recipe.externalLink}</a>
            </div>
            <div className="row">
              <h6>Time Requirements</h6>
            </div>
            <div className="row mb-2">
              <div className="col">
                <strong>Prep Time (min):&nbsp;</strong>
                {recipe.prepTimeMin},&nbsp;
                <strong>Cook Time (min):&nbsp;</strong>
                {recipe.cookTimeMin}
              </div>
            </div>
            <div className="row">
              <h6>Ingredients</h6>
            </div>
            <div className="row mb-2">
              <div className="col">
                {this.buildIngredientsList(recipe.ingredientLists)}
              </div>
            </div>
            <div className="row">
              <h6>Instructions</h6>
            </div>
            <div className="row mb-2">
              <div className="col text-newlines">
                {recipe.instructions}
              </div>
            </div>
            {this.maybeGetDescription(recipe)}
            <hr/>
          </div>
      );
    }

    return recipeContainers;
  }

  render() {
    return (
        <div>
          {this.buildResultOutput()}
        </div>
    );
  }
}

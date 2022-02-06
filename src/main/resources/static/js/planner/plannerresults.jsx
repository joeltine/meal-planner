import React from "react";

import {Toast} from "../toasts/toast";
import {GoogleDocsClient} from "./googledocsclient";

export class PlannerResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isSignedIn: false};
    this.exportToDocs = this.exportToDocs.bind(this);
    this.authenticateToGoogle = this.authenticateToGoogle.bind(this);
  }

  getDocsClient() {
    return new Promise(function (resolve, reject) {
      GAPI_CLIENT_READY.then(() => {
        resolve(new GoogleDocsClient());
      });
    });
  }

  componentDidMount() {
    if (!GAPI_CLIENT_READY) {
      Toast.showNewErrorToast('The gapi client wasn\'t initialized!',
          'The gapi client wasn\'t initialized before trying to use the Meal Planner result page.',
          {autohide: false});
      return;
    }

    GAPI_CLIENT_READY.then(() => {
      this.updateSignInStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
      gapi.auth2.getAuthInstance().isSignedIn.listen(
          this.updateSignInStatus.bind(this));
    }).catch((err) => {
      Toast.showNewErrorToast('The gapi client failed to initialize!',
          `An error occurred initializing the gapi client: ${JSON.stringify(
              err)}`,
          {autohide: false});
    });
  }

  authenticateToGoogle() {
    GAPI_CLIENT_READY.then(() => {
      gapi.auth2.getAuthInstance().signIn().then(() => {
        const profile = gapi.auth2.getAuthInstance().currentUser.get().getBasicProfile();
        Toast.showNewSuccessToast('Authentication Successful!',
            `Successfully authenticated ${profile.getName()} using account ${profile.getEmail()}.`);
      }).catch((err) => {
        Toast.showNewErrorToast(
            `Failed to authenticate!', 'Failed to sign-in to Google: ${JSON.stringify(
                err)}`, {delay: 10000});
      });
    });
  }

  exportToDocs() {
    this.getDocsClient().then((client) => {
      client.createNewMealPlanDoc(this.props.results).then((newDoc) => {
        console.log('Meal Plan created');
        console.log(newDoc);
      });
    }).catch(console.error);
  }

  updateSignInStatus(isSignedIn) {
    this.setState({
      isSignedIn: isSignedIn
    });
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

  getExportButton() {
    return this.state.isSignedIn ?
        <button
            className="btn btn-primary ml-2"
            onClick={this.exportToDocs}>
          Export to Google Docs
        </button> :
        <button className="btn btn-warning ml-2"
                onClick={this.authenticateToGoogle}>
          Sign-in to Export to Google Docs
        </button>;
  }

  getResultButtons() {
    return (
        <div className="container-fluid" key="buttons">
          <div className="row">
            <button className="btn btn-danger"
                    onClick={this.props.goBackButtonClick}>
              Go Back
            </button>
            {this.getExportButton()}
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
               className="container-fluid mb-4 mt-4">
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

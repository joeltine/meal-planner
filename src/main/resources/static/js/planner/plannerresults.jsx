import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import LoginIcon from '@mui/icons-material/Login';
import RefreshIcon from '@mui/icons-material/Refresh';
import {IconButton, LinearProgress} from '@mui/material';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React from 'react';
import {renderToString} from 'react-dom/server';

import {Toast} from '../toasts/toast';
import {GoogleDriveUploader} from './googledriveuploader';

export class PlannerResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isSignedIn: false, isExportingDoc: false};
    this.exportToDocs = this.exportToDocs.bind(this);
    this.authenticateToGoogle = this.authenticateToGoogle.bind(this);
  }

  componentDidMount() {
    if (!GAPI_CLIENT_READY) {
      Toast.showNewErrorToast('The gapi client wasn\'t initialized!',
          'The gapi client wasn\'t initialized before trying to use ' +
          'the Meal Planner result page.',
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
        const profile = gapi.auth2.getAuthInstance().currentUser.get()
            .getBasicProfile();
        Toast.showNewSuccessToast('Authentication Successful!',
            `Successfully authenticated ${profile.getName()} using ` +
            `account ${profile.getEmail()}.`);
      }).catch((err) => {
        Toast.showNewErrorToast(
            'Failed to authenticate!',
            `Failed to sign-in to Google: ${JSON.stringify(err)}`,
            {delay: 10000});
      });
    });
  }

  buildGroceryList() {
    const groceries = {};
    const groceryItems = [];

    for (const recipe of this.props.results) {
      for (const ingredientListItem of recipe.ingredientLists) {
        const ingredient = ingredientListItem.ingredient;
        // Right now, you can technically have multiple lines of the same
        // ingredient with different unit types (e.g., 1 ounce chicken AND
        // 2 pounds chicken), so we key on unit id as well.
        const key = `${ingredient.id}-${ingredientListItem.unit.id}`;
        if (!groceries[key]) {
          groceries[key] = {
            quantity: 0,
            unit: ingredientListItem.unit.name,
            displayName: ingredient.displayName || ingredient.name
          };
        }
        groceries[key].quantity += ingredientListItem.quantity;
      }
    }

    for (const id in groceries) {
      const grocery = groceries[id];
      groceryItems.push(
          <li key={id}>
            {`${grocery.quantity} ${grocery.unit} ${grocery.displayName}`}
          </li>
      );
    }

    return (
        <section key="groceryList">
          <h1>Grocery List</h1>
          <ul>{groceryItems}</ul>
          <hr/>
        </section>
    );
  }

  buildSimplifiedResultHtmlForGoogleDocs() {
    const results = [this.buildGroceryList()];

    for (const recipe of this.props.results) {
      results.push(
          <section key={recipe.id}>
            <h1>{recipe.name}</h1>
            <a href={recipe.externalLink}>{recipe.externalLink}</a>
            <h2>Time Requirements</h2>
            <p>
              <strong>Prep Time (min):&nbsp;</strong>
              {recipe.prepTimeMin},&nbsp;
              <strong>Cook Time (min):&nbsp;</strong>
              {recipe.cookTimeMin}
            </p>
            <h2>Ingredients</h2>
            {this.buildIngredientsList(recipe.ingredientLists)}
            <h2>Instructions</h2>
            <pre style={{fontFamily: 'Arial'}}>{recipe.instructions}</pre>
            {recipe.description &&
                <React.Fragment>
                  <h2>Description</h2>
                  <pre style={{fontFamily: 'Arial'}}>{recipe.description}</pre>
                </React.Fragment>}
            <hr/>
          </section>
      );
    }

    return renderToString(
        <React.Fragment>
          <title>Test Document</title>
          <main>{results}</main>
        </React.Fragment>
    );
  }

  exportToDocs() {
    this.setState({
      isExportingDoc: true
    });
    GAPI_CLIENT_READY.then(() => {
      const uploader = new GoogleDriveUploader({
        file: new Blob([this.buildSimplifiedResultHtmlForGoogleDocs()],
            {'type': 'text/html'}),
        metadata: {
          name: `Meal Plan for ${new Date().toLocaleDateString()}`,
          mimeType: 'application/vnd.google-apps.document'
        },
        token: gapi.client.getToken().access_token,
        onComplete: (response) => {
          const docInfo = JSON.parse(response);
          Toast.showNewSuccessToast('Google Doc Successfully Created!',
              'Successfully uploaded <a target="_blank" ' +
              `href="${this.buildGoogleDocUrl(docInfo.id)}">${docInfo.name}` +
              '</a> to Google Docs.',
              {delay: 20000});
          this.setState({
            isExportingDoc: false
          });
        },
        onError: (error) => {
          Toast.showNewErrorToast(
              'Failed to create Google Doc!',
              'Request to upload file to Google Drive/Docs failed: ' +
              `${JSON.stringify(error)}}`, {autohide: false});
          this.setState({
            isExportingDoc: false
          });
        }
      });
      uploader.upload();
    });
  }

  buildGoogleDocUrl(docId) {
    return `https://docs.google.com/document/d/${docId}/edit`;
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
            {`${ingredientListItem.quantity} ${unit} ${ingredient.displayName ||
            ingredient.name}`}
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
        <div className="p-5 mb-4 bg-light rounded-3">
          <div className="container-fluid py-5">
            <h1 className="display-5 fw-bold">No recipes found!</h1>
            <p className="col-md-8 fs-4">
              No recipes were found matching your given criteria. Try removing
              some filters or use less restrictive conditions.
            </p>
            <Button variant="contained" size="large"
                    onClick={this.props.goBackButtonClick}>
              Go Back
            </Button>
          </div>
        </div>
    );
  }

  getExportButton() {
    return this.state.isSignedIn ?
        <Button variant="contained"
                startIcon={<FileUploadIcon/>}
                onClick={this.exportToDocs}
                disabled={this.state.isExportingDoc}>
          Export to Google Docs
        </Button> :
        <Button variant="contained"
                color="secondary"
                startIcon={<LoginIcon/>}
                onClick={this.authenticateToGoogle}>
          Sign-in to Export to Google Docs
        </Button>;
  }

  getResultButtons() {
    return (
        <div className="container-fluid" key="buttons">
          <div className="row">
            <div className="col-md-12 pb-3">
              {this.state.isExportingDoc && <LinearProgress/>}
            </div>
          </div>
          <div className="row g-3">
            <div className="col-md-auto ps-0">
              <Button variant="contained"
                      startIcon={<ArrowBackIcon/>}
                      disabled={this.state.isExportingDoc}
                      onClick={this.props.goBackButtonClick}>
                Go Back
              </Button>
            </div>
            <div className="col-md-auto ps-0">
              {this.getExportButton()}
            </div>
          </div>
        </div>
    );
  }

  buildResultOutput() {
    const recipeContainers = [];

    for (const recipe of this.props.results) {
      recipeContainers.push(
          <div key={recipe.id}
               className="container-fluid mb-4 mt-4">
            <div className="row">
              <h4>
                {recipe.name}
                <IconButton aria-label="replace recipe"
                            title="Replace this recipe"
                            onClick={() => {
                              this.props.replaceSingleRecipe(recipe.id);
                            }}>
                  <RefreshIcon/>
                </IconButton>
              </h4>
            </div>
            <div className="row mb-2">
              <a target="_blank"
                 href={recipe.externalLink}
                 rel="noreferrer">{recipe.externalLink}</a>
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
    let output;
    if (!this.props.results || !this.props.results.length) {
      output = this.getEmptyResultOutput();
    } else {
      output = [this.getResultButtons()];
      output.push(
          <div key="recipeHtmlContainer">
            {this.buildResultOutput()}
          </div>
      );
    }

    return output;
  }
}

PlannerResults.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
  goBackButtonClick: PropTypes.func.isRequired,
  replaceSingleRecipe: PropTypes.func.isRequired
};

import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import RefreshIcon from '@mui/icons-material/Refresh';
import {IconButton, LinearProgress} from '@mui/material';
import Button from '@mui/material/Button';
import PropTypes from 'prop-types';
import React from 'react';
import {renderToString} from 'react-dom/server';

import {Toast} from '../toasts/toast';
import {GoogleDriveUploader} from './googledriveuploader';

const CLIENT_ID = '104092167699-bhdgbdqd0ntudhhhqt8qq06l601v9dvj.apps' +
    '.googleusercontent.com';
const TOKEN_LOCAL_STORAGE_KEY = 'googleAccessToken';

export class PlannerResults extends React.Component {
  constructor(props) {
    super(props);
    this.state = {isExportingDoc: false};
    this.exportToDocs = this.exportToDocs.bind(this);
    this.accessTokenObj = null;
    const localTokenObj = localStorage.getItem(TOKEN_LOCAL_STORAGE_KEY);
    if (localTokenObj) {
      this.accessTokenObj = JSON.parse(localTokenObj);
    }
  }

  getAccessToken() {
    // If we already have a token and it's fresh, use it.
    if (this.accessTokenObj && this.accessTokenObj.expires_at > Date.now()) {
      return Promise.resolve(this.accessTokenObj.access_token);
    }

    const tokenPromise = new Promise((resolve) => {
      // Get Google Identity Service client, with required Google Drive
      // permissions/scope.
      const gisClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: 'https://www.googleapis.com/auth/drive',
        callback: (tokenResponse) => {
          // Set an Unix epoch millisecond expiration time in the future,
          // subtracting 10s from expires_in (in seconds) to be conservative.
          tokenResponse.expires_at = Date.now() + ((tokenResponse.expires_in -
              10) * 1000);
          // Cache the token info so we can use it on the next load.
          localStorage.setItem(TOKEN_LOCAL_STORAGE_KEY,
              JSON.stringify(tokenResponse));
          this.accessTokenObj = tokenResponse;
          resolve(tokenResponse.access_token);
        }
      });

      gisClient.requestAccessToken();
    });

    return tokenPromise;
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
    this.getAccessToken().then((token) => {
      const uploader = new GoogleDriveUploader({
        file: new Blob([this.buildSimplifiedResultHtmlForGoogleDocs()],
            {'type': 'text/html'}),
        metadata: {
          name: `Meal Plan for ${new Date().toLocaleDateString()}`,
          mimeType: 'application/vnd.google-apps.document'
        },
        token: token,
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
    }, () => {
      this.setState({
        isExportingDoc: false
      });
    });
  }

  buildGoogleDocUrl(docId) {
    return `https://docs.google.com/document/d/${docId}/edit`;
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
    return (
        <Button variant="contained"
                startIcon={<FileUploadIcon/>}
                onClick={this.exportToDocs}
                disabled={this.state.isExportingDoc}>
          Export to Google Docs
        </Button>);
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

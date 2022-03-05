import React from 'react';

import {sendAjax} from '../common/ajax';
import {cloneObject} from '../common/utils';
import {Toast} from '../toasts/toast';
import {PlannerForm} from './plannerform';
import {PlannerResults} from './plannerresults';

const RenderModes = {
  FORM: 'FORM',
  RESULTS: 'RESULTS'
};

export class MealPlanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      renderMode: RenderModes.FORM,
      resultData: [],
      plannerFormData: {}
    };
    this.onPlanButtonClick = this.onPlanButtonClick.bind(this);
    this.goToForm = this.goToForm.bind(this);
    this.replaceSingleRecipe = this.replaceSingleRecipe.bind(this);
  }

  goToForm() {
    this.setState({
      renderMode: RenderModes.FORM
    });
  }

  replaceSingleRecipe(toBeReplacedId) {
    // Get the current recipe constraint query, but set to only return 1 result.
    const newFormData = cloneObject(this.state.plannerFormData);
    newFormData.numRecipes = '1';

    // Get list of current recipe ids that aren't the id to be replaced, so we
    // can ensure they're not returned as the replacement recipe.
    const currIds = this.state.resultData.map((recipe) => recipe.id);
    const toBeReplacedIndex = currIds.indexOf(toBeReplacedId);
    currIds.splice(toBeReplacedIndex, 1);

    sendAjax(`/getMealPlan?excludeRecipes=${currIds.join(',')}`, {
      method: 'POST',
      data: JSON.stringify(newFormData),
      processData: false,
      contentType: 'application/json'
    }).done((results) => {
      if (results && results.length) {
        this.state.resultData.splice(toBeReplacedIndex, 1, results[0]);
        this.setState({
          resultData: this.state.resultData,
          renderMode: RenderModes.RESULTS
        });
      } else {
        const toBeReplacedRecipe = this.state.resultData[toBeReplacedIndex];
        Toast.showNewInfoToast('Failed to replace recipe',
            'There are no eligible recipes to replace ' +
            `"${toBeReplacedRecipe.name}" given the current constraints.`,
            {delay: 7000});
      }
    });
  }

  onPlanButtonClick(plannerFormData) {
    sendAjax('/getMealPlan', {
      method: 'POST',
      data: JSON.stringify(plannerFormData),
      processData: false,
      contentType: 'application/json'
    }).done((results) => {
      this.setState({
        resultData: results,
        renderMode: RenderModes.RESULTS,
        plannerFormData: plannerFormData
      });
    });
  }

  render() {
    return (
        <React.Fragment>
          {this.state.renderMode === RenderModes.RESULTS &&
              <PlannerResults
                  results={this.state.resultData}
                  goBackButtonClick={this.goToForm}
                  replaceSingleRecipe={this.replaceSingleRecipe}/>}
          <div className={this.state.renderMode === RenderModes.FORM ? '' :
              'd-none'}>
            <PlannerForm onPlanButtonClick={this.onPlanButtonClick}/>
          </div>
        </React.Fragment>
    );
  }
}

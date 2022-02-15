import React from 'react';

import {PlannerForm} from './plannerform';
import {PlannerResults} from './plannerresults';

const RenderModes = {
  FORM: 'FORM',
  RESULTS: 'RESULTS'
};

export class MealPlanner extends React.Component {
  constructor(props) {
    super(props);
    this.state = {renderMode: RenderModes.FORM, resultData: []};
    this.onResultUpdate = this.onResultUpdate.bind(this);
    this.goToForm = this.goToForm.bind(this);
  }

  goToForm() {
    this.setState({
      renderMode: RenderModes.FORM
    });
  }

  onResultUpdate(results) {
    this.setState({
      resultData: results,
      renderMode: RenderModes.RESULTS
    });
  }

  render() {
    return (
        <React.Fragment>
          {this.state.renderMode === RenderModes.RESULTS &&
              <PlannerResults
                  results={this.state.resultData}
                  goBackButtonClick={this.goToForm}/>}
          <div className={this.state.renderMode === RenderModes.FORM ? ''
              : 'd-none'}>
            <PlannerForm onResultUpdate={this.onResultUpdate}/>
          </div>
        </React.Fragment>
    );
  }
}

import PropTypes from "prop-types";
import React from "react";

import {sendAjax} from "../common/ajax";
import {FilterAnyAll} from "./filteranyall";
import {FilterRow} from "./filterrow";
import {NumRecipes} from "./numrecipes";
import {PlanButton} from "./planbutton";

let FILTER_ROW_ID = 0;

export class PlannerForm extends React.Component {
  constructor(props) {
    super(props);
    this.numRecipeRef = React.createRef();
    this.filterAnyAllRef = React.createRef();
    this.formRef = React.createRef();
    this.rowRefs = {};
    this.state = {filterRows: [FILTER_ROW_ID]};
    this.addFilterRow = this.addFilterRow.bind(this);
    this.removeFilterRow = this.removeFilterRow.bind(this);
    this.onPlanButtonClick = this.onPlanButtonClick.bind(this);
  }

  onPlanButtonClick() {
    this.formRef.current.classList.add('was-validated');
    if (this.formRef.current.checkValidity()) {
      const planObj = {};
      planObj.numRecipes = this.numRecipeRef.current.getValue();
      planObj.filterLogicalOperator = this.filterAnyAllRef.current.getValue();
      planObj.filters = [];
      Object.values(this.rowRefs).forEach((ref) => {
        planObj.filters.push(ref.getRowData());
      });

      sendAjax('/getMealPlan', {
        method: 'POST',
        data: JSON.stringify(planObj),
        processData: false,
        contentType: 'application/json'
      }).done((results) => {
        this.props.onResultUpdate(results);
      });
    }
  }

  addFilterRow() {
    const filterRows = this.state.filterRows;
    filterRows.push(++FILTER_ROW_ID);
    this.setState({
      filterRows: filterRows
    });
  }

  removeFilterRow(identifier) {
    const filterRows = this.state.filterRows;
    if (filterRows.length > 1) {
      delete this.rowRefs[identifier];
      filterRows.splice(filterRows.indexOf(identifier), 1);
      this.setState({
        filterRows: filterRows
      });
    }
  }

  renderFilterRows() {
    const rows = [];
    for (let i = 0; i < this.state.filterRows.length; i++) {
      const rowId = this.state.filterRows[i];
      rows.push(
          <FilterRow
              ref={(ref) => {
                // React calls this with null sometimes:
                // https://github.com/facebook/react/issues/9328
                if (ref != null) {
                  this.rowRefs[rowId] = ref;
                }
              }}
              key={rowId}
              identifier={rowId}
              addRowClick={this.addFilterRow}
              removeRowClick={this.removeFilterRow}/>
      );
    }
    return rows;
  }

  render() {
    return (
        <form ref={this.formRef} className="container-fluid p-0">
          <h5>Number of recipes</h5>
          <div className="row">
            <NumRecipes ref={this.numRecipeRef}/>
          </div>
          <h5>Constraints</h5>
          <div className="row border rounded pt-3 pb-3 me-0 ms-0">
            <div className="col-md-12">
              <div className="row">
                <FilterAnyAll ref={this.filterAnyAllRef}/>
              </div>
              {this.renderFilterRows()}
            </div>
          </div>
          <div className="row pt-2">
            <div className="col-md-12">
              <PlanButton onButtonClick={this.onPlanButtonClick}/>
            </div>
          </div>
        </form>
    );
  }
}

PlannerForm.propTypes = {
  onResultUpdate: PropTypes.func.isRequired
};

import React from 'react';
import ReactDOM from 'react-dom';

import {CommonController} from '../common/common';
import {DataTable} from '../datatable/datatable';

class MealTypeEditor extends React.Component {
  constructor(props) {
    super(props);
    new CommonController();
  }

  render() {
    return (
        <DataTable dataSource="/mealTypes"/>
    );
  }
}

ReactDOM.render(
    <React.StrictMode>
      <MealTypeEditor/>
    </React.StrictMode>,
    document.getElementById('mealTypeEditor'));

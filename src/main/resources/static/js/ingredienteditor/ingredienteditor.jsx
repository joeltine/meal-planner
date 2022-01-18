import React from 'react';
import ReactDOM from 'react-dom';

import {CommonController} from '../common/common';
import {DataTable} from '../datatable/datatable';

class IngredientEditor extends React.Component {
  constructor(props) {
    super(props);
    new CommonController();
  }

  render() {
    return (
        <DataTable dataSource="/ingredients"/>
    );
  }
}

ReactDOM.render(
    <React.StrictMode>
      <IngredientEditor/>
    </React.StrictMode>,
    document.getElementById('ingredientEditor'));

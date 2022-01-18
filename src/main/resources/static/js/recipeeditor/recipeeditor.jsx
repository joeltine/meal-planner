import React from 'react';
import ReactDOM from 'react-dom';

import {CommonController} from '../common/common';
import {DataTable} from '../datatable/datatable';

class RecipeEditor extends React.Component {
  constructor(props) {
    super(props);
    new CommonController();
  }

  render() {
    return (
        <DataTable dataSource="/recipes"/>
    );
  }
}

ReactDOM.render(
    <React.StrictMode>
      <RecipeEditor/>
    </React.StrictMode>,
    document.getElementById('recipeEditor'));

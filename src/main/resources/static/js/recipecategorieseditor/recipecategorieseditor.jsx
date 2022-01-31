import React from 'react';
import ReactDOM from 'react-dom';

import {CommonController} from '../common/common';
import {DataTable} from '../datatable/datatable';

class RecipeCategoriesEditor extends React.Component {
  constructor(props) {
    super(props);
    new CommonController();
  }

  render() {
    return (
        <DataTable dataSource="/recipeCategories"/>
    );
  }
}

ReactDOM.render(
    <React.StrictMode>
      <RecipeCategoriesEditor/>
    </React.StrictMode>,
    document.getElementById('recipeCategoriesEditor'));

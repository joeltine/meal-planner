import React from 'react';
import ReactDOM from 'react-dom';

import {CommonController} from '../common/common';
import {DataTable} from '../datatable/datatable';

class RecipeTypeEditor extends React.Component {
  constructor(props) {
    super(props);
    new CommonController();
  }

  render() {
    return (
        <DataTable dataSource="/recipeTypes"/>
    );
  }
}

ReactDOM.render(
    <React.StrictMode>
      <RecipeTypeEditor/>
    </React.StrictMode>,
    document.getElementById('recipeTypeEditor'));

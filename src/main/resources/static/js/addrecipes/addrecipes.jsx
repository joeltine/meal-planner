import React from 'react';
import ReactDOM from 'react-dom';

import {CommonController} from '../common/common';
import {AddRecipesController} from './addrecipescontroller';

new CommonController();

ReactDOM.render(
    <React.StrictMode>
      <AddRecipesController/>
    </React.StrictMode>,
    document.getElementById('addRecipes'));

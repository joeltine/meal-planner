import '../../css/planner/mealplanner.css';

import React from 'react';
import ReactDOM from 'react-dom';

import {CommonController} from '../common/common';
import {MealPlanner} from './mealplanner';

new CommonController();

ReactDOM.render(
    <React.StrictMode>
      <MealPlanner/>
    </React.StrictMode>,
    document.getElementById('mealPlanner'));

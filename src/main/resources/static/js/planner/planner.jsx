import React from "react";
import ReactDOM from "react-dom";
import {MealPlanner} from "./mealplanner";
import {CommonController} from "../common/common";

new CommonController();

ReactDOM.render(
    <React.StrictMode>
      <MealPlanner/>
    </React.StrictMode>,
    document.getElementById('mealPlanner'));

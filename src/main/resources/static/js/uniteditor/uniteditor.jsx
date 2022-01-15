import React from 'react';
import ReactDOM from 'react-dom';

import {CommonController} from "../common/common";

class UnitEditorComponent extends React.Component {

  render() {
    return <div>Hello World</div>;
  }
}

new CommonController();

ReactDOM.render(
    <React.StrictMode>
      <UnitEditorComponent/>
    </React.StrictMode>,
    document.getElementById('unitEditor'));

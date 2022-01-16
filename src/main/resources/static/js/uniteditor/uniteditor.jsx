import React from 'react';
import ReactDOM from 'react-dom';

import {CommonController} from '../common/common';
import {DataTable} from '../datatable/datatable';

class UnitEditor extends React.Component {
  constructor(props) {
    super(props);
    new CommonController();
  }

  render() {
    return (
        <DataTable/>
    );
  }
}

ReactDOM.render(
    <React.StrictMode>
      <UnitEditor/>
    </React.StrictMode>,
    document.getElementById('unitEditor'));

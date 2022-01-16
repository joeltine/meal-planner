import React from 'react';
import {SearchBox} from './searchbox';
import {AddButton} from './addbutton';
import {DeleteButton} from './deletebutton';
import {Table} from "./table";
import {Pagination} from "./pagination";

export class DataTable extends React.Component {
  render() {
    return (
        <div className="container">
          <div className="row pb-3">
            <div className="col">
              <SearchBox/>
            </div>
            <div className="col-auto">
              <AddButton/>
            </div>
            <div className="col-auto">
              <DeleteButton/>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Table/>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Pagination/>
            </div>
          </div>
        </div>
    );
  }
}

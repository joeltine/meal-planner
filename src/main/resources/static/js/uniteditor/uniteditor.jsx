import React from 'react';
import ReactDOM from 'react-dom';

import {CommonController} from "../common/common";

class UnitEditorComponent extends React.Component {

  render() {
    return (
        <div className="container">
          <div className="row">
            <div className="col">
              <div className="input-group mb-3">
                <input type="text" className="form-control"
                       placeholder="Search..."/>
                <div className="input-group-append">
                  <button className="btn btn-primary" type="button" id="search">
                    Search
                  </button>
                </div>
              </div>
            </div>
            <div className="col-auto">
              <button type="button" className="btn btn-success">
                <svg className="feather mr-1" viewBox="0 0 24 24">
                  <use href="#icon-plus"/>
                </svg>
                Add New Row
              </button>
              <button type="button" className="btn btn-danger ml-3">
                <svg className="feather mr-1" viewBox="0 0 24 24">
                  <use href="#icon-trash"/>
                </svg>
                Delete Selected
              </button>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <table className="table table-bordered table-hover datatable">
                <thead>
                <tr>
                  <th scope="col">Id
                    <svg className="feather"
                         viewBox="0 0 24 24">
                      <use href="#icon-chevron-up"/>
                    </svg>
                  </th>
                  <th scope="col">First
                    <svg className="feather"
                         viewBox="0 0 24 24">
                      <use href="#icon-chevron-up-down"/>
                    </svg>
                  </th>
                  <th scope="col">Last
                    <svg className="feather"
                         viewBox="0 0 24 24">
                      <use href="#icon-chevron-up-down"/>
                    </svg>
                  </th>
                  <th scope="col">Handle
                    <svg className="feather"
                         viewBox="0 0 24 24">
                      <use href="#icon-chevron-up-down"/>
                    </svg>
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr>
                  <th scope="row">1</th>
                  <td>Mark</td>
                  <td>Otto</td>
                  <td>@mdo</td>
                </tr>
                <tr>
                  <th scope="row">2</th>
                  <td>Jacob</td>
                  <td>Thornton</td>
                  <td>@fat</td>
                </tr>
                <tr>
                  <th scope="row">3</th>
                  <td>Larry</td>
                  <td>Bird</td>
                  <td>@twitter</td>
                </tr>
                </tbody>
                <tfoot>
                <tr>
                  <th scope="col">Id</th>
                  <th scope="col">First</th>
                  <th scope="col">Last</th>
                  <th scope="col">Handle</th>
                </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <nav aria-label="Page navigation example">
                <ul className="pagination">
                  <li className="page-item"><a className="page-link"
                                               href="#">Previous</a></li>
                  <li className="page-item"><a className="page-link"
                                               href="#">1</a>
                  </li>
                  <li className="page-item"><a className="page-link"
                                               href="#">2</a>
                  </li>
                  <li className="page-item"><a className="page-link"
                                               href="#">3</a>
                  </li>
                  <li className="page-item"><a className="page-link"
                                               href="#">Next</a></li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
    );
  }
}

new CommonController();

ReactDOM.render(
    <React.StrictMode>
      <UnitEditorComponent/>
    </React.StrictMode>,
    document.getElementById('unitEditor'));

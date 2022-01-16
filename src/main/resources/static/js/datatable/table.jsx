import React from 'react';

export class Table extends React.Component {
  render() {
    return (
        <table className="table table-bordered table-hover datatable">
          <thead className="thead-dark">
          <tr>
            <th scope="col">Id
              <svg className="feather"
                   viewBox="0 0 24 24">
                <use href="#icon-chevron-up-down"/>
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
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>Bird</td>
            <td>@twitter</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>Bird</td>
            <td>@twitter</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>Bird</td>
            <td>@twitter</td>
          </tr>
          <tr>
            <th scope="row">3</th>
            <td>Larry</td>
            <td>Bird</td>
            <td>@twitter</td>
          </tr>
          </tbody>
          <tfoot className="thead-dark">
          <tr>
            <th scope="col">Id</th>
            <th scope="col">First</th>
            <th scope="col">Last</th>
            <th scope="col">Handle</th>
          </tr>
          </tfoot>
        </table>
    );
  }
}


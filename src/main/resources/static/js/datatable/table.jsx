import React from 'react';

export class Table extends React.Component {
  constructor(props) {
    super(props);

    this.onColumnHeaderClick = this.onColumnHeaderClick.bind(this);
  }

  onColumnHeaderClick(e, colName, colIndex) {
    this.props.onColumnHeaderClick(colName, colIndex);
  }

  getColumnHeaderIndicator(data) {
    let columnIndicator = {'': ''};
    if (data && data.length) {
      columnIndicator = data[0];
    }
    return columnIndicator;
  }

  getColumnHeaders(data) {
    const columnHeaders = [];
    const columnIndicator = this.getColumnHeaderIndicator(data);

    Object.keys(columnIndicator).forEach((colName, index) => {
      columnHeaders.push(
          <th scope="col" key={colName} onClick={(e) => {
            this.onColumnHeaderClick(e, colName, index);
          }}>
            {colName}
            <svg className="feather"
                 viewBox="0 0 24 24">
              <use href="#icon-chevron-up-down"/>
            </svg>
          </th>
      );
    });

    return columnHeaders;
  }

  getColumnFooters(data) {
    const columnFooters = [];
    const columnIndicator = this.getColumnHeaderIndicator(data);

    Object.keys(columnIndicator).forEach((colName) => {
      columnFooters.push(<th scope="col" key={colName}>{colName}</th>);
    });

    return columnFooters;
  }

  getTableRows(data) {
    let rows = [];
    if (!data.length) {
      data = [{'empty': 'Table is empty.'}];
    }

    data.forEach((row, rowIndex) => {
      const cols = [];
      const rowKey = row.id != null ? row.id : rowIndex;
      Object.values(row).forEach((val, colIndex) => {
        let colVal = val;
        if ($.isArray(val) || $.isPlainObject(val)) {
          colVal = JSON.stringify(colVal);
        }
        cols.push(<td key={colIndex}>{colVal}</td>);
      });
      rows.push(<tr key={rowKey}>{cols}</tr>);
    });

    return rows;
  }

  render() {
    const data = this.props.data;
    const columnHeaders = this.getColumnHeaders(data);
    const columnFooters = this.getColumnFooters(data);
    const rows = this.getTableRows(data);

    return (
        <table className="table table-bordered table-hover datatable">
          <thead className="thead-dark">
          <tr>{columnHeaders}</tr>
          </thead>
          <tbody>
          {rows}
          </tbody>
          <tfoot className="thead-dark">
          <tr>{columnFooters}</tr>
          </tfoot>
        </table>
    );
  }
}

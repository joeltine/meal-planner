import React from 'react';
import {SORT_TYPES} from "./sorttypes";
import {Td} from "./td";
import PropTypes from "prop-types";

export class Table extends React.Component {
  constructor(props) {
    super(props);
    this.selectedRows = [];
    this.tableRef = React.createRef();
    this.onColumnHeaderClick = this.onColumnHeaderClick.bind(this);
  }

  onColumnHeaderClick(colName) {
    this.props.onColumnHeaderClick(colName);
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
    const sortCol = this.props.sortCol || {};

    Object.keys(columnIndicator).forEach((colName) => {
      let sortSvg = 'icon-chevron-up-down';
      if (sortCol['colName'] && sortCol['colName'] === colName) {
        sortSvg = sortCol['sort'] === SORT_TYPES.ascending ? 'icon-chevron-up'
            : 'icon-chevron-down';
      }

      columnHeaders.push(
          <th scope="col" key={colName} onClick={() => {
            this.onColumnHeaderClick(colName);
          }}>
            {colName}
            <svg className="feather"
                 viewBox="0 0 24 24">
              <use href={`#${sortSvg}`}/>
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

  componentDidUpdate() {
    this.selectedRows = [];
    Array.from(
        this.tableRef.current.querySelectorAll('tr.table-active')).forEach(
        (row) => {
          row.classList.remove('table-active');
        });
  }

  getSelectedRows() {
    return this.selectedRows;
  }

  onRowClick(e, rowData) {
    // TODO: Implement shift+click multi-row selection.
    const rowEl = e.currentTarget;
    if (!rowEl.classList.contains('table-active')) {
      rowEl.classList.add('table-active');
      this.selectedRows.push(rowData);
    } else {
      const index = this.selectedRows.indexOf(rowData);
      if (index > -1) {
        this.selectedRows.splice(index, 1);
      }
      rowEl.classList.remove('table-active');
    }
  }

  getTableRows(data) {
    let rows = [];
    if (!data.length) {
      data = [{'empty': 'Table is empty.'}];
    }

    data.forEach((row, rowIndex) => {
      const cols = [];
      const rowKey = row.id != null ? row.id : rowIndex;
      Object.entries(row).forEach(([key, val], colIndex) => {
        let colVal = val;
        if ($.isArray(val) || $.isPlainObject(val)) {
          colVal = JSON.stringify(colVal);
        }
        // TODO: Make the "editable" check more generic than just looking for
        //       a column named "id". E.g., maybe the server can return type
        //       info and/or whether the column is editable.
        cols.push(<Td key={colIndex} value={colVal} onValueUpdate={(newVal) => {
          this.props.onColumnValueUpdate(row, key, newVal);
        }} editable={key !== 'id'}/>);
      });
      rows.push(<tr onClick={(e) => {
        this.onRowClick(e, row);
      }} key={rowKey}>{cols}</tr>);
    });

    return rows;
  }

  render() {
    const data = this.props.data;
    const columnHeaders = this.getColumnHeaders(data);
    const columnFooters = this.getColumnFooters(data);
    const rows = this.getTableRows(data);

    return (
        <table className="table table-bordered table-hover datatable"
               ref={this.tableRef}>
          <thead className="thead-dark" aria-label="table-header">
          <tr>{columnHeaders}</tr>
          </thead>
          <tbody aria-label="table-body">
          {rows}
          </tbody>
          <tfoot className="thead-dark" aria-label="table-footer">
          <tr>{columnFooters}</tr>
          </tfoot>
        </table>
    );
  }
}

Table.propTypes = {
  data: PropTypes.arrayOf(PropTypes.object).isRequired,
  sortCol: PropTypes.objectOf(PropTypes.string),
  onColumnHeaderClick: PropTypes.func,
  onColumnValueUpdate: PropTypes.func
};

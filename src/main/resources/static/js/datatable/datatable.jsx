import React from 'react';
import {SearchBox} from './searchbox';
import {AddButton} from './addbutton';
import {DeleteButton} from './deletebutton';
import {Table} from "./table";
import {Pagination} from "./pagination";
import {SORT_TYPES} from "./sorttypes";

const MAX_ROWS_PER_PAGE = 10;

export class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.tableComponentRef = React.createRef();
    this.fullData = [];
    this.preFilteredData = [];
    this.state = {
      // Current data visible in table.
      tableData: [],
      // Total data items we're managing (including non visible).
      totalItems: 0,
      // Current, visible, navigation page within data.
      currentPage: 1,
      // Which column is sorted and how, e.g.,
      // {'colName': 'id', 'sort': 'DESC'}.
      sortCol: {colName: '', sort: ''}
    };
    this.navigateToPreviousPage = this.navigateToPreviousPage.bind(this);
    this.navigateToNextPage = this.navigateToNextPage.bind(this);
    this.navigateToPage = this.navigateToPage.bind(this);
    this.toggleColumnSort = this.toggleColumnSort.bind(this);
    this.deleteSelectedRows = this.deleteSelectedRows.bind(this);
    this.addNewRow = this.addNewRow.bind(this);
    this.updateColumnValue = this.updateColumnValue.bind(this);
    this.searchTableDebounced = this.debounce(this.searchTable.bind(this));
  }

  debounce(func, timeout = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        func.apply(this, args);
      }, timeout);
    };
  }

  /**
   * Returns if a given array contains the given substring. Only works for
   * arrays containing only numbers and/or strings.
   */
  arrayContainsSubstring(array, string) {
    for (let i = 0; i < array.length; i++) {
      if (String(array[i]).includes(string)) {
        return true;
      }
    }
    return false;
  }

  addNewRow() {

  }

  getType(value) {
    if (Object.prototype.toString.call(value) === '[object String]') {
      return 'string';
    } else if (Object.prototype.toString.call(value) === '[object Number]') {
      return 'number';
    } else if ($.isArray(value)) {
      return 'array';
    } else if ($.isPlainObject(value)) {
      return 'plainObject';
    } else {
      return typeof value;
    }
  }

  updateColumnValue(row, key, val) {
    const index = this.fullData.indexOf(row);
    if (index === -1) {
      console.error(`Failed to update row ${row} with key ${key}.`);
      return;
    }

    const colType = this.getType(row[key]);
    let convertedVal = val;

    if (colType === 'number') {
      convertedVal = Number(val);
      // TODO: Do error handling when they enter a bad value and this is NaN.
    } else if (colType === 'array' || colType === 'plainObject') {
      convertedVal = JSON.parse(val);
      // TODO: Do error handling where entered val does not parse to original
      //       JSON type.
    }

    const originalValue = row[key];
    // TODO: Is there anyway to not reference id directly? Doing this makes
    //       the datatable impl dependent on the data structure.
    const originalId = row.id;
    row[key] = convertedVal;

    // TODO: Handle cases of editing non-editable cells (e.g., id). They
    //       should either not be able to edit them in the UI or the update
    //       attempt should fail w/ an error message.

    this.doAjax(`${this.props.dataSource}/${originalId}`, {
      method: 'PUT',
      data: JSON.stringify(row),
      processData: false,
      contentType: 'application/json'
    })
        .fail(() => {
          // Reset value back to original on failure.
          row[key] = originalValue;
        })
        .done(() => {
          this.refreshCurrentPage();
        });
  }

  searchTable(query) {
    if (/^\s+$/.test(query)) {
      // If input is just a bunch of spaces, do nothing.
      return;
    }

    query = query.trim();
    if (query === '') {
      // The only way to get in here is if the user had something in the search
      // bar and deleted it, hence resetting the filter.
      if (this.preFilteredData.length) {
        // Reset back to original state if we're in a filtered state and query
        // is blank (indicating they cleared the search form).
        this.fullData = this.preFilteredData;
        this.preFilteredData = [];
      }
    } else {
      if (!this.preFilteredData.length) {
        // If this is the first filter from a clean slate, cache full dataset.
        this.preFilteredData = this.fullData;
      }

      // Always do filter on the full dataset.
      this.fullData = this.preFilteredData.filter((row) => {
        for (const value of Object.values(row)) {
          if (this.getType(value) === 'string') {
            if (value.includes(query)) {
              return true;
            }
          } else if (this.getType(value) === 'number') {
            if (String(value).includes(query)) {
              return true;
            }
          } else if (this.getType(value) === 'array') {
            if (this.arrayContainsSubstring(value, query)) {
              return true;
            }
          } else if (this.getType(value) === 'plainObject') {
            if (this.arrayContainsSubstring(Object.values(value), query)) {
              return true;
            }
            if (this.arrayContainsSubstring(Object.keys(value), query)) {
              return true;
            }
          }
        }
        return false;
      });
    }

    // Reset back to page 1.
    this.navigateToPage(1);
  }

  /**
   * Does an in place sort of passed array of objects (data) on the given column
   * (key) name.
   */
  sortDataOnColumn(data, colName, sortOrder) {
    data.sort((a, b) => {
      let aVal = a[colName];
      let bVal = b[colName];

      if (this.getType(aVal) === 'array') {
        // If it's an array, sort by first element. Note, this might fail
        // if the first item is the same in both arrays. E.g., you could get
        // [0, 100, 5] before [0, 2, 3]. It might make sense to do deeper
        // comparisons if aVal[0] === bVal[0].
        aVal = aVal[0];
        bVal = bVal[0];
      } else if (this.getType(aVal) === 'plainObject') {
        // If object, stringify and then sort. It's a bit wonky, but sorting
        // objects is inherently wonky.
        aVal = JSON.stringify(aVal);
        bVal = JSON.stringify(bVal);
      }

      if (this.getType(aVal) === 'number') {
        // Numeric sorting.
        return sortOrder === SORT_TYPES.ascending ? aVal - bVal : bVal - aVal;
      }

      // String based sorting.
      return sortOrder === SORT_TYPES.ascending ?
          aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    // Update the sortCol state.
    this.setState({
      sortCol: {
        colName: colName,
        sort: sortOrder
      }
    });
  }

  toggleColumnSort(colName) {
    if (colName == null || colName === '') {
      return;
    }

    const sortCol = this.state.sortCol;
    let sortOrder = SORT_TYPES.descending;

    if (sortCol['colName'] === colName &&
        sortCol['sort'] === SORT_TYPES.descending) {
      // If we're already sorting the given column, ensure we're toggling
      // the sort.
      sortOrder = SORT_TYPES.ascending;
    }

    this.sortDataOnColumn(this.fullData, colName, sortOrder);

    if (this.preFilteredData.length) {
      // Unfortunately, if the table is filtered, we also need to ensure the
      // cached pre-filtered data is sorted. This ensures that future filters
      // or resetting the filter maintains the same sorting.
      this.sortDataOnColumn(this.preFilteredData, colName, sortOrder);
    }

    this.refreshCurrentPage();
  }

  navigateToPreviousPage() {
    this.navigateToPage(this.state.currentPage - 1)
  }

  navigateToNextPage() {
    this.navigateToPage(this.state.currentPage + 1)
  }

  refreshCurrentPage() {
    this.navigateToPage(this.state.currentPage);
  }

  navigateToPage(page) {
    const dataSlice = this.getDataSlice(page);
    this.setState({
      tableData: dataSlice,
      currentPage: page,
      totalItems: this.fullData.length
    });
  }

  deleteSelectedRows() {
    const rowsToDelete = this.tableComponentRef.current.getSelectedRows();
    if (rowsToDelete.length) {
      this.doAjax(this.props.dataSource, {
        method: 'DELETE',
        data: JSON.stringify(rowsToDelete),
        contentType: 'application/json',
        processData: false
      })
          .done(() => {
            rowsToDelete.forEach((row) => {
              const index = this.fullData.indexOf(row);
              if (index > -1) {
                this.fullData.splice(index, 1);
              } else {
                // TODO: Replace w/ proper error handling.
                console.error(
                    'Attempted to delete row not found in table data. This '
                    + 'shouldn\'t happen unless there\'s a race condition.');
              }
            });
            this.refreshCurrentPage();
          });
    }
  }

  componentDidMount() {
    this.fetchInitialData();
  }

  fetchInitialData() {
    this.doAjax(this.props.dataSource).done((response) => {
      // TODO: Caching the full dataset might be slow for very large tables.
      //       Consider adding ability to do paging on the server.
      this.fullData = response;
      this.navigateToPage(1);
    });
  }

  getDataSlice(page) {
    const start = ((page - 1) * MAX_ROWS_PER_PAGE);
    const end = start + MAX_ROWS_PER_PAGE;
    return this.fullData.slice(start, end);
  }

  doAjax(endpoint, extraOptions) {
    // TODO: Universally, handle loading interstitial when AJAX is happening.
    const headers = {};
    headers[CSRF_HEADER_NAME] = CSRF_TOKEN;

    const options = {
      method: 'GET',
      headers: headers
    };

    $.extend(options, extraOptions);

    return $.ajax(endpoint, options)
        .fail((jqXHR, textStatus, errorThrown) => {
          const response = JSON.parse(jqXHR.responseText);
          // TODO: Replace me w/ proper error handling. E.g., a toast.
          console.error(response);
        });
  }

  render() {
    return (
        <div className="container-fluid">
          <div className="row pb-3">
            <div className="col">
              <SearchBox onSearchChange={this.searchTableDebounced}/>
            </div>
            <div className="col-auto">
              <AddButton onAddClick={this.addNewRow}/>
            </div>
            <div className="col-auto">
              <DeleteButton onDeleteClick={this.deleteSelectedRows}/>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Table ref={this.tableComponentRef}
                     data={this.state.tableData}
                     sortCol={this.state.sortCol}
                     onColumnHeaderClick={this.toggleColumnSort}
                     onColumnValueUpdate={this.updateColumnValue}/>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Pagination totalItems={this.state.totalItems}
                          itemsPerPage={MAX_ROWS_PER_PAGE}
                          activePage={this.state.currentPage}
                          onPreviousClick={this.navigateToPreviousPage}
                          onNextClick={this.navigateToNextPage}
                          onPageNavigate={this.navigateToPage}/>
            </div>
          </div>
        </div>
    );
  }
}

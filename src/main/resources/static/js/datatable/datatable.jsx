import React from 'react';
import {SearchBox} from './searchbox';
import {AddButton} from './addbutton';
import {DeleteButton} from './deletebutton';
import {Table} from "./table";
import {Toast} from "../toasts/toast";
import {Pagination} from "./pagination";
import {SORT_TYPES} from "./sorttypes";
import {arrayContainsSubstring, debounce, getType} from "../common/utils";
import {sendAjax} from "../common/ajax";

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
    this.searchTableDebounced = debounce(this.searchTable.bind(this));
  }

  addNewRow() {

  }

  updateColumnValue(row, key, val) {
    const index = this.fullData.indexOf(row);
    if (index === -1) {
      Toast.showNewErrorToast('Failed to update cell!',
          `In attempting to update row id ${row.id} column ${key}, we `
          + 'failed to find the row in the known dataset.', {autohide: false});
      return;
    }

    const colType = getType(row[key]);
    let convertedVal = val;

    if (colType === 'number') {
      convertedVal = Number(val);
      if (Number.isNaN(convertedVal)) {
        Toast.showNewErrorToast('Failed to update Cell!',
            `Attempting to convert "${val}" to number failed. `
            + 'Is it a valid number?', {autohide: false});
        return;
      }
    } else if (colType === 'array' || colType === 'plainObject') {
      try {
        convertedVal = JSON.parse(val);
      } catch (e) {
        Toast.showNewErrorToast('Failed to update cell!',
            `Attempting to convert "${val}" failed. `
            + 'It is likely not valid JSON.', {autohide: false});
        return;
      }
    }

    const originalValue = row[key];
    row[key] = convertedVal;

    // TODO: Handle cases of editing non-editable cells (e.g., id). They
    //       should either not be able to edit them in the UI or the update
    //       attempt should fail w/ an error message.

    this.doAjax(`${this.props.dataSource}/${row.id}`, {
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
          Toast.showNewSuccessToast('Success updating cell!',
              `Updating row with id ${row.id} was successful!`);
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
          if (getType(value) === 'string') {
            if (value.includes(query)) {
              return true;
            }
          } else if (getType(value) === 'number') {
            if (String(value).includes(query)) {
              return true;
            }
          } else if (getType(value) === 'array') {
            if (arrayContainsSubstring(value, query)) {
              return true;
            }
          } else if (getType(value) === 'plainObject') {
            if (arrayContainsSubstring(Object.values(value), query)) {
              return true;
            }
            if (arrayContainsSubstring(Object.keys(value), query)) {
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

      if (getType(aVal) === 'array') {
        // If it's an array, sort by first element. Note, this might fail
        // if the first item is the same in both arrays. E.g., you could get
        // [0, 100, 5] before [0, 2, 3]. It might make sense to do deeper
        // comparisons if aVal[0] === bVal[0].
        aVal = aVal[0];
        bVal = bVal[0];
      } else if (getType(aVal) === 'plainObject') {
        // If object, stringify and then sort. It's a bit wonky, but sorting
        // objects is inherently wonky.
        aVal = JSON.stringify(aVal);
        bVal = JSON.stringify(bVal);
      }

      if (getType(aVal) === 'number') {
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
            const successes = [];
            const failures = [];
            rowsToDelete.forEach((row) => {
              const index = this.fullData.indexOf(row);
              if (index > -1) {
                this.fullData.splice(index, 1);
                successes.push(row.id);
              } else {
                failures.push(row.id);
              }
            });

            if (successes.length) {
              Toast.showNewSuccessToast('Delete successful!',
                  `Successfully deleted row${successes.length > 1 ? 's'
                      : ''} with id${successes.length > 1 ? 's'
                      : ''}: ${successes.join(', ')}.`);
            }

            if (failures.length) {
              Toast.showNewErrorToast('Delete failed!',
                  `Attempting to delete row${failures.length > 1 ? 's'
                      : ''} (${failures.join(', ')}) not found in table `
                  + `data. This shouldn\'t happen unless there\'s a race `
                  + `condition.`, {autohide: false});
            }

            this.refreshCurrentPage();
          });
    }
  }

  componentDidMount() {
    this.fetchInitialData();
  }

  fetchInitialData() {
    this.doAjax(this.props.dataSource).done((response) => {
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
    return sendAjax(endpoint, extraOptions);
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

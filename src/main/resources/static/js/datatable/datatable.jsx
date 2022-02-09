import React from 'react';
import {SearchBox} from './searchbox';
import {AddButton} from './addbutton';
import {DeleteButton} from './deletebutton';
import {Table} from "./table";
import {Toast} from "../toasts/toast";
import {Pagination} from "./pagination";
import {SORT_TYPES} from "./sorttypes";
import {
  arrayContainsSubstring,
  debounce,
  getType,
  isValidDate,
  tryToConvertStringToType,
  Types
} from "../common/utils";
import {sendAjax} from "../common/ajax";
import {NewRowForm} from "./newrowform";
import PropTypes from "prop-types";

const MAX_ROWS_PER_PAGE = 10;

export class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.tableComponentRef = React.createRef();
    this.fullData = [];
    // TODO: Consider new implementation of filtering that doesn't require
    //       this array. E.g., pass a "filtered" set of rows to the Table
    //       component and have it conditionally rendered there. Then fullData
    //       is always the source of truth and we don't have to maintain both
    //       fullData and preFilteredData arrays during sorting/adding etc.
    this.preFilteredData = [];
    this.currentFilterQuery = '';
    this.state = {
      // Current data visible in table.
      tableData: [],
      // Total data items we're managing (including non visible).
      totalItems: 0,
      // Current, visible, navigation page within data.
      currentPage: 1,
      // Which column is sorted and how, e.g.,
      // {'colName': 'id', 'sort': 'DESC'}.
      sortCol: {colName: '', sort: ''},
      // Mapping of row key to estimated type.
      columnTypeInfo: {},
      // Whether they want to add a new row.
      addingNewRow: false
    };
    this.navigateToPreviousPage = this.navigateToPreviousPage.bind(this);
    this.navigateToNextPage = this.navigateToNextPage.bind(this);
    this.navigateToPage = this.navigateToPage.bind(this);
    this.toggleColumnSort = this.toggleColumnSort.bind(this);
    this.deleteSelectedRows = this.deleteSelectedRows.bind(this);
    this.showNewRowForm = this.showNewRowForm.bind(this);
    this.updateColumnValue = this.updateColumnValue.bind(this);
    this.saveNewRow = this.saveNewRow.bind(this);
    this.hideNewRowForm = this.hideNewRowForm.bind(this);
    this.searchTableDebounced = debounce(this.searchTable.bind(this));
  }

  showNewRowForm() {
    this.setState({
      addingNewRow: true
    });
  }

  saveNewRow(newRow) {
    this.addNewRowOnServer(newRow).done(() => {
      this.hideNewRowForm();
    });
  }

  hideNewRowForm() {
    this.setState({
      addingNewRow: false
    });
  }

  addNewRowOnServer(row) {
    return sendAjax(this.props.dataSource, {
      method: 'POST',
      data: JSON.stringify(row),
      processData: false,
      contentType: 'application/json'
    })
        .done((newRow) => {
          this.addNewRowIntoDataSet(newRow);
          this.refreshCurrentPage();
          Toast.showNewSuccessToast('Successfully added row!',
              `Added new row with id: ${newRow.id}`);
        });
  }

  addNewRowIntoDataSet(newRow) {
    // Table is currently filtered.
    if (this.currentFilterQuery.length) {
      // And it matches the current filter.
      if (this.rowMatchesQuery(newRow, this.currentFilterQuery)) {
        // Put it in fullData, so it's visible in current visible table data.
        this.fullData.push(newRow);
      }
      // Always add to preFilteredData, so it is in table when filter is
      // cleared and fullData is reinstated as preFilteredData.
      this.preFilteredData.push(newRow);
    } else {
      this.fullData.push(newRow);
    }
    // Always re-sort everything so row is in correct place.
    this.reSortAllData();
  }

  reSortAllData() {
    // Sort new row back into data.
    if (this.state.sortCol.colName.length) {
      this.sortDataOnColumn(this.fullData, this.state.sortCol.colName,
          this.state.sortCol.sort);
      this.sortDataOnColumn(this.preFilteredData, this.state.sortCol.colName,
          this.state.sortCol.sort);
    }
  }

  updateColumnValue(row, key, val) {
    const index = this.fullData.indexOf(row);
    if (index === -1) {
      Toast.showNewErrorToast('Failed to update cell!',
          `In attempting to update row id ${row.id} column ${key}, we `
          + 'failed to find the row in the known dataset.', {autohide: false});
      return;
    }

    const colType = this.state.columnTypeInfo[key];
    let convertedVal = tryToConvertStringToType(val, colType);

    if (convertedVal === null) {
      Toast.showNewErrorToast('Failed to Update Cell!',
          `Attempting to convert "${val}" to ${colType} failed. `
          + `Is it a valid ${colType}?`, {delay: 7000});
      return;
    }

    const originalValue = row[key];
    row[key] = convertedVal;

    this.updateRowOnServer(row)
        .fail(() => {
          // Reset value back to original on failure.
          row[key] = originalValue;
        });
  }

  updateRowOnServer(row) {
    return sendAjax(`${this.props.dataSource}/${row.id}`, {
      method: 'PUT',
      data: JSON.stringify(row),
      processData: false,
      contentType: 'application/json'
    })
        .done(() => {
          this.refreshCurrentPage();
          Toast.showNewSuccessToast('Success updating cell!',
              `Updating row with id ${row.id} was successful!`);
        });
  }

  rowMatchesQuery(row, query) {
    for (const value of Object.values(row)) {
      if (getType(value) === Types.STRING) {
        if (value.includes(query)) {
          return true;
        }
      } else if (getType(value) === Types.NUMBER) {
        if (String(value).includes(query)) {
          return true;
        }
      } else if (getType(value) === Types.ARRAY) {
        if (arrayContainsSubstring(value, query)) {
          return true;
        }
      } else if (getType(value) === Types.PLAIN_OBJECT) {
        if (arrayContainsSubstring(Object.values(value), query)) {
          return true;
        }
        if (arrayContainsSubstring(Object.keys(value), query)) {
          return true;
        }
      }
    }
    return false;
  }

  searchTable(query) {
    if (/^\s+$/.test(query)) {
      // If input is just a bunch of spaces, do nothing.
      return;
    }

    query = query.trim();
    this.currentFilterQuery = query;

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
        return this.rowMatchesQuery(row, query);
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
    const type = this.state.columnTypeInfo[colName];
    data.sort((a, b) => {
      let aVal = a[colName];
      let bVal = b[colName];

      if (type === Types.ARRAY) {
        // If it's an array, sort by first element. Note, this might fail
        // if the first item is the same in both arrays. E.g., you could get
        // [0, 100, 5] before [0, 2, 3]. It might make sense to do deeper
        // comparisons if aVal[0] === bVal[0].
        aVal = aVal[0];
        bVal = bVal[0];
      } else if (type === Types.PLAIN_OBJECT) {
        // If object, stringify and then sort. It's a bit wonky, but sorting
        // objects is inherently wonky.
        aVal = JSON.stringify(aVal);
        bVal = JSON.stringify(bVal);
      }

      if (type === Types.NUMBER) {
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

  /**
   * Removes given row from passed array. Adds ids of rows successful/failed
   * removal attempts to passed successes/failures Sets. If array is empty,
   * nothing happens, neither successes/failures will be populated.
   */
  removeRowFromArrayIfExists(array, row, successes, failures) {
    if (array.length) {
      const index = array.indexOf(row);

      if (index > -1) {
        array.splice(index, 1);
        successes.add(row.id);
      } else {
        failures.add(row.id);
      }
    }
  }

  deleteSelectedRows() {
    const rowsToDelete = this.tableComponentRef.current.getSelectedRows();
    if (rowsToDelete.length) {
      sendAjax(this.props.dataSource, {
        method: 'DELETE',
        data: JSON.stringify(rowsToDelete),
        contentType: 'application/json',
        processData: false
      })
          .done(() => {
            const successes = new Set();
            const failures = new Set();

            rowsToDelete.forEach((row) => {
              this.removeRowFromArrayIfExists(this.fullData, row, successes,
                  failures);
              // Need to make sure row is deleted from pre-filtered data so
              // when filter is reset the delete is preserved.
              this.removeRowFromArrayIfExists(this.preFilteredData, row,
                  successes, failures);
            });

            if (successes.size) {
              Toast.showNewSuccessToast('Delete successful!',
                  `Successfully deleted row${successes.size > 1 ? 's'
                      : ''} with id${successes.size > 1 ? 's'
                      : ''}: ${Array.from(successes).join(', ')}.`);
            }

            if (failures.size) {
              Toast.showNewErrorToast('Delete failed!',
                  `Attempting to delete row${failures.size > 1 ? 's'
                      : ''} (${Array.from(failures).join(
                      ', ')}) not found in table `
                  + `data. This shouldn't happen unless there's a race `
                  + `condition.`, {autohide: false});
            }

            this.refreshCurrentPage();
          });
    }
  }

  componentDidMount() {
    this.fetchInitialData();
  }

  calculateDataTypeInformation() {
    if (!this.fullData.length) {
      return;
    }

    const typeInfo = {};
    Object.entries(this.fullData[0]).forEach(([key, value]) => {
      let type = getType(value);
      if (type === Types.STRING) {
        // Check if string is a valid date string, helps do validation later.
        if (isValidDate(new Date(value))) {
          type = Types.DATE;
        }
      }
      typeInfo[key] = type;
    });
    this.setState({
      columnTypeInfo: typeInfo
    });
  }

  fetchInitialData() {
    sendAjax(this.props.dataSource).done((response) => {
      this.fullData = response;
      this.calculateDataTypeInformation();
      this.navigateToPage(1);
    });
  }

  getDataSlice(page) {
    const start = ((page - 1) * MAX_ROWS_PER_PAGE);
    const end = start + MAX_ROWS_PER_PAGE;
    return this.fullData.slice(start, end);
  }

  maybeRenderNewRowForm() {
    if (!this.state.addingNewRow || !this.fullData.length) {
      return;
    }
    return (
        <div className="row pb-3">
          <div className="col">
            <NewRowForm typeInfo={this.state.columnTypeInfo}
                        onSaveClick={this.saveNewRow}
                        onCancelClick={this.hideNewRowForm}/>
          </div>
        </div>
    );
  }

  getFullData() {
    return this.fullData;
  }

  render() {
    return (
        <div className="container-fluid">
          <div className="row pb-3">
            <div className="col">
              <SearchBox onSearchChange={this.searchTableDebounced}/>
            </div>
            <div className="col-auto">
              <AddButton onAddClick={this.showNewRowForm}/>
            </div>
            <div className="col-auto">
              <DeleteButton onDeleteClick={this.deleteSelectedRows}/>
            </div>
          </div>
          {this.maybeRenderNewRowForm()}
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

DataTable.propTypes = {
  dataSource: PropTypes.string.isRequired
};

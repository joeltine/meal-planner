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
    this.fullData = [];
    this.preFilteredData = [];
    this.state = {
      // Current data visible in table.
      tableData: [],
      // Total data items we're managing (including non visible).
      totalItems: 0,
      // Current navigation page within data.
      currentPage: 1,
      // Which column is sorted and how, e.g.,
      // {'colName': 'id', 'sort': 'DESC'}.
      sortCol: {colName: '', sort: ''}
    };
    this.navigateToPreviousPage = this.navigateToPreviousPage.bind(this);
    this.navigateToNextPage = this.navigateToNextPage.bind(this);
    this.navigateToPage = this.navigateToPage.bind(this);
    this.toggleColumnSort = this.toggleColumnSort.bind(this);
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
      if (String(array[i]).includes(query)) {
        return true;
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
          if (Object.prototype.toString.call(value) == '[object String]') {
            if (value.includes(query)) {
              return true;
            }
          } else if (
              Object.prototype.toString.call(value) === '[object Number]') {
            if (String(value).includes(query)) {
              return true;
            }
          } else if ($.isArray(value)) {
            if (this.arrayContainsSubstring(value, query)) {
              return true;
            }
          } else if ($.isPlainObject(value)) {
            if (this.arrayContainsSubstring(Object.values(value), query)) {
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

      if ($.isArray(aVal)) {
        // If it's an array, sort by first element. Note, this might fail
        // if the first item is the same in both arrays. E.g., you could get
        // [0, 100, 5] before [0, 2, 3]. It might make sense to do deeper
        // comparisons if aVal[0] === bVal[0].
        aVal = aVal[0];
        bVal = bVal[0];
      } else if ($.isPlainObject(aVal)) {
        // If object, stringify and then sort. It's a bit wonky, but sorting
        // objects is inherently wonky.
        aVal = JSON.stringify(aVal);
        bVal = JSON.stringify(bVal);
      }

      if (Object.prototype.toString.call(aVal) === '[object Number]') {
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

    if (sortCol['colName'] === colName) {
      // If we're sorting the currently sorted column, reverse the sort.
      sortOrder = sortCol['sort'] === SORT_TYPES.ascending
          ? SORT_TYPES.descending : SORT_TYPES.ascending;
    }

    this.sortDataOnColumn(this.fullData, colName, sortOrder);

    if (this.preFilteredData.length) {
      // Unfortunately, if the table is filtered, we also need to ensure the
      // cached pre-filtered data is sorted the same way.
      this.sortDataOnColumn(this.preFilteredData, colName, sortOrder);
    }

    this.navigateToPage(this.state.currentPage);
  }

  navigateToPreviousPage() {
    this.navigateToPage(this.state.currentPage - 1)
  }

  navigateToNextPage() {
    this.navigateToPage(this.state.currentPage + 1)
  }

  navigateToPage(page) {
    const dataSlice = this.getDataSlice(page);
    this.setState({
      tableData: dataSlice,
      currentPage: page,
      totalItems: this.fullData.length
    });
  }

  componentDidMount() {
    this.fetchInitialData();
  }

  fetchInitialData() {
    this.doAjax(this.props.dataSource).done((response) => {
      // TODO: Caching the full dataset might be slow for very large tables.
      //       Consider adding ability to do paging on the server.
      this.fullData = response;
      const dataSlice = this.getDataSlice(this.state.currentPage);
      this.setState({
        tableData: dataSlice,
        totalItems: this.fullData.length
      });
    });
  }

  getDataSlice(page) {
    const start = ((page - 1) * MAX_ROWS_PER_PAGE);
    const end = start + MAX_ROWS_PER_PAGE;
    return this.fullData.slice(start, end);
  }

  doAjax(endpoint, extraOptions) {
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
              <AddButton/>
            </div>
            <div className="col-auto">
              <DeleteButton/>
            </div>
          </div>
          <div className="row">
            <div className="col">
              <Table data={this.state.tableData}
                     sortCol={this.state.sortCol}
                     onColumnHeaderClick={this.toggleColumnSort}/>
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

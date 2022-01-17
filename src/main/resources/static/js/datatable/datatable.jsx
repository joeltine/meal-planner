import React from 'react';
import {SearchBox} from './searchbox';
import {AddButton} from './addbutton';
import {DeleteButton} from './deletebutton';
import {Table} from "./table";
import {Pagination} from "./pagination";

const MAX_ROWS_PER_PAGE = 10;

export class DataTable extends React.Component {
  constructor(props) {
    super(props);
    this.fullData = [];
    this.state = {tableData: [], totalItems: 0, currentPage: 1};
    this.navigateToPreviousPage = this.navigateToPreviousPage.bind(this);
    this.navigateToNextPage = this.navigateToNextPage.bind(this);
    this.navigateToPage = this.navigateToPage.bind(this);
    this.sortColumn = this.sortColumn.bind(this);
  }

  sortColumn(colName, colIndex) {
    console.log(colName, colIndex);
    const sortOrder = 'DESC';

    // TODO: How to deal w/ sort order state? Need to know of col is already
    //       sorted.

    this.fullData.sort((a, b) => {
      const aVal = a[colName];
      const bVal = b[colName];

      if (!isNaN(aVal)) {
        // Numeric sorting.
        return sortOrder == 'ASC' ? aVal - bVal : bVal - aVal;
      }

      // String based sorting.
      return sortOrder == 'ASC' ?
          aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

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
      currentPage: page
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
        totalItems: response.length
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
              <Table data={this.state.tableData}
                     onColumnHeaderClick={this.sortColumn}/>
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

import React from 'react';
import PropTypes from "prop-types";

// Max number of boxes shown in pagination widget. This number includes "..."
// separators as well.
const MAX_PAGES = 9;

export class Pagination extends React.Component {
  constructor(props) {
    super(props);
    this.handlePrevClick = this.handlePrevClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePageNavigationClick = this.handlePageNavigationClick.bind(this);
  }

  handlePageNavigationClick(page) {
    if (page !== this.props.activePage) {
      this.props.onPageNavigate(page);
    }
  }

  handlePrevClick(e) {
    if (!e.currentTarget.classList.contains('disabled')) {
      this.props.onPreviousClick();
    }
  }

  handleNextClick(e) {
    if (!e.currentTarget.classList.contains('disabled')) {
      this.props.onNextClick();
    }
  }

  getPageListItem(page) {
    const itemClass = `page-item ${page === this.props.activePage ? 'active'
        : ''}`;
    return (
        <li className={itemClass} key={page} onClick={() => {
          this.handlePageNavigationClick(page);
        }}>
          <a className="page-link">{page}</a>
        </li>
    );
  }

  getSpacerListItem(key) {
    return (
        <li className="page-item disabled" key={`spacer-${key}`}>
          <a className="page-link">...</a>
        </li>
    );
  }

  generatePages(totalPages) {
    const pages = [];
    const activePage = this.props.activePage;

    if (totalPages <= MAX_PAGES) {
      // If we're below MAX_PAGES, just render all the pages.
      for (let i = 1; i <= totalPages; i++) {
        pages.push(this.getPageListItem(i));
      }
    } else {
      if (activePage < MAX_PAGES - 2) {
        // If we're in the first set of pages before MAX_PAGES, render up until
        // a reasonable point, then "...", and then the last page.
        // E.g., 1, 2, 3, 4, 5, 6, 7, ... 250
        for (let i = 1; i < MAX_PAGES - 1; i++) {
          pages.push(this.getPageListItem(i));
        }
        pages.push(this.getSpacerListItem(totalPages - 1));
        pages.push(this.getPageListItem(totalPages));
      } else if (activePage > (totalPages - (MAX_PAGES - 3))) {
        // If we're within the ending section of pages, render the first page,
        // then "...", and then the last set of pages.
        // E.g., 1, ..., 56, 57, 58, 59, 60, 61, 62
        pages.push(this.getPageListItem(1));
        pages.push(this.getSpacerListItem(2));
        for (let i = totalPages - (MAX_PAGES - 3); i <= totalPages; i++) {
          pages.push(this.getPageListItem(i));
        }
      } else {
        // If we're somewhere in the middle of pagination, render the first 2
        // pages, "...", the middle section +/- 1, "...", then the last 2 pages.
        // E.g., 1, 2, ..., 56, 57, 58, ..., 102, 103
        pages.push(this.getPageListItem(1));
        pages.push(this.getPageListItem(2));
        pages.push(this.getSpacerListItem(3));
        pages.push(this.getPageListItem(activePage - 1));
        pages.push(this.getPageListItem(activePage));
        pages.push(this.getPageListItem(activePage + 1));
        pages.push(this.getSpacerListItem(totalPages - 2));
        pages.push(this.getPageListItem(totalPages - 1));
        pages.push(this.getPageListItem(totalPages));
      }
    }

    return pages;
  }

  render() {
    const totalPages = Math.ceil(
        this.props.totalItems / this.props.itemsPerPage);
    const showingStartRange = this.props.totalItems === 0 ? 0
        : ((this.props.activePage - 1) * this.props.itemsPerPage) + 1;
    let showingEndRange = showingStartRange + (this.props.itemsPerPage - 1);
    if (showingEndRange >= this.props.totalItems) {
      showingEndRange = this.props.totalItems;
    }
    const prevActiveState = this.props.activePage === 1 ? 'disabled' : '';
    const nextActiveState =
        this.props.activePage === totalPages ? 'disabled' : '';
    const pages = this.generatePages(totalPages);

    // TODO: Add support for filtered entries message:
    //       "(filtered from 57 total entries)"

    return (
        <div className="container-fluid">
          <div className="row">
            <div className="col pl-0 page-summary">
              Showing {showingStartRange} to {showingEndRange} of {this.props.totalItems} entries
            </div>
            <div className="col pr-0">
              <nav className="float-right">
                <ul className="pagination" aria-label="pagination">
                  <li aria-label="prev-button"
                      className={`page-item ${prevActiveState}`}
                      onClick={this.handlePrevClick}>
                    <a className="page-link">Previous</a>
                  </li>
                  {pages}
                  <li aria-label="next-button"
                      className={`page-item ${nextActiveState}`}
                      onClick={this.handleNextClick}>
                    <a className="page-link">Next</a>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
    );
  }
}

Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  itemsPerPage: PropTypes.number.isRequired,
  activePage: PropTypes.number.isRequired,
  onPreviousClick: PropTypes.func,
  onNextClick: PropTypes.func,
  onPageNavigate: PropTypes.func
};
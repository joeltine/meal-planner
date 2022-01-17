import React from 'react';

const MAX_PAGES = 9;

export class Pagination extends React.Component {
  constructor(props) {
    super(props);

    this.handlePrevClick = this.handlePrevClick.bind(this);
    this.handleNextClick = this.handleNextClick.bind(this);
    this.handlePageNavigationClick = this.handlePageNavigationClick.bind(this);
  }

  handlePageNavigationClick(page) {
    if (page != this.props.activePage) {
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
        <li className={itemClass} key={page} onClick={(e) => {
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
      for (let i = 1; i <= totalPages; i++) {
        pages.push(this.getPageListItem(i));
      }
    } else {
      if (activePage < MAX_PAGES - 2) {
        for (let i = 1; i < MAX_PAGES - 1; i++) {
          pages.push(this.getPageListItem(i));
        }
        pages.push(this.getSpacerListItem(totalPages - 1));
        pages.push(this.getPageListItem(totalPages));
      } else if (activePage > (totalPages - (MAX_PAGES - 3))) {
        pages.push(this.getPageListItem(1));
        pages.push(this.getSpacerListItem(2));
        for (let i = totalPages - (MAX_PAGES - 3); i <= totalPages; i++) {
          pages.push(this.getPageListItem(i));
        }
      } else {
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
    const showingStartRange = ((this.props.activePage - 1)
        * this.props.itemsPerPage) + 1;
    const showingEndRange = showingStartRange + (this.props.itemsPerPage - 1);
    const prevActiveState = this.props.activePage === 1 ? 'disabled' : '';
    const nextActiveState =
        this.props.activePage === totalPages ? 'disabled' : '';
    const pages = this.generatePages(totalPages);

    // TODO: Add support for filtered entries message:
    //       (filtered from 57 total entries).

    // TODO: Handle case where we have a large number of pages. Should only
    //       render at most N pages at a time.

    return (
        <div className="container">
          <div className="row">
            <div className="col pl-0">
              Showing {showingStartRange} to {showingEndRange} of {this.props.totalItems} entries
            </div>
            <div className="col pr-0">
              <nav className="float-right">
                <ul className="pagination">
                  <li className={`page-item ${prevActiveState}`}
                      onClick={this.handlePrevClick}>
                    <a className="page-link">Previous</a>
                  </li>
                  {pages}
                  <li className={`page-item ${nextActiveState}`}
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
import React from "react";
import {fireEvent, render} from '@testing-library/react'
import JasmineDOM from '@testing-library/jasmine-dom';
import {Pagination} from "./pagination";

describe('Pagination test suite', function () {

  beforeAll(() => {
    jasmine.getEnv().addMatchers(JasmineDOM);
  });

  it('should render all pages less than max pages', function () {
    const activePage = 1;
    const {getByRole, getAllByRole} = render(
        <Pagination totalItems={35}
                    itemsPerPage={10}
                    activePage={activePage}/>
    );
    const pageItems = getAllByRole('listitem');
    const prevButton = getByRole('listitem', {name: 'prev-button'});
    const nextButton = getByRole('listitem', {name: 'next-button'});
    expect(pageItems).toHaveSize(6);
    expect(prevButton).toHaveClass('disabled');
    expect(nextButton).not.toHaveClass('disabled');
    expect(pageItems.indexOf(prevButton)).toEqual(0);
    expect(pageItems.indexOf(nextButton)).toEqual(pageItems.length - 1);
    for (let i = 1; i < pageItems.length - 1; i++) {
      expect(pageItems[i]).toHaveTextContent(String(i));
      if (i === activePage) {
        expect(pageItems[i]).toHaveClass('active');
      } else {
        expect(pageItems[i]).not.toHaveClass('active');
      }
    }
  });

  it('should render first pages when active page is early', function () {
    const activePage = 2;
    const {getByRole, getAllByRole} = render(
        <Pagination totalItems={255}
                    itemsPerPage={10}
                    activePage={activePage}/>
    );
    const pageItems = getAllByRole('listitem');
    const prevButton = getByRole('listitem', {name: 'prev-button'});
    const nextButton = getByRole('listitem', {name: 'next-button'});
    expect(pageItems).toHaveSize(11);
    expect(prevButton).not.toHaveClass('disabled');
    expect(nextButton).not.toHaveClass('disabled');
    expect(pageItems.indexOf(prevButton)).toEqual(0);
    expect(pageItems.indexOf(nextButton)).toEqual(pageItems.length - 1);
    let i = 1;
    for (; i < pageItems.length - 3; i++) {
      if (i === activePage) {
        expect(pageItems[i]).toHaveClass('active');
      } else {
        expect(pageItems[i]).not.toHaveClass('active');
      }
      expect(pageItems[i]).toHaveTextContent(String(i));
    }
    expect(pageItems[i]).toHaveTextContent('...');
    expect(pageItems[i + 1]).toHaveTextContent(String(26));
  });

  it('should render last pages when active page is late', function () {
    const activePage = 24;
    const totalItems = 255;
    const itemsPerPage = 10;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const {getByRole, getAllByRole} = render(
        <Pagination totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    activePage={activePage}/>
    );
    const pageItems = getAllByRole('listitem');
    const prevButton = getByRole('listitem', {name: 'prev-button'});
    const nextButton = getByRole('listitem', {name: 'next-button'});
    expect(pageItems).toHaveSize(11);
    expect(prevButton).not.toHaveClass('disabled');
    expect(nextButton).not.toHaveClass('disabled');
    expect(pageItems.indexOf(prevButton)).toEqual(0);
    expect(pageItems.indexOf(nextButton)).toEqual(pageItems.length - 1);

    const expectedItems = {
      1: 1,
      2: '...',
      3: totalPages - 6,
      4: totalPages - 5,
      5: totalPages - 4,
      6: totalPages - 3,
      7: totalPages - 2,
      8: totalPages - 1,
      9: totalPages
    };

    for (let i = 1; i < 10; i++) {
      // prev 1 2 ..  6 7 8 .. 254 255 next
      if (pageItems[i].textContent === String(activePage)) {
        expect(pageItems[i]).toHaveClass('active');
      } else {
        expect(pageItems[i]).not.toHaveClass('active');
      }
      if (pageItems[i].textContent === '...') {
        expect(pageItems[i]).toHaveClass('disabled');
      }
      expect(pageItems[i]).toHaveTextContent(expectedItems[i]);
    }
  });

  it('should disable prev button when active page is first', function () {
    const totalItems = 255;
    const itemsPerPage = 10;
    const activePage = 1;
    const {getByRole, getAllByRole} = render(
        <Pagination totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    activePage={activePage}/>
    );
    const pageItems = getAllByRole('listitem');
    const prevButton = getByRole('listitem', {name: 'prev-button'});
    const nextButton = getByRole('listitem', {name: 'next-button'});
    expect(pageItems).toHaveSize(11);
    expect(prevButton).toHaveClass('disabled');
    expect(nextButton).not.toHaveClass('disabled');
    expect(pageItems.indexOf(prevButton)).toEqual(0);
    expect(pageItems.indexOf(nextButton)).toEqual(pageItems.length - 1);
  });

  it('should disable next button when active page is last', function () {
    const totalItems = 255;
    const itemsPerPage = 10;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const activePage = totalPages;
    const {getByRole, getAllByRole} = render(
        <Pagination totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    activePage={activePage}/>
    );
    const pageItems = getAllByRole('listitem');
    const prevButton = getByRole('listitem', {name: 'prev-button'});
    const nextButton = getByRole('listitem', {name: 'next-button'});
    expect(pageItems).toHaveSize(11);
    expect(prevButton).not.toHaveClass('disabled');
    expect(nextButton).toHaveClass('disabled');
    expect(pageItems.indexOf(prevButton)).toEqual(0);
    expect(pageItems.indexOf(nextButton)).toEqual(pageItems.length - 1);
  });

  it('should render middle nav when active page is in the middle', function () {
    const totalItems = 255;
    const itemsPerPage = 10;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const activePage = Math.floor(totalPages / 2);
    const {getByRole, getAllByRole} = render(
        <Pagination totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    activePage={activePage}/>
    );
    const pageItems = getAllByRole('listitem');
    const prevButton = getByRole('listitem', {name: 'prev-button'});
    const nextButton = getByRole('listitem', {name: 'next-button'});
    expect(pageItems).toHaveSize(11);
    expect(prevButton).not.toHaveClass('disabled');
    expect(nextButton).not.toHaveClass('disabled');
    expect(pageItems.indexOf(prevButton)).toEqual(0);
    expect(pageItems.indexOf(nextButton)).toEqual(pageItems.length - 1);

    const expectedItems = {
      1: 1,
      2: 2,
      3: '...',
      4: activePage - 1,
      5: activePage,
      6: activePage + 1,
      7: '...',
      8: totalPages - 1,
      9: totalPages
    };

    for (let i = 1; i < 10; i++) {
      // prev 1 2 ..  6 7 8 .. 254 255 next
      if (pageItems[i].textContent === String(activePage)) {
        expect(pageItems[i]).toHaveClass('active');
      } else {
        expect(pageItems[i]).not.toHaveClass('active');
      }
      if (pageItems[i].textContent === '...') {
        expect(pageItems[i]).toHaveClass('disabled');
      }
      expect(pageItems[i]).toHaveTextContent(expectedItems[i]);
    }
  });

  it('should handle prev click when prev button is enabled', function () {
    const totalItems = 255;
    const itemsPerPage = 10;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const activePage = Math.floor(totalPages / 2);
    const prevClickSpy = jasmine.createSpy();
    const {getByRole} = render(
        <Pagination totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    activePage={activePage}
                    onPreviousClick={prevClickSpy}/>
    );
    const prevButton = getByRole('listitem', {name: 'prev-button'});
    expect(prevButton).not.toHaveClass('disabled');
    fireEvent.click(prevButton);
    expect(prevClickSpy).toHaveBeenCalledOnceWith();
  });

  it('should NOT handle prev click when prev button is disabled', function () {
    const totalItems = 255;
    const itemsPerPage = 10;
    const activePage = 1;
    const prevClickSpy = jasmine.createSpy();
    const {getByRole} = render(
        <Pagination totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    activePage={activePage}
                    onPreviousClick={prevClickSpy}/>
    );
    const prevButton = getByRole('listitem', {name: 'prev-button'});
    expect(prevButton).toHaveClass('disabled');
    fireEvent.click(prevButton);
    expect(prevClickSpy).not.toHaveBeenCalled();
  });

  it('should handle next click when next button is enabled', function () {
    const totalItems = 255;
    const itemsPerPage = 10;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const activePage = Math.floor(totalPages / 2);
    const nextClickSpy = jasmine.createSpy();
    const {getByRole} = render(
        <Pagination totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    activePage={activePage}
                    onNextClick={nextClickSpy}/>
    );
    const nextButton = getByRole('listitem', {name: 'next-button'});
    expect(nextButton).not.toHaveClass('disabled');
    fireEvent.click(nextButton);
    expect(nextClickSpy).toHaveBeenCalledOnceWith();
  });

  it('should NOT handle next click when next button is disabled', function () {
    const totalItems = 255;
    const itemsPerPage = 10;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const activePage = totalPages;
    const nextClickSpy = jasmine.createSpy();
    const {getByRole} = render(
        <Pagination totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    activePage={activePage}
                    onNextClick={nextClickSpy}/>
    );
    const nextButton = getByRole('listitem', {name: 'next-button'});
    expect(nextButton).toHaveClass('disabled');
    fireEvent.click(nextButton);
    expect(nextClickSpy).not.toHaveBeenCalled();
  });

  it('should do page navigation when clicking non-active page', function () {
    const totalItems = 255;
    const itemsPerPage = 10;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const activePage = Math.floor(totalPages / 2);
    const navigateSpy = jasmine.createSpy();
    const {getByText} = render(
        <Pagination totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    activePage={activePage}
                    onPageNavigate={navigateSpy}/>
    );
    const page12 = getByText('12')
    fireEvent.click(page12);
    expect(navigateSpy).toHaveBeenCalledOnceWith(12);
  });

  it('should NOT do page navigation when clicking active page', function () {
    const totalItems = 255;
    const itemsPerPage = 10;
    const activePage = 12;
    const navigateSpy = jasmine.createSpy();
    const {getByText} = render(
        <Pagination totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    activePage={activePage}
                    onPageNavigate={navigateSpy}/>
    );
    const activeItem = getByText(activePage);
    fireEvent.click(activeItem);
    expect(navigateSpy).not.toHaveBeenCalled();
  });

  it('should render page summary correctly', function () {
    const totalItems = 255;
    const itemsPerPage = 10;
    const activePage = 12;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const {rerender, container} = render(
        <Pagination totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    activePage={activePage}/>
    );
    const pageSummary = container.querySelector('.page-summary');
    expect(pageSummary).toHaveTextContent(
        `Showing 111 to 120 of ${totalItems} entries`);

    rerender(
        <Pagination totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    activePage={totalPages}/>
    );
    expect(pageSummary).toHaveTextContent(
        `Showing 251 to ${totalItems} of ${totalItems} entries`);

    rerender(
        <Pagination totalItems={totalItems}
                    itemsPerPage={itemsPerPage}
                    activePage={1}/>
    );
    expect(pageSummary).toHaveTextContent(
        `Showing 1 to ${itemsPerPage} of ${totalItems} entries`);
  });
});

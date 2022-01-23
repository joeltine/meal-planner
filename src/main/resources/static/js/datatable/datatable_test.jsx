import React from 'react';
import JasmineDOM from '@testing-library/jasmine-dom';
import 'jasmine-ajax';
import {fireEvent, render} from '@testing-library/react';
import {DataTable} from './datatable';
import userEvent from "@testing-library/user-event";

describe('DataTable test suite', function () {

  beforeAll(() => {
    jasmine.getEnv().addMatchers(JasmineDOM);
    window.CSRF_HEADER_NAME = '_csrf';
    window.CSRF_TOKEN = '12345abcdef';
  });

  beforeEach(() => {
    jasmine.Ajax.install();
    jasmine.clock().install();
  });

  afterEach(() => {
    jasmine.Ajax.uninstall();
    jasmine.clock().uninstall();
  });

  it('should fetch initial data, render, and look like a new datatable app',
      function () {
        // Render the table and return AJAX init data.
        const {getByRole, getByText} = render(<DataTable dataSource={'/foo'}/>);
        let requests = jasmine.Ajax.requests;
        expect(requests.count()).toBe(1);
        let request = requests.mostRecent();
        expect(request.url).toBe('/foo');
        expect(request.method).toBe('GET');
        const tableData = [{id: 0, foo: "bar"}, {id: 1, foo: "bat"}];
        request.respondWith({
          'status': 200,
          'contentType': 'application/json',
          'responseText': JSON.stringify(tableData),
        });

        // Verify searchbox and two buttons.
        expect(getByRole('textbox')).toBeVisible();
        expect(getByRole('button', {name: 'Add New Row'})).toBeVisible();
        expect(getByRole('button', {name: 'Delete Selected'})).toBeVisible();

        // Verify table looks right.
        const table = getByRole('table');
        expect(table).toBeVisible();
        const thead = table.querySelector('thead');
        const tbody = table.querySelector('tbody');
        const tfoot = table.querySelector('tfoot');
        const headers = Array.from(thead.querySelectorAll('th'));
        const footers = Array.from(tfoot.querySelectorAll('th'));
        const headerText = [];
        const footerText = [];
        for (let i = 0; i < headers.length; i++) {
          headerText.push(headers[i].textContent);
          footerText.push(footers[i].textContent);
        }
        expect(headerText).toEqual(
            jasmine.arrayWithExactContents(['id', 'foo']));
        expect(footerText).toEqual(
            jasmine.arrayWithExactContents(['id', 'foo']));
        expect(tbody.querySelectorAll('tr').length).toEqual(2);

        // Verify pagination
        const pagination = getByRole('list', {name: 'pagination'});
        expect(pagination.querySelectorAll('li').length).toEqual(3);
        expect(getByText('Showing 1 to 2 of 2 entries')).toBeVisible();
      });

  it('should filter when searchbox input is entered', async function () {
    const dataTableRef = React.createRef();
    const {getByRole} = render(
        <DataTable ref={dataTableRef} dataSource={'/foo'}/>);
    let requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(1);
    let request = requests.mostRecent();
    expect(request.url).toBe('/foo');
    expect(request.method).toBe('GET');
    const tableData = [
      {id: 0, foo: "bar", bar: ["inner", "2nd"], bat: {b: "charizard"}},
      {id: 1, foo: "bat", bar: ["inner"], bat: {z: "pikachu"}},
      {id: 2, foo: "some stuff", bar: ["inner"], bat: {c: "henry"}},
      {id: 3, foo: "other stuff", bar: ["outer"], bat: {d: "123"}},
      {id: 4, foo: "hypno toad", bar: ["inner"], bat: {bee: "mo"}},
      {id: 5, foo: "dude", bar: ["inner"], bat: {happ: "poignant"}},
      {id: 6, foo: "what", bar: ["loopy"], bat: {ino: "number"}},
      {id: 7, foo: "are", bar: ["js"], bat: {abba: "missisi"}},
      {id: 8, foo: "you about", bar: ["sinner"], bat: {b: "love"}},
      {id: 9, foo: "some 123 nums", bar: ["inner"], bat: {bc: "stuffed"}},
      {id: 10, foo: "fake here", bar: ["inner"], bat: {bo: "hot"}},
      {id: 11, foo: "bat", bar: ["inner"], bat: {t: "jill"}}];
    request.respondWith({
      'status': 200,
      'contentType': 'application/json',
      'responseText': JSON.stringify(tableData),
    });

    let searchbox = getByRole('textbox');

    // White space only does nothing.
    expect(dataTableRef.current.getFullData().length).toEqual(12);
    await userEvent.type(searchbox, '  ');
    // The search method is debounced and can delay triggering searching 300ms
    // after the last character is typed. We need to tick forward to ensure
    // changes are propagated.
    jasmine.clock().tick(500);
    expect(dataTableRef.current.getFullData().length).toEqual(12);

    // Test both that search queries are trimmed and that array contents are
    // filtered.
    await userEvent.clear(searchbox);
    await userEvent.type(searchbox, '   loopy   ');
    jasmine.clock().tick(500);
    expect(dataTableRef.current.getFullData().length).toEqual(1);

    // Test object keys and values are filterable.
    await userEvent.clear(searchbox);
    await userEvent.type(searchbox, 'missisi');
    jasmine.clock().tick(500);
    expect(dataTableRef.current.getFullData().length).toEqual(1);
    await userEvent.clear(searchbox);
    await userEvent.type(searchbox, 'abba');
    jasmine.clock().tick(500);
    expect(dataTableRef.current.getFullData().length).toEqual(1);

    // Tests query for number fields and substrings in different types.
    await userEvent.clear(searchbox);
    await userEvent.type(searchbox, '2');
    jasmine.clock().tick(500);
    expect(dataTableRef.current.getFullData().length).toEqual(4);

    // Tests backspace triggers new search.
    await userEvent.clear(searchbox);
    await userEvent.type(searchbox, 'stuffe');
    jasmine.clock().tick(500);
    expect(dataTableRef.current.getFullData().length).toEqual(1);
    await userEvent.type(searchbox, '[Backspace]');
    jasmine.clock().tick(500);
    expect(dataTableRef.current.getFullData().length).toEqual(3);
  });

  it('should preserve sort order when filtering', async function () {
    const dataTableRef = React.createRef();
    const {getByRole} = render(
        <DataTable ref={dataTableRef} dataSource={'/foo'}/>);
    let requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(1);
    let request = requests.mostRecent();
    expect(request.url).toBe('/foo');
    expect(request.method).toBe('GET');
    const tableData = [
      {id: 0, foo: "bar", bar: ["inner", "2nd"], bat: {b: "charizard"}},
      {id: 1, foo: "bat", bar: ["inner"], bat: {z: "pikachu"}},
      {id: 2, foo: "some stuff", bar: ["inner"], bat: {c: "henry"}},
      {id: 3, foo: "other stuff", bar: ["outer"], bat: {d: "123"}},
      {id: 4, foo: "hypno toad", bar: ["inner"], bat: {bee: "mo"}},
      {id: 5, foo: "dude", bar: ["inner"], bat: {happ: "poignant"}},
      {id: 6, foo: "what", bar: ["loopy"], bat: {ino: "number"}},
      {id: 7, foo: "are", bar: ["js"], bat: {abba: "missisi"}},
      {id: 8, foo: "you about", bar: ["sinner"], bat: {b: "love"}},
      {id: 9, foo: "some 123 nums", bar: ["inner"], bat: {bc: "stuffed"}},
      {id: 10, foo: "fake here", bar: ["inner"], bat: {bo: "hot"}},
      {id: 11, foo: "bat", bar: ["inner"], bat: {t: "jill"}}];
    request.respondWith({
      'status': 200,
      'contentType': 'application/json',
      'responseText': JSON.stringify(tableData),
    });

    let searchbox = getByRole('textbox');

    // Sort the first column.
    const thead = getByRole('rowgroup', {name: 'table-header'});
    const headers = thead.querySelectorAll('th');
    let idIndex;
    // In theory, "id" should always be 0, but I'm not going to rely on object
    // keys being ordered.
    for (let i = 0; i < headers.length; i++) {
      if (headers[i].textContent === 'id') {
        idIndex = i;
        break;
      }
    }

    // Sort id descending
    fireEvent.click(headers[idIndex]);
    let fullData = dataTableRef.current.getFullData();
    // Looks vaguely sorted.. other tests will do more comprehensive assertions.
    expect(fullData[0].id).toEqual(11);
    expect(fullData[1].id).toEqual(10);

    // Filter on "2".
    await userEvent.type(searchbox, '2');
    jasmine.clock().tick(500);
    fullData = dataTableRef.current.getFullData();
    expect(fullData.length).toEqual(4);
    expect(fullData[0].id).toEqual(9); // "some 123 nums"
    expect(fullData[1].id).toEqual(3); // {d: "123"}
    expect(fullData[2].id).toEqual(2); // id: 2
    expect(fullData[3].id).toEqual(0); // bar: ["inner", "2nd"]
  });

  it('should reset page to 1 on filter', async function () {
    const dataTableRef = React.createRef();
    const {getByRole} = render(
        <DataTable ref={dataTableRef} dataSource={'/foo'}/>);
    let requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(1);
    let request = requests.mostRecent();
    expect(request.url).toBe('/foo');
    expect(request.method).toBe('GET');
    const tableData = [
      {id: 0, foo: "bar", bar: ["inner", "2nd"], bat: {b: "charizard"}},
      {id: 1, foo: "bat", bar: ["inner"], bat: {z: "pikachu"}},
      {id: 2, foo: "some stuff", bar: ["inner"], bat: {c: "henry"}},
      {id: 3, foo: "other stuff", bar: ["outer"], bat: {d: "123"}},
      {id: 4, foo: "hypno toad", bar: ["inner"], bat: {bee: "mo"}},
      {id: 5, foo: "dude", bar: ["inner"], bat: {happ: "poignant"}},
      {id: 6, foo: "what", bar: ["loopy"], bat: {ino: "number"}},
      {id: 7, foo: "are", bar: ["js"], bat: {abba: "missisi"}},
      {id: 8, foo: "you about", bar: ["sinner"], bat: {b: "love"}},
      {id: 9, foo: "some 123 nums", bar: ["inner"], bat: {bc: "stuffed"}},
      {id: 10, foo: "fake here", bar: ["inner"], bat: {bo: "hot"}},
      {id: 11, foo: "bat", bar: ["innr"], bat: {t: "jill"}}];
    request.respondWith({
      'status': 200,
      'contentType': 'application/json',
      'responseText': JSON.stringify(tableData),
    });

    let searchbox = getByRole('textbox');
    const pagination = getByRole('list', {name: 'pagination'});
    let pages = pagination.querySelectorAll('li');
    expect(pages.length).toEqual(4);

    // Navigate to page 2
    fireEvent.click(pages[2]);
    const tbody = getByRole('rowgroup', {name: 'table-body'});
    let rows = Array.from(tbody.querySelectorAll('tr'));
    expect(rows.length).toEqual(2);

    // Filter on "e", only one row doesn't have "e".
    await userEvent.type(searchbox, 'e');
    jasmine.clock().tick(500);
    rows = Array.from(tbody.querySelectorAll('tr'));
    expect(rows.length).toEqual(10);
    pages = pagination.querySelectorAll('li');
    expect(pages.length).toEqual(4); // Still have all pages
    expect(pagination.querySelector('li.active').textContent).toEqual('1');
  });

  // Tests to be written:
  // - Column sorting
  //  - Sorting preserved before/after filter
  //  - Sorting preserved on pagination
  //  - Sorting preserved on pagination
  //  - Adding new rows in are sorted properly while and not filtering table
  // - Add new row
  //  - New row in data set before/after filtering
  //  - Row shows up in table
  //  - New rows added are visible or not visible depending on page+sort
  //  - Success toast
  // - Delete rows
  //  - Deletes only selected rows, no selection does nothing
  //  - Deletes are persisted after clearing filter
  //  - Shows success toast
  // - Pagination
  //  - Clicking number changes page
  //  - Clicking next/prev traverses data set
  // - Cell editing
  //  - Double click + edit cell is reflected in the table and dataset
  //  - Failure on server restores row+cell value to original
  // - Toasts on error
  //  - Bad Ajax request shows error

});
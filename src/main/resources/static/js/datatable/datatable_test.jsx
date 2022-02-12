import 'jasmine-ajax';

import JasmineDOM from '@testing-library/jasmine-dom';
import {fireEvent, render} from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import React from 'react';

import {DataTable} from './datatable';

const DATA_SOURCE = '/foo';

/**
 * Given a thead element, find the index of the th matching "text".
 */
function getColIndexForText(thead, text) {
  const headers = thead.querySelectorAll('th');
  let index;
  for (let i = 0; i < headers.length; i++) {
    if (headers[i].textContent === text) {
      index = i;
      break;
    }
  }
  return index;
}

function respondWithAjaxTableData(tableData) {
  let requests = jasmine.Ajax.requests;
  expect(requests.count()).toBe(1);
  let request = requests.mostRecent();
  expect(request.url).toBe(DATA_SOURCE);
  expect(request.method).toBe('GET');
  request.respondWith({
    'status': 200,
    'contentType': 'application/json',
    'responseText': JSON.stringify(tableData),
  });
}

function assertRowsSortedDescendingByNumberColumn(rows, colIndex) {
  let lastNum = Infinity;
  for (let i = 0; i < rows.length; i++) {
    const numCell = rows[i].querySelectorAll('td')[colIndex];
    const num = Number(numCell.textContent);
    expect(num).toBeLessThanOrEqual(lastNum);
    lastNum = num;
  }
}

function assertRowsSortedAscendingByNumberColumn(rows, colIndex) {
  let lastNum = -Infinity;
  for (let i = 0; i < rows.length; i++) {
    const numCell = rows[i].querySelectorAll('td')[colIndex];
    const num = Number(numCell.textContent);
    expect(num).toBeGreaterThanOrEqual(lastNum);
    lastNum = num;
  }
}

function assertRowsSortedDescendingByStringColumn(rows, colIndex) {
  let lastStr = null;
  for (let i = 0; i < rows.length; i++) {
    const strCell = rows[i].querySelectorAll('td')[colIndex];
    const str = strCell.textContent;
    if (lastStr != null) {
      expect(str <= lastStr).withContext(`${str} <= ${lastStr}`).toBeTrue();
    }
    lastStr = str;
  }
}

function assertRowsSortedAscendingByStringColumn(rows, colIndex) {
  let lastStr = null;
  for (let i = 0; i < rows.length; i++) {
    const strCell = rows[i].querySelectorAll('td')[colIndex];
    const str = strCell.textContent;
    if (lastStr != null) {
      expect(str >= lastStr).withContext(`${str} >= ${lastStr}`).toBeTrue();
    }
    lastStr = str;
  }
}

function assertRowsSortedDescendingByArrayColumn(rows, colIndex) {
  let lastStr = null;
  for (let i = 0; i < rows.length; i++) {
    const arrCell = rows[i].querySelectorAll('td')[colIndex];
    const arr = JSON.parse(arrCell.textContent);
    if (lastStr != null) {
      expect(arr[0] <= lastStr).withContext(
          `${arr[0]} <= ${lastStr}`).toBeTrue();
    }
    lastStr = arr[0];
  }
}

function assertRowsSortedAscendingByArrayColumn(rows, colIndex) {
  let lastStr = null;
  for (let i = 0; i < rows.length; i++) {
    const arrCell = rows[i].querySelectorAll('td')[colIndex];
    const arr = JSON.parse(arrCell.textContent);
    if (lastStr != null) {
      expect(arr[0] >= lastStr).withContext(
          `${arr[0]} >= ${lastStr}`).toBeTrue();
    }
    lastStr = arr[0];
  }
}

async function addNewRowToTable(getByRole, newData) {
  const addNewButton = getByRole('button', {name: 'Add New Row'});
  fireEvent.click(addNewButton);
  const form = getByRole('form', {name: 'new-row-form'});
  for (const [key, val] of Object.entries(newData)) {
    const input = form.querySelector(`input[placeholder="${key}"]`);
    expect(input).toBeInTheDocument();
    await userEvent.type(input, val);
  }
  const saveButton = getByRole('button', {name: 'Save'});
  fireEvent.click(saveButton);
}

function assertRowInTableTimes(getByRole, rowToFind, times) {
  const tbody = getByRole('rowgroup', {name: 'table-body'});
  const nextButton = getByRole('listitem', {name: 'next-button'});
  const idIndex = getColIndexForText(
      getByRole('rowgroup', {name: 'table-header'}), 'id');
  const pagination = getByRole('list', {name: 'pagination'});
  let pages = pagination.querySelectorAll('li').length - 2;
  let found = 0;
  while (pages >= 1) {
    const rows = tbody.querySelectorAll('tr');
    for (let row of rows) {
      const cells = row.querySelectorAll('td');
      if (cells[idIndex].textContent === rowToFind[0]) {
        const cellValues = [];
        for (let cell of cells) {
          cellValues.push(cell.textContent);
        }
        expect(cellValues).toEqual(
            jasmine.arrayWithExactContents(rowToFind));
        found++;
      }
    }
    fireEvent.click(nextButton);
    pages--;
  }

  expect(found).toEqual(times);
}

function assertRowInDataTimes(data, rowToFind, times) {
  let found = 0;
  for (let row of data) {
    if (row.id === rowToFind.id) {
      expect(row).toEqual(rowToFind);
      found++;
    }
  }
  expect(found).toEqual(times);
}

function assertSuccessToast(expectedText) {
  const successToast = document.querySelector('.toast-success');
  expect(successToast).withContext(
      '.toast-success should be in the document').toBeInTheDocument();
  expect(successToast.querySelector('.toast-body').textContent).withContext(
      `.toast-success should have content ${expectedText}`).toContain(
      expectedText);
}

function assertErrorToast(expectedText) {
  const errorToast = document.querySelector('.toast-error');
  expect(errorToast).withContext(
      '.toast-error should be in the document').toBeInTheDocument();
  expect(errorToast.querySelector('.toast-body').textContent).withContext(
      `.toast-error should have content ${expectedText}`).toContain(
      expectedText);
}

describe('DataTable test suite', function () {
  let tableData;
  let toastContainer;

  beforeAll(() => {
    jasmine.getEnv().addMatchers(JasmineDOM);
    window.CSRF_HEADER_NAME = '_csrf';
    window.CSRF_TOKEN = '12345abcdef';
    toastContainer = document.createElement('div');
    toastContainer.setAttribute('id', 'toastContainer');
    document.body.appendChild(toastContainer);
  });

  afterAll(() => {
    toastContainer.remove();
  });

  beforeEach(() => {
    jasmine.Ajax.install();
    jasmine.clock().install();
    tableData = [
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
  });

  afterEach((done) => {
    jasmine.Ajax.uninstall();
    // Clear any toasts on timers hanging around.
    jasmine.clock().tick(5000);
    jasmine.clock().uninstall();
    // Clear any permanent toasts still on the page.
    const toasts = Array.from(
        document.getElementById('toastContainer').querySelectorAll('.toast'));
    let total = toasts.length;
    toasts.forEach((toast) => {
      const $toast = $(toast);
      $toast.toast('hide');
      // Hide is async, so we need to only finish the test after all toasts
      // are gone.
      $toast.on('hidden.bs.toast', function () {
        total--;
        if (total === 0) {
          done();
        }
      });
    });

    tableData = null;
    if (!total) {
      done();
    }
  });

  it('should fetch initial data, render, and look like a new datatable app',
      function () {
        // Render the table and return AJAX init data.
        const {getByRole, getByText} = render(<DataTable
            dataSource={DATA_SOURCE}/>);
        let requests = jasmine.Ajax.requests;
        expect(requests.count()).toBe(1);
        let request = requests.mostRecent();
        expect(request.url).toBe(DATA_SOURCE);
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
        <DataTable ref={dataTableRef} dataSource={DATA_SOURCE}/>);

    respondWithAjaxTableData(tableData);

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
        <DataTable ref={dataTableRef} dataSource={DATA_SOURCE}/>);

    respondWithAjaxTableData(tableData);

    let searchbox = getByRole('textbox');

    // Sort the id column.
    const thead = getByRole('rowgroup', {name: 'table-header'});
    const headers = thead.querySelectorAll('th');
    let idIndex = getColIndexForText(thead, 'id');

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

    // Reset filter, full data and table should be sorted still.
    await userEvent.clear(searchbox);
    jasmine.clock().tick(500);
    fullData = dataTableRef.current.getFullData();
    let minId = Infinity;
    for (let i = 0; i < fullData.length; i++) {
      expect(fullData[i].id).toBeLessThanOrEqual(minId);
      minId = fullData[i].id;
    }

    const tbody = getByRole('rowgroup', {name: 'table-body'});
    assertRowsSortedDescendingByNumberColumn(tbody.querySelectorAll('tr'),
        idIndex);
    const nextButton = getByRole('listitem', {name: 'next-button'});
    // Next page should be sorted too.
    fireEvent.click(nextButton);
    assertRowsSortedDescendingByNumberColumn(tbody.querySelectorAll('tr'),
        idIndex);
  });

  it('should reset page to 1 on filter', async function () {
    const dataTableRef = React.createRef();
    const {getByRole} = render(
        <DataTable ref={dataTableRef} dataSource={DATA_SOURCE}/>);

    respondWithAjaxTableData(tableData);

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

  it('should sort number-based column', function () {
    const dataTableRef = React.createRef();
    const {getByRole} = render(
        <DataTable ref={dataTableRef} dataSource={DATA_SOURCE}/>);

    respondWithAjaxTableData(tableData);

    const thead = getByRole('rowgroup', {name: 'table-header'});
    const headers = thead.querySelectorAll('th');
    let idIndex = getColIndexForText(thead, 'id');

    // Sort id descending
    fireEvent.click(headers[idIndex]);

    // Full data sorted on id.
    let fullData = dataTableRef.current.getFullData();
    let minId = Infinity;
    for (let i = 0; i < fullData.length; i++) {
      expect(fullData[i].id).toBeLessThanOrEqual(minId);
      minId = fullData[i].id;
    }

    // Table rows also sorted on id.
    const tbody = getByRole('rowgroup', {name: 'table-body'});
    assertRowsSortedDescendingByNumberColumn(tbody.querySelectorAll('tr'),
        idIndex);
    const nextButton = getByRole('listitem', {name: 'next-button'});
    // Next page should be sorted too.
    fireEvent.click(nextButton);
    assertRowsSortedDescendingByNumberColumn(tbody.querySelectorAll('tr'),
        idIndex);

    // Sort ascending
    fireEvent.click(headers[idIndex]);

    // Full data sorted
    fullData = dataTableRef.current.getFullData();
    let maxId = -Infinity;
    for (let i = 0; i < fullData.length; i++) {
      expect(fullData[i].id).toBeGreaterThanOrEqual(maxId);
      maxId = fullData[i].id;
    }

    // Table rows also sorted
    assertRowsSortedAscendingByNumberColumn(tbody.querySelectorAll('tr'),
        idIndex);
    // Next page should be sorted too.
    const prevButton = getByRole('listitem', {name: 'prev-button'});
    fireEvent.click(prevButton);
    assertRowsSortedAscendingByNumberColumn(tbody.querySelectorAll('tr'),
        idIndex);
  });

  it('should sort string-based column', function () {
    const dataTableRef = React.createRef();
    const {getByRole} = render(
        <DataTable ref={dataTableRef} dataSource={DATA_SOURCE}/>);

    respondWithAjaxTableData(tableData);

    const thead = getByRole('rowgroup', {name: 'table-header'});
    const headers = thead.querySelectorAll('th');
    let fooIndex = getColIndexForText(thead, 'foo');

    // Sort foo descending
    fireEvent.click(headers[fooIndex]);

    // Full data sorted on foo.
    let fullData = dataTableRef.current.getFullData();
    let lastString = null;
    for (let i = 0; i < fullData.length; i++) {
      if (lastString != null) {
        expect(fullData[i].foo <= lastString).withContext(
            `${fullData[i].foo} <= ${lastString}`).toBeTrue();
      }
      lastString = fullData[i].foo;
    }

    // Table rows also sorted on foo.
    const tbody = getByRole('rowgroup', {name: 'table-body'});
    assertRowsSortedDescendingByStringColumn(tbody.querySelectorAll('tr'),
        fooIndex);
    const nextButton = getByRole('listitem', {name: 'next-button'});
    // Next page should be sorted too.
    fireEvent.click(nextButton);
    assertRowsSortedDescendingByStringColumn(tbody.querySelectorAll('tr'),
        fooIndex);

    // Sort ascending
    fireEvent.click(headers[fooIndex]);

    // Full data sorted
    fullData = dataTableRef.current.getFullData();
    let lastStr = null;
    for (let i = 0; i < fullData.length; i++) {
      if (lastStr != null) {
        expect(fullData[i].foo >= lastStr).withContext(
            `${fullData[i].foo} >= ${lastStr}`).toBeTrue();
      }
      lastStr = fullData[i].foo;
    }

    // Table rows also sorted
    assertRowsSortedAscendingByStringColumn(tbody.querySelectorAll('tr'),
        fooIndex);
    // Prev page should be sorted too.
    const prevButton = getByRole('listitem', {name: 'prev-button'});
    fireEvent.click(prevButton);
    assertRowsSortedAscendingByStringColumn(tbody.querySelectorAll('tr'),
        fooIndex);
  });

  it('should sort array-based column', function () {
    const dataTableRef = React.createRef();
    const {getByRole} = render(
        <DataTable ref={dataTableRef} dataSource={DATA_SOURCE}/>);

    respondWithAjaxTableData(tableData);

    const thead = getByRole('rowgroup', {name: 'table-header'});
    const headers = thead.querySelectorAll('th');
    let barIndex = getColIndexForText(thead, 'bar');

    // Sort bar descending
    fireEvent.click(headers[barIndex]);

    // Full data sorted on bar.
    let fullData = dataTableRef.current.getFullData();
    let lastString = null;
    for (let i = 0; i < fullData.length; i++) {
      if (lastString != null) {
        expect(fullData[i].bar[0] <= lastString).withContext(
            `${fullData[i].bar[0]} <= ${lastString}`).toBeTrue();
      }
      lastString = fullData[i].bar[0];
    }

    // Table rows also sorted on bar.
    const tbody = getByRole('rowgroup', {name: 'table-body'});
    assertRowsSortedDescendingByArrayColumn(tbody.querySelectorAll('tr'),
        barIndex);
    const nextButton = getByRole('listitem', {name: 'next-button'});
    // Next page should be sorted too.
    fireEvent.click(nextButton);
    assertRowsSortedDescendingByArrayColumn(tbody.querySelectorAll('tr'),
        barIndex);

    // Sort ascending
    fireEvent.click(headers[barIndex]);

    // Full data sorted
    fullData = dataTableRef.current.getFullData();
    let lastStr = null;
    for (let i = 0; i < fullData.length; i++) {
      if (lastStr != null) {
        expect(fullData[i].bar[0] >= lastStr).withContext(
            `${fullData[i].bar[0]} >= ${lastStr}`).toBeTrue();
      }
      lastStr = fullData[i].bar[0];
    }

    // Table rows also sorted
    assertRowsSortedAscendingByArrayColumn(tbody.querySelectorAll('tr'),
        barIndex);
    // Prev page should be sorted too.
    const prevButton = getByRole('listitem', {name: 'prev-button'});
    fireEvent.click(prevButton);
    assertRowsSortedAscendingByArrayColumn(tbody.querySelectorAll('tr'),
        barIndex);
  });

  it('should sort object-based column', function () {
    const dataTableRef = React.createRef();
    const {getByRole} = render(
        <DataTable ref={dataTableRef} dataSource={DATA_SOURCE}/>);

    respondWithAjaxTableData(tableData);

    const thead = getByRole('rowgroup', {name: 'table-header'});
    const headers = thead.querySelectorAll('th');
    let batIndex = getColIndexForText(thead, 'bat');

    // Sort bat descending
    fireEvent.click(headers[batIndex]);

    // Full data sorted on bat.
    let fullData = dataTableRef.current.getFullData();
    let lastString = null;
    for (let i = 0; i < fullData.length; i++) {
      const stringified = JSON.stringify(fullData[i].bat);
      if (lastString != null) {
        expect(stringified <= lastString).withContext(
            `${stringified} <= ${lastString}`).toBeTrue();
      }
      lastString = stringified;
    }

    // Table rows also sorted on bat.
    const tbody = getByRole('rowgroup', {name: 'table-body'});
    // We sort on stringified objects, so asserting as a string column is fine.
    assertRowsSortedDescendingByStringColumn(tbody.querySelectorAll('tr'),
        batIndex);
    const nextButton = getByRole('listitem', {name: 'next-button'});
    // Next page should be sorted too.
    fireEvent.click(nextButton);
    assertRowsSortedDescendingByStringColumn(tbody.querySelectorAll('tr'),
        batIndex);

    // Sort ascending
    fireEvent.click(headers[batIndex]);

    // Full data sorted
    fullData = dataTableRef.current.getFullData();
    let lastStr = null;
    for (let i = 0; i < fullData.length; i++) {
      const stringified = JSON.stringify(fullData[i].bat);
      if (lastStr != null) {
        expect(stringified >= lastStr).withContext(
            `${stringified} >= ${lastStr}`).toBeTrue();
      }
      lastStr = stringified;
    }

    // Table rows also sorted
    assertRowsSortedAscendingByStringColumn(tbody.querySelectorAll('tr'),
        batIndex);
    // Prev page should be sorted too.
    const prevButton = getByRole('listitem', {name: 'prev-button'});
    fireEvent.click(prevButton);
    assertRowsSortedAscendingByStringColumn(tbody.querySelectorAll('tr'),
        batIndex);
  });

  it('should add new row to table', async function () {
    const dataTableRef = React.createRef();
    const {getByRole} = render(
        <DataTable ref={dataTableRef} dataSource={DATA_SOURCE}/>);

    respondWithAjaxTableData(tableData);

    await addNewRowToTable(getByRole,
        {foo: 'holy moly', bar: '[["awesome"]', bat: '{{"igadi": "muscles"}'});

    let requests = jasmine.Ajax.requests;
    let request = requests.mostRecent();
    expect(request.url).toBe(DATA_SOURCE);
    expect(request.method).toBe('POST');
    request.respondWith({
      'status': 200,
      'contentType': 'application/json',
      'responseText': '{"id": 69, "foo": "holy moly", "bar": ["awesome"], "bat": {"igadi": "muscles"}}'
    });

    assertSuccessToast('Added new row with id: 69');

    let fullData = dataTableRef.current.getFullData();
    assertRowInDataTimes(fullData,
        {id: 69, foo: 'holy moly', bar: ['awesome'], bat: {igadi: 'muscles'}},
        1);
    assertRowInTableTimes(getByRole,
        ['69', 'holy moly', '["awesome"]', '{"igadi":"muscles"}'], 1);
  });

  it('should add new row to table while filtered', async function () {
    const dataTableRef = React.createRef();
    const {getByRole} = render(
        <DataTable ref={dataTableRef} dataSource={DATA_SOURCE}/>);

    respondWithAjaxTableData(tableData);

    const searchbox = getByRole('textbox');
    await userEvent.type(searchbox, 'pikachu');
    jasmine.clock().tick(500);

    await addNewRowToTable(getByRole,
        {foo: 'holy moly', bar: '[["awesome"]', bat: '{{"igadi": "muscles"}'});

    let requests = jasmine.Ajax.requests;
    let request = requests.mostRecent();
    expect(request.url).toBe(DATA_SOURCE);
    expect(request.method).toBe('POST');
    request.respondWith({
      'status': 200,
      'contentType': 'application/json',
      'responseText': '{"id": 69, "foo": "holy moly", "bar": ["awesome"], "bat": {"igadi": "muscles"}}'
    });

    // Not in table or fulldata, until we clear filter.
    let fullData = dataTableRef.current.getFullData();
    assertRowInDataTimes(fullData,
        {id: 69, foo: 'holy moly', bar: ['awesome'], bat: {igadi: 'muscles'}},
        0);
    assertRowInTableTimes(getByRole,
        ['69', 'holy moly', '["awesome"]', '{"igadi":"muscles"}'], 0);

    // Clear the filter and it's there
    await userEvent.clear(searchbox);
    jasmine.clock().tick(500);
    fullData = dataTableRef.current.getFullData();
    assertRowInDataTimes(fullData,
        {id: 69, foo: 'holy moly', bar: ['awesome'], bat: {igadi: 'muscles'}},
        1);
    assertRowInTableTimes(getByRole,
        ['69', 'holy moly', '["awesome"]', '{"igadi":"muscles"}'], 1);
  });

  it('should add new row to table and preserve sorting', async function () {
    const dataTableRef = React.createRef();
    const {getByRole} = render(
        <DataTable ref={dataTableRef} dataSource={DATA_SOURCE}/>);

    respondWithAjaxTableData(tableData);

    // Sort the id column.
    const thead = getByRole('rowgroup', {name: 'table-header'});
    const headers = thead.querySelectorAll('th');
    let idIndex = getColIndexForText(thead, 'id');

    // Sort id ascending
    fireEvent.click(headers[idIndex]);
    fireEvent.click(headers[idIndex]);

    const searchbox = getByRole('textbox');
    await userEvent.type(searchbox, 'h');
    jasmine.clock().tick(500);

    await addNewRowToTable(getByRole,
        {foo: 'holy moly', bar: '[["awesome"]', bat: '{{"igadi": "muscles"}'});

    let requests = jasmine.Ajax.requests;
    let request = requests.mostRecent();
    expect(request.url).toBe(DATA_SOURCE);
    expect(request.method).toBe('POST');
    request.respondWith({
      'status': 200,
      'contentType': 'application/json',
      'responseText': '{"id": 69, "foo": "holy moly", "bar": ["awesome"], "bat": {"igadi": "muscles"}}'
    });

    // Should be visible with current filter
    let fullData = dataTableRef.current.getFullData();
    assertRowInDataTimes(fullData,
        {id: 69, foo: 'holy moly', bar: ['awesome'], bat: {igadi: 'muscles'}},
        1);
    assertRowInTableTimes(getByRole,
        ['69', 'holy moly', '["awesome"]', '{"igadi":"muscles"}'], 1);
    // And results are sorted
    assertRowsSortedAscendingByNumberColumn(
        getByRole('rowgroup', {name: 'table-body'}).querySelectorAll('tr'),
        idIndex);

    // Clear the filter and it's still there
    await userEvent.clear(searchbox);
    jasmine.clock().tick(500);
    fullData = dataTableRef.current.getFullData();
    assertRowInDataTimes(fullData,
        {id: 69, foo: 'holy moly', bar: ['awesome'], bat: {igadi: 'muscles'}},
        1);
    assertRowInTableTimes(getByRole,
        ['69', 'holy moly', '["awesome"]', '{"igadi":"muscles"}'], 1);
    // And results are sorted
    assertRowsSortedAscendingByNumberColumn(
        getByRole('rowgroup', {name: 'table-body'}).querySelectorAll('tr'),
        idIndex);
  });

  it('should delete selected rows', function () {
    const dataTableRef = React.createRef();
    const {getByRole} = render(
        <DataTable ref={dataTableRef} dataSource={DATA_SOURCE}/>);

    respondWithAjaxTableData(tableData);
    const deleteButton = getByRole('button', {name: 'Delete Selected'});

    // No DELETE request should happen with nothing selected.
    fireEvent.click(deleteButton);
    let requests = jasmine.Ajax.requests;
    let request = requests.mostRecent();
    expect(request.url).toBe(DATA_SOURCE);
    expect(request.method).toBe('GET');

    let fullData = dataTableRef.current.getFullData();
    const row0 = Object.assign({}, fullData[0]);
    const row3 = Object.assign({}, fullData[3]);
    const row7 = Object.assign({}, fullData[7]);

    // Click some rows and delete them.
    const rows = getByRole('rowgroup', {name: 'table-body'}).querySelectorAll(
        'tr');
    fireEvent.click(rows[0]); // id = 0
    fireEvent.click(rows[3]); // id = 3
    fireEvent.click(rows[7]); // id = 7
    fireEvent.click(deleteButton);
    requests = jasmine.Ajax.requests;
    request = requests.mostRecent();
    expect(request.url).toBe(DATA_SOURCE);
    expect(request.method).toBe('DELETE');
    request.respondWith({
      'status': 200,
      'contentType': 'text/plain',
      'responseText': 'Success!'
    });

    assertSuccessToast('Successfully deleted rows with ids: 0, 3, 7');

    fullData = dataTableRef.current.getFullData();
    let deletedIds = [0, 3, 7];
    for (let row of fullData) {
      expect(deletedIds.indexOf(row.id)).withContext(
          `row.id=${row.id}`).toEqual(-1);
    }

    // Assert deleted rows not in HTML table either.
    assertRowInTableTimes(getByRole, row0, 0);
    assertRowInTableTimes(getByRole, row3, 0);
    assertRowInTableTimes(getByRole, row7, 0);
  });

  it('should delete selected rows while table is filtered', async function () {
    const dataTableRef = React.createRef();
    const {getByRole} = render(
        <DataTable ref={dataTableRef} dataSource={DATA_SOURCE}/>);

    respondWithAjaxTableData(tableData);

    const deleteButton = getByRole('button', {name: 'Delete Selected'});
    let fullData = dataTableRef.current.getFullData();
    const row3 = Object.assign({}, fullData[3]);
    const row9 = Object.assign({}, fullData[9]);
    let searchbox = getByRole('textbox');

    // Filter table.
    await userEvent.type(searchbox, 'stuff');
    jasmine.clock().tick(500);

    // Click some rows and delete them.
    const rows = getByRole('rowgroup', {name: 'table-body'}).querySelectorAll(
        'tr');
    fireEvent.click(rows[1]); // id=3, foo: "other stuff"
    fireEvent.click(rows[2]); // id=9, bat: {bc: "stuffed"}
    fireEvent.click(deleteButton);
    let requests = jasmine.Ajax.requests;
    let request = requests.mostRecent();
    expect(request.url).toBe(DATA_SOURCE);
    expect(request.method).toBe('DELETE');
    request.respondWith({
      'status': 200,
      'contentType': 'text/plain',
      'responseText': 'Success!'
    });

    assertSuccessToast('Successfully deleted rows with ids: 3, 9');

    fullData = dataTableRef.current.getFullData();
    let deletedIds = [3, 9];
    for (let row of fullData) {
      expect(deletedIds.indexOf(row.id)).withContext(
          `row.id=${row.id}`).toEqual(-1);
    }
    // Assert deleted rows not in HTML table either.
    assertRowInTableTimes(getByRole, row3, 0);
    assertRowInTableTimes(getByRole, row9, 0);

    // Reset filter.
    await userEvent.clear(searchbox);
    jasmine.clock().tick(500);
    fullData = dataTableRef.current.getFullData();
    for (let row of fullData) {
      expect(deletedIds.indexOf(row.id)).withContext(
          `row.id=${row.id}`).toEqual(-1);
    }
    // Assert deleted rows not in HTML table either.
    assertRowInTableTimes(getByRole, row3, 0);
    assertRowInTableTimes(getByRole, row9, 0);
  });

  it('should page through table', function () {
    const dataTableRef = React.createRef();
    const {getByRole} = render(
        <DataTable ref={dataTableRef} dataSource={DATA_SOURCE}/>);

    respondWithAjaxTableData(tableData);

    const pagination = getByRole('list', {name: 'pagination'});
    let pages = pagination.querySelectorAll('li');
    expect(pages.length).toEqual(4);
    const prevButton = pages[0];
    const page1 = pages[1];
    const page2 = pages[2];
    const nextButton = pages[3];

    expect(page1).toHaveClass('active');

    // Page 1 starting point
    let rows = getByRole('rowgroup', {name: 'table-body'}).querySelectorAll(
        'tr');
    expect(rows.length).toEqual(10);

    // Go to page 2 directly
    fireEvent.click(page2);
    rows = getByRole('rowgroup', {name: 'table-body'}).querySelectorAll(
        'tr');
    expect(rows.length).toEqual(2);

    // Back to page 1 via previous button
    fireEvent.click(prevButton);
    rows = getByRole('rowgroup', {name: 'table-body'}).querySelectorAll(
        'tr');
    expect(rows.length).toEqual(10);

    // Then back to page 2 via next button
    fireEvent.click(nextButton);
    rows = getByRole('rowgroup', {name: 'table-body'}).querySelectorAll(
        'tr');
    expect(rows.length).toEqual(2);
  });

  it('should update data when cell is edited', async function () {
    const dataTableRef = React.createRef();
    const {getByRole} = render(
        <DataTable ref={dataTableRef} dataSource={DATA_SOURCE}/>);

    respondWithAjaxTableData(tableData);

    const barIndex = getColIndexForText(
        getByRole('rowgroup', {name: 'table-header'}), 'bar');
    const rows = getByRole('rowgroup', {name: 'table-body'}).querySelectorAll(
        'tr');
    const id1BarCell = rows[1].querySelectorAll('td')[barIndex];
    fireEvent.doubleClick(id1BarCell);
    const barInput = id1BarCell.querySelector('input');
    expect(barInput).toHaveValue('["inner"]');

    await userEvent.type(barInput, '[Backspace], "new"]');
    expect(barInput).toHaveValue('["inner", "new"]');

    await userEvent.type(barInput, '[Enter]');
    let requests = jasmine.Ajax.requests;
    let request = requests.mostRecent();
    expect(request.url).toBe(`${DATA_SOURCE}/1`);
    expect(request.method).toBe('PUT');
    request.respondWith({
      'status': 200,
      'contentType': 'text/plain',
      'responseText': 'Success!'
    });

    assertSuccessToast('Updating row with id 1 was successful!');

    expect(id1BarCell).toHaveTextContent('["inner","new"]');
  });

  it('should update data when cell is edited while table is filtered',
      async function () {
        const dataTableRef = React.createRef();
        const {getByRole} = render(
            <DataTable ref={dataTableRef} dataSource={DATA_SOURCE}/>);

        respondWithAjaxTableData(tableData);

        const searchbox = getByRole('textbox');
        await userEvent.type(searchbox, 'pikachu');
        jasmine.clock().tick(500);

        const batIndex = getColIndexForText(
            getByRole('rowgroup', {name: 'table-header'}), 'bat');
        let rows = getByRole('rowgroup',
            {name: 'table-body'}).querySelectorAll(
            'tr');
        let pikachuBatCell = rows[0].querySelectorAll('td')[batIndex];
        fireEvent.doubleClick(pikachuBatCell);
        const batInput = pikachuBatCell.querySelector('input');
        expect(batInput).toHaveValue('{"z":"pikachu"}');

        await userEvent.type(batInput, '[Backspace], "new": "thing"}');
        expect(batInput).toHaveValue('{"z":"pikachu", "new": "thing"}');

        await userEvent.type(batInput, '[Enter]');
        let requests = jasmine.Ajax.requests;
        let request = requests.mostRecent();
        expect(request.url).toBe(`${DATA_SOURCE}/1`);
        expect(request.method).toBe('PUT');
        request.respondWith({
          'status': 200,
          'contentType': 'text/plain',
          'responseText': 'Success!'
        });

        assertSuccessToast('Updating row with id 1 was successful!');

        expect(pikachuBatCell).toHaveTextContent(
            '{"z":"pikachu","new":"thing"}');

        await userEvent.clear(searchbox);
        jasmine.clock().tick(500);

        rows = getByRole('rowgroup', {name: 'table-body'}).querySelectorAll(
            'tr');
        pikachuBatCell = rows[1].querySelectorAll('td')[batIndex];
        expect(pikachuBatCell).toHaveTextContent(
            '{"z":"pikachu","new":"thing"}');
      });

  it('should not update cell when server errors', async function () {
    const dataTableRef = React.createRef();
    const {getByRole} = render(
        <DataTable ref={dataTableRef} dataSource={DATA_SOURCE}/>);

    respondWithAjaxTableData(tableData);

    const barIndex = getColIndexForText(
        getByRole('rowgroup', {name: 'table-header'}), 'bar');
    const rows = getByRole('rowgroup', {name: 'table-body'}).querySelectorAll(
        'tr');
    const id1BarCell = rows[1].querySelectorAll('td')[barIndex];
    fireEvent.doubleClick(id1BarCell);
    const barInput = id1BarCell.querySelector('input');
    expect(barInput).toHaveValue('["inner"]');

    await userEvent.type(barInput, '[Backspace], "new"]');
    expect(barInput).toHaveValue('["inner", "new"]');

    await userEvent.type(barInput, '[Enter]');
    let requests = jasmine.Ajax.requests;
    let request = requests.mostRecent();
    expect(request.url).toBe(`${DATA_SOURCE}/1`);
    expect(request.method).toBe('PUT');
    request.respondWith({
      'status': 500,
      'contentType': 'text/plain',
      'responseText': 'Failure!'
    });
    assertErrorToast('PUT request to /foo/1 failed');
    expect(id1BarCell).toHaveTextContent('["inner"]');
  });

  it('should show error toast on failed initial fetch', function () {
    // Render the table and return AJAX init data.
    render(<DataTable dataSource={DATA_SOURCE}/>);
    let requests = jasmine.Ajax.requests;
    expect(requests.count()).toBe(1);
    let request = requests.mostRecent();
    expect(request.url).toBe(DATA_SOURCE);
    expect(request.method).toBe('GET');
    request.respondWith({
      'status': 500,
      'contentType': 'text/plain',
      'responseText': 'Failure'
    });
    assertErrorToast('request to /foo failed');
  });
});

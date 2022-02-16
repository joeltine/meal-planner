import JasmineDOM from '@testing-library/jasmine-dom';
import {fireEvent, render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import {
  randomArray,
  randomInt,
  randomObject,
  randomString
} from '../common/test_utils';
import {SORT_TYPES} from './sorttypes';
import {Table} from './table';

function generateTableData(totalRows) {
  const data = [];
  for (let i = 0; i < totalRows; i++) {
    data.push({
      id: i,
      stringCol: randomString(5),
      intCol: randomInt(128),
      arrCol: randomArray(5),
      objCol: randomObject(5)
    });
  }
  return data;
}

function assertRowGroup(rowGroup) {
  expect(rowGroup.querySelectorAll('tr').length).toEqual(1);
  const headers = Array.from(rowGroup.querySelectorAll('th'));
  expect(headers.length).toEqual(5);

  const headerText = [];
  for (const header of headers) {
    headerText.push(header.textContent);
  }
  expect(headerText).toEqual(jasmine.arrayWithExactContents(
      ['id', 'stringCol', 'intCol', 'arrCol', 'objCol']));
}

describe('Table test suite', function() {
  beforeAll(() => {
    jasmine.getEnv().addMatchers(JasmineDOM);
  });

  it('should render empty table with no data', function() {
    const data = [];
    const {getByRole} = render(<Table data={data}/>);
    expect(getByRole('rowgroup', {name: 'table-body'})).toHaveTextContent(
        'Table is empty');
  });

  it('should render table with some data', function() {
    const totalRows = 12;
    const data = generateTableData(totalRows);
    const {getByRole} = render(<Table data={data}/>);

    expect(getByRole('table')).toBeInTheDocument();
    assertRowGroup(getByRole('rowgroup', {name: 'table-header'}));
    assertRowGroup(getByRole('rowgroup', {name: 'table-footer'}));

    const tbody = getByRole('rowgroup', {name: 'table-body'});
    const rows = Array.from(tbody.querySelectorAll('tr'));
    expect(rows.length).toEqual(totalRows);

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i];
      const cols = Array.from(row.querySelectorAll('td'));
      expect(cols.length).toEqual(5);
      for (let j = 0; j < cols.length; j++) {
        const val = cols[j];
        expect(val.textContent).toEqual(jasmine.notEmpty());
      }
    }
  });

  it('should select/unselect rows on click', function() {
    const data = generateTableData(10);
    const tableRef = React.createRef();
    const {getByRole} = render(<Table ref={tableRef} data={data}/>);

    const tbody = getByRole('rowgroup', {name: 'table-body'});
    const rows = Array.from(tbody.querySelectorAll('tr'));

    fireEvent.click(rows[0]);
    let selectedRows = tableRef.current.getSelectedRows();
    expect(tbody.querySelectorAll('.table-active')).toHaveSize(1);
    expect(selectedRows).toHaveSize(1);
    expect(selectedRows[0].id).toEqual(0);

    fireEvent.click(rows[0]); // unselect 0
    fireEvent.click(rows[1]);
    fireEvent.click(rows[2]);
    selectedRows = tableRef.current.getSelectedRows();
    expect(tbody.querySelectorAll('.table-active')).toHaveSize(2);
    expect(selectedRows).toHaveSize(2);
    expect(selectedRows[0].id).toEqual(1);
    expect(selectedRows[1].id).toEqual(2);
  });

  it('should clear row selection on component update', function() {
    let data = generateTableData(10);
    const tableRef = React.createRef();
    const {getByRole, rerender} = render(<Table ref={tableRef} data={data}/>);

    const tbody = getByRole('rowgroup', {name: 'table-body'});
    let rows = Array.from(tbody.querySelectorAll('tr'));

    fireEvent.click(rows[0]);
    fireEvent.click(rows[1]);
    fireEvent.click(rows[9]);
    let selectedRows = tableRef.current.getSelectedRows();
    expect(tbody.querySelectorAll('.table-active')).toHaveSize(3);
    expect(selectedRows).toHaveSize(3);

    data = generateTableData(3);
    rerender(<Table ref={tableRef} data={data}/>);
    rows = Array.from(tbody.querySelectorAll('tr'));

    selectedRows = tableRef.current.getSelectedRows();
    expect(tbody.querySelectorAll('.table-active')).toHaveSize(0);
    expect(selectedRows).toHaveSize(0);

    fireEvent.click(rows[1]);
    selectedRows = tableRef.current.getSelectedRows();
    expect(tbody.querySelectorAll('.table-active')).toHaveSize(1);
    expect(selectedRows).toHaveSize(1);
  });

  it('should respond to column header click events', function() {
    const data = generateTableData(10);
    const colHeaderClickSpy = jasmine.createSpy();
    const {getByRole} = render(
        <Table data={data}
               onColumnHeaderClick={colHeaderClickSpy}/>
    );
    const thead = getByRole('rowgroup', {name: 'table-header'});
    const headers = Array.from(thead.querySelectorAll('th'));

    for (const h of headers) {
      fireEvent.click(h);
      expect(colHeaderClickSpy).toHaveBeenCalledWith(h.textContent);
    }
  });

  it('should toggle sort indicator on sortCol update', function() {
    const data = generateTableData(10);
    const sortColInfo = {};
    const colHeaderClickSpy = jasmine.createSpy().and.callFake((colName) => {
      if (sortColInfo['colName'] === colName) {
        sortColInfo['sort'] = sortColInfo['sort'] === SORT_TYPES.descending ?
            SORT_TYPES.ascending : SORT_TYPES.descending;
      } else {
        sortColInfo['colName'] = colName;
        sortColInfo['sort'] = SORT_TYPES.descending;
      }
      rerender(<Table data={data}
                      onColumnHeaderClick={colHeaderClickSpy}
                      sortCol={sortColInfo}/>);
    });
    const {getByRole, rerender} = render(
        <Table data={data}
               onColumnHeaderClick={colHeaderClickSpy}
               sortCol={sortColInfo}/>
    );
    const thead = getByRole('rowgroup', {name: 'table-header'});
    const headers = Array.from(thead.querySelectorAll('th'));
    for (const h of headers) {
      expect(h.querySelector('use').getAttribute('href')).toEqual(
          '#icon-chevron-up-down');
    }

    const col1 = headers[0];
    fireEvent.click(col1);
    expect(col1.querySelector('use').getAttribute('href')).toEqual(
        '#icon-chevron-down');

    const col3 = headers[2];
    fireEvent.click(col3);
    // Original col resets
    expect(col1.querySelector('use').getAttribute('href')).toEqual(
        '#icon-chevron-up-down');
    // Newly clicked col now has sort indicator
    expect(col3.querySelector('use').getAttribute('href')).toEqual(
        '#icon-chevron-down');

    // Clicking again toggles sort indicator
    fireEvent.click(col3);
    expect(col3.querySelector('use').getAttribute('href')).toEqual(
        '#icon-chevron-up');
    // Clicking again toggles sort indicator
    fireEvent.click(col3);
    expect(col3.querySelector('use').getAttribute('href')).toEqual(
        '#icon-chevron-down');
  });

  it('should trigger onColumnValueUpdate when td cell changes',
      async function() {
        const totalRows = 12;
        const data = generateTableData(totalRows);
        const columnUpdateSpy = jasmine.createSpy();
        const {getByRole} = render(
            <Table data={data}
                   onColumnValueUpdate={columnUpdateSpy}/>);
        const tbody = getByRole('rowgroup', {name: 'table-body'});
        const thead = getByRole('rowgroup', {name: 'table-header'});
        const rows = Array.from(tbody.querySelectorAll('tr'));
        const cols = Array.from(rows[0].querySelectorAll('td'));
        const editableCell = cols[1];
        const cellKey = Array.from(
            thead.querySelectorAll('th'))[1].textContent;
        fireEvent.doubleClick(editableCell);
        const input = editableCell.querySelector('input');
        await userEvent.clear(input);
        await userEvent.type(input, 'some stuff[Enter]');
        expect(columnUpdateSpy).toHaveBeenCalledOnceWith(data[0], cellKey,
            'some stuff');
      });
});

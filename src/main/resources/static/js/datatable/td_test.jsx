import JasmineDOM from '@testing-library/jasmine-dom';
import {fireEvent, render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import {Td} from './td';

describe('Td test suite', function() {
  let tr = null;
  let table = null;

  beforeAll(() => {
    jasmine.getEnv().addMatchers(JasmineDOM);
  });

  beforeEach(() => {
    tr = document.createElement('tr');
    table = document.createElement('table');
    table.appendChild(tr);
    document.body.appendChild(table);
  });

  afterEach(() => {
    table.remove();
  });

  it('should render passed value', function() {
    const {getByText} = render(<Td value="Hi mom"/>, {container: tr});
    expect(getByText('Hi mom')).toBeInTheDocument();
  });

  it('should not turn into an input on double click when not editable',
      function() {
        const {queryByRole, getByText} = render(<Td value="Hi mom"/>,
            {container: tr});
        expect(getByText('Hi mom')).toBeInTheDocument();
        fireEvent.doubleClick(getByText('Hi mom'));
        expect(queryByRole('textbox')).toBeNull();
      });

  it('should turn into an input on double click when editable',
      async function() {
        const onValueUpdateSpy = jasmine.createSpy();
        const {getByRole, getByText, queryByRole} = render(
            <Td value="Hi mom"
                editable={true}
                onValueUpdate={onValueUpdateSpy}/>,
            {container: tr});
        expect(getByText('Hi mom')).toBeInTheDocument();
        fireEvent.doubleClick(getByText('Hi mom'));
        const textBox = getByRole('textbox');
        expect(textBox).toHaveValue('Hi mom');
        await userEvent.clear(textBox);
        expect(textBox).toHaveValue('');
        await userEvent.type(textBox, 'World!');
        expect(textBox).toHaveValue('World!');
        await userEvent.type(textBox, 'x[Enter]');
        expect(onValueUpdateSpy).toHaveBeenCalledOnceWith('World!x');
        expect(queryByRole('textbox')).toBeNull();
      });

  it('should not fire onUpdateValue when user presses escape',
      async function() {
        const onValueUpdateSpy = jasmine.createSpy();
        const {getByRole, getByText, queryByRole} = render(
            <Td value="Hi mom"
                editable={true}
                onValueUpdate={onValueUpdateSpy}/>,
            {container: tr});
        expect(getByText('Hi mom')).toBeInTheDocument();
        fireEvent.doubleClick(getByText('Hi mom'));
        const textBox = getByRole('textbox');
        expect(textBox).toHaveValue('Hi mom');
        await userEvent.type(textBox, 'x[Escape]');
        expect(onValueUpdateSpy).toHaveBeenCalledTimes(0);
        expect(queryByRole('textbox')).toBeNull();
        expect(getByRole('cell')).toHaveTextContent('Hi mom');
      });
});

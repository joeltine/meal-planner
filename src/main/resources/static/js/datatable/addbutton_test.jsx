import JasmineDOM from '@testing-library/jasmine-dom';
import {fireEvent, render, screen} from '@testing-library/react';
import React from 'react';

import {AddButton} from './addbutton';

describe('AddButton test suite', function() {
  beforeAll(() => {
    jasmine.getEnv().addMatchers(JasmineDOM);
  });

  it('should look like a button', function() {
    render(<AddButton/>);
    expect(screen.getByRole('button')).toHaveTextContent('Add New Row');
  });

  it('should act like a button', function() {
    const mockClick = jasmine.createSpy();
    const {getByRole} = render(<AddButton onAddClick={mockClick}/>);
    fireEvent.click(getByRole('button'));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});

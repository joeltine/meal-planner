import React from "react";
import {fireEvent, render, screen} from '@testing-library/react'
import JasmineDOM from '@testing-library/jasmine-dom';
import {DeleteButton} from "./deletebutton";

describe('DeleteButton test suite', function () {
  beforeAll(() => {
    jasmine.getEnv().addMatchers(JasmineDOM);
  });

  it('should look like a button', function () {
    render(<DeleteButton/>)
    expect(screen.getByRole('button')).toHaveTextContent('Delete Selected');
  });

  it('should act like a button', function () {
    let mockClick = jasmine.createSpy();
    const {getByRole} = render(<DeleteButton onDeleteClick={mockClick}/>)
    fireEvent.click(getByRole('button'));
    expect(mockClick).toHaveBeenCalledTimes(1);
  });
});
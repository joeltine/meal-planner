import JasmineDOM from '@testing-library/jasmine-dom';
import {render} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import {SearchBox} from './searchbox';

describe('SearchBox test suite', function () {

  beforeAll(() => {
    jasmine.getEnv().addMatchers(JasmineDOM);
  });

  it('should render search input', function () {
    const {getByRole} = render(<SearchBox/>);
    expect(getByRole('textbox')).toHaveValue('');
  });

  it('should trigger onSearchChange on text input', async function () {
    const searchChangeSpy = jasmine.createSpy();
    const {getByRole} = render(<SearchBox onSearchChange={searchChangeSpy}/>);
    const searchInput = getByRole('textbox');
    expect(searchInput).toHaveValue('');
    expect(searchChangeSpy).not.toHaveBeenCalled();
    const searchText = 'test input';
    await userEvent.type(searchInput, searchText);
    expect(searchChangeSpy).toHaveBeenCalledTimes(searchText.length);
    for (let i = 0; i < searchText.length; i++) {
      expect(searchChangeSpy).toHaveBeenCalledWith(searchText.slice(0, i + 1));
    }
  });
});

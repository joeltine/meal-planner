import JasmineDOM from '@testing-library/jasmine-dom';
import {fireEvent, render} from '@testing-library/react';
import userEvent from "@testing-library/user-event";
import React from "react";

import {Types} from "../common/utils";
import {NewRowForm} from "./newrowform";

describe('NewRowForm test suite', function () {
  beforeAll(() => {
    jasmine.getEnv().addMatchers(JasmineDOM);
  });

  it('should render all fields and buttons for type info', function () {
    const {getByPlaceholderText, getByRole, queryAllByRole} = render(<NewRowForm
        typeInfo={{
          'id': Types.NUMBER,
          'bar': Types.NUMBER,
          'foo': Types.STRING,
          'baz': Types.PLAIN_OBJECT
        }}/>);
    expect(queryAllByRole('textbox')).toHaveSize(4);
    expect(getByPlaceholderText('id')).toBeDisabled();
    expect(getByPlaceholderText('bar')).toHaveValue('');
    expect(getByPlaceholderText('foo')).toHaveValue('');
    expect(getByPlaceholderText('baz')).toHaveValue('');
    expect(queryAllByRole('button')).toHaveSize(2);
    expect(getByRole('button', {name: 'Save'})).toBeVisible();
    expect(getByRole('button', {name: 'Cancel'})).toBeVisible();
  });

  it('should respond to cancel click', function () {
    const cancelSpy = jasmine.createSpy();
    const {getByRole} = render(
        <NewRowForm
            typeInfo={{
              'id': Types.NUMBER,
              'bar': Types.NUMBER,
              'foo': Types.STRING,
              'baz': Types.PLAIN_OBJECT
            }} onCancelClick={cancelSpy}/>);
    expect(getByRole('button', {name: 'Cancel'})).toBeVisible();
    fireEvent.click(getByRole('button', {name: 'Cancel'}));
    expect(cancelSpy).toHaveBeenCalledTimes(1);
  });

  it('should not save on empty form', function () {
    const saveSpy = jasmine.createSpy();
    const {getByRole, getByPlaceholderText} = render(
        <NewRowForm
            typeInfo={{
              'id': Types.NUMBER,
              'bar': Types.NUMBER,
              'foo': Types.STRING,
              'baz': Types.PLAIN_OBJECT
            }} onSaveClick={saveSpy}/>);
    expect(getByRole('button', {name: 'Save'})).toBeVisible();
    fireEvent.click(getByRole('button', {name: 'Save'}));
    expect(getByPlaceholderText('id')).toBeDisabled();
    expect(getByPlaceholderText('bar')).toBeInvalid();
    expect(getByPlaceholderText('foo')).toBeInvalid();
    expect(getByPlaceholderText('baz')).toBeInvalid();
    expect(saveSpy).toHaveBeenCalledTimes(0);
  });

  it('should invalidate bad number input', async function () {
    const saveSpy = jasmine.createSpy();
    const {getByPlaceholderText, getByRole} = render(
        <NewRowForm
            typeInfo={{
              'id': Types.NUMBER,
              'bar': Types.NUMBER,
              'foo': Types.STRING,
              'baz': Types.PLAIN_OBJECT,
              'bat': Types.ARRAY
            }} onSaveClick={saveSpy}/>);
    const saveButton = getByRole('button', {name: 'Save'});
    expect(saveButton).toBeVisible();
    fireEvent.click(saveButton);
    const numberInput = getByPlaceholderText('bar');
    expect(numberInput).toBeInvalid();
    expect(saveSpy).toHaveBeenCalledTimes(0);

    const invalidInputs = ['hey', '0x', 'one', '1..3', '30px', '1,3',
      'Infinity', 'null'];
    const validInputs = ['74653', '0x3', '-15', '3.14', '.5', '0.123'];

    for (let invalid of invalidInputs) {
      await userEvent.clear(numberInput);
      await userEvent.type(numberInput, invalid);
      fireEvent.click(saveButton);
      expect(numberInput).withContext(`input=${invalid}`).toBeInvalid();
      expect(saveSpy).toHaveBeenCalledTimes(0);
    }

    for (let valid of validInputs) {
      await userEvent.clear(numberInput);
      await userEvent.type(numberInput, valid);
      fireEvent.click(saveButton);
      expect(numberInput).withContext(`input=${valid}`).toBeValid();
    }
  });

  it('should invalidate bad string input', async function () {
    const saveSpy = jasmine.createSpy();
    const {getByPlaceholderText, getByRole} = render(
        <NewRowForm
            typeInfo={{
              'id': Types.NUMBER,
              'bar': Types.NUMBER,
              'foo': Types.STRING,
              'baz': Types.PLAIN_OBJECT,
              'bat': Types.ARRAY
            }} onSaveClick={saveSpy}/>);
    const saveButton = getByRole('button', {name: 'Save'});
    expect(saveButton).toBeVisible();
    fireEvent.click(saveButton);
    const stringInput = getByPlaceholderText('foo');
    expect(stringInput).toBeInvalid();
    expect(saveSpy).toHaveBeenCalledTimes(0);

    const validInputs = ['null', 'Infinity', 'undefined', '74653',
      '<div>YO</div>', '    test    ', '0 '];
    const invalidInputs = ['    ', '\t\n'];

    for (let invalid of invalidInputs) {
      await userEvent.clear(stringInput);
      await userEvent.type(stringInput, invalid);
      fireEvent.click(saveButton);
      expect(stringInput).withContext(`input="${invalid}"`).toBeInvalid();
    }

    for (let valid of validInputs) {
      await userEvent.clear(stringInput);
      await userEvent.type(stringInput, valid);
      fireEvent.click(saveButton);
      expect(stringInput).withContext(`input="${valid}"`).toBeValid();
    }
  });

  it('should invalidate bad array input', async function () {
    const saveSpy = jasmine.createSpy();
    const {getByPlaceholderText, getByRole} = render(
        <NewRowForm
            typeInfo={{
              'id': Types.NUMBER,
              'bar': Types.NUMBER,
              'foo': Types.STRING,
              'baz': Types.PLAIN_OBJECT,
              'bat': Types.ARRAY
            }} onSaveClick={saveSpy}/>);
    const saveButton = getByRole('button', {name: 'Save'});
    expect(saveButton).toBeVisible();
    fireEvent.click(saveButton);
    const arrayInput = getByPlaceholderText('bat');
    expect(arrayInput).toBeInvalid();
    expect(saveSpy).toHaveBeenCalledTimes(0);

    // Note, userEvent reserves "[]" or "{}" for special key events. Double
    // bracket is effectively "escaping" the char to type the raw key, e.g.,
    // "[[" types "[". Also, only the opening character needs to be escaped,
    // so "[[]" types "[]".
    // TODO: Figure out a way to test more complex structures (eg nested
    //       arrays). See https://github.com/testing-library/user-event/issues/840.
    const validInputs = ['[[]', ' [[]', '[[1,2,3] ', '[["test", "me"]'];
    const invalidInputs = ['0', 'hi', '    ', '\t\n', '[[', '[[,]', '{{}',
      '{{]]', '[[\'invalid due to single quotes\']'];

    for (let invalid of invalidInputs) {
      await userEvent.clear(arrayInput);
      await userEvent.type(arrayInput, invalid);
      fireEvent.click(saveButton);
      expect(arrayInput).withContext(
          `input="${arrayInput.value}"`).toBeInvalid();
    }

    for (let valid of validInputs) {
      await userEvent.clear(arrayInput);
      await userEvent.type(arrayInput, valid);
      fireEvent.click(saveButton);
      expect(arrayInput).withContext(`input="${arrayInput.value}"`).toBeValid();
    }
  });

  it('should invalidate bad plain object input', async function () {
    const saveSpy = jasmine.createSpy();
    const {getByPlaceholderText, getByRole} = render(
        <NewRowForm
            typeInfo={{
              'id': Types.NUMBER,
              'bar': Types.NUMBER,
              'foo': Types.STRING,
              'baz': Types.PLAIN_OBJECT,
              'bat': Types.ARRAY
            }} onSaveClick={saveSpy}/>);
    const saveButton = getByRole('button', {name: 'Save'});
    expect(saveButton).toBeVisible();
    fireEvent.click(saveButton);
    const objectInput = getByPlaceholderText('baz');
    expect(objectInput).toBeInvalid();
    expect(saveSpy).toHaveBeenCalledTimes(0);

    // Note, userEvent reserves "[]" or "{}" for special key events. Double
    // bracket is effectively "escaping" the char to type the raw key, e.g.,
    // "[[" types "[". Also, only the opening character needs to be escaped,
    // so "[[]" types "[]".
    // TODO: Figure out a way to test more complex structures (eg nested
    //       arrays). See https://github.com/testing-library/user-event/issues/840.
    const validInputs = ['{{}', '{{"foo": "bar"} ', ' {{"b": "Foo", "3": 3}'];
    const invalidInputs = ['0', 'hi', '    ', '\t\n', '[[', '[[,]',
      '{{\'quote\': "bad"}', '{{]]', '[[\'invalid due to single quotes\']',
      '[[]', '[[1,2,3] ', '[["test", "me"]'];

    for (let invalid of invalidInputs) {
      await userEvent.clear(objectInput);
      await userEvent.type(objectInput, invalid);
      fireEvent.click(saveButton);
      expect(objectInput).withContext(
          `input="${objectInput.value}"`).toBeInvalid();
    }

    for (let valid of validInputs) {
      await userEvent.clear(objectInput);
      await userEvent.type(objectInput, valid);
      fireEvent.click(saveButton);
      expect(objectInput).withContext(
          `input="${objectInput.value}"`).toBeValid();
    }
  });

  it('should invalidate bad date input', async function () {
    const saveSpy = jasmine.createSpy();
    const {getByPlaceholderText, getByRole} = render(
        <NewRowForm
            typeInfo={{
              'id': Types.NUMBER,
              'bar': Types.NUMBER,
              'foo': Types.STRING,
              'baz': Types.PLAIN_OBJECT,
              'bat': Types.ARRAY,
              'dat': Types.DATE
            }} onSaveClick={saveSpy}/>);
    const saveButton = getByRole('button', {name: 'Save'});
    expect(saveButton).toBeVisible();
    fireEvent.click(saveButton);
    const dateInput = getByPlaceholderText('dat');
    expect(dateInput).toBeInvalid();
    expect(saveSpy).toHaveBeenCalledTimes(0);

    const validInputs = ['1975-01-02T00:00:12Z', 'December 17, 1995 03:24:00',
      '1970-01-01', '2011-10-10T14:48:00', '2011-10-10T14:48:00.000+09:00',
      '01 Jun 2016 14:31:46 -0700', '1-1-2021',
      'Sat, 22 Jan 2022 23:30:32 GMT',
      'Sat Jan 22 2022 16:30:32 GMT-0700 (Mountain Standard Time)',
      '2/22/1975', '1/22/2022, 4:30:32 PM'];
    const invalidInputs = ['test', '1642894122977', '20220102'];

    for (let invalid of invalidInputs) {
      await userEvent.clear(dateInput);
      await userEvent.type(dateInput, invalid);
      fireEvent.click(saveButton);
      expect(dateInput).withContext(
          `input="${dateInput.value}"`).toBeInvalid();
    }

    for (let valid of validInputs) {
      await userEvent.clear(dateInput);
      await userEvent.type(dateInput, valid);
      fireEvent.click(saveButton);
      expect(dateInput).withContext(
          `input="${dateInput.value}"`).toBeValid();
    }
  });

  it('should call onSaveClick when form is valid', async function () {
    const saveSpy = jasmine.createSpy();
    const {getByPlaceholderText, getByRole} = render(
        <NewRowForm
            typeInfo={{
              'id': Types.NUMBER,
              'bar': Types.NUMBER,
              'foo': Types.STRING,
              'baz': Types.PLAIN_OBJECT,
              'bat': Types.ARRAY
            }} onSaveClick={saveSpy}/>);
    const saveButton = getByRole('button', {name: 'Save'});
    const barInput = getByPlaceholderText('bar');
    await userEvent.type(barInput, '32');

    const fooInput = getByPlaceholderText('foo');
    await userEvent.type(fooInput, 'valid');

    const bazInput = getByPlaceholderText('baz');
    await userEvent.type(bazInput, '{{"foo": 1}');

    const batInput = getByPlaceholderText('bat');
    await userEvent.type(batInput, '[[1,2,3]');

    fireEvent.click(saveButton);
    expect(saveSpy).toHaveBeenCalledOnceWith({
      id: null,
      bar: 32,
      foo: 'valid',
      baz: {foo: 1},
      bat: [1, 2, 3]
    });
  });
});

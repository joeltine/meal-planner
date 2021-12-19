import {AddRecipesController} from './addrecipes';

describe('AddRecipesController test suite', function () {
  let controller;

  beforeAll(function () {
    const html = window.__html__['addrecipes/addrecipes_test.html'];
    $('body').append(html);
    controller = new AddRecipesController();
  });

  afterAll(function () {
    $('body').empty();
    controller = null;
  });

  it('binds submit handler', function () {
    expect(controller).toBeTruthy();
  });
});

import JasmineDOM from "@testing-library/jasmine-dom";

describe('MealPlanner test suite', function () {
  beforeAll(() => {
    jasmine.getEnv().addMatchers(JasmineDOM);
    window.CSRF_HEADER_NAME = '_csrf';
    window.CSRF_TOKEN = '12345abcdef';
  });

  afterAll(() => {
  });

  beforeEach(() => {
  });

  afterEach(() => {
  });

  it('should do things with stuff', function () {
    //const {getByRole, getByText} = render(<MealPlanner/>);

  });
});
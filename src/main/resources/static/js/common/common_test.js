import {CommonController} from './common';

describe('CommonController test suite', function () {
  let uiContainer = $('<div></div>');

  beforeAll(function () {
    $('body').append(uiContainer);
  });

  beforeEach(function () {
    const html = window.__html__['js/common/common_test.html'];
    uiContainer.append(html);
  });

  afterEach(function () {
    uiContainer.empty();
  });

  afterAll(function () {
    uiContainer.remove();
  });

  it('sets nav-link with pathname to active', function () {
    spyOn(CommonController.prototype, 'getCurrentPathname')
        .and.returnValue('/addrecipes');
    new CommonController();
    expect($('a.nav-link.active').length).toBe(1);
    expect($('a.nav-link[href="/addrecipes"]').hasClass('active')).toBeTrue();
  });

  it('does nothing when no nav-link matches pathname', function () {
    spyOn(CommonController.prototype, 'getCurrentPathname')
        .and.returnValue('/doesntexist');
    new CommonController();
    expect($('a.nav-link.active').length).toBe(0);
  });

  it('maps root pathname to /planner', function () {
    spyOn(CommonController.prototype, 'getCurrentPathname')
        .and.returnValue('/');
    new CommonController();
    expect($('a.nav-link.active').length).toBe(1);
    expect($('a.nav-link[href="/planner"]').hasClass('active')).toBeTrue();
  });

  it('if pathname ends with Editor, sets parent to active', function () {
    spyOn(CommonController.prototype, 'getCurrentPathname')
        .and.returnValue('/recipeEditor');
    new CommonController();
    expect($('a.nav-link.active').length).toBe(1);
    expect($('#editorDropdown').hasClass('active')).toBeTrue();
  });
});


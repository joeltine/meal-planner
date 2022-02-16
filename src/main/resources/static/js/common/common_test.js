import {CommonController} from './common';

describe('CommonController test suite', function() {
  const uiContainer = document.createElement('div');

  beforeAll(function() {
    document.body.append(uiContainer);
  });

  beforeEach(function() {
    const html = window.__html__['js/common/common_test.html'];
    uiContainer.innerHTML = html;
  });

  afterEach(function() {
    uiContainer.innerHTML = '';
  });

  afterAll(function() {
    uiContainer.remove();
  });

  it('sets nav-link with pathname to active', function() {
    spyOn(CommonController.prototype, 'getCurrentPathname')
        .and.returnValue('/addrecipes');
    new CommonController();
    expect(document.querySelectorAll('a.nav-link.active').length).toBe(1);
    expect(document.querySelectorAll(
        'a.nav-link[href="/addrecipes"]')[0].classList.contains(
        'active')).toBeTrue();
  });

  it('does nothing when no nav-link matches pathname', function() {
    spyOn(CommonController.prototype, 'getCurrentPathname')
        .and.returnValue('/doesntexist');
    new CommonController();
    expect(document.querySelectorAll('a.nav-link.active').length).toBe(0);
  });

  it('maps root pathname to /planner', function() {
    spyOn(CommonController.prototype, 'getCurrentPathname')
        .and.returnValue('/');
    new CommonController();
    expect(document.querySelectorAll('a.nav-link.active').length).toBe(1);
    expect(document.querySelectorAll(
        'a.nav-link[href="/planner"]')[0].classList.contains(
        'active')).toBeTrue();
  });

  it('if pathname ends with Editor, sets parent to active', function() {
    spyOn(CommonController.prototype, 'getCurrentPathname')
        .and.returnValue('/recipeEditor');
    new CommonController();
    expect(document.querySelectorAll('a.nav-link.active').length).toBe(1);
    expect(document.querySelectorAll('#editorDropdown')[0].classList.contains(
        'active')).toBeTrue();
  });
});


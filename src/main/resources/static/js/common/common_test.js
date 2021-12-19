import {CommonController} from './common';

describe('CommonController test suite', function () {
  beforeEach(function () {
    const html = window.__html__['common/common_test.html'];
    $('body').append(html);
  });

  afterEach(function () {
    $('body').empty();
  });

  it('sets nav-link with pathname to active', function () {
    spyOn(CommonController.prototype, 'getCurrentPathname')
        .and.returnValue('/foo');
    new CommonController();
    expect($('a.nav-link.active').length).toBe(1);
    expect($('a.nav-link[href="/foo"]').hasClass('active')).toBeTrue();
  });

  it('does nothing when no nav-link matches pathname', function () {
    spyOn(CommonController.prototype, 'getCurrentPathname')
        .and.returnValue('/doesntexist');
    new CommonController();
    expect($('a.nav-link.active').length).toBe(0);
  });
});

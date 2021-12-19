export class CommonController {
  constructor() {
    this.setCurrentNavItem();
  }

  setCurrentNavItem() {
    const pathName = this.getCurrentPathname();
    $(`a.nav-link[href="${pathName}"]`).addClass('active');
  }

  getCurrentPathname() {
    return window.location.pathname;
  }
}
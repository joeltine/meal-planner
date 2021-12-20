export class CommonController {
  constructor() {
    this.setCurrentNavItem();
  }

  setCurrentNavItem() {
    let pathName = this.getCurrentPathname();
    if (pathName == '/') {
      pathName = '/planner';
    }
    $(`a.nav-link[href="${pathName}"]`).addClass('active');
  }

  getCurrentPathname() {
    return window.location.pathname;
  }
}
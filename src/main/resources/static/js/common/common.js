class CommonController {
  constructor() {
    this.setCurrentNavItem();
  }

  setCurrentNavItem() {
    const pathName = window.location.pathname;
    $(`a.nav-link[href="${pathName}"]`).addClass('active');
  }
}

const common = new CommonController();
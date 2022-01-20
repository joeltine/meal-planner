/**
 * Common functionality for all pages. Should be imported and constructed on
 * every page in the app.
 * TODO: Make this initialization on every page automatic w/o manual import.
 */

import {Toast} from "../toasts/toast";

export class CommonController {
  constructor() {
    this.setCurrentNavItem();
    this.bindGlobalErrorHandler();
  }

  bindGlobalErrorHandler() {
    window.onerror = (message, source, lineno) => {
      Toast.showNewErrorToast('Uncaught JS Exception!',
          `Message: ${message}, source: ${source}, line: ${lineno}`,
          {autohide: false});
      return false;
    }
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
/**
 * Common functionality for all pages. Should be imported and constructed on
 * every page in the app.
 */

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
// Global import of bootstrap CSS.
import 'bootstrap/dist/css/bootstrap.min.css';
// Import site-wide css.
import '../../css/common/main.css';

import {Toast} from '../toasts/toast';

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
    };
  }

  setCurrentNavItem() {
    let pathName = this.getCurrentPathname();
    if (pathName === '/') {
      pathName = '/planner';
    }
    const activeLink = document.querySelector(`.navbar a[href="${pathName}"]`);
    if (activeLink) {
      activeLink.classList.add('active');
    }
    if (pathName.endsWith('Editor')) {
      document.getElementById('editorDropdown').classList.add('active');
    }
  }

  getCurrentPathname() {
    return window.location.pathname;
  }
}

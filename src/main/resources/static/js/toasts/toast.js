/**
 * Toast implementation. Relies on a container named #toastContainer being on
 * the page along with bootstrap JS + CSS for styling.
 */

import '../../css/toasts/toast.css';

import {Toast as BootstrapToast} from 'bootstrap';

const STATE_CLASS_MAP = {
  ERROR: {
    header: {
      bgColor: 'bg-danger',
      textColor: 'text-white'
    },
    container: {
      stateClass: 'toast-error'
    }
  },
  INFO: {
    header: {
      bgColor: 'bg-secondary',
      textColor: 'text-white'
    },
    container: {
      stateClass: 'toast-info'
    }
  },
  SUCCESS: {
    header: {
      bgColor: 'bg-success',
      textColor: 'text-white'
    },
    container: {
      stateClass: 'toast-success'
    }
  }
};

let UID = 0;

// TODO: Write unit tests.
export class Toast {
  constructor(header = 'Default Header', body = 'Default Body', state = 'INFO',
      toastOptions = {}) {
    this.header = header;
    this.body = body;
    this.state = state;
    this.toastOptions = toastOptions;
    this.toastId = '';
    this.toastEl = this.getNewToastEl();
    const defaultOptions = {
      animation: true,
      autohide: true,
      delay: 3000
    };
    const mergedOptions = Object.assign(defaultOptions, this.toastOptions);
    this.toast = new BootstrapToast(this.toastEl, mergedOptions);
  }

  show() {
    this.toast.show();
    // Event when hidden after animation is complete.
    this.toastEl.addEventListener('hidden.bs.toast', () => {
      this.toast.dispose();
      // We look up the DOM element as sometimes this.toastEl does not point
      // to the real toast element in the DOM. Bootstrap is probably replacing
      // the element.
      document.getElementById(this.toastId).remove();
      delete this.toastEl;
    });
  }

  getNewToastEl() {
    const styles = STATE_CLASS_MAP[this.state];
    this.toastId = `toast-${++UID}`;
    const toastHtml = `
      <div class="toast ${styles.container.stateClass}" id="${this.toastId}"
           role="alert">
        <div class="toast-header ${styles.header.bgColor} 
                    ${styles.header.textColor}">
          <svg class="feather me-2" viewBox="0 0 24 24">
            <use href="#icon-alert-circle"/>
          </svg>
          <strong class="me-auto toast-header-text">${this.header}</strong>
          <small class="toast-time ms-2">${new Date().toLocaleString()}</small>
          <button type="button" class="btn-close ms-2 mb-1" 
                  data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          ${this.body}
        </div>
      </div>`;
    // TODO: This isn't safe as user-supplied input is included in the toast.
    //       Sanitize this HTML for XSS.
    document.getElementById('toastContainer').innerHTML += toastHtml;
    return document.getElementById(this.toastId);
  }

  static showNewInfoToast(header, body, toastOptions) {
    const toast = new Toast(header, body, 'INFO', toastOptions);
    toast.show();
    return toast;
  }

  static showNewErrorToast(header, body, toastOptions) {
    const toast = new Toast(header, body, 'ERROR', toastOptions);
    toast.show();
    return toast;
  }

  static showNewSuccessToast(header, body, toastOptions) {
    const toast = new Toast(header, body, 'SUCCESS', toastOptions);
    toast.show();
    return toast;
  }
}

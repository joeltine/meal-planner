/**
 * Toast implementation. Relies on a container named #toastContainer being on
 * the page along with bootstrap JS and jquery.
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

// TODO: Write unit tests.
export class Toast {
  constructor(header = 'Default Header', body = 'Default Body', state = 'INFO',
      toastOptions = {}) {
    this.header = header;
    this.body = body;
    this.state = state;
    this.toastOptions = toastOptions;
    this.time = new Date().toLocaleString();
    this.toastEl = this.getNewToastEl();
    const defaultOptions = {
      animation: true,
      autohide: true,
      delay: 3000
    };
    const mergedOptions = $.extend(defaultOptions, this.toastOptions);
    this.toast = new BootstrapToast(this.toastEl[0], mergedOptions);
  }

  show() {
    this.toastEl.appendTo('#toastContainer');
    this.toast.show();
    this.toastEl.on('hidden.bs.toast', () => {
      this.toast.dispose();
      this.toastEl.remove();
    });
  }

  getNewToastEl() {
    const styles = STATE_CLASS_MAP[this.state];
    return $(`
      <div class="toast ${styles.container.stateClass}" role="alert">
        <div class="toast-header ${styles.header.bgColor} ${styles.header.textColor}">
          <svg class="feather me-2" viewBox="0 0 24 24">
            <use href="#icon-alert-circle"/>
          </svg>
          <strong class="me-auto toast-header-text">${this.header}</strong>
          <small class="toast-time ms-2">${this.time}</small>
          <button type="button" class="btn-close ms-2 mb-1" data-bs-dismiss="toast" aria-label="Close"></button>
        </div>
        <div class="toast-body">
          ${this.body}
        </div>
      </div>`);
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

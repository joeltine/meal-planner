/**
 * Toast implementation. Relies on a container named #toastContainer being on
 * the page along with bootstrap JS and jquery.
 */

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
    this.toast = this.getNewToast();
  }

  show() {
    this.toast.appendTo('#toastContainer');
    this.toast.toast('show');
    this.toast.on('hidden.bs.toast', () => {
      this.toast.toast('dispose');
      this.toast.remove();
    });
  }

  getNewToast() {
    const defaultOptions = {
      animation: true,
      autohide: true,
      delay: 3000
    };
    const styles = STATE_CLASS_MAP[this.state];
    const mergedOptions = $.extend(defaultOptions, this.toastOptions);
    const toast = $(`
    <div class="toast ${styles.container.stateClass}" role="alert">
      <div class="toast-header ${styles.header.bgColor} ${styles.header.textColor}">
        <svg class="feather mr-2" viewBox="0 0 24 24">
          <use href="#alert-circle"/>
        </svg>
        <strong class="mr-auto toast-header-text">${this.header}</strong>
        <small class="toast-time ml-2">${this.time}</small>
        <button type="button" class="ml-2 mb-1 close" data-dismiss="toast">
          <span>&times;</span>
        </button>
      </div>
      <div class="toast-body">
        ${this.body}
      </div>
    </div>`);
    toast.toast(mergedOptions);
    return toast;
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

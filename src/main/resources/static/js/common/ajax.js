/**
 * Central AJAX library.
 */

import {Toast} from '../toasts/toast';

// TODO: Write unit tests.
export function sendAjax(endpoint, extraOptions) {
  const headers = {};
  headers[CSRF_HEADER_NAME] = CSRF_TOKEN;

  const options = {
    method: 'GET',
    headers: headers
  };

  $.extend(options, extraOptions);

  return $.ajax(endpoint, options)
      .fail((jqXHR, textStatus, errorThrown) => {
        Toast.showNewErrorToast('Failed Network Request!',
            `Your ${options.method} request to ${endpoint} failed! ` +
            `Response Text: ${jqXHR.responseText}, ` +
            `Text Status: ${textStatus}, ` +
            `Error Thrown: ${errorThrown}.`,
            {autohide: false});
      });
}

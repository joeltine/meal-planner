/**
 * Central AJAX library.
 */

export function sendAjax(endpoint, extraOptions) {
// TODO: Universally, handle loading interstitial when AJAX is happening.
  const headers = {};
  headers[CSRF_HEADER_NAME] = CSRF_TOKEN;

  const options = {
    method: 'GET',
    headers: headers
  };

  $.extend(options, extraOptions);

  return $.ajax(endpoint, options)
      .fail((jqXHR, textStatus, errorThrown) => {
        const response = JSON.parse(jqXHR.responseText);
        // TODO: Replace me w/ proper error handling. E.g., a toast.
        console.error(response);
      });
}
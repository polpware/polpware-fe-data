/**
 * @fileOverview
 * Defines a class for performing XHR in an exception way and in a promise way
 */
import { legacyLibs } from '@polpware/amd-bridge';

const _ = legacyLibs._;

import Observable from '@polpware/tinymce-tailor/api/util/Observable';
import Tools from '@polpware/tinymce-tailor/api/util/Tools';

import { urlEncode } from '@polpware/fe-utilities';

const XHR = {
    /**
     * Sends a XMLHTTPRequest.
     * Consult the Wiki for details on what settings this method takes.
     *
     * @method send
     * @param {Object} settings Object will target URL, callbacks and other info needed to make the request.
     */
    send: function(settings) {
        var xhr, count = 0;

        var ready = function() {
            if (!settings.async || xhr.readyState == 4 || count++ > 10000) {
                if (settings.success && count < 10000 && xhr.status == 200) {
                    if (settings.response_type === '' || settings.response_type === 'text') {
                        settings.success.call(settings.success_scope, '' + xhr.responseText, xhr, settings);
                    } else {
                        settings.success.call(settings.success_scope, xhr.response, xhr, settings);
                    }
                } else if (settings.error) {
                    settings.error.call(settings.error_scope, count > 10000 ? 'TIMED_OUT' : 'GENERAL', xhr, settings);
                }

                xhr = null;
            } else {
                setTimeout(ready, 10);
            }
        };

        // Default settings
        settings.scope = settings.scope || this;
        settings.success_scope = settings.success_scope || settings.scope;
        settings.error_scope = settings.error_scope || settings.scope;
        settings.async = settings.async === false ? false : true;
        settings.data = settings.data || '';

        (XHR as any).fire('beforeInitialize', { settings: settings });

        xhr = new XMLHttpRequest();

        if (xhr) {
            if (xhr.overrideMimeType) {
                xhr.overrideMimeType(settings.content_type);
            }

            xhr.open(settings.type || (settings.data ? 'POST' : 'GET'), settings.url, settings.async);

            if (settings.crossDomain) {
                xhr.withCredentials = true;
            }

            if (settings.content_type) {
                xhr.setRequestHeader('Content-Type', settings.content_type);
            }

            if (settings.response_type) {
                xhr.responseType = settings.response_type;
            }

            if (settings.requestheaders) {
                Tools.each(settings.requestheaders, function(header: { key: string; value: string; }) {
                    xhr.setRequestHeader(header.key, header.value);
                });
            }

            xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');

            xhr = (XHR as any).fire('beforeSend', { xhr: xhr, settings: settings }).xhr;
            xhr.send(settings.data);

            // Syncronous request
            if (!settings.async) {
                return ready();
            }

            // Wait for response, onReadyStateChange can not be used since it leaks memory in IE
            setTimeout(ready, 10);
        }
    }
};

Tools.extend(XHR, Observable);



export interface IXHRCtorOption {
    url: string;
    async?: boolean;
    type?: 'POST' | 'GET';
    content_type: 'application/x-www-form-urlencoded' | 'application/json' | '';
    response_type: 'json' | 'blob' | 'document' | 'text' | 'arraybuffer' | '';
    requestheaders: any[];
    scope?: any;
    success_scope?: any;
    error_scope?: any;
    data?: any;
}

const defaultOptions = {
    async: true,
    content_type: '',
    response_type: 'json',
    requestheaders: [],
    success_scope: null,
    error_scope: null,
    scope: null
};

export function sendPromise(options: IXHRCtorOption): PromiseLike<any> {
    const settings = _.extend({}, defaultOptions, options);

    const promise: PromiseLike<any> = new Promise((resolve, reject) => {
        const xhrSettings = {
            url: settings.url,
            content_type: settings.content_type,
            response_type: settings.response_type,
            type: settings.type,
            data: settings.data,
            async: settings.async,
            success: (output, xhr, input) => {
                resolve({
                    response: output,
                    xhr: xhr,
                    settings: input
                });
            },
            error: (output, xhr, input) => {
                reject({
                    error: output,
                    xhr: xhr,
                    settings: input
                });
            },
            success_scope: settings.success_scope,
            error_scope: settings.error_scope,
            scope: settings.scope,
            requestheaders: settings.requestheaders
        };
        // Process sent-out data
        if (settings.content_type === 'application/x-www-form-urlencoded') {
            xhrSettings.data = urlEncode(xhrSettings.data);
        } else if (settings.content_type === 'application/json') {
            xhrSettings.data = JSON.stringify(xhrSettings.data);
        }
        XHR.send(xhrSettings);
    });

    return promise;
}

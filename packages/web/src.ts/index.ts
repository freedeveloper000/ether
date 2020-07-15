"use strict";

import { encode as base64Encode } from "@ethersproject/base64";
import { shallowCopy } from "@ethersproject/properties";
import { toUtf8Bytes } from "@ethersproject/strings";

import { Logger } from "@ethersproject/logger";
import { version } from "./_version";
const logger = new Logger(version);

import { getUrl, GetUrlResponse } from "./geturl";

function staller(duration: number): Promise<void> {
    return new Promise((resolve) => {
        setTimeout(resolve, duration);
    });
}

// Exported Types
export type ConnectionInfo = {
    url: string,
    headers?: { [key: string]: string | number }

    user?: string,
    password?: string,

    allowInsecureAuthentication?: boolean,

    throttleLimit?: number,
    throttleSlotInterval?: number;
    throttleCallback?: (attempt: number, url: string) => Promise<boolean>,

    timeout?: number,
};

export interface OnceBlockable {
    once(eventName: "block", handler: () => void): void;
}

export interface OncePollable {
    once(eventName: "poll", handler: () => void): void;
}

export type PollOptions = {
    timeout?: number,
    floor?: number,
    ceiling?: number,
    interval?: number,
    retryLimit?: number,
    onceBlock?: OnceBlockable
    oncePoll?: OncePollable
};

export type FetchJsonResponse = {
    statusCode: number;
    headers: { [ header: string ]: string };
};


type Header = { key: string, value: string };

export function fetchJson(connection: string | ConnectionInfo, json?: string, processFunc?: (value: any, response: FetchJsonResponse) => any): Promise<any> {

    // How many times to retry in the event of a throttle
    const attemptLimit = (typeof(connection) === "object" && connection.throttleLimit != null) ? connection.throttleLimit: 12;
    logger.assertArgument((attemptLimit > 0 && (attemptLimit % 1) === 0),
        "invalid connection throttle limit", "connection.throttleLimit", attemptLimit);

    const throttleCallback = ((typeof(connection) === "object") ? connection.throttleCallback: null);
    const throttleSlotInterval = ((typeof(connection) === "object" && typeof(connection.throttleSlotInterval) === "number") ? connection.throttleSlotInterval: 100);
    logger.assertArgument((throttleSlotInterval > 0 && (throttleSlotInterval % 1) === 0),
        "invalid connection throttle slot interval", "connection.throttleSlotInterval", throttleSlotInterval);

    const headers: { [key: string]: Header } = { };

    let url: string = null;

    // @TODO: Allow ConnectionInfo to override some of these values
    const options: any = {
        method: "GET",
    };

    let allow304 = false;

    let timeout = 2 * 60 * 1000;

    if (typeof(connection) === "string") {
        url = connection;

    } else if (typeof(connection) === "object") {
        if (connection == null || connection.url == null) {
            logger.throwArgumentError("missing URL", "connection.url", connection);
        }

        url = connection.url;

        if (typeof(connection.timeout) === "number" && connection.timeout > 0) {
            timeout = connection.timeout;
        }

        if (connection.headers) {
            for (const key in connection.headers) {
                headers[key.toLowerCase()] = { key: key, value: String(connection.headers[key]) };
                if (["if-none-match", "if-modified-since"].indexOf(key.toLowerCase()) >= 0) {
                    allow304 = true;
                }
            }
        }

        if (connection.user != null && connection.password != null) {
            if (url.substring(0, 6) !== "https:" && connection.allowInsecureAuthentication !== true) {
                logger.throwError(
                    "basic authentication requires a secure https url",
                    Logger.errors.INVALID_ARGUMENT,
                    { argument: "url", url: url, user: connection.user, password: "[REDACTED]" }
                );
            }

            const authorization = connection.user + ":" + connection.password;
            headers["authorization"] = {
                key: "Authorization",
                value: "Basic " + base64Encode(toUtf8Bytes(authorization))
            };
        }
    }

    if (json) {
        options.method = "POST";
        options.body = json;
        headers["content-type"] = { key: "Content-Type", value: "application/json" };
    }

    const flatHeaders: { [ key: string ]: string } = { };
    Object.keys(headers).forEach((key) => {
        const header = headers[key];
        flatHeaders[header.key] = header.value;
    });
    options.headers = flatHeaders;

    const runningTimeout = (function() {
        let timer: NodeJS.Timer = null;
        const promise = new Promise(function(resolve, reject) {
            if (timeout) {
                timer = setTimeout(() => {
                    if (timer == null) { return; }
                    timer = null;

                    reject(logger.makeError("timeout", Logger.errors.TIMEOUT, {
                        requestBody: (options.body || null),
                        requestMethod: options.method,
                        timeout: timeout,
                        url: url
                    }));
                }, timeout);
            }
        });

        const cancel = function() {
            if (timer == null) { return; }
            clearTimeout(timer);
            timer = null;
        }

        return { promise, cancel };
    })();

    const runningFetch = (async function() {

        for (let attempt = 0; attempt < attemptLimit; attempt++) {
            let response: GetUrlResponse = null;

            try {
                response = await getUrl(url, options);

                // Exponential back-off throttling
                if (response.statusCode === 429 && attempt < attemptLimit) {
                    let tryAgain = true;
                    if (throttleCallback) {
                        tryAgain = await throttleCallback(attempt, url);
                    }

                    if (tryAgain) {
                        let stall = 0;

                        const retryAfter = response.headers["retry-after"];
                        if (typeof(retryAfter) === "string" && retryAfter.match(/^[1-9][0-9]*$/)) {
                            stall = parseInt(retryAfter) * 1000;
                        } else {
                            stall = throttleSlotInterval * parseInt(String(Math.random() * Math.pow(2, attempt)));
                        }

                        await staller(stall);
                        continue;
                    }
                }

            } catch (error) {
                response = (<any>error).response;
                if (response == null) {
                    runningTimeout.cancel();
                    logger.throwError("missing response", Logger.errors.SERVER_ERROR, {
                        requestBody: (options.body || null),
                        requestMethod: options.method,
                        serverError: error,
                        url: url
                    });
                }
            }


            let body = response.body;

            if (allow304 && response.statusCode === 304) {
                body = null;

            } else if (response.statusCode < 200 || response.statusCode >= 300) {
                runningTimeout.cancel();
                logger.throwError("bad response", Logger.errors.SERVER_ERROR, {
                    status: response.statusCode,
                    headers: response.headers,
                    body: body,
                    requestBody: (options.body || null),
                    requestMethod: options.method,
                    url: url
                });
            }

            let json: any = null;
            if (body != null) {
                try {
                    json = JSON.parse(body);
                } catch (error) {
                    runningTimeout.cancel();
                    logger.throwError("invalid JSON", Logger.errors.SERVER_ERROR, {
                        body: body,
                        error: error,
                        requestBody: (options.body || null),
                        requestMethod: options.method,
                        url: url
                    });
                }
            }

            if (processFunc) {
                try {
                    json = await processFunc(json, response);
                } catch (error) {
                    // Allow the processFunc to trigger a throttle
                    if (error.throttleRetry && attempt < attemptLimit) {
                        let tryAgain = true;
                        if (throttleCallback) {
                            tryAgain = await throttleCallback(attempt, url);
                        }

                        if (tryAgain) {
                            const timeout = throttleSlotInterval * parseInt(String(Math.random() * Math.pow(2, attempt)));
                            await staller(timeout);
                            continue;
                        }
                    }

                    runningTimeout.cancel();
                    logger.throwError("processing response error", Logger.errors.SERVER_ERROR, {
                        body: json,
                        error: error,
                        requestBody: (options.body || null),
                        requestMethod: options.method,
                        url: url
                    });
                }
            }

            runningTimeout.cancel();
            return json;
        }
    })();

    return Promise.race([ runningTimeout.promise, runningFetch ]);
}

export function poll<T>(func: () => Promise<T>, options?: PollOptions): Promise<T> {
    if (!options) { options = {}; }
    options = shallowCopy(options);
    if (options.floor == null) { options.floor = 0; }
    if (options.ceiling == null) { options.ceiling = 10000; }
    if (options.interval == null) { options.interval = 250; }

    return new Promise(function(resolve, reject) {

        let timer: NodeJS.Timer = null;
        let done: boolean = false;

        // Returns true if cancel was successful. Unsuccessful cancel means we're already done.
        const cancel = (): boolean => {
            if (done) { return false; }
            done = true;
            if (timer) { clearTimeout(timer); }
            return true;
        };

        if (options.timeout) {
            timer = setTimeout(() => {
                if (cancel()) { reject(new Error("timeout")); }
            }, options.timeout)
        }

        const retryLimit = options.retryLimit;

        let attempt = 0;
        function check() {
            return func().then(function(result) {

                // If we have a result, or are allowed null then we're done
                if (result !== undefined) {
                    if (cancel()) { resolve(result); }

                } else if (options.oncePoll) {
                    options.oncePoll.once("poll", check);

                } else if (options.onceBlock) {
                    options.onceBlock.once("block", check);

                // Otherwise, exponential back-off (up to 10s) our next request
                } else if (!done) {
                    attempt++;
                    if (attempt > retryLimit) {
                        if (cancel()) { reject(new Error("retry limit reached")); }
                        return;
                    }

                    let timeout = options.interval * parseInt(String(Math.random() * Math.pow(2, attempt)));
                    if (timeout < options.floor) { timeout = options.floor; }
                    if (timeout > options.ceiling) { timeout = options.ceiling; }

                    setTimeout(check, timeout);
                }

                return null;
            }, function(error) {
                if (cancel()) { reject(error); }
            });
        }
        check();
    });
}


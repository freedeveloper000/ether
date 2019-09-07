"use strict";
import * as hash from "hash.js";
import { arrayify } from "@ethersproject/bytes";
import { Logger } from "@ethersproject/logger";
import { version } from "./_version";
const logger = new Logger(version);
export var SupportedAlgorithms;
(function (SupportedAlgorithms) {
    SupportedAlgorithms["sha256"] = "sha256";
    SupportedAlgorithms["sha512"] = "sha512";
})(SupportedAlgorithms || (SupportedAlgorithms = {}));
;
export function ripemd160(data) {
    return "0x" + (hash.ripemd160().update(arrayify(data)).digest("hex"));
}
export function sha256(data) {
    return "0x" + (hash.sha256().update(arrayify(data)).digest("hex"));
}
export function sha512(data) {
    return "0x" + (hash.sha512().update(arrayify(data)).digest("hex"));
}
export function computeHmac(algorithm, key, data) {
    if (!SupportedAlgorithms[algorithm]) {
        logger.throwError("unsupported algorithm " + algorithm, Logger.errors.UNSUPPORTED_OPERATION, {
            operation: "hmac",
            algorithm: algorithm
        });
    }
    return "0x" + hash.hmac(hash[algorithm], arrayify(key)).update(arrayify(data)).digest("hex");
}

"use strict";

import { arrayify, BytesLike, hexZeroPad, isBytes } from "@ethersproject/bytes";
import * as errors from "@ethersproject/errors";
import { defineReadOnly, isNamedInstance } from "@ethersproject/properties";

import { BigNumber, BigNumberish } from "./bignumber";

const _constructorGuard = { };

const Zero = BigNumber.from(0);
const NegativeOne = BigNumber.from(-1);

function throwFault(message: string, fault: string, operation: string, value?: any): never {
    let params: any = { fault: fault, operation: operation };
    if (value !== undefined) { params.value = value; }
    return errors.throwError(message, errors.NUMERIC_FAULT, params);
}

// Constant to pull zeros from for multipliers
let zeros = "0";
while (zeros.length < 256) { zeros += zeros; }

// Returns a string "1" followed by decimal "0"s
function getMultiplier(decimals: BigNumberish): string {

    if (typeof(decimals) !== "number") {
        try {
            decimals = BigNumber.from(decimals).toNumber();
        } catch (e) { }
    }

    if (typeof(decimals) === "number" && decimals >= 0 && decimals <= 256 && !(decimals % 1)) {
        return ("1" + zeros.substring(0, decimals));
    }

    return errors.throwArgumentError("invalid decimal size", "decimals", decimals);
}

export function formatFixed(value: BigNumberish, decimals?: string | BigNumberish): string {
    if (decimals == null) { decimals = 0; }
    let multiplier = getMultiplier(decimals);

    // Make sure wei is a big number (convert as necessary)
    value = BigNumber.from(value);

    let negative = value.lt(Zero);
    if (negative) { value = value.mul(NegativeOne); }

    let fraction = value.mod(multiplier).toString();
    while (fraction.length < multiplier.length - 1) { fraction = "0" + fraction; }

    // Strip training 0
    fraction = fraction.match(/^([0-9]*[1-9]|0)(0*)/)[1];

    let whole = value.div(multiplier).toString();

    value = whole + "." + fraction;

    if (negative) { value = "-" + value; }

    return value;
}

export function parseFixed(value: string, decimals?: BigNumberish): BigNumber {
    if (decimals == null) { decimals = 0; }
    let multiplier = getMultiplier(decimals);

    if (typeof(value) !== "string" || !value.match(/^-?[0-9.,]+$/)) {
        errors.throwArgumentError("invalid decimal value", "value", value);
    }

    if (multiplier.length - 1 === 0) {
        return BigNumber.from(value);
    }

    // Is it negative?
    let negative = (value.substring(0, 1) === "-");
    if (negative) { value = value.substring(1); }

    if (value === ".") {
        errors.throwArgumentError("missing value", "value", value);
    }

    // Split it into a whole and fractional part
    let comps = value.split(".");
    if (comps.length > 2) {
        errors.throwArgumentError("too many decimal points", "value", value);
    }

    let whole = comps[0], fraction = comps[1];
    if (!whole) { whole = "0"; }
    if (!fraction) { fraction = "0"; }

    // Prevent underflow
    if (fraction.length > multiplier.length - 1) {
        throwFault("fractional component exceeds decimals", "underflow", "parseFixed");
    }

    // Fully pad the string with zeros to get to wei
    while (fraction.length < multiplier.length - 1) { fraction += "0"; }

    let wholeValue = BigNumber.from(whole);
    let fractionValue = BigNumber.from(fraction);

    let wei = (wholeValue.mul(multiplier)).add(fractionValue);

    if (negative) { wei = wei.mul(NegativeOne); }

    return wei;
}

export class FixedFormat {
    readonly signed: boolean;
    readonly width: number;
    readonly decimals: number;
    readonly name: string;
    readonly _multiplier: BigNumber;

    constructor(constructorGuard: any, signed: boolean, width: number, decimals: number) {
        defineReadOnly(this, "signed", signed);
        defineReadOnly(this, "width", width);
        defineReadOnly(this, "decimals", decimals);

        let name = (signed ? "": "u") + "fixed" + String(width) + "x" + String(decimals);
        defineReadOnly(this, "name", name);

        defineReadOnly(this, "_multiplier", getMultiplier(decimals));
    }

    static from(value: any): FixedFormat {
        if (value instanceof FixedFormat) { return value; }

        let signed = true;
        let width = 128;
        let decimals = 18;

        if (typeof(value) === "string") {
            if (value === "fixed") {
                // defaults...
            } else if (value === "ufixed") {
                signed = false;
            } else if (value != null) {
                let match = value.match(/^(u?)fixed([0-9]+)x([0-9]+)$/);
                if (!match) { errors.throwArgumentError("invalid fixed format", "format", value); }
                signed = (match[1] !== "u");
                width = parseInt(match[2]);
                decimals = parseInt(match[3]);
            }
        } else if (value) {
            let check = (key: string, type: string, defaultValue: any): any => {
                if (value[key] == null) { return defaultValue; }
                if (typeof(value[key]) !== type) {
                    errors.throwArgumentError("invalid fixed format (" + key + " not " + type +")", "format." + key, value[key]);
                }
                return value[key];
            }
            signed = check("signed", "boolean", signed);
            width = check("width", "number", width);
            decimals = check("decimals", "number", decimals);
        }

        if (width % 8) {
            errors.throwArgumentError("invalid fixed format width (not byte aligned)", "format.width", width);
        }

        if (decimals > 80) {
            errors.throwArgumentError("invalid fixed format (decimals too large)", "format.decimals", decimals);
        }

        return new FixedFormat(_constructorGuard, signed, width, decimals);
    }

    static isInstance(value: any): value is FixedFormat {
        return isNamedInstance(this, value);
    }
}

export class FixedNumber {
    readonly format: FixedFormat;
    readonly _hex: string;
    readonly _value: string;

    constructor(constructorGuard: any, hex: string, value: string, format?: FixedFormat) {
        errors.checkNew(new.target, FixedNumber);
        defineReadOnly(this, 'format', format);
        defineReadOnly(this, '_hex', hex);
        defineReadOnly(this, '_value', value);
    }


    _checkFormat(other: FixedNumber): void {
        if (this.format.name !== other.format.name) {
            errors.throwArgumentError("incompatible format; use fixedNumber.toFormat", "other", other);
        }
    }

    addUnsafe(other: FixedNumber): FixedNumber {
        this._checkFormat(other);
        let a = parseFixed(this._value, this.format.decimals);
        let b = parseFixed(other._value, other.format.decimals);
        return FixedNumber.fromValue(a.add(b), this.format.decimals, this.format);
    }

    subUnsafe(other: FixedNumber): FixedNumber {
        this._checkFormat(other);
        let a = parseFixed(this._value, this.format.decimals);
        let b = parseFixed(other._value, other.format.decimals);
        return FixedNumber.fromValue(a.sub(b), this.format.decimals, this.format);
    }

    mulUnsafe(other: FixedNumber): FixedNumber {
        this._checkFormat(other);
        let a = parseFixed(this._value, this.format.decimals);
        let b = parseFixed(other._value, other.format.decimals);
        return FixedNumber.fromValue(a.mul(b).div(this.format._multiplier), this.format.decimals, this.format);
    }

    divUnsafe(other: FixedNumber): FixedNumber {
        this._checkFormat(other);
        let a = parseFixed(this._value, this.format.decimals);
        let b = parseFixed(other._value, other.format.decimals);
        return FixedNumber.fromValue(a.mul(this.format._multiplier).div(b), this.format.decimals, this.format);
    }

    // @TODO: Support other rounding algorithms
    round(decimals?: number): FixedNumber {
        if (decimals == null) { decimals = 0; }
        if (decimals < 0 || decimals > 80 || (decimals % 1)) {
            errors.throwArgumentError("invalid decimal cound", "decimals", decimals);
        }

        // If we are already in range, we're done
        let comps = this.toString().split(".");
        if (comps[1].length <= decimals) { return this; }

        // Bump the value up by the 0.00...0005
        let bump = "0." + zeros.substring(0, decimals) + "5";
        comps = this.addUnsafe(FixedNumber.fromString(bump, this.format))._value.split(".");

        // Now it is safe to truncate
        return FixedNumber.fromString(comps[0] + "." + comps[1].substring(0, decimals));
    }


    toString(): string { return this._value; }

    toHexString(width?: number): string {
        if (width == null) { return this._hex; }
        if (width % 8) { errors.throwArgumentError("invalid byte width", "width", width); }
        let hex = BigNumber.from(this._hex).fromTwos(this.format.width).toTwos(width).toHexString();
        return hexZeroPad(hex, width / 8);
    }

    toUnsafeFloat(): number { return parseFloat(this.toString()); }

    toFormat(format: FixedFormat | string): FixedNumber {
        return FixedNumber.fromString(this._value, format);
    }


    static fromValue(value: BigNumber, decimals?: BigNumberish, format?: FixedFormat | string): FixedNumber {
        // If decimals looks more like a format, and there is no format, shift the parameters
        if (format == null && decimals != null && (FixedFormat.isInstance(decimals) || typeof(decimals) === "string")) {
            format = decimals;
            decimals = null;
        }

        if (decimals == null) { decimals = 0; }
        if (format == null) { format = "fixed"; }

        let fixedFormat = (FixedFormat.isInstance(format) ? format: FixedFormat.from(format));
        return FixedNumber.fromString(formatFixed(value, decimals), fixedFormat);
    }


    static fromString(value: string, format?: FixedFormat | string): FixedNumber {
        if (format == null) { format = "fixed"; }

        let fixedFormat = (FixedFormat.isInstance(format) ? format: FixedFormat.from(format));

        let numeric = parseFixed(value, fixedFormat.decimals);

        if (!fixedFormat.signed && numeric.lt(Zero)) {
            throwFault("unsigned value cannot be negative", "overflow", "value", value);
        }

        let hex: string = null;
        if (fixedFormat.signed) {
            hex = numeric.toTwos(fixedFormat.width).toHexString();
        } else {
            hex = numeric.toHexString();
            hex = hexZeroPad(hex, fixedFormat.width / 8);
        }

        let decimal = formatFixed(numeric, fixedFormat.decimals);

        return new FixedNumber(_constructorGuard, hex, decimal, fixedFormat);
    }

    static fromBytes(value: BytesLike, format?: FixedFormat | string): FixedNumber {
        if (format == null) { format = "fixed"; }

        let fixedFormat = (FixedFormat.isInstance(format) ? format: FixedFormat.from(format));

        if (arrayify(value).length > fixedFormat.width / 8) {
            throw new Error("overflow");
        }

        let numeric = BigNumber.from(value);
        if (fixedFormat.signed) { numeric = numeric.fromTwos(fixedFormat.width); }

        let hex = numeric.toTwos((fixedFormat.signed ? 0: 1) + fixedFormat.width).toHexString();
        let decimal = formatFixed(numeric, fixedFormat.decimals);

        return new FixedNumber(_constructorGuard, hex, decimal, fixedFormat);
    }

    static from(value: any, format?: FixedFormat | string) {
        if (typeof(value) === "string") {
            return FixedNumber.fromString(value, format);
        }

        if (isBytes(value)) {
            return FixedNumber.fromBytes(value, format);
        }

        try {
            return FixedNumber.fromValue(value, 0, format);
        } catch (error) {
            // Allow NUMERIC_FAULT to bubble up
            if (error.code !== errors.INVALID_ARGUMENT) {
                throw error;
            }
        }

        return errors.throwArgumentError("invalid FixedNumber value", "value", value);
    }

    static isFixedNumber(value: any): value is FixedNumber {
        return isNamedInstance<FixedNumber>(this, value);
    }
}

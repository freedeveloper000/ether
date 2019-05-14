"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
/**
 *  BigNumber
 *
 *  A wrapper around the BN.js object. We use the BN.js library
 *  because it is used by elliptic, so it is required regardles.
 *
 */
var BN = __importStar(require("bn.js"));
var bytes_1 = require("@ethersproject/bytes");
var properties_1 = require("@ethersproject/properties");
var errors = __importStar(require("@ethersproject/errors"));
var _constructorGuard = {};
var MAX_SAFE = 0x1fffffffffffff;
/*
export function isBigNumberLike(value: any): value is BigNumberish {
    return (BigNumber.isBigNumber(value) ||
            (!!((<any>value).toHexString)) ||
            isBytes(value) ||
            value.match(/^-?([0-9]+|0x[0-9a-f]+)$/i) ||
            typeof(value) === "number");
}
*/
var BigNumber = /** @class */ (function () {
    function BigNumber(constructorGuard, hex) {
        var _newTarget = this.constructor;
        errors.checkNew(_newTarget, BigNumber);
        if (constructorGuard !== _constructorGuard) {
            errors.throwError("cannot call consturtor directly; use BigNumber.from", errors.UNSUPPORTED_OPERATION, {
                operation: "new (BigNumber)"
            });
        }
        properties_1.defineReadOnly(this, "_hex", hex);
    }
    BigNumber.prototype.fromTwos = function (value) {
        return toBigNumber(toBN(this).fromTwos(value));
    };
    BigNumber.prototype.toTwos = function (value) {
        return toBigNumber(toBN(this).toTwos(value));
    };
    BigNumber.prototype.abs = function () {
        if (this._hex[0] === "-") {
            return BigNumber.from(this._hex.substring(1));
        }
        return this;
    };
    BigNumber.prototype.add = function (other) {
        return toBigNumber(toBN(this).add(toBN(other)));
    };
    BigNumber.prototype.sub = function (other) {
        return toBigNumber(toBN(this).sub(toBN(other)));
    };
    BigNumber.prototype.div = function (other) {
        var o = BigNumber.from(other);
        if (o.isZero()) {
            throwFault("division by zero", "div");
        }
        return toBigNumber(toBN(this).div(toBN(other)));
    };
    BigNumber.prototype.mul = function (other) {
        return toBigNumber(toBN(this).mul(toBN(other)));
    };
    BigNumber.prototype.mod = function (other) {
        return toBigNumber(toBN(this).mod(toBN(other)));
    };
    BigNumber.prototype.pow = function (other) {
        return toBigNumber(toBN(this).pow(toBN(other)));
    };
    BigNumber.prototype.maskn = function (value) {
        return toBigNumber(toBN(this).maskn(value));
    };
    BigNumber.prototype.eq = function (other) {
        return toBN(this).eq(toBN(other));
    };
    BigNumber.prototype.lt = function (other) {
        return toBN(this).lt(toBN(other));
    };
    BigNumber.prototype.lte = function (other) {
        return toBN(this).lte(toBN(other));
    };
    BigNumber.prototype.gt = function (other) {
        return toBN(this).gt(toBN(other));
    };
    BigNumber.prototype.gte = function (other) {
        return toBN(this).gte(toBN(other));
    };
    BigNumber.prototype.isZero = function () {
        return toBN(this).isZero();
    };
    BigNumber.prototype.toNumber = function () {
        try {
            return toBN(this).toNumber();
        }
        catch (error) {
            throwFault("overflow", "toNumber", this.toString());
        }
        return null;
    };
    BigNumber.prototype.toString = function () {
        // Lots of people expect this, which we do not support, so check
        if (arguments.length !== 0) {
            errors.throwError("bigNumber.toString does not accept parameters", errors.UNEXPECTED_ARGUMENT, {});
        }
        return toBN(this).toString(10);
    };
    BigNumber.prototype.toHexString = function () {
        return this._hex;
    };
    BigNumber.from = function (value) {
        if (value instanceof BigNumber) {
            return value;
        }
        if (typeof (value) === "string") {
            if (value.match(/-?0x[0-9a-f]+/i)) {
                return new BigNumber(_constructorGuard, toHex(value));
            }
            if (value.match(/^-?[0-9]+$/)) {
                return new BigNumber(_constructorGuard, toHex(new BN.BN(value)));
            }
            return errors.throwArgumentError("invalid BigNumber string", "value", value);
        }
        if (typeof (value) === "number") {
            if (value % 1) {
                throwFault("underflow", "BigNumber.from", value);
            }
            if (value >= MAX_SAFE || value <= -MAX_SAFE) {
                throwFault("overflow", "BigNumber.from", value);
            }
            return BigNumber.from(String(value));
        }
        if (typeof (value) === "bigint") {
            return BigNumber.from(value.toString());
        }
        if (bytes_1.isBytes(value)) {
            return BigNumber.from(bytes_1.hexlify(value));
        }
        if (value._hex && bytes_1.isHexString(value._hex)) {
            return BigNumber.from(value._hex);
        }
        if (value.toHexString) {
            value = value.toHexString();
            if (typeof (value) === "string") {
                return BigNumber.from(value);
            }
        }
        return errors.throwArgumentError("invalid BigNumber value", "value", value);
    };
    BigNumber.isBigNumber = function (value) {
        return properties_1.isNamedInstance(this, value);
    };
    return BigNumber;
}());
exports.BigNumber = BigNumber;
/*
export function bigNumberify(value: BigNumberish): BigNumber {
    if (BigNumber.isBigNumber(value)) { return value; }
    return new BigNumber(value);
}
*/
/*
function zeros(length) {
    let result = "";
    while (result.length < length) { tens += "0"; }
    return result;
}
export class FixedNumber {
    readonly value: BigNumber;
    readonly decimalPlaces: number;

    constructor(value: BigNumberish, decimalPlaces: number) {
        defineReadOnly(this, "value", bigNumberify(value));
        defineReadOnly(this, "decimalPlaces", decimalPlaces);
    }

    toString(): string {
        return formatUnits(this.value, this.decimalPlaces);
    }

    static fromString(value: string): FixedNumber {
        let comps = value.split(".");
        let decimalPlaces = 0;
        if (comps.length === 2) { decimalPlaces = comps[1].length; }
        return new FixedNumber(parseUnits(value, decimalPlaces), decimalPlaces);
    }
*/
/*
    
    readonly negative: boolean;
    readonly whole: BigNumber;
    readonly fraction: BigNumber;
    constructor(whole: BigNumberish, fraction: BigNumberish, negative?: boolean) {
        if (whole.lt(constants.Zero)) {
            errors.throwError("whole component must be positive", errors.INVALID_ARGUMENT, {
                argument: whole,
                value: whole
            });
        }
        defineReadOnly(this, "whole", bigNumberify(whole));
        defineReadOnly(this, "fraction", bigNumberify(fraction));
        defineReadOnly(this, "negative", !!boolean);
    }
*/
/*
    toHexString(bitWidth?: number, decimalPlaces?: number, signed?: boolean): string {
        if (bitWidth == null) { bitWidth = 128; }
        if (decimalPlaces == null) { decimalPlaces = 18; }
        if (signed == null) { signed = true; }
        return null;
    }
    static fromValue(value: BigNumberish, decimalPlaces: number): FixedNumber {
        let negative = false;
        if (value.lt(constants.Zero)) {
            negative = true;
            value = value.abs();
        }
        let tens = bigNumberify("1" + zeros(decimalPlaces));
        return new FixedNumber(value.divide(tens), value.mod(tens), negative);
    }
        let negative = false;
        if (value.substring(0, 1) === "-") {
            negative = true;
            value = value.substring(1);
        }

        if (value !== "." && value !== "") {
            let comps = value.split(".");
            if (comps.length === 1) {
                return new FixedNumber(comps[0], 0, negative);
            } else if (comps.length === 2) {
                if (comps[0] === "") { comps[0] = "0"; }
                if (comps[1] === "") { comps[1] = "0"; }
                return new FixedNumber(comps[0], comps[1], negative);
            }
        }

        errors.throwError("invalid fixed-point value", errors.INVALID_ARGUMENT, {
            argument: "value",
            value: value
        });

        return null;
*/
//}
// Normalize the hex string
function toHex(value) {
    // For BN, call on the hex string
    if (typeof (value) !== "string") {
        return toHex(value.toString(16));
    }
    // If negative, prepend the negative sign to the normalized positive value
    if (value[0] === "-") {
        // Strip off the negative sign
        value = value.substring(1);
        // Cannot have mulitple negative signs (e.g. "--0x04")
        if (value[0] === "-") {
            errors.throwArgumentError("invalid hex", "value", value);
        }
        // Call toHex on the positive component
        value = toHex(value);
        // Do not allow "-0x00"
        if (value === "0x00") {
            return value;
        }
        // Negate the value
        return "-" + value;
    }
    // Add a "0x" prefix if missing
    if (value.substring(0, 2) !== "0x") {
        value = "0x" + value;
    }
    // Normalize zero
    if (value === "0x") {
        return "0x00";
    }
    // Make the string even length
    if (value.length % 2) {
        value = "0x0" + value.substring(2);
    }
    // Trim to smallest even-length string
    while (value.length > 4 && value.substring(0, 4) === "0x00") {
        value = "0x" + value.substring(4);
    }
    return value;
}
function toBigNumber(value) {
    return BigNumber.from(toHex(value));
}
function toBN(value) {
    var hex = BigNumber.from(value).toHexString();
    if (hex[0] === "-") {
        return (new BN.BN("-" + hex.substring(3), 16));
    }
    return new BN.BN(hex.substring(2), 16);
}
function throwFault(fault, operation, value) {
    var params = { fault: fault, operation: operation };
    if (value != null) {
        params.value = value;
    }
    return errors.throwError(fault, errors.NUMERIC_FAULT, params);
}

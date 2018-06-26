'use strict';
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
// This is SUPER useful, but adds 140kb (even zipped, adds 40kb)
//var unorm = require('unorm');
var address_1 = require("./address");
exports.getAddress = address_1.getAddress;
exports.getContractAddress = address_1.getContractAddress;
exports.getIcapAddress = address_1.getIcapAddress;
var abi_coder_1 = require("./abi-coder");
exports.AbiCoder = abi_coder_1.AbiCoder;
exports.defaultAbiCoder = abi_coder_1.defaultAbiCoder;
exports.formatSignature = abi_coder_1.formatSignature;
exports.formatParamType = abi_coder_1.formatParamType;
exports.parseSignature = abi_coder_1.parseSignature;
exports.parseParamType = abi_coder_1.parseParamType;
var base64 = __importStar(require("./base64"));
exports.base64 = base64;
var bignumber_1 = require("./bignumber");
exports.BigNumber = bignumber_1.BigNumber;
exports.bigNumberify = bignumber_1.bigNumberify;
var bytes_1 = require("./bytes");
exports.arrayify = bytes_1.arrayify;
exports.concat = bytes_1.concat;
exports.hexlify = bytes_1.hexlify;
exports.joinSignature = bytes_1.joinSignature;
exports.padZeros = bytes_1.padZeros;
exports.splitSignature = bytes_1.splitSignature;
exports.stripZeros = bytes_1.stripZeros;
var hash_1 = require("./hash");
exports.hashMessage = hash_1.hashMessage;
exports.id = hash_1.id;
exports.namehash = hash_1.namehash;
var keccak256_1 = require("./keccak256");
exports.keccak256 = keccak256_1.keccak256;
var sha2_1 = require("./sha2");
exports.sha256 = sha2_1.sha256;
var solidity_1 = require("./solidity");
exports.solidityKeccak256 = solidity_1.keccak256;
exports.solidityPack = solidity_1.pack;
exports.soliditySha256 = solidity_1.sha256;
var random_bytes_1 = require("./random-bytes");
exports.randomBytes = random_bytes_1.randomBytes;
var properties_1 = require("./properties");
exports.defineFrozen = properties_1.defineFrozen;
exports.defineReadOnly = properties_1.defineReadOnly;
exports.resolveProperties = properties_1.resolveProperties;
exports.shallowCopy = properties_1.shallowCopy;
var RLP = __importStar(require("./rlp"));
exports.RLP = RLP;
var utf8_1 = require("./utf8");
exports.toUtf8Bytes = utf8_1.toUtf8Bytes;
exports.toUtf8String = utf8_1.toUtf8String;
var units_1 = require("./units");
exports.formatEther = units_1.formatEther;
exports.parseEther = units_1.parseEther;
exports.formatUnits = units_1.formatUnits;
exports.parseUnits = units_1.parseUnits;
var web_1 = require("./web");
exports.fetchJson = web_1.fetchJson;
var transaction_1 = require("./transaction");
exports.parseTransaction = transaction_1.parse;
exports.serializeTransaction = transaction_1.serialize;
var errors = __importStar(require("./errors"));
exports.errors = errors;
// NFKD (decomposed)
//const etherSymbol = '\uD835\uDF63';
// NFKC (composed)
var etherSymbol = '\u039e';
exports.etherSymbol = etherSymbol;
exports.default = {
    AbiCoder: abi_coder_1.AbiCoder,
    defaultAbiCoder: abi_coder_1.defaultAbiCoder,
    parseSignature: abi_coder_1.parseSignature,
    parseParamType: abi_coder_1.parseParamType,
    RLP: RLP,
    fetchJson: web_1.fetchJson,
    defineReadOnly: properties_1.defineReadOnly,
    defineFrozen: properties_1.defineFrozen,
    resolveProperties: properties_1.resolveProperties,
    shallowCopy: properties_1.shallowCopy,
    etherSymbol: etherSymbol,
    arrayify: bytes_1.arrayify,
    concat: bytes_1.concat,
    padZeros: bytes_1.padZeros,
    stripZeros: bytes_1.stripZeros,
    base64: base64,
    bigNumberify: bignumber_1.bigNumberify,
    BigNumber: bignumber_1.BigNumber,
    hexlify: bytes_1.hexlify,
    toUtf8Bytes: utf8_1.toUtf8Bytes,
    toUtf8String: utf8_1.toUtf8String,
    hashMessage: hash_1.hashMessage,
    namehash: hash_1.namehash,
    id: hash_1.id,
    getAddress: address_1.getAddress,
    getIcapAddress: address_1.getIcapAddress,
    getContractAddress: address_1.getContractAddress,
    formatEther: units_1.formatEther,
    parseEther: units_1.parseEther,
    formatUnits: units_1.formatUnits,
    parseUnits: units_1.parseUnits,
    keccak256: keccak256_1.keccak256,
    sha256: sha2_1.sha256,
    randomBytes: random_bytes_1.randomBytes,
    solidityPack: solidity_1.pack,
    solidityKeccak256: solidity_1.keccak256,
    soliditySha256: solidity_1.sha256,
    splitSignature: bytes_1.splitSignature,
    joinSignature: bytes_1.joinSignature,
    parseTransaction: transaction_1.parse,
    serializeTransaction: transaction_1.serialize,
    errors: errors
};

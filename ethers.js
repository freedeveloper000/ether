'use strict';
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var contracts_1 = require("./contracts");
exports.Contract = contracts_1.Contract;
exports.Interface = contracts_1.Interface;
var providers_1 = require("./providers");
exports.getDefaultProvider = providers_1.getDefaultProvider;
var json_rpc_provider_1 = require("./providers/json-rpc-provider");
var wallet_1 = require("./wallet");
exports.HDNode = wallet_1.HDNode;
exports.SigningKey = wallet_1.SigningKey;
exports.Wallet = wallet_1.Wallet;
var utils = __importStar(require("./utils"));
exports.utils = utils;
var wordlists = __importStar(require("./wordlists"));
exports.wordlists = wordlists;
var errors = __importStar(require("./utils/errors"));
exports.errors = errors;
// This is empty in node, and used by browserify to inject extra goodies
var shims_1 = require("./utils/shims");
exports.platform = shims_1.platform;
// This is generated by "npm run dist"
var _version_1 = require("./_version");
exports.version = _version_1.version;
///////////////////////////////
// Imported Abstracts
var abstract_provider_1 = require("./providers/abstract-provider");
var abstract_signer_1 = require("./wallet/abstract-signer");
var hmac_1 = require("./utils/hmac");
var utf8_1 = require("./utils/utf8");
var wordlist_1 = require("./wordlists/wordlist");
///////////////////////////////
// Exported Types
var types;
(function (types) {
    types.AbstractSigner = abstract_signer_1.Signer;
    types.AbstractProvider = abstract_provider_1.Provider;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    ;
    // ./utils/hmac
    types.SupportedAlgorithms = hmac_1.SupportedAlgorithms;
    ;
    // ./utils/utf8
    types.UnicodeNormalizationForm = utf8_1.UnicodeNormalizationForm;
    ;
    // ./wordlists/wordlist
    types.Wordlist = wordlist_1.Wordlist;
})(types || (types = {}));
exports.types = types;
///////////////////////////////
var constants = utils.constants;
exports.constants = constants;
var providers = {
    Provider: providers_1.Provider,
    FallbackProvider: providers_1.FallbackProvider,
    EtherscanProvider: providers_1.EtherscanProvider,
    InfuraProvider: providers_1.InfuraProvider,
    IpcProvider: providers_1.IpcProvider,
    JsonRpcProvider: providers_1.JsonRpcProvider,
    Web3Provider: providers_1.Web3Provider,
    JsonRpcSigner: json_rpc_provider_1.JsonRpcSigner
};
exports.providers = providers;

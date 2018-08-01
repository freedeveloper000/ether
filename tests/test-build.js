
var assert = require('assert');
var fs = require('fs');
var path = require('path');

var utils = require('./utils');
var ethers = utils.getEthers(__filename);

describe("Package Version", function() {
    var url = "http://registry.npmjs.org/ethers"
    it("is not already published", function() {
        return ethers.utils.fetchJson(url).then(function(data) {
            assert.ok(Object.keys(data.versions).indexOf(ethers.version) === -1);
        });
    });
});

// These test cases will fail if "npm run dist" has not been called to
// create the ./dist/ethers.js and ./dist/ethers.min.js. They will also
// fail if the dist files have been tampered with manually, since Travis
// CI will build them using the same tool versions in the package-lock.json.
describe("Dist Build:", function() {

    // No need (and can't) check this in the browser
    if (fs.readFileSync == null) { return; }

    function test(filename) {
        it("matches dist build - " + filename, function() {
            var dist = fs.readFileSync(path.resolve(__dirname, '../dist/' + filename)).toString()
            var checkDist = fs.readFileSync(path.resolve(__dirname, './dist/' + filename)).toString();
            assert.equal(ethers.utils.id(checkDist), ethers.utils.id(dist), 'matches');
        });
    }

    test('ethers.js');
    test('ethers.min.js');
});

/*
describe("Test package path resolution:", function() {
    var Tests = {
        "..": [
            "Wallet"
        ],
        "../contracts": [
        ],
        "../contracts/contract": [
        ],
        "../contracts/interface": [
        ],
        "../providers": [
        ],
        "../providers/InfuraProvider": [
        ],
        "../providers/JsonRpcProvider": [
        ],
        "../providers/FallbackProvider": [
        ],
        "../providers/IpcProvider": [
        ],
        "../providers/Provider": [
        ],
        "../wallet": [
        ],
    };
    for (var key in Tests) {
        it(key, function() {
            var test = require(key);
        });
    }
});
*/

// Generated by dts-bundle v0.7.3

declare module 'ethers' {
    import * as ethers from 'ethers/ethers';
    export { ethers };
    export * from "ethers/ethers";
}

declare module 'ethers/ethers' {
    import { platform } from 'ethers/utils/shims';
    import { Contract, Interface } from 'ethers/contracts';
    import * as providers from 'ethers/providers';
    import * as utils from 'ethers/utils';
    import { HDNode, SigningKey, Wallet } from 'ethers/wallet';
    import * as wordlists from 'ethers/wordlists';
    import * as types from 'ethers/utils/types';
    import * as errors from 'ethers/utils/errors';
    import { version } from 'ethers/_version';
    const constants: {
        AddressZero: string;
        HashZero: string;
        NegativeOne: utils.types.BigNumber;
        Zero: utils.types.BigNumber;
        One: utils.types.BigNumber;
        Two: utils.types.BigNumber;
        WeiPerEther: utils.types.BigNumber;
    };
    export { Wallet, HDNode, SigningKey, Contract, Interface, providers, types, errors, constants, utils, wordlists, platform, version };
}

declare module 'ethers/utils/shims' {
    export const platform = "node";
}

declare module 'ethers/contracts' {
    import { Contract } from 'ethers/contracts/contract';
    import { Interface } from 'ethers/contracts/interface';
    export { Contract, Interface };
}

declare module 'ethers/providers' {
    import { Provider } from 'ethers/providers/provider';
    import { EtherscanProvider } from 'ethers/providers/etherscan-provider';
    import { FallbackProvider } from 'ethers/providers/fallback-provider';
    import { IpcProvider } from 'ethers/providers/ipc-provider';
    import { InfuraProvider } from 'ethers/providers/infura-provider';
    import { JsonRpcProvider, JsonRpcSigner } from 'ethers/providers/json-rpc-provider';
    import { Web3Provider } from 'ethers/providers/web3-provider';
    import { Network } from 'ethers/utils/types';
    function getDefaultProvider(network?: Network | string): Provider;
    export { Provider, getDefaultProvider, FallbackProvider, EtherscanProvider, InfuraProvider, JsonRpcProvider, Web3Provider, IpcProvider, JsonRpcSigner };
}

declare module 'ethers/utils' {
    import { getAddress, getContractAddress, getIcapAddress } from 'ethers/utils/address';
    import { AbiCoder, defaultAbiCoder, formatSignature, formatParamType, parseSignature, parseParamType } from 'ethers/utils/abi-coder';
    import * as base64 from 'ethers/utils/base64';
    import { bigNumberify } from 'ethers/utils/bignumber';
    import { arrayify, concat, hexDataSlice, hexDataLength, hexlify, hexStripZeros, hexZeroPad, joinSignature, padZeros, splitSignature, stripZeros } from 'ethers/utils/bytes';
    import { hashMessage, id, namehash } from 'ethers/utils/hash';
    import { getJsonWalletAddress } from 'ethers/utils/json-wallet';
    import { keccak256 } from 'ethers/utils/keccak256';
    import { sha256 } from 'ethers/utils/sha2';
    import { keccak256 as solidityKeccak256, pack as solidityPack, sha256 as soliditySha256 } from 'ethers/utils/solidity';
    import { randomBytes } from 'ethers/utils/random-bytes';
    import { getNetwork } from 'ethers/utils/networks';
    import { defineFrozen, defineReadOnly, resolveProperties, shallowCopy } from 'ethers/utils/properties';
    import * as RLP from 'ethers/utils/rlp';
    import { verifyMessage } from 'ethers/utils/secp256k1';
    import { parse as parseTransaction, serialize as serializeTransaction } from 'ethers/utils/transaction';
    import { toUtf8Bytes, toUtf8String } from 'ethers/utils/utf8';
    import { formatEther, parseEther, formatUnits, parseUnits } from 'ethers/utils/units';
    import { fetchJson } from 'ethers/utils/web';
    import * as types from 'ethers/utils/types';
    import * as errors from 'ethers/utils/errors';
    const etherSymbol = "\u039E";
    const constants: {
        AddressZero: string;
        HashZero: string;
        NegativeOne: types.BigNumber;
        Zero: types.BigNumber;
        One: types.BigNumber;
        Two: types.BigNumber;
        WeiPerEther: types.BigNumber;
    };
    export { AbiCoder, defaultAbiCoder, formatSignature, formatParamType, parseSignature, parseParamType, constants, types, RLP, fetchJson, getNetwork, defineReadOnly, defineFrozen, resolveProperties, shallowCopy, etherSymbol, arrayify, concat, padZeros, stripZeros, base64, bigNumberify, hexlify, hexStripZeros, hexZeroPad, hexDataLength, hexDataSlice, toUtf8Bytes, toUtf8String, hashMessage, namehash, id, getAddress, getIcapAddress, getContractAddress, formatEther, parseEther, formatUnits, parseUnits, keccak256, sha256, randomBytes, solidityPack, solidityKeccak256, soliditySha256, splitSignature, joinSignature, parseTransaction, serializeTransaction, getJsonWalletAddress, verifyMessage, errors };
}

declare module 'ethers/wallet' {
    import { Wallet } from 'ethers/wallet/wallet';
    import * as HDNode from 'ethers/wallet/hdnode';
    import { SigningKey } from 'ethers/wallet/signing-key';
    export { HDNode, SigningKey, Wallet };
}

declare module 'ethers/wordlists' {
    import { Wordlist } from 'ethers/wordlists/wordlist';
    const en: Wordlist;
    const ko: Wordlist;
    const it: Wordlist;
    const ja: Wordlist;
    const zh: Wordlist;
    const zh_cn: Wordlist;
    const zh_tw: Wordlist;
    export { en, it, ja, ko, zh, zh_cn, zh_tw };
}

declare module 'ethers/utils/types' {
    export type Arrayish = string | ArrayLike<number>;
    export abstract class BigNumber {
            abstract fromTwos(value: number): BigNumber;
            abstract toTwos(value: number): BigNumber;
            abstract add(other: BigNumberish): BigNumber;
            abstract sub(other: BigNumberish): BigNumber;
            abstract div(other: BigNumberish): BigNumber;
            abstract mul(other: BigNumberish): BigNumber;
            abstract mod(other: BigNumberish): BigNumber;
            abstract pow(other: BigNumberish): BigNumber;
            abstract maskn(value: number): BigNumber;
            abstract eq(other: BigNumberish): boolean;
            abstract lt(other: BigNumberish): boolean;
            abstract lte(other: BigNumberish): boolean;
            abstract gt(other: BigNumberish): boolean;
            abstract gte(other: BigNumberish): boolean;
            abstract isZero(): boolean;
            abstract toNumber(): number;
            abstract toString(): string;
            abstract toHexString(): string;
    }
    export type BigNumberish = BigNumber | string | number | Arrayish;
    export type ConnectionInfo = {
            url: string;
            user?: string;
            password?: string;
            allowInsecure?: boolean;
    };
    export interface OnceBlockable {
            once(eventName: "block", handler: () => void): void;
    }
    export type PollOptions = {
            timeout?: number;
            floor?: number;
            ceiling?: number;
            interval?: number;
            onceBlock?: OnceBlockable;
    };
    export type SupportedAlgorithms = 'sha256' | 'sha512';
    export interface Signature {
            r: string;
            s: string;
            recoveryParam?: number;
            v?: number;
    }
    export type Network = {
            name: string;
            chainId: number;
            ensAddress?: string;
    };
    export type Networkish = Network | string | number;
    export type CoerceFunc = (type: string, value: any) => any;
    export type ParamType = {
            name?: string;
            type: string;
            indexed?: boolean;
            components?: Array<any>;
    };
    export type EventFragment = {
            type: string;
            name: string;
            anonymous: boolean;
            inputs: Array<ParamType>;
    };
    export type FunctionFragment = {
            type: string;
            name: string;
            constant: boolean;
            inputs: Array<ParamType>;
            outputs: Array<ParamType>;
            payable: boolean;
            stateMutability: string;
    };
    export type UnsignedTransaction = {
            to?: string;
            nonce?: number;
            gasLimit?: BigNumberish;
            gasPrice?: BigNumberish;
            data?: Arrayish;
            value?: BigNumberish;
            chainId?: number;
    };
    export interface Transaction {
            hash?: string;
            to?: string;
            from?: string;
            nonce: number;
            gasLimit: BigNumber;
            gasPrice: BigNumber;
            data: string;
            value: BigNumber;
            chainId: number;
            r?: string;
            s?: string;
            v?: number;
    }
    export type BlockTag = string | number;
    export interface Block {
            hash: string;
            parentHash: string;
            number: number;
            timestamp: number;
            nonce: string;
            difficulty: number;
            gasLimit: BigNumber;
            gasUsed: BigNumber;
            miner: string;
            extraData: string;
            transactions: Array<string>;
    }
    export type Filter = {
            fromBlock?: BlockTag;
            toBlock?: BlockTag;
            address?: string;
            topics?: Array<string | Array<string>>;
    };
    export interface Log {
            blockNumber?: number;
            blockHash?: string;
            transactionIndex?: number;
            removed?: boolean;
            transactionLogIndex?: number;
            address: string;
            data: string;
            topics: Array<string>;
            transactionHash?: string;
            logIndex?: number;
    }
    export interface TransactionReceipt {
            contractAddress?: string;
            transactionIndex?: number;
            root?: string;
            gasUsed?: BigNumber;
            logsBloom?: string;
            blockHash?: string;
            transactionHash?: string;
            logs?: Array<Log>;
            blockNumber?: number;
            cumulativeGasUsed?: BigNumber;
            byzantium: boolean;
            status?: number;
    }
    export type TransactionRequest = {
            to?: string | Promise<string>;
            from?: string | Promise<string>;
            nonce?: number | string | Promise<number | string>;
            gasLimit?: BigNumberish | Promise<BigNumberish>;
            gasPrice?: BigNumberish | Promise<BigNumberish>;
            data?: Arrayish | Promise<Arrayish>;
            value?: BigNumberish | Promise<BigNumberish>;
            chainId?: number | Promise<number>;
    };
    export interface TransactionResponse extends Transaction {
            blockNumber?: number;
            blockHash?: string;
            timestamp?: number;
            from: string;
            raw?: string;
            wait: (timeout?: number) => Promise<TransactionReceipt>;
    }
    export abstract class Indexed {
            readonly hash: string;
    }
    export interface DeployDescription {
            readonly inputs: Array<ParamType>;
            readonly payable: boolean;
            encode(bytecode: string, params: Array<any>): string;
    }
    export interface FunctionDescription {
            readonly type: "call" | "transaction";
            readonly name: string;
            readonly signature: string;
            readonly sighash: string;
            readonly inputs: Array<ParamType>;
            readonly outputs: Array<ParamType>;
            readonly payable: boolean;
            encode(params: Array<any>): string;
            decode(data: string): any;
    }
    export interface EventDescription {
            readonly name: string;
            readonly signature: string;
            readonly inputs: Array<ParamType>;
            readonly anonymous: boolean;
            readonly topic: string;
            encodeTopics(params: Array<any>): Array<string>;
            decode(data: string, topics?: Array<string>): any;
    }
    export interface LogDescription {
            readonly name: string;
            readonly signature: string;
            readonly topic: string;
            readonly values: Array<any>;
    }
    export interface TransactionDescription {
            readonly name: string;
            readonly args: Array<any>;
            readonly signature: string;
            readonly sighash: string;
            readonly decode: (data: string) => any;
            readonly value: BigNumber;
    }
    export type ContractFunction = (...params: Array<any>) => Promise<any>;
    export type EventFilter = {
            address?: string;
            topics?: Array<string>;
    };
    export interface Event extends Log {
            args: Array<any>;
            decode: (data: string, topics?: Array<string>) => any;
            event: string;
            eventSignature: string;
            removeListener: () => void;
            getBlock: () => Promise<Block>;
            getTransaction: () => Promise<TransactionResponse>;
            getTransactionReceipt: () => Promise<TransactionReceipt>;
    }
    export type EventType = string | Array<string> | Filter;
    export type Listener = (...args: Array<any>) => void;
    /**
        *  Provider
        *
        *  Note: We use an abstract class so we can use instanceof to determine if an
        *        object is a Provider.
        */
    export abstract class MinimalProvider implements OnceBlockable {
            abstract getNetwork(): Promise<Network>;
            abstract getBlockNumber(): Promise<number>;
            abstract getGasPrice(): Promise<BigNumber>;
            abstract getBalance(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<BigNumber>;
            abstract getTransactionCount(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<number>;
            abstract getCode(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string>;
            abstract getStorageAt(addressOrName: string | Promise<string>, position: BigNumberish | Promise<BigNumberish>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string>;
            abstract sendTransaction(signedTransaction: string | Promise<string>): Promise<TransactionResponse>;
            abstract call(transaction: TransactionRequest): Promise<string>;
            abstract estimateGas(transaction: TransactionRequest): Promise<BigNumber>;
            abstract getBlock(blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>): Promise<Block>;
            abstract getTransaction(transactionHash: string): Promise<TransactionResponse>;
            abstract getTransactionReceipt(transactionHash: string): Promise<TransactionReceipt>;
            abstract getLogs(filter: Filter): Promise<Array<Log>>;
            abstract resolveName(name: string | Promise<string>): Promise<string>;
            abstract lookupAddress(address: string | Promise<string>): Promise<string>;
            abstract on(eventName: EventType, listener: Listener): MinimalProvider;
            abstract once(eventName: EventType, listener: Listener): MinimalProvider;
            abstract listenerCount(eventName?: EventType): number;
            abstract listeners(eventName: EventType): Array<Listener>;
            abstract removeAllListeners(eventName: EventType): MinimalProvider;
            abstract removeListener(eventName: EventType, listener: Listener): MinimalProvider;
            abstract waitForTransaction(transactionHash: string, timeout?: number): Promise<TransactionReceipt>;
    }
    export type AsyncProvider = {
            isMetaMask?: boolean;
            host?: string;
            path?: string;
            sendAsync: (request: any, callback: (error: any, response: any) => void) => void;
    };
    export type ProgressCallback = (percent: number) => void;
    export type EncryptOptions = {
            iv?: Arrayish;
            entropy?: Arrayish;
            mnemonic?: string;
            path?: string;
            client?: string;
            salt?: Arrayish;
            uuid?: string;
            scrypt?: {
                    N?: number;
                    r?: number;
                    p?: number;
            };
    };
    /**
        *  Signer
        *
        *  Note: We use an abstract class so we can use instanceof to determine if an
        *        object is a Signer.
        */
    export abstract class Signer {
            provider?: MinimalProvider;
            abstract getAddress(): Promise<string>;
            abstract signMessage(message: Arrayish | string): Promise<string>;
            abstract sendTransaction(transaction: TransactionRequest): Promise<TransactionResponse>;
    }
    export abstract class HDNode {
            readonly privateKey: string;
            readonly publicKey: string;
            readonly mnemonic: string;
            readonly path: string;
            readonly chainCode: string;
            readonly index: number;
            readonly depth: number;
            abstract derivePath(path: string): HDNode;
    }
    export interface Wordlist {
            locale: string;
            getWord(index: number): string;
            getWordIndex(word: string): number;
            split(mnemonic: string): Array<string>;
            join(words: Array<string>): string;
    }
}

declare module 'ethers/utils/errors' {
    export const UNKNOWN_ERROR = "UNKNOWN_ERROR";
    export const NOT_IMPLEMENTED = "NOT_IMPLEMENTED";
    export const MISSING_NEW = "MISSING_NEW";
    export const CALL_EXCEPTION = "CALL_EXCEPTION";
    export const INVALID_ARGUMENT = "INVALID_ARGUMENT";
    export const MISSING_ARGUMENT = "MISSING_ARGUMENT";
    export const UNEXPECTED_ARGUMENT = "UNEXPECTED_ARGUMENT";
    export const NUMERIC_FAULT = "NUMERIC_FAULT";
    export const UNSUPPORTED_OPERATION = "UNSUPPORTED_OPERATION";
    export function throwError(message: string, code: string, params: any): never;
    export function checkNew(self: any, kind: any): void;
    export function checkArgumentCount(count: number, expectedCount: number, suffix?: string): void;
    export function setCensorship(censorship: boolean, permanent?: boolean): void;
}

declare module 'ethers/_version' {
    export const version = "4.0.0-beta.0";
}

declare module 'ethers/contracts/contract' {
    import { Interface } from 'ethers/contracts/interface';
    import { Signer, MinimalProvider, BigNumber, ContractFunction, EventFilter, ParamType, Listener, TransactionRequest, TransactionResponse } from 'ethers/utils/types';
    interface Bucket<T> {
        [name: string]: T;
    }
    export class Contract {
        readonly address: string;
        readonly interface: Interface;
        readonly signer: Signer;
        readonly provider: MinimalProvider;
        readonly estimate: Bucket<(...params: Array<any>) => Promise<BigNumber>>;
        readonly functions: Bucket<ContractFunction>;
        readonly filters: Bucket<(...params: Array<any>) => EventFilter>;
        readonly [name: string]: ContractFunction | any;
        readonly addressPromise: Promise<string>;
        readonly deployTransaction: TransactionResponse;
        constructor(addressOrName: string, contractInterface: Array<string | ParamType> | string | Interface, signerOrProvider: Signer | MinimalProvider);
        deployed(): Promise<Contract>;
        fallback(overrides?: TransactionRequest): Promise<TransactionResponse>;
        connect(signerOrProvider: Signer | MinimalProvider): Contract;
        attach(addressOrName: string): Contract;
        deploy(bytecode: string, ...args: Array<any>): Promise<Contract>;
        on(event: EventFilter | string, listener: Listener): Contract;
        once(event: EventFilter | string, listener: Listener): Contract;
        addEventLisener(eventName: EventFilter | string, listener: Listener): Contract;
        emit(eventName: EventFilter | string, ...args: Array<any>): boolean;
        listenerCount(eventName?: EventFilter | string): number;
        listeners(eventName: EventFilter | string): Array<Listener>;
        removeAllListeners(eventName: EventFilter | string): Contract;
        removeListener(eventName: any, listener: Listener): Contract;
    }
    export {};
}

declare module 'ethers/contracts/interface' {
    import { BigNumberish, DeployDescription as _DeployDescription, EventDescription as _EventDescription, FunctionDescription as _FunctionDescription, LogDescription as _LogDescription, TransactionDescription as _TransactionDescription, EventFragment, FunctionFragment, ParamType } from 'ethers/utils/types';
    export class Interface {
        readonly abi: Array<EventFragment | FunctionFragment>;
        readonly functions: {
            [name: string]: _FunctionDescription;
        };
        readonly events: {
            [name: string]: _EventDescription;
        };
        readonly deployFunction: _DeployDescription;
        constructor(abi: Array<string | ParamType> | string);
        parseTransaction(tx: {
            data: string;
            value?: BigNumberish;
        }): _TransactionDescription;
        parseLog(log: {
            topics: Array<string>;
            data: string;
        }): _LogDescription;
    }
}

declare module 'ethers/providers/provider' {
    import { BigNumber, BigNumberish, Block, BlockTag, EventType, Filter, Listener, Log, MinimalProvider, Network, Networkish, Transaction, TransactionReceipt, TransactionRequest, TransactionResponse } from 'ethers/utils/types';
    export class Provider extends MinimalProvider {
        protected _emitted: any;
        /**
          *  ready
          *
          *  A Promise<Network> that resolves only once the provider is ready.
          *
          *  Sub-classes that call the super with a network without a chainId
          *  MUST set this. Standard named networks have a known chainId.
          *
          */
        protected ready: Promise<Network>;
        constructor(network: Networkish | Promise<Network>);
        resetEventsBlock(blockNumber: number): void;
        readonly network: Network;
        getNetwork(): Promise<Network>;
        readonly blockNumber: number;
        polling: boolean;
        pollingInterval: number;
        waitForTransaction(transactionHash: string, timeout?: number): Promise<TransactionReceipt>;
        getBlockNumber(): Promise<number>;
        getGasPrice(): Promise<BigNumber>;
        getBalance(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<BigNumber>;
        getTransactionCount(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<number>;
        getCode(addressOrName: string | Promise<string>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string>;
        getStorageAt(addressOrName: string | Promise<string>, position: BigNumberish | Promise<BigNumberish>, blockTag?: BlockTag | Promise<BlockTag>): Promise<string>;
        sendTransaction(signedTransaction: string | Promise<string>): Promise<TransactionResponse>;
        _wrapTransaction(tx: Transaction, hash?: string): TransactionResponse;
        call(transaction: TransactionRequest): Promise<string>;
        estimateGas(transaction: TransactionRequest): Promise<BigNumber>;
        getBlock(blockHashOrBlockTag: BlockTag | string | Promise<BlockTag | string>): Promise<Block>;
        getTransaction(transactionHash: string): Promise<TransactionResponse>;
        getTransactionReceipt(transactionHash: string): Promise<TransactionReceipt>;
        getLogs(filter: Filter): Promise<Array<Log>>;
        getEtherPrice(): Promise<number>;
        resolveName(name: string | Promise<string>): Promise<string>;
        lookupAddress(address: string | Promise<string>): Promise<string>;
        static checkTransactionResponse(transaction: any): TransactionResponse;
        doPoll(): void;
        perform(method: string, params: any): Promise<any>;
        protected _startPending(): void;
        protected _stopPending(): void;
        on(eventName: EventType, listener: Listener): Provider;
        once(eventName: EventType, listener: Listener): Provider;
        addEventListener(eventName: EventType, listener: Listener): Provider;
        emit(eventName: EventType, ...args: Array<any>): boolean;
        listenerCount(eventName?: EventType): number;
        listeners(eventName: EventType): Array<Listener>;
        removeAllListeners(eventName: EventType): Provider;
        removeListener(eventName: EventType, listener: Listener): Provider;
    }
}

declare module 'ethers/providers/etherscan-provider' {
    import { Provider } from 'ethers/providers/provider';
    import { BlockTag, Networkish, TransactionResponse } from 'ethers/utils/types';
    export class EtherscanProvider extends Provider {
        readonly baseUrl: string;
        readonly apiKey: string;
        constructor(network?: Networkish, apiKey?: string);
        perform(method: string, params: any): Promise<any>;
        getHistory(addressOrName: string | Promise<string>, startBlock?: BlockTag, endBlock?: BlockTag): Promise<Array<TransactionResponse>>;
    }
}

declare module 'ethers/providers/fallback-provider' {
    import { Provider } from 'ethers/providers/provider';
    export class FallbackProvider extends Provider {
        constructor(providers: Array<Provider>);
        readonly providers: Array<Provider>;
        perform(method: string, params: any): any;
    }
}

declare module 'ethers/providers/ipc-provider' {
    import { JsonRpcProvider } from 'ethers/providers/json-rpc-provider';
    import { Networkish } from 'ethers/utils/types';
    export class IpcProvider extends JsonRpcProvider {
        readonly path: string;
        constructor(path: string, network?: Networkish);
        send(method: string, params: any): Promise<any>;
    }
}

declare module 'ethers/providers/infura-provider' {
    import { JsonRpcProvider, JsonRpcSigner } from 'ethers/providers/json-rpc-provider';
    import { Networkish } from 'ethers/utils/types';
    export class InfuraProvider extends JsonRpcProvider {
        readonly apiAccessToken: string;
        constructor(network?: Networkish, apiAccessToken?: string);
        protected _startPending(): void;
        getSigner(address?: string): JsonRpcSigner;
        listAccounts(): Promise<Array<string>>;
    }
}

declare module 'ethers/providers/json-rpc-provider' {
    import { Provider } from 'ethers/providers/provider';
    import { Arrayish, BigNumber, BlockTag, ConnectionInfo, Networkish, Signer, TransactionRequest, TransactionResponse } from 'ethers/utils/types';
    export class JsonRpcSigner extends Signer {
        readonly provider: JsonRpcProvider;
        constructor(provider: JsonRpcProvider, address?: string);
        readonly address: string;
        getAddress(): Promise<string>;
        getBalance(blockTag?: BlockTag): Promise<BigNumber>;
        getTransactionCount(blockTag?: BlockTag): Promise<number>;
        sendTransaction(transaction: TransactionRequest): Promise<TransactionResponse>;
        signMessage(message: Arrayish | string): Promise<string>;
        unlock(password: string): Promise<boolean>;
    }
    export class JsonRpcProvider extends Provider {
        readonly connection: ConnectionInfo;
        constructor(url?: ConnectionInfo | string, network?: Networkish);
        getSigner(address?: string): JsonRpcSigner;
        listAccounts(): Promise<Array<string>>;
        send(method: string, params: any): Promise<any>;
        perform(method: string, params: any): Promise<any>;
        protected _startPending(): void;
        protected _stopPending(): void;
        static hexlifyTransaction(transaction: TransactionRequest): any;
    }
}

declare module 'ethers/providers/web3-provider' {
    import { JsonRpcProvider } from 'ethers/providers/json-rpc-provider';
    import { AsyncProvider, Networkish } from 'ethers/utils/types';
    export class Web3Provider extends JsonRpcProvider {
        readonly _web3Provider: AsyncProvider;
        constructor(web3Provider: AsyncProvider, network?: Networkish);
        send(method: string, params: any): Promise<any>;
    }
}

declare module 'ethers/utils/address' {
    import { Arrayish, BigNumber } from 'ethers/utils/types';
    export function getAddress(address: string): string;
    export function getIcapAddress(address: string): string;
    export function getContractAddress(transaction: {
        from: string;
        nonce: Arrayish | BigNumber | number;
    }): string;
}

declare module 'ethers/utils/abi-coder' {
    import { Arrayish, CoerceFunc, EventFragment, FunctionFragment, ParamType } from 'ethers/utils/types';
    export const defaultCoerceFunc: CoerceFunc;
    export function parseParamType(type: string): ParamType;
    export function formatParamType(paramType: ParamType): string;
    export function formatSignature(fragment: EventFragment | FunctionFragment): string;
    export function parseSignature(fragment: string): EventFragment | FunctionFragment;
    export class AbiCoder {
        readonly coerceFunc: CoerceFunc;
        constructor(coerceFunc?: CoerceFunc);
        encode(types: Array<string | ParamType>, values: Array<any>): string;
        decode(types: Array<string | ParamType>, data: Arrayish): Array<any>;
    }
    export const defaultAbiCoder: AbiCoder;
}

declare module 'ethers/utils/base64' {
    import { Arrayish } from 'ethers/utils/types';
    export function decode(textData: string): Uint8Array;
    export function encode(data: Arrayish): string;
}

declare module 'ethers/utils/bignumber' {
    import { BigNumber as _BigNumber, BigNumberish } from 'ethers/utils/types';
    export function bigNumberify(value: BigNumberish): _BigNumber;
    export const ConstantNegativeOne: _BigNumber;
    export const ConstantZero: _BigNumber;
    export const ConstantOne: _BigNumber;
    export const ConstantTwo: _BigNumber;
    export const ConstantWeiPerEther: _BigNumber;
}

declare module 'ethers/utils/bytes' {
    /**
      *  Conversion Utilities
      *
      */
    import { Arrayish, BigNumber, Signature } from 'ethers/utils/types';
    export const AddressZero = "0x0000000000000000000000000000000000000000";
    export const HashZero = "0x0000000000000000000000000000000000000000000000000000000000000000";
    export function isArrayish(value: any): boolean;
    export function arrayify(value: Arrayish | BigNumber): Uint8Array;
    export function concat(objects: Array<Arrayish>): Uint8Array;
    export function stripZeros(value: Arrayish): Uint8Array;
    export function padZeros(value: Arrayish, length: number): Uint8Array;
    export function isHexString(value: any, length?: number): boolean;
    export function hexlify(value: Arrayish | BigNumber | number): string;
    export function hexDataLength(data: string): number;
    export function hexDataSlice(data: string, offset: number, length?: number): string;
    export function hexStripZeros(value: string): string;
    export function hexZeroPad(value: string, length: number): string;
    export function splitSignature(signature: Arrayish | Signature): Signature;
    export function joinSignature(signature: Signature): string;
}

declare module 'ethers/utils/hash' {
    import { Arrayish } from 'ethers/utils/types';
    export function namehash(name: string): string;
    export function id(text: string): string;
    export function hashMessage(message: Arrayish | string): string;
}

declare module 'ethers/utils/json-wallet' {
    export function isCrowdsaleWallet(json: string): boolean;
    export function isSecretStorageWallet(json: string): boolean;
    export function getJsonWalletAddress(json: string): string;
}

declare module 'ethers/utils/keccak256' {
    import { Arrayish } from 'ethers/utils/types';
    export function keccak256(data: Arrayish): string;
}

declare module 'ethers/utils/sha2' {
    import { Arrayish } from 'ethers/utils/types';
    export function sha256(data: Arrayish): string;
    export function sha512(data: Arrayish): string;
}

declare module 'ethers/utils/solidity' {
    export function pack(types: Array<string>, values: Array<any>): string;
    export function keccak256(types: Array<string>, values: Array<any>): string;
    export function sha256(types: Array<string>, values: Array<any>): string;
}

declare module 'ethers/utils/random-bytes' {
    export function randomBytes(length: number): Uint8Array;
}

declare module 'ethers/utils/networks' {
    import { Network, Networkish } from 'ethers/utils/types';
    /**
      *  getNetwork
      *
      *  Converts a named common networks or chain ID (network ID) to a Network
      *  and verifies a network is a valid Network..
      */
    export function getNetwork(network: Networkish): Network;
}

declare module 'ethers/utils/properties' {
    export function defineReadOnly(object: any, name: string, value: any): void;
    export function defineFrozen(object: any, name: string, value: any): void;
    export function resolveProperties(object: any): Promise<any>;
    export function shallowCopy(object: any): any;
    export function jsonCopy(object: any): any;
}

declare module 'ethers/utils/rlp' {
    import { Arrayish } from 'ethers/utils/types';
    export function encode(object: any): string;
    export function decode(data: Arrayish): any;
}

declare module 'ethers/utils/secp256k1' {
    import { Arrayish, Signature } from 'ethers/utils/types';
    export class KeyPair {
        readonly privateKey: string;
        readonly publicKey: string;
        readonly compressedPublicKey: string;
        readonly publicKeyBytes: Uint8Array;
        constructor(privateKey: Arrayish);
        sign(digest: Arrayish): Signature;
    }
    export function recoverPublicKey(digest: Arrayish, signature: Signature): string;
    export function computePublicKey(key: Arrayish, compressed?: boolean): string;
    export function recoverAddress(digest: Arrayish, signature: Signature): string;
    export function computeAddress(key: string): string;
    export function verifyMessage(message: Arrayish | string, signature: Signature | string): string;
    export const N: string;
}

declare module 'ethers/utils/transaction' {
    import { Arrayish, Signature, Transaction, UnsignedTransaction } from 'ethers/utils/types';
    export function serialize(transaction: UnsignedTransaction, signature?: Arrayish | Signature): string;
    export function parse(rawTransaction: Arrayish): Transaction;
}

declare module 'ethers/utils/utf8' {
    import { Arrayish } from 'ethers/utils/types';
    export enum UnicodeNormalizationForm {
        current = "",
        NFC = "NFC",
        NFD = "NFD",
        NFKC = "NFKC",
        NFKD = "NFKD"
    }
    export function toUtf8Bytes(str: string, form?: UnicodeNormalizationForm): Uint8Array;
    export function toUtf8String(bytes: Arrayish): string;
}

declare module 'ethers/utils/units' {
    import { BigNumber, BigNumberish } from 'ethers/utils/types';
    export function formatUnits(value: BigNumberish, unitType?: string | number, options?: any): string;
    export function parseUnits(value: string, unitType?: string | number): BigNumber;
    export function formatEther(wei: BigNumberish, options: any): string;
    export function parseEther(ether: string): BigNumber;
}

declare module 'ethers/utils/web' {
    import { ConnectionInfo, PollOptions } from 'ethers/utils/types';
    export function fetchJson(connection: string | ConnectionInfo, json: string, processFunc: (value: any) => any): Promise<any>;
    export function poll(func: () => Promise<any>, options?: PollOptions): Promise<any>;
}

declare module 'ethers/wallet/wallet' {
    import { SigningKey } from 'ethers/wallet/signing-key';
    import { Arrayish, BigNumber, BlockTag, HDNode, MinimalProvider, ProgressCallback, Signer, TransactionRequest, TransactionResponse, Wordlist } from 'ethers/utils/types';
    export class Wallet extends Signer {
            readonly provider: MinimalProvider;
            constructor(privateKey: SigningKey | HDNode | Arrayish, provider?: MinimalProvider);
            readonly address: string;
            readonly mnemonic: string;
            readonly path: string;
            readonly privateKey: string;
            /**
                *  Create a new instance of this Wallet connected to provider.
                */
            connect(provider: MinimalProvider): Wallet;
            getAddress(): Promise<string>;
            sign(transaction: TransactionRequest): Promise<string>;
            signMessage(message: Arrayish | string): Promise<string>;
            getBalance(blockTag?: BlockTag): Promise<BigNumber>;
            getTransactionCount(blockTag?: BlockTag): Promise<number>;
            sendTransaction(transaction: TransactionRequest): Promise<TransactionResponse>;
            encrypt(password: Arrayish | string, options: any, progressCallback: ProgressCallback): Promise<string>;
            /**
                *  Static methods to create Wallet instances.
                */
            static createRandom(options?: any): Wallet;
            static fromEncryptedJson(json: string, password: Arrayish, progressCallback: ProgressCallback): Promise<Wallet>;
            static fromMnemonic(mnemonic: string, path?: string, wordlist?: Wordlist): Wallet;
    }
}

declare module 'ethers/wallet/hdnode' {
    import { Arrayish, HDNode as _HDNode, Wordlist } from 'ethers/utils/types';
    export const defaultPath = "m/44'/60'/0'/0/0";
    export function fromMnemonic(mnemonic: string, wordlist?: Wordlist): _HDNode;
    export function fromSeed(seed: Arrayish): _HDNode;
    export function mnemonicToSeed(mnemonic: string, password?: string): string;
    export function mnemonicToEntropy(mnemonic: string, wordlist?: Wordlist): string;
    export function entropyToMnemonic(entropy: Arrayish, wordlist?: Wordlist): string;
    export function isValidMnemonic(mnemonic: string, wordlist?: Wordlist): boolean;
}

declare module 'ethers/wallet/signing-key' {
    import { Arrayish, HDNode, Signature } from 'ethers/utils/types';
    export class SigningKey {
        readonly privateKey: string;
        readonly publicKey: string;
        readonly address: string;
        readonly mnemonic: string;
        readonly path: string;
        constructor(privateKey: Arrayish | HDNode);
        signDigest(digest: Arrayish): Signature;
    }
}

declare module 'ethers/wordlists/wordlist' {
    import { Wordlist as _Wordlist } from 'ethers/utils/types';
    export function check(wordlist: _Wordlist): string;
    export abstract class Wordlist implements _Wordlist {
        locale: string;
        constructor(locale: string);
        abstract getWord(index: number): string;
        abstract getWordIndex(word: string): number;
        split(mnemonic: string): Array<string>;
        join(words: Array<string>): string;
    }
    export function register(lang: Wordlist, name?: string): void;
}


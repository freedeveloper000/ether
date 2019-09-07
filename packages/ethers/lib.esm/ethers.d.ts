import { Contract, ContractFactory } from "@ethersproject/contracts";
import { BigNumber, FixedNumber } from "@ethersproject/bignumber";
import { Signer, VoidSigner } from "@ethersproject/abstract-signer";
import { Wallet } from "@ethersproject/wallet";
import * as constants from "@ethersproject/constants";
import * as providers from "@ethersproject/providers";
import { Wordlist, wordlists } from "@ethersproject/wordlists";
import * as utils from "./utils";
declare const errors: {
    [name: string]: string;
};
import { BigNumberish } from "@ethersproject/bignumber";
import { Bytes, BytesLike, Signature } from "@ethersproject/bytes";
import { Transaction, UnsignedTransaction } from "@ethersproject/transactions";
import { version } from "./_version";
declare const logger: utils.Logger;
import { ContractFunction, ContractReceipt, ContractTransaction, Event, EventFilter, Overrides, PayableOverrides, CallOverrides, ContractInterface } from "@ethersproject/contracts";
declare function getDefaultProvider(network?: providers.Network | string, options?: any): providers.BaseProvider;
export { Signer, Wallet, VoidSigner, getDefaultProvider, providers, Contract, ContractFactory, BigNumber, FixedNumber, constants, errors, logger, utils, wordlists, version, ContractFunction, ContractReceipt, ContractTransaction, Event, EventFilter, Overrides, PayableOverrides, CallOverrides, ContractInterface, BigNumberish, Bytes, BytesLike, Signature, Transaction, UnsignedTransaction, Wordlist };

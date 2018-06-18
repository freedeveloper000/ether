import { Provider, ProviderSigner } from './provider';
import { Network } from './networks';
import { EtherscanProvider } from './etherscan-provider';
import { FallbackProvider } from './fallback-provider';
import { IpcProvider } from './ipc-provider';
import { InfuraProvider } from './infura-provider';
import { JsonRpcProvider } from './json-rpc-provider';
import { Web3Provider } from './web3-provider';
declare function getDefaultProvider(network?: Network | string): FallbackProvider;
export { Provider, getDefaultProvider, ProviderSigner, FallbackProvider, EtherscanProvider, InfuraProvider, JsonRpcProvider, Web3Provider, IpcProvider };

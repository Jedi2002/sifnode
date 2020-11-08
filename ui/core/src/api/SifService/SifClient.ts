import {
  AuthExtension,
  BroadcastMode,
  CosmosClient,
  CosmosFeeTable,
  GasLimits,
  GasPrice,
  LcdClient,
  OfflineSigner,
  setupAuthExtension,
  SigningCosmosClient,
} from "@cosmjs/launchpad";

import { ClpExtension, setupClpExtension } from "./x/clp";

type CustomLcdClient = LcdClient & AuthExtension & ClpExtension;

function createLcdClient(
  apiUrl: string,
  broadcastMode: BroadcastMode | undefined
): CustomLcdClient {
  return LcdClient.withExtensions(
    { apiUrl: apiUrl, broadcastMode: broadcastMode },
    setupAuthExtension,
    setupClpExtension
  );
}

type IClpApi = ClpExtension["clp"];

export class SifClient extends SigningCosmosClient implements IClpApi {
  protected readonly lcdClient: CustomLcdClient;

  constructor(
    apiUrl: string,
    senderAddress: string,
    signer: OfflineSigner,
    gasPrice?: GasPrice,
    gasLimits?: Partial<GasLimits<CosmosFeeTable>>,
    broadcastMode?: BroadcastMode
  ) {
    super(apiUrl, senderAddress, signer, gasPrice, gasLimits, broadcastMode);
    this.lcdClient = createLcdClient(apiUrl, broadcastMode);
    this.swap = this.lcdClient.clp.swap;
    this.getPools = this.lcdClient.clp.getPools;
  }

  swap: IClpApi["swap"];
  getPools: IClpApi["getPools"];
}
export class SifUnSignedClient extends CosmosClient implements IClpApi {
  protected readonly lcdClient: CustomLcdClient;

  constructor(apiUrl: string, broadcastMode?: BroadcastMode) {
    super(apiUrl, broadcastMode);
    this.lcdClient = createLcdClient(apiUrl, broadcastMode);
    this.swap = this.lcdClient.clp.swap;
    this.getPools = this.lcdClient.clp.getPools;
  }

  swap: IClpApi["swap"];
  getPools: IClpApi["getPools"];
}
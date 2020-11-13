import { ref, Ref } from "@vue/reactivity";
import { CATK, RWN } from "../constants";
import { AssetAmount, LiquidityProvider, Pool } from "../entities";
import { Fraction, IFraction } from "../entities/fraction/Fraction";
import { PoolState } from "./addLiquidityCalculator";
import { useRemoveLiquidityCalculator } from "./removeLiquidityCalculator";

describe("useRemoveLiquidityCalculator", () => {
  // input
  const asymmetry: Ref<string> = ref("0");
  const externalAssetSymbol: Ref<string | null> = ref(null);
  const nativeAssetSymbol: Ref<string | null> = ref(null);
  const sifAddress: Ref<string> = ref("12345678asFDSghkjg");
  const wBasisPoints: Ref<string> = ref("5000");
  const marketPairFinder = jest.fn<Pool | null, any>(() => null);
  const liquidityProviderFinder = jest.fn<
    Promise<LiquidityProvider | null>,
    any
  >(async () => null);

  // output
  let withdrawExternalAssetAmount: Ref<string | null>;
  let withdrawNativeAssetAmount: Ref<string | null>;
  let state: Ref<PoolState>;

  beforeEach(() => {
    ({
      state,
      withdrawExternalAssetAmount,
      withdrawNativeAssetAmount,
    } = useRemoveLiquidityCalculator({
      asymmetry,
      externalAssetSymbol,
      liquidityProviderFinder,
      marketPairFinder,
      nativeAssetSymbol,
      sifAddress,
      wBasisPoints,
    }));
  });

  test("displays the correct withdrawal amounts", () => {
    liquidityProviderFinder.mockImplementation(async () =>
      LiquidityProvider(CATK, new Fraction("100000"), "sif123456876512341234")
    );
    marketPairFinder.mockImplementation(() =>
      Pool(
        AssetAmount(CATK, "1000000"),
        AssetAmount(RWN, "1000000"),
        new Fraction("1000000")
      )
    );
    expect(state.value).toBe(PoolState.SELECT_TOKENS);
    asymmetry.value = "0";
    externalAssetSymbol.value = "catk";
    nativeAssetSymbol.value = "rwn";
    sifAddress.value = "sif123456876512341234";
    wBasisPoints.value = "0";

    expect(state.value).toBe(PoolState.ZERO_AMOUNTS);
    wBasisPoints.value = "10000";
    expect(state.value).toBe(PoolState.VALID_INPUT);

    expect(withdrawExternalAssetAmount.value).toEqual("100000.0 CATK");
    expect(withdrawNativeAssetAmount.value).toEqual("100000.0 RWN");
    asymmetry.value = "10000";

    expect(withdrawExternalAssetAmount.value).toEqual("181000.0 CATK");
    expect(withdrawNativeAssetAmount.value).toEqual("0.0 RWN");
    wBasisPoints.value = "5000";

    expect(withdrawExternalAssetAmount.value).toEqual("95125.0 CATK");
    expect(withdrawNativeAssetAmount.value).toEqual("0.0 RWN");
  });
});

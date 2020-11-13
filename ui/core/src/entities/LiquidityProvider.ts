import { Asset } from "./Asset";
import { IFraction } from "./fraction/Fraction";

export function LiquidityProvider(
  asset: Asset,
  units: IFraction,
  address: string
): LiquidityProvider {
  return { asset, units, address };
}
export type LiquidityProvider = {
  asset: Asset;
  units: IFraction;
  address: string;
};

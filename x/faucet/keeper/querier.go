package keeper

import (
	// this line is used by starport scaffolding # 1
	abci "github.com/tendermint/tendermint/abci/types"

	"github.com/Sifchain/sifnode/x/faucet/types"
	"github.com/cosmos/cosmos-sdk/codec"
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

// NewQuerier creates a new querier for faucet clients.
func NewQuerier(k Keeper) sdk.Querier {
	return func(ctx sdk.Context, path []string, req abci.RequestQuery) ([]byte, error) {
		switch path[0] {
		// this line is used by starport scaffolding # 2
		case types.QueryBalance:
			return queryBalance(ctx, req, k)
			// TODO: Put the modules query routes
		default:
			return nil, sdkerrors.Wrap(sdkerrors.ErrUnknownRequest, "unknown faucet query endpoint")
		}
	}
}

func queryBalance(ctx sdk.Context, req abci.RequestQuery, keeper Keeper) ([]byte, error) {
	var params types.QueryReqGetFaucetBalance
	var coins sdk.Coins
	err := types.ModuleCdc.UnmarshalJSON(req.Data, &params)
	// TODO: return the balance from the faucet address
	if err != nil {
		return nil, sdkerrors.Wrap(sdkerrors.ErrJSONUnmarshal, err.Error())
	}
	balance := keeper.HasCoins(ctx, params.FaucetAddress, coins)
	res, err := codec.MarshalJSONIndent(keeper.cdc, balance)
	if err != nil {
		return nil, sdkerrors.Wrap(sdkerrors.ErrJSONMarshal, err.Error())
	}
	return res, nil
}

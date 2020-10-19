#!/usr/bin/env bash

rm -rf ~/.sifnoded
rm -rf ~/.sifnodecli

sifnoded init test --chain-id=sifnode

sifnodecli config output json
sifnodecli config indent true
sifnodecli config trust-node true
sifnodecli config chain-id namechain
sifnodecli config keyring-backend test

echo "Generating deterministic account - shadowfiend"
echo "race draft rival universe maid cheese steel logic crowd fork comic easy truth drift tomorrow eye buddy head time cash swing swift midnight borrow" | sifnodecli keys add shadowfiend --recover

echo "Generating deterministic account - akasha"
echo "hand inmate canvas head lunar naive increase recycle dog ecology inhale december wide bubble hockey dice worth gravity ketchup feed balance parent secret orchard" | sifnodecli keys add akasha --recover

sifnoded add-genesis-account $(sifnodecli keys show shadowfiend -a) 1000nametoken,100000000stake
sifnoded add-genesis-account $(sifnodecli keys show akasha -a) 1000nametoken,100000000stake

sifnoded gentx --name shadowfiend --keyring-backend test

echo "Collecting genesis txs..."
sifnoded collect-gentxs

echo "Validating genesis file..."
sifnoded validate-genesis

echo "Starting test chain"
sifnoded start --log_level="main:info,state:error,statesync:info,*:error"

sifnodecli rest-server  --unsafe-cors --trace
import Web3 from "web3";

import { SampleToken } from "../types/web3-v1-contracts/SampleToken";
import abi from "../abi/SampleToken.json";
import * as env from "dotenv";

env.config();

const envs = {
  RPC_HOST: process.env.RPC_HOST || "",
  SAMPLE_TOKEN_ADDRESS: process.env.SAMPLE_TOKEN_ADDRESS || "",
  OWNER_ADDRESS: process.env.OWNER_ADDRESS || "",
};

console.log(envs);

async function main() {
  const web3 = new Web3(envs.RPC_HOST);
  const fromWei = web3.utils.fromWei;
  const sampleToken = new web3.eth.Contract(
    abi as any,
    envs.SAMPLE_TOKEN_ADDRESS
  ) as any as SampleToken;
  const balance = await sampleToken.methods
    .balanceOf(envs.OWNER_ADDRESS)
    .call();
  const tokenName = await sampleToken.methods.name().call();
  const tokenSymbol = await sampleToken.methods.symbol().call();

  console.log(`Balance of ${tokenName} is: ${fromWei(balance)}`);

  console.log("Listening for transfer events...");
  sampleToken.events.Transfer((err, e) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log(
      `${fromWei(e.returnValues.value)} ${tokenSymbol} transferred ${
        e.returnValues.from
      } -> ${e.returnValues.to}`
    );
  });
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});

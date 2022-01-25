const {
  networks: truffleNetwork,
} = require("./solidity/build/flipstarter.json");

let networks = {
  bch: {
    name: "Smart Bitcoin Cash",
    rpc: "https://smartbch.fountainhead.cash/mainnet",
    symbol: "BCH",
    chainId: "0x2710",
  },
  ganache: {
    name: "Ganache",
    rpc: "ws://127.0.0.1:7545",
    symbol: "ETH",
    chainId: "0x539",
  },
  moeing: {
    name: "testnet SmartBch",
    rpc: "https://moeing.tech:9546",
    symbol: "BCH",
    chainId: "0x2711",
  },
};

function getNetwork() {
  if (networks[process.env.network]) {
    return networks[process.env.network];
  }
  if (process.env.DEV) {
    return networks.ganache;
  }
  if (process.env.chainId) {
    return {
      name: process.env.name,
      rpc: process.env.rpc,
      symbol: process.env.symbol,
      chainId: process.env.chainId,
    };
  }

  return networks.bch;
}

function getAddress() {
  if (process.env.contractAddress) {
    return process.env.contractAddress;
  } else {
    return truffleNetwork[5777].address;
  }
}

module.exports = {
  getNetwork,
  getAddress,
};

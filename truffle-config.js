module.exports = {
  networks: {
    development: {
      host: "127.0.0.1", // Localhost
      port: 7545,
      network_id: "*", // Any network
      // websocket: true,
      // timeoutBlocks: 200,
    },
  },
  contracts_build_directory: "./solidity/build",
  contracts_directory: "./solidity/contracts",
  migrations_directory: "./solidity/migrations",
  test_directory: "./solidity/test",

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.7",
    },
  },

  settings: {
    optimizer: {
      enabled: true,
      runs: 200,
    },
  },
};

const HDWalletProvider = require("@truffle/hdwallet-provider");
const mnemonic =
  "word put entry swing range summer father obtain other idle arrest tortoise";

module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // to customize your Truffle configuration!
  networks: {
    development: {
      host: "127.0.0.1",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      provider: function() {
        return new HDWalletProvider(
          mnemonic,
          "https://rinkeby.infura.io/v3/e7484561f42f4ba2910a7faa99bfa729"
        );
      },
      network_id: 4,
      gas: 4500000,
      gasPrice: 10000000000
    }
  }
};

# Setup

Clone repo, install dependencies with `yarn install` then launch server with `yarn dev`. Navigate to `http://localhost:3000/` with your favorite browser with metamask installed. You can use the mnemonic in `truffle.js` to import the wallet addresses into metamask to interact with the contract (the first 5 addresses are already assigned to contract owner, farmer, distributor, retailer, and consumer).

Run tests with `yarn test`

# UML Diagrams

UML diagrams are located in `/uml` folder.

# Libraries

`event.watch` is no longer supported in latest web3 versions. The `truffle-assertions` package is used to test events instead.

The `@truffle/hdwallet-provider` package was installed to deploy the contracts to the rinkeby network via Infura.

Added [Prettier](https://github.com/prettier/prettier) and its [solidity plugin](https://github.com/prettier-solidity/prettier-plugin-solidity) to format files.

# TX Hashes & Contracts Addresses

## SupplyChain

### Tx Hash

0x9cadf83fa050eae4d3aae63b8907a9115168260bc8f9ca555db7c6bc51fa1452

### Contract Address

0xFa76488F0857e783648CF3022CC4D80ECf1ab58b

## Related Contracts

### Migrations

#### Tx Hash

0x2358a7cc6063843a938433adfc565477127ae9c71325239ea41b35ff5251932b

#### Contract Address

0xF9A8493Ef9C780ce700d915bB650C6ea3557B071

### FarmerRole

#### Tx Hash

0x9c6ab34c34fc6ac2854dbcc02fac7b7a471ada79a36994de2760416883a9997d

#### Contract Address

0x3c089B6607D3145dc2BEBa43a746F7aD42E50D54

### DistributorRole

#### Tx Hash

0x96c438b9b54f513a10023c5a34b77583b8533b13841d0a9be306a291a940e1fe

#### Contract Address

0x44571A07c4aD785840EF7C260F73B6B8BE18071D

### RetailerRole

#### Tx Hash

0xd503cb070815aacd9dbe2edf38f60280292fe909088f5f8d8191fb5ad7073b18

#### Contract Address

0xa62580057c0eabd180Bb08041a4BF765E0A9B0a9

### ConsumerRole

#### Tx Hash

0x44a54c4b760354403346461d3b49912223edfc2e75cdf9cda53fa5a4acaca91c

#### Contract Address

0x692b4101Ba06017006d19A2f3a64AdAe12E99f3e

# Program Version Numbers

- Node v10.16.0
- Truffle v5.0.27
- web3 v1.2.1

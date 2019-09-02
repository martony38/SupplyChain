// This script is designed to test the solidity smart contract - SuppyChain.sol -- and the various functions within
// Declare a variable and assign the compiled smart contract artifact
const SupplyChain = artifacts.require("SupplyChain");

const truffleAssert = require("truffle-assertions");

contract("SupplyChain", function(accounts) {
  // Declare few constants and assign a few sample accounts generated by ganache-cli
  let sku = 1;
  let upc = 1;
  const ownerID = accounts[0];
  const originFarmerID = accounts[1];
  const originFarmName = "Olio Fattoria";
  const originFarmInformation = "Sicily";
  const originFarmLatitude = "-38.239770";
  const originFarmLongitude = "144.341490";
  let productID = sku + upc;
  const productNotes = "Best olives for cold pressed extra virgin oil";
  const productPrice = web3.utils.toWei("1", "ether");
  let itemState = 0;
  const distributorID = accounts[2];
  const retailerID = accounts[3];
  const consumerID = accounts[4];
  const emptyAddress = "0x00000000000000000000000000000000000000";

  ///Available Accounts
  ///==================
  ///(0) 0x27d8d15cbc94527cadf5ec14b69519ae23288b95
  ///(1) 0x018c2dabef4904ecbd7118350a0c54dbeae3549a
  ///(2) 0xce5144391b4ab80668965f2cc4f2cc102380ef0a
  ///(3) 0x460c31107dd048e34971e57da2f99f659add4f02
  ///(4) 0xd37b7b8c62be2fdde8daa9816483aebdbd356088
  ///(5) 0x27f184bdc0e7a931b507ddd689d76dba10514bcb
  ///(6) 0xfe0df793060c49edca5ac9c104dd8e3375349978
  ///(7) 0xbd58a85c96cc6727859d853086fe8560bc137632
  ///(8) 0xe07b5ee5f738b2f87f88b99aac9c64ff1e0c7917
  ///(9) 0xbd3ff2e3aded055244d66544c9c059fa0851da44

  console.log("ganache-cli accounts used here...");
  console.log("Contract Owner: accounts[0] ", accounts[0]);
  console.log("Farmer: accounts[1] ", accounts[1]);
  console.log("Distributor: accounts[2] ", accounts[2]);
  console.log("Retailer: accounts[3] ", accounts[3]);
  console.log("Consumer: accounts[4] ", accounts[4]);

  const originFarmAssertions = resultBufferOne => {
    assert.equal(resultBufferOne[0], sku, "Error: Invalid item SKU");
    assert.equal(resultBufferOne[1], upc, "Error: Invalid item UPC");
    assert.equal(
      resultBufferOne[3],
      originFarmerID,
      "Error: Missing or Invalid originFarmerID"
    );
    assert.equal(
      resultBufferOne[4],
      originFarmName,
      "Error: Missing or Invalid originFarmName"
    );
    assert.equal(
      resultBufferOne[5],
      originFarmInformation,
      "Error: Missing or Invalid originFarmInformation"
    );
    assert.equal(
      resultBufferOne[6],
      originFarmLatitude,
      "Error: Missing or Invalid originFarmLatitude"
    );
    assert.equal(
      resultBufferOne[7],
      originFarmLongitude,
      "Error: Missing or Invalid originFarmLongitude"
    );
  };

  // 1st Test
  it("Testing smart contract function harvestOlives() that allows a farmer to harvest olives", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Mark an item as Harvested by calling function harvestOlives()
    const tx = await supplyChain.harvestOlives(
      upc,
      originFarmerID,
      originFarmName,
      originFarmInformation,
      originFarmLatitude,
      originFarmLongitude,
      productNotes
    );

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(
      resultBufferOne[2],
      originFarmerID,
      "Error: Missing or Invalid ownerID"
    );
    originFarmAssertions(resultBufferOne);
    assert.equal(resultBufferTwo[5], 0, "Error: Invalid item State");
    truffleAssert.eventEmitted(tx, "Harvested", null, "Invalid event emitted");
  });

  // 2nd Test
  it("Testing smart contract function processOlives() that allows a farmer to process olives", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Mark an item as Processed by calling function processOlives()
    const tx = await supplyChain.processOlives(upc, { from: originFarmerID });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(
      resultBufferOne[2],
      originFarmerID,
      "Error: Missing or Invalid ownerID"
    );
    originFarmAssertions(resultBufferOne);
    assert.equal(resultBufferTwo[5], 1, "Error: Invalid item State");
    truffleAssert.eventEmitted(tx, "Processed", null, "Invalid event emitted");
  });

  // 3rd Test
  it("Testing smart contract function bottleOil() that allows a farmer to bottle olive oil", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Mark an item as Bottled by calling function bottleOil()
    const tx = await supplyChain.bottleOil(upc, { from: originFarmerID });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(
      resultBufferOne[2],
      originFarmerID,
      "Error: Missing or Invalid ownerID"
    );
    originFarmAssertions(resultBufferOne);
    assert.equal(resultBufferTwo[5], 2, "Error: Invalid item State");
    truffleAssert.eventEmitted(tx, "Bottled", null, "Invalid event emitted");
  });

  // 4th Test
  it("Testing smart contract function sellOil() that allows a farmer to sell olive oil", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Mark an item as ForSale by calling function sellOil()
    const tx = await supplyChain.sellOil(upc, productPrice, {
      from: originFarmerID
    });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(
      resultBufferOne[2],
      originFarmerID,
      "Error: Missing or Invalid ownerID"
    );
    originFarmAssertions(resultBufferOne);
    assert.equal(
      resultBufferTwo[4],
      productPrice,
      "Error: Invalid product price"
    );
    assert.equal(resultBufferTwo[5], 3, "Error: Invalid item State");
    truffleAssert.eventEmitted(tx, "ForSale", null, "Invalid event emitted");
  });

  // 5th Test
  it("Testing smart contract function buyOil() that allows a distributor to buy olive oil", async () => {
    const supplyChain = await SupplyChain.deployed();

    const farmerInitialBalance = await web3.eth.getBalance(originFarmerID);
    const distributorInitialBalance = await web3.eth.getBalance(distributorID);

    // Mark an item as Sold by calling function buyOil()
    const tx = await supplyChain.buyOil(upc, {
      from: distributorID,
      value: web3.utils.toWei("1.5", "ether"),
      gasPrice: 0
    });

    const farmerFinalBalance = await web3.eth.getBalance(originFarmerID);
    const distributorFinalBalance = await web3.eth.getBalance(distributorID);

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(
      resultBufferOne[2],
      distributorID,
      "Error: Missing or Invalid ownerID"
    );
    assert.equal(
      resultBufferTwo[6],
      distributorID,
      "Error: Missing or Invalid distributorID"
    );
    originFarmAssertions(resultBufferOne);
    assert.equal(
      resultBufferTwo[4],
      productPrice,
      "Error: Invalid product price"
    );
    assert.equal(resultBufferTwo[5], 4, "Error: Invalid item State");
    truffleAssert.eventEmitted(tx, "Sold", null, "Invalid event emitted");

    assert.equal(
      (
        parseInt(distributorInitialBalance, 10) -
        parseInt(distributorFinalBalance, 10)
      ).toString(),
      productPrice,
      "Error: Invalid amount paid by distributor"
    );
    assert.equal(
      (
        parseInt(farmerFinalBalance, 10) - parseInt(farmerInitialBalance, 10)
      ).toString(),
      productPrice,
      "Error: Invalid amount received by farmer"
    );
  });

  // 6th Test
  it("Testing smart contract function shipOil() that allows a distributor to ship olive oil", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Mark an item as Sold by calling function shipOil()
    const tx = await supplyChain.shipOil(upc, {
      from: distributorID
    });

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(
      resultBufferOne[2],
      distributorID,
      "Error: Missing or Invalid ownerID"
    );
    assert.equal(
      resultBufferTwo[6],
      distributorID,
      "Error: Missing or Invalid distributorID"
    );
    originFarmAssertions(resultBufferOne);
    assert.equal(
      resultBufferTwo[4],
      productPrice,
      "Error: Invalid product price"
    );
    assert.equal(resultBufferTwo[5], 5, "Error: Invalid item State");
    truffleAssert.eventEmitted(tx, "Shipped", null, "Invalid event emitted");
  });

  // 7th Test
  it("Testing smart contract function receiveOil() that allows a retailer to mark olive oil received", async () => {
    const supplyChain = await SupplyChain.deployed();

    const retailerInitialBalance = await web3.eth.getBalance(retailerID);
    const distributorInitialBalance = await web3.eth.getBalance(distributorID);

    // Mark an item as Sold by calling function receiveOil()
    const tx = await supplyChain.receiveOil(upc, {
      from: retailerID,
      value: web3.utils.toWei("1.5", "ether"),
      gasPrice: 0
    });

    const retailerFinalBalance = await web3.eth.getBalance(retailerID);
    const distributorFinalBalance = await web3.eth.getBalance(distributorID);

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(
      resultBufferOne[2],
      retailerID,
      "Error: Missing or Invalid ownerID"
    );
    assert.equal(
      resultBufferTwo[6],
      distributorID,
      "Error: Missing or Invalid distributorID"
    );
    assert.equal(
      resultBufferTwo[7],
      retailerID,
      "Error: Missing or Invalid retailerID"
    );
    originFarmAssertions(resultBufferOne);
    assert.equal(
      resultBufferTwo[4],
      productPrice,
      "Error: Invalid product price"
    );
    assert.equal(resultBufferTwo[5], 6, "Error: Invalid item State");
    truffleAssert.eventEmitted(tx, "Received", null, "Invalid event emitted");

    assert.equal(
      (
        parseInt(retailerInitialBalance, 10) -
        parseInt(retailerFinalBalance, 10)
      ).toString(),
      productPrice,
      "Error: Invalid amount paid by retailer"
    );
    assert.equal(
      (
        parseInt(distributorFinalBalance, 10) -
        parseInt(distributorInitialBalance, 10)
      ).toString(),
      productPrice,
      "Error: Invalid amount received by distributor"
    );
  });

  // 8th Test
  it("Testing smart contract function purchaseOil() that allows a consumer to purchase olive oil", async () => {
    const supplyChain = await SupplyChain.deployed();

    const retailerInitialBalance = await web3.eth.getBalance(retailerID);
    const consumerInitialBalance = await web3.eth.getBalance(consumerID);

    // Mark an item as Purchased by calling function purchaseOil()
    const tx = await supplyChain.purchaseOil(upc, {
      from: consumerID,
      value: web3.utils.toWei("1.5", "ether"),
      gasPrice: 0
    });

    const retailerFinalBalance = await web3.eth.getBalance(retailerID);
    const consumerFinalBalance = await web3.eth.getBalance(consumerID);

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set
    assert.equal(
      resultBufferOne[2],
      consumerID,
      "Error: Missing or Invalid ownerID"
    );
    assert.equal(
      resultBufferTwo[6],
      distributorID,
      "Error: Missing or Invalid distributorID"
    );
    assert.equal(
      resultBufferTwo[7],
      retailerID,
      "Error: Missing or Invalid retailerID"
    );
    assert.equal(
      resultBufferTwo[8],
      consumerID,
      "Error: Missing or Invalid consumerID"
    );
    originFarmAssertions(resultBufferOne);
    assert.equal(
      resultBufferTwo[4],
      productPrice,
      "Error: Invalid product price"
    );
    assert.equal(resultBufferTwo[5], 7, "Error: Invalid item State");
    truffleAssert.eventEmitted(tx, "Purchased", null, "Invalid event emitted");

    assert.equal(
      (
        parseInt(consumerInitialBalance, 10) -
        parseInt(consumerFinalBalance, 10)
      ).toString(),
      productPrice,
      "Error: Invalid amount paid by retailer"
    );
    assert.equal(
      (
        parseInt(retailerFinalBalance, 10) -
        parseInt(retailerInitialBalance, 10)
      ).toString(),
      productPrice,
      "Error: Invalid amount received by distributor"
    );
  });

  // 9th Test
  it("Testing smart contract function fetchItemBufferOne() that allows anyone to fetch item details from blockchain", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferOne = await supplyChain.fetchItemBufferOne.call(upc);

    // Verify the result set:
    originFarmAssertions(resultBufferOne);
    assert.equal(
      resultBufferOne[2],
      consumerID,
      "Error: Missing or Invalid ownerID"
    );
  });

  // 10th Test
  it("Testing smart contract function fetchItemBufferTwo() that allows anyone to fetch item details from blockchain", async () => {
    const supplyChain = await SupplyChain.deployed();

    // Retrieve the just now saved item from blockchain by calling function fetchItem()
    const resultBufferTwo = await supplyChain.fetchItemBufferTwo.call(upc);

    // Verify the result set:
    assert.equal(resultBufferTwo[0], sku, "Error: Invalid item SKU");
    assert.equal(resultBufferTwo[1], upc, "Error: Invalid item UPC");
    assert.equal(
      resultBufferTwo[2],
      productID,
      "Error: Invalid item productID"
    );
    assert.equal(
      resultBufferTwo[3],
      productNotes,
      "Error: Invalid item productNotes"
    );
    assert.equal(
      resultBufferTwo[4],
      productPrice,
      "Error: Invalid item productPrice"
    );
    assert.equal(resultBufferTwo[5], 7, "Error: Invalid item itemState");
    assert.equal(
      resultBufferTwo[6],
      distributorID,
      "Error: Invalid item distributorID"
    );
    assert.equal(
      resultBufferTwo[7],
      retailerID,
      "Error: Invalid item retailerID"
    );
    assert.equal(
      resultBufferTwo[8],
      consumerID,
      "Error: Invalid item consumerID"
    );
  });
});

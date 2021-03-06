App = {
  web3Provider: null,
  contracts: {},
  emptyAddress: "0x0000000000000000000000000000000000000000",
  sku: 0,
  upc: 0,
  metamaskAccountID: "0x0000000000000000000000000000000000000000",
  ownerID: "0x0000000000000000000000000000000000000000",
  originFarmerID: "0x0000000000000000000000000000000000000000",
  originFarmName: null,
  originFarmInformation: null,
  originFarmLatitude: null,
  originFarmLongitude: null,
  productNotes: null,
  productPrice: 0,
  distributorID: "0x0000000000000000000000000000000000000000",
  retailerID: "0x0000000000000000000000000000000000000000",
  consumerID: "0x0000000000000000000000000000000000000000",

  init: async function() {
    App.readForm();
    /// Setup access to blockchain
    return await App.initWeb3();
  },

  readForm: function() {
    App.sku = $("#sku").val();
    App.upc = $("#upc").val();
    App.ownerID = $("#ownerID").val();
    App.originFarmerID = $("#originFarmerID").val();
    App.originFarmName = $("#originFarmName").val();
    App.originFarmInformation = $("#originFarmInformation").val();
    App.originFarmLatitude = $("#originFarmLatitude").val();
    App.originFarmLongitude = $("#originFarmLongitude").val();
    App.productNotes = $("#productNotes").val();
    App.productPrice = $("#productPrice").val();
    App.distributorID = $("#distributorID").val();
    App.retailerID = $("#retailerID").val();
    App.consumerID = $("#consumerID").val();

    console.log(
      App.sku,
      App.upc,
      App.ownerID,
      App.originFarmerID,
      App.originFarmName,
      App.originFarmInformation,
      App.originFarmLatitude,
      App.originFarmLongitude,
      App.productNotes,
      App.productPrice,
      App.distributorID,
      App.retailerID,
      App.consumerID
    );
  },

  initWeb3: async function() {
    /// Find or Inject Web3 Provider
    /// Modern dapp browsers...
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      try {
        // Request account access
        await window.ethereum.enable();
      } catch (error) {
        // User denied account access...
        console.error("User denied account access");
      }
    }
    // Legacy dapp browsers...
    else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:7545"
      );
    }

    App.getMetaskAccountID();

    return App.initSupplyChain();
  },

  getMetaskAccountID: function() {
    web3 = new Web3(App.web3Provider);

    // Retrieving accounts
    web3.eth.getAccounts(function(err, res) {
      if (err) {
        console.log("Error:", err);
        return;
      }
      console.log("getMetaskID:", res);
      App.metamaskAccountID = res[0];
    });
  },

  initSupplyChain: function() {
    /// Source the truffle compiled smart contracts
    var jsonSupplyChain = "../../build/contracts/SupplyChain.json";

    /// JSONfy the smart contracts
    $.getJSON(jsonSupplyChain, function(data) {
      console.log("data", data);
      var SupplyChainArtifact = data;
      App.contracts.SupplyChain = TruffleContract(SupplyChainArtifact);
      App.contracts.SupplyChain.setProvider(App.web3Provider);

      App.fetchItemBufferOne();
      App.fetchItemBufferTwo();
      App.fetchEvents();
    });

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on("click", App.handleButtonClick);
    $("input").on("change", App.handleInput);
  },

  handleInput: async function(event) {
    console.log(event.target.id, event.target.value);
    App[event.target.id] = event.target.value;
  },

  handleButtonClick: async function(event) {
    event.preventDefault();

    App.getMetaskAccountID();

    var processId = parseInt($(event.target).data("id"));
    console.log("processId", processId);

    switch (processId) {
      case 1:
        return await App.harvestOlives(event);
        break;
      case 2:
        return await App.processOlives(event);
        break;
      case 3:
        return await App.bottleOil(event);
        break;
      case 4:
        return await App.sellOil(event);
        break;
      case 5:
        return await App.buyOil(event);
        break;
      case 6:
        return await App.shipOil(event);
        break;
      case 7:
        return await App.receiveOil(event);
        break;
      case 8:
        return await App.purchaseOil(event);
        break;
      case 9:
        return await App.fetchItemBufferOne(event);
        break;
      case 10:
        return await App.fetchItemBufferTwo(event);
        break;
      case 11:
        return await App.addFarmer(event);
        break;
      case 12:
        return await App.addDistributor(event);
        break;
      case 13:
        return await App.addRetailer(event);
        break;
      case 14:
        return await App.addConsumer(event);
        break;
    }
  },

  harvestOlives: function(event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data("id"));

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.harvestOlives(
          App.upc,
          App.metamaskAccountID,
          App.originFarmName,
          App.originFarmInformation,
          App.originFarmLatitude,
          App.originFarmLongitude,
          App.productNotes
        );
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("harvestOlives", result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  addFarmer: function(event) {
    event.preventDefault();

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.addFarmer(App.originFarmerID, {
          from: App.metamaskAccountID,
          gasPrice: 0
        });
      })
      .then(function(result) {
        //$("#ftc-item").text(result);
        console.log("addFarmer", result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  addDistributor: function(event) {
    event.preventDefault();

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.addDistributor(App.distributorID, {
          from: App.metamaskAccountID
        });
      })
      .then(function(result) {
        //$("#ftc-item").text(result);
        console.log("addDistributor", result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  addRetailer: function(event) {
    event.preventDefault();

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.addRetailer(App.retailerID, {
          from: App.metamaskAccountID
        });
      })
      .then(function(result) {
        //$("#ftc-item").text(result);
        console.log("addRetailer", result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  addConsumer: function(event) {
    event.preventDefault();

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.addConsumer(App.consumerID, {
          from: App.metamaskAccountID
        });
      })
      .then(function(result) {
        //$("#ftc-item").text(result);
        console.log("addConsumer", result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  processOlives: function(event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data("id"));

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.processOlives(App.upc, { from: App.metamaskAccountID });
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("processOlives", result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  bottleOil: function(event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data("id"));

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.bottleOil(App.upc, { from: App.metamaskAccountID });
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("bottleOil", result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  sellOil: function(event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data("id"));

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.sellOil(App.upc, App.productPrice, {
          from: App.metamaskAccountID
        });
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("sellOil", result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  buyOil: function(event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data("id"));

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        const walletValue = web3.toWei(1.1, "ether");
        return instance.buyOil(App.upc, {
          from: App.metamaskAccountID,
          value: walletValue
        });
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("buyOil", result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  shipOil: function(event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data("id"));

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.shipOil(App.upc, { from: App.metamaskAccountID });
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("shipOil", result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  receiveOil: function(event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data("id"));

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        const walletValue = web3.toWei(1.1, "ether");
        return instance.receiveOil(App.upc, {
          from: App.metamaskAccountID,
          value: walletValue
        });
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("receiveOil", result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  purchaseOil: function(event) {
    event.preventDefault();
    var processId = parseInt($(event.target).data("id"));

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        const walletValue = web3.toWei(1.1, "ether");
        return instance.purchaseOil(App.upc, {
          from: App.metamaskAccountID,
          value: walletValue
        });
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("purchaseOil", result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  fetchItemBufferOne: function() {
    ///   event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));
    App.upc = $("#upc").val();
    console.log("upc", App.upc);

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.fetchItemBufferOne(App.upc);
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("fetchItemBufferOne", result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  fetchItemBufferTwo: function() {
    ///    event.preventDefault();
    ///    var processId = parseInt($(event.target).data('id'));

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        return instance.fetchItemBufferTwo.call(App.upc);
      })
      .then(function(result) {
        $("#ftc-item").text(result);
        console.log("fetchItemBufferTwo", result);
      })
      .catch(function(err) {
        console.log(err.message);
      });
  },

  fetchEvents: function() {
    if (
      typeof App.contracts.SupplyChain.currentProvider.sendAsync !== "function"
    ) {
      App.contracts.SupplyChain.currentProvider.sendAsync = function() {
        return App.contracts.SupplyChain.currentProvider.send.apply(
          App.contracts.SupplyChain.currentProvider,
          arguments
        );
      };
    }

    App.contracts.SupplyChain.deployed()
      .then(function(instance) {
        var events = instance.allEvents(function(err, log) {
          if (!err)
            $("#ftc-events").append(
              "<li>" + log.event + " - " + log.transactionHash + "</li>"
            );
        });
      })
      .catch(function(err) {
        console.log(err.message);
      });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});

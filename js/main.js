const NETWORK_ID = 137
var NFT_PRICE = null
var PRESALE_PRICE = null
var MAX_SUPPLY = null
var MAX_PRESALE_SUPPLY = null
var contract
var accounts
var web3
var spend;
var balance
var tokenbalance
var available
var mynft;
var currentAddr = null;
var balanceNFT
var IsAproba;
var stake;
var TokenUser = 0;
var misNftsID = [];
var iddeltango;
var balanceStake;
var TotalMinado;
var tokenContract;
const NftsAddress = '0xAf5d3183de674004bCD656aFA2dACD3B31EB9696'
const stakeAddress = '0xe7BA75C831f54b39aF0051Be3f272e4Ea69A1870'
const tokenAddress = '0x8888c0B3561084A2E55560e477E453CBD68731C4' // mainnet busd

const NftsABI = [{"inputs":[{"internalType":"string","name":"_name","type":"string"},{"internalType":"string","name":"_symbol","type":"string"},{"internalType":"string","name":"_initBaseURI","type":"string"},{"internalType":"string","name":"_initNotRevealedUri","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"approved","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"operator","type":"address"},{"indexed":false,"internalType":"bool","name":"approved","type":"bool"}],"name":"ApprovalForAll","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"previousOwner","type":"address"},{"indexed":true,"internalType":"address","name":"newOwner","type":"address"}],"name":"OwnershipTransferred","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":true,"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"addressMintedBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"approve","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseExtension","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"baseURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"cost","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getApproved","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"operator","type":"address"}],"name":"isApprovedForAll","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"_user","type":"address"}],"name":"isWhitelisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxMintAmount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"maxSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_mintAmount","type":"uint256"}],"name":"mint","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nftPerAddressLimit","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"notRevealedUri","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"onlyWhitelisted","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"ownerOf","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"bool","name":"_state","type":"bool"}],"name":"pause","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"paused","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"renounceOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"reveal","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"revealed","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"bytes","name":"_data","type":"bytes"}],"name":"safeTransferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"operator","type":"address"},{"internalType":"bool","name":"approved","type":"bool"}],"name":"setApprovalForAll","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_newBaseExtension","type":"string"}],"name":"setBaseExtension","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_newBaseURI","type":"string"}],"name":"setBaseURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newCost","type":"uint256"}],"name":"setCost","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_limit","type":"uint256"}],"name":"setNftPerAddressLimit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"_notRevealedURI","type":"string"}],"name":"setNotRevealedURI","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bool","name":"_state","type":"bool"}],"name":"setOnlyWhitelisted","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newmaxMintAmount","type":"uint256"}],"name":"setmaxMintAmount","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"bytes4","name":"interfaceId","type":"bytes4"}],"name":"supportsInterface","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"index","type":"uint256"}],"name":"tokenOfOwnerByIndex","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"tokenURI","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"transferFrom","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"newOwner","type":"address"}],"name":"transferOwnership","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"_owner","type":"address"}],"name":"walletOfOwner","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address[]","name":"_users","type":"address[]"}],"name":"whitelistUsers","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"whitelistedAddresses","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"withdraw","outputs":[],"stateMutability":"payable","type":"function"}]

const tokenAbi = [{"inputs":[],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"subtractedValue","type":"uint256"}],"name":"decreaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"addedValue","type":"uint256"}],"name":"increaseAllowance","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"amount","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"}]

const stakeABI = [{"inputs":[{"internalType":"contract IERC721","name":"_nftToken","type":"address"},{"internalType":"contract IERC20","name":"_erc20Token","type":"address"},{"internalType":"address","name":"_daoAdmin","type":"address"}],"stateMutability":"nonpayable","type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"NftStaked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"blockNumber","type":"uint256"}],"name":"NftUnStaked","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"staker","type":"address"},{"indexed":false,"internalType":"uint256","name":"tokenId","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"stakeAmount","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"fromBlock","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"toBlock","type":"uint256"}],"name":"StakePayout","type":"event"},{"inputs":[],"name":"DIAMOND_tokensPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"GOLD_tokensPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"SILVER_tokensPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"_mount","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"_copper_tokensPerBlock","type":"uint256"},{"internalType":"uint256","name":"_SILVER_tokensPerBlock","type":"uint256"},{"internalType":"uint256","name":"_GOLD_tokensPerBlock","type":"uint256"},{"internalType":"uint256","name":"_DIAMOND_tokensPerBlock","type":"uint256"}],"name":"changeTokensPerblock","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"copper_tokensPerBlock","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"daoAdmin","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"erc20Token","outputs":[{"internalType":"contract IERC20","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"getCurrentStakeEarned","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getStakeContractBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"getStakeNftBalance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"}],"name":"harvest","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"}],"name":"jefe","outputs":[{"internalType":"uint256","name":"mount","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"add","type":"address"}],"name":"misnft","outputs":[{"internalType":"uint256[]","name":"","type":"uint256[]"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nftToken","outputs":[{"internalType":"contract IERC721","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"","type":"address"},{"internalType":"address","name":"","type":"address"},{"internalType":"uint256","name":"","type":"uint256"},{"internalType":"bytes","name":"","type":"bytes"}],"name":"onERC721Received","outputs":[{"internalType":"bytes4","name":"","type":"bytes4"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"receipt","outputs":[{"internalType":"uint256","name":"tokenId","type":"uint256"},{"internalType":"uint256","name":"stakedFromBlock","type":"uint256"},{"internalType":"address","name":"owner","type":"address"},{"internalType":"uint256","name":"rango","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"reclaimTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_newPriceCopper","type":"uint256"},{"internalType":"uint256","name":"_newPriceSilver","type":"uint256"},{"internalType":"uint256","name":"_newPriceGold","type":"uint256"},{"internalType":"uint256","name":"_newPriceDiamon","type":"uint256"}],"name":"setPrice","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"tokenId","type":"uint256[]"},{"internalType":"uint256[]","name":"_rango","type":"uint256[]"}],"name":"stakeNFT","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256[]","name":"tokenId","type":"uint256[]"}],"name":"unStakeNFT","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_copper_tokensPerBlock","type":"uint256"},{"internalType":"uint256","name":"_SILVER_tokensPerBlock","type":"uint256"},{"internalType":"uint256","name":"_GOLD_tokensPerBlock","type":"uint256"},{"internalType":"uint256","name":"_DIAMOND_tokensPerBlock","type":"uint256"}],"name":"updateStakingReward","outputs":[],"stateMutability":"nonpayable","type":"function"}]



function metamaskReloadCallback() {
  window.ethereum.on('accountsChanged', (accounts) => {
    document.getElementById("web3_message").textContent = "Accounts changed, realoading...";
    window.location.reload()
  })
  window.ethereum.on('networkChanged', (accounts) => {
    document.getElementById("web3_message").textContent = "Network changed, realoading...";
    window.location.reload()
  })
}

const getAccounts = async () => {
  metamaskReloadCallback()
  try {
    await window.ethereum.request({ method: "eth_requestAccounts" })
    resolve(web3)
  } catch (error) {
    console.log(error)
  }
}

const getWeb3 = async () => {
  return new Promise((resolve, reject) => {
    if (document.readyState == "complete") {
      if (window.ethereum) {
        const web3 = new Web3(window.ethereum)
        resolve(web3)
      } else {
        reject("must install MetaMask")
        document.getElementById("web3_message").textContent = "Error: Please install Metamask";
      }
    } else {
      window.addEventListener("load", async () => {
        if (window.ethereum) {
          const web3 = new Web3(window.ethereum)
          resolve(web3)
        } else {
          reject("must install MetaMask")
          document.getElementById("web3_message").textContent = "Error: Please install Metamask";
        }
      });
    }
  });
};

function handleRevertError(message) {
  alert(message)
}

async function getRevertReason(txHash) {
  const tx = await web3.eth.getTransaction(txHash)
  await web3.eth
    .call(tx, tx.blockNumber)
    .then((result) => {
      throw Error("unlikely to happen")
    })
    .catch((revertReason) => {
      var str = "" + revertReason
      json_reason = JSON.parse(str.substring(str.indexOf("{")))
      handleRevertError(json_reason.message)
    });
}

const getContract = async (web3) => {
  // const response = await fetch("./contracts/MinerGlobal.json");
  //const data = await response.json();

  const netId = await web3.eth.net.getId();
  //const deployedNetwork = data.networks[netId];
  tokenContract = new web3.eth.Contract(tokenAbi, tokenAddress);
  contract = new web3.eth.Contract(NftsABI, NftsAddress);
  stake = new web3.eth.Contract(stakeABI, stakeAddress);
  
  return contract
}

async function connectWallet() {
  getAccounts()
}

async function loadAccount() {

  accounts = await web3.eth.getAccounts()
  balance = await contract.methods.balanceOf(accounts[0]).call()
  balanceStake = await stake.methods.misnft(accounts[0]).call()
  totalstaked = await stake.methods.getStakeNftBalance().call()
 
  
  //balanceNFT = await contract.methods.tokensOfOwner(accounts[0]).call()
  for(var i = 0; i < balance; i++){
    misNftsID[i] = await contract.methods.tokenOfOwnerByIndex(accounts[0], i).call();
  }
  //console.log(misNftsID)

  //es aprovado
  IsAproba = await contract.methods.isApprovedForAll(accounts[0], stakeAddress).call()
  if (IsAproba) {
    $("#aprobar").hide();
  }
  //console.log(IsAproba)
  for (let e = 0; e < misNftsID.length; e++) {
    imgURL = "https://uw-app-k5iwr.ondigitalocean.app/metadata/" + misNftsID[e] +".json"
    axios.get(imgURL)
      .then((response) => {
        // función que se ejecutará al recibir una respuesta
        var nftsMis = response.data.image
        //console.log(nftsMis)
        const nftdiv = document.getElementById("carousel-img1")
        const insertarnft = document.createElement("div")
        insertarnft.classList.add("column")
        insertarnft.classList.add("is-one-quarter-desktop")
        insertarnft.classList.add("is-half-tablet")
   
   
        
       
        insertarnft.innerHTML=` 
        
        <div class="card is-loaded">
        <div class="card-image is-loaded"  style="background-image: url(${nftsMis})" data-image-full="${nftsMis}">
          <img src=${nftsMis}" alt="Psychopomp" />
        </div>
        <div class="card-description">
          <h2>Weirdos #${misNftsID[e]}</h2>
          <a onclick="Stake(${misNftsID[e]}, 0)" class="boton azul">Stake</a >
          
        </div>
      </div>
            
        
        `; 


        nftdiv.appendChild(insertarnft)
      })
      .catch(function (error) {
        // función para capturar el error
        console.log(error);
      })
  }

  for (let e = 0; e < balanceStake.length; e++) {
    imgURL = "https://uw-app-k5iwr.ondigitalocean.app/metadata/" + balanceStake[e] +".json"
    axios.get(imgURL)
      .then((response) => {
    console.log(imgURL)

        // función que se ejecutará al recibir una respuesta
        var nftsMis = response.data.image
   
        stake.methods.getCurrentStakeEarned(balanceStake[e]).call().then(userBalance => {
           TotalMinado = web3.utils.fromWei(userBalance);
           TokenUser  = parseFloat(TokenUser) + parseFloat(TotalMinado) ;
            document.getElementById("Your_Reward").textContent = TokenUser;
          
           console.log(TokenUser)
           const nftdiv = document.getElementById("carousel-img2")
           const insertarnft = document.createElement("div")
           insertarnft.classList.add("column")
           insertarnft.classList.add("is-one-quarter-desktop")
           insertarnft.classList.add("is-half-tablet")
      
           insertarnft.innerHTML = ` 
           <div class="card is-loaded">
           <div class="card-image is-loaded"  style="background-image: url(${nftsMis})" data-image-full="${nftsMis}">
             <img src=${nftsMis}" alt="Psychopomp" />
           </div>
           <div class="card-description">
             <h2>Weirdos #${balanceStake[e]}</h2>
             <p>Total Mined ${TotalMinado}</p>
             <a onclick="UnStake(${balanceStake[e]})" class="boton azul">UnStake</a >
             
           </div>
         </div>
        
       `

           nftdiv.appendChild(insertarnft)
         })
         .catch(function (error) {
           // función para capturar el error
           console.log(error);
         })

        }).catch((err) => {
          console.log(err)
        });
        
     
  }




  tokenContract.methods.balanceOf(accounts[0]).call().then(userBalance => {
    let amt = web3.utils.fromWei(userBalance);

  }).catch((err) => {
    console.log(err)
  });

  tokenContract.methods.allowance(accounts[0], NftsAddress).call().then(result => {
    spend = web3.utils.fromWei(result)
    if (spend > 0) {
      // alert(spend)
    }
  }).catch((err) => {
    console.log(err)
  });



    document.getElementById("Your_Weirdos").textContent = balance;
    document.getElementById("Staked").textContent = balanceStake.length;
    document.getElementById("Total_Stake").textContent = totalstaked;
}


async function loadDapp() {

  var awaitWeb3 = async function () {
    web3 = await getWeb3()
    web3.eth.net.getId((err, netId) => {
      if (netId == NETWORK_ID) {
        $("#nft-en-stake").hide();


        var awaitContract = async function () {
          contract = await getContract(web3);
       
          total_mint = await contract.methods.totalSupply().call()
          
          web3.eth.getAccounts(function (err, accounts) {
            if (err != null)
              console.error("An error occurred: " + err);
            else if (accounts.length == 0)
              console.log("User is not logged in to MetaMask");
            else {
              loadAccount()
            }
          });
        };
        awaitContract();
      } else {
        //document.getElementById("web3_message").textContent = "Please connect to Binance smart chain";
      }
    });
  };
  awaitWeb3();
}

loadDapp()





//APROVAR
const NftApro = async () => {
  const result = await contract.methods.setApprovalForAll(stakeAddress, true)
    .send({ from: accounts[0], gas: 0, value: 0 })
    .catch((revertReason) => {

    });
}

//staker all
const StakeALL = async () => {
  console.log(misNftsID)
  stake.methods.stakeNFT(misNftsID, misNftsID).send({ from: accounts[0] }).then(result => {
loadDapp()

  }).catch((err) => {
    console.log(err)
  });


}

//staker 
const Stake = async (_idnfts, _rango) => {


  stake.methods.stakeNFT([_idnfts],[ _rango]).send({ from: accounts[0] }).then(result => {
    loadDapp()

  }).catch((err) => {
    console.log(err)
  });


}


//Unstaker all
const UnStakeALL = async () => {
  console.log(balanceStake)
  stake.methods.unStakeNFT(balanceStake).send({ from: accounts[0] }).then(result => {
    loadDapp()

  }).catch((err) => {
    console.log(err)
  });


}


//Unstaker 
const UnStake = async (_idnfts) => {


  stake.methods.unStakeNFT([_idnfts]).send({ from: accounts[0] }).then(result => {
    loadDapp()

  }).catch((err) => {
    console.log(err)
  });


}


function NoStake(){
  $( "#InStake" ).removeClass( "is-active" );
  $("#NoStake").addClass("is-active");
  $("#nft-en-stake").hide();
  $("#nft-no-stake").show();

}
function InStake(){
  $( "#NoStake" ).removeClass( "is-active" );
  $("#InStake").addClass("is-active");
  $("#nft-no-stake").hide();
  $("#nft-en-stake ").show(); 

}

var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.display === "block") {
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
}



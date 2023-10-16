const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const PORT = 3000;
const http = require("http");
const Wallet = require("ethereumjs-wallet");
const Web3 = require("web3");
const server = http.createServer(app);
const {ethers,JsonRpcProvider , formatEther, parseUnits, isAddress, ContractTransactionResponse, InfuraProvider} = require("ethers");
const { EthHdWallet, generateMnemonic } = require("eth-hd-wallet");

const HttpProvider =
  "https://eth-mainnet.g.alchemy.com/v2/3iz35aSwwC5nbTT9SyTmJ0WM916nuv70";
app.use(bodyParser.json({ limit: "100mb", type: "application/json" }));
app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    extended: true,
  })
);

// app.post('/import-wallet',async (req, res) => {
//     const privateKey = "06cfe268e737bda2e3fc4ef07603b6ff6b74ce7f9671b81dd43bccc5fb9f8a93";
//     var wallet = Wallet.fromPrivateKey(new Buffer(privateKey, "hex"));
//     console.log(wallet)
//     const web3 = new Web3(HttpProvider);
//     const address = `0x${wallet.getAddress().toString('hex')}`;

//     web3.eth.getBalance(address).then((balance) => {
//       res.json({ address, balance });
//     });
//   });

// app.post("/create-wallet", (req, res) => {
//   const wallet = EthHdWallet.fromMnemonic(generateMnemonic());
//   console.log(wallet instanceof EthHdWallet);
//   console.log(wallet.generateAddresses(1));
//   res.send({ wallet });
// });

app.post("/import-wallet",async (req, res) => {
  var privateKey = req.body.privateKey;
  privateKey = "0x".concat(privateKey);
  if (ethers.isHexString(privateKey, 32)) {
    console.log('Valid private key');
  } else {
    console.log('Invalid private key');
    return res.status(400).send({ error: "Invalid private key" });
  }
  try{
    const wallet = new ethers.Wallet(privateKey);
  }
  catch(err){
    return res.status(400).send("Invalid Private Key")
  }
  try{
    //"0x41f6b253b7965836e092e66fc89ffa623083f0b034c20985d92c4d29950d895d";
   if(privateKey){
    try{
    const wallet = new ethers.Wallet(privateKey);
    console.log("Address:", wallet.address);
    const rpcURL = new JsonRpcProvider("https://bsc-dataseed.binance.org/");
    //const provider = new ethers.Wallet(wallet.address, rpcURL);
    var balance = await rpcURL.getBalance(wallet.address);
    console.log("asdasdas")
    const result = {
      walletAddress : wallet.address,
      balance : formatEther(balance)
    }
    console.log(result)
    res.send(result);
  }
  catch(err){
    console.log(err)
    return res.status(400).send("Private Key Not Correct")
  }
   }
   else{
    console.log(err)
    return res.status(400).send("Please provide private key")
   }
  }
  catch(err){
    return res.status(400).send("Invalid Private Key")
  }
});

app.post("/generate-wallet",async (req, res) => {
  const wallet =await ethers.Wallet.createRandom();
  console.log("Wallet Address:", wallet);
  console.log("Private key:", wallet.privateKey);
  console.log("Address:", wallet.address);
   const rpcURL = new JsonRpcProvider("https://bsc-dataseed.binance.org/");
    var balance = await rpcURL.getBalance(wallet.address);
  console.log("Wallet Mnemmonic "+JSON.stringify(wallet.mnemonic.phrase));
  const result = {
    walletAddress : wallet.address,
    privateKey : wallet.privateKey,
    mnemonic : wallet.mnemonic.phrase,
    balance : formatEther(balance)
  }
  res.status(200).send(result)
});

app.post("/network-wallet", async (req, res) => {
  const privateKey = "0x06cfe268e737bda2e3fc4ef07603b6ff6b74ce7f9671b81dd43bccc5fb9f8a93"
  const provider = new JsonRpcProvider("https://rpc.ankr.com/eth_goerli");
  const wallet = new ethers.Wallet(privateKey, provider);
  const balance = await provider.getBalance(wallet.address);
  console.log("balance "+balance)
  console.log("balance convert "+formatEther(balance))
  //console.log("Balance:", ethers.utils.format(balance));
  // console.log("Private key:", wallet.privateKey);
  // console.log("Address:", wallet.address);
  res.end()
});

app.post("/token-wallet", async (req, res) => {
  var privateKey = req.body.privateKey;
  privateKey = "0x".concat(privateKey);
  const provider = new JsonRpcProvider("https://bsc-dataseed.binance.org/");
  const wallet = new ethers.Wallet(privateKey, provider);
   // Define the contract ABI
   const abi = require("./contract.json")

  // Create a contract instance
  try {
    

  var contractAddress = "0x55d398326f99059fF775485246999027B3197955"
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const name = await contract.name();
  const symbol = await contract.symbol();
  const decimals = await contract.decimals();
  const token =  {
    name: name,
    symbol: symbol,
    decimals: decimals
  };
  console.log("name "+name)
  console.log("symbol "+symbol)
  console.log("decimals "+decimals)
  //wallet.addtoken(token);
 
  console.log("Token imported:", token);
  const balance = await contract.balanceOf(wallet.address);
  console.log("Token balance:", balance.toString());
  const result = {
    tokenName : token.name,
    tokenSymbol : token.symbol,
    tokenBalance : formatEther(balance)
  }
  res.status(200).send(result)
} catch (error) {
    console.log(error)
}
  //console.log("Balance:", ethers.utils.format(balance));
  // console.log("Private key:", wallet.privateKey);
  // console.log("Address:", wallet.address);
  res.end()
});

app.post("/token-walletf3", async (req, res) => {
  var privateKey = req.body.privateKey;
  privateKey = "0x".concat(privateKey);
  if(privateKey){
  const provider = new JsonRpcProvider("https://bsc-dataseed.binance.org/");
  const wallet = new ethers.Wallet(privateKey, provider);
   // Define the contract ABI
   const abi = require("./contract.json")

  // Create a contract instance
  try {
    

  var contractAddress = "0xfB265e16e882d3d32639253ffcfC4b0a2E861467"
  const contract = new ethers.Contract(contractAddress, abi, provider);
  const name = await contract.name();
  const symbol = await contract.symbol();
  const decimals = await contract.decimals();
  const token =  {
    name: name,
    symbol: symbol,
    decimals: decimals
  };
  console.log("name "+name)
  console.log("symbol "+symbol)
  console.log("decimals "+decimals)
  //wallet.addtoken(token);
 
  console.log("Token imported:", token);
  const balance = await contract.balanceOf(wallet.address);
  console.log("Token balance:", balance.toString());
  const result = {
    tokenName : token.name,
    tokenSymbol : token.symbol,
    tokenBalance : formatEther(balance)
  }
  return res.status(200).send(result)
} catch (error) {
    console.log(error)
}
}
else{
  return res.status(400).send("Please provide private key")
}
  //console.log("Balance:", ethers.utils.format(balance));
  // console.log("Private key:", wallet.privateKey);
  // console.log("Address:", wallet.address);
  res.end()
});

/////////////transfer function

app.post("/transfertoken", async (req, res) => {
  //var privateKey = req.body.privateKey;
  //"0x7Aff2d0B67FE9Ebb842aE9F3255DFfca0E02448c"
  //"0x06cfe268e737bda2e3fc4ef07603b6ff6b74ce7f9671b81dd43bccc5fb9f8a93"
  var receiptAddress = req.body.walletAddress
  console.log("wallet address "+receiptAddress)
  var amount = req.body.token
  console.log("amount "+amount)
  var CONTRACT_ADDRESS = "0xfB265e16e882d3d32639253ffcfC4b0a2E861467"
  var privateKey = req.body.privateKey 
  privateKey = "0x".concat(privateKey)
  console.log("privateKey "+privateKey)
  
  const abi = require("./contract.json")

const provider = new JsonRpcProvider("https://bsc-dataseed.binance.org/"); // Connect to Ropsten testnet
const wallet = new ethers.Wallet(privateKey, provider);
const amountConvert = parseUnits(amount,18)
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
if(isAddress(receiptAddress)){
  try{
const tx = await contract.transfer(receiptAddress, amountConvert);
console.log('Transaction hash:', tx.hash);
const result = {
  response : tx.hash
}
 return res.status(200).send(result)
}
catch(err){
  console.log("Insufficient Funds")
  return res.status(401).send("Insufficient Balance")
}
}
else{
  console.log("Invalid Address")
  const result = {
    response : "Invalid Address"
  }
  return res.status(400).send(result)
}
});


/////////////////////////////////////////////////

app.post("/transfertokenusdt", async (req, res) => {
  //var privateKey = req.body.privateKey;
  //"0x7Aff2d0B67FE9Ebb842aE9F3255DFfca0E02448c"
  //"0x06cfe268e737bda2e3fc4ef07603b6ff6b74ce7f9671b81dd43bccc5fb9f8a93"
  var receiptAddress = req.body.walletAddress
  console.log("wallet address "+receiptAddress)
  var amount = req.body.token
  console.log("amount "+amount)
  var CONTRACT_ADDRESS = "0x55d398326f99059fF775485246999027B3197955"
  var privateKey = req.body.privateKey 
  privateKey = "0x".concat(privateKey)
  console.log("privateKey "+privateKey)
  
  const abi = require("./contract.json")

const provider = new JsonRpcProvider("https://bsc-dataseed.binance.org/"); 
const wallet = new ethers.Wallet(privateKey, provider);
const amountConvert = parseUnits(amount,18)
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
if(isAddress(receiptAddress)){
 try{ 
const tx = await contract.transfer(receiptAddress, amountConvert);
console.log('Transaction hash:', tx.hash);
  return res.status(200).send(tx.hash)
}
catch(err){
  console.log("Insufficient Funds")
  return res.status(401).send("Insufficient Balance")
}
}
else{
  res.status(400).send("Invalid Receipt Address")
}
});

app.post("/swaptoken", async (req, res) => {
  //var privateKey = req.body.privateKey;
  var receiptAddress = "0x7Aff2d0B67FE9Ebb842aE9F3255DFfca0E02448c"
  var amount = '50'
  var CONTRACT_ADDRESS = "0x5828bE076e42216050FC11DfECD8598232043b19"
  const privateKey = "0x06cfe268e737bda2e3fc4ef07603b6ff6b74ce7f9671b81dd43bccc5fb9f8a93"
  const abi = require("./contract.json")

const provider = new JsonRpcProvider("https://bsc-testnet.public.blastapi.io"); // Connect to Ropsten testnet
const wallet = new ethers.Wallet(privateKey, provider);
const amountConvert = parseUnits(amount,18)
const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, wallet);
if(isAddress(receiptAddress)){
const tx = await contract.transfer(receiptAddress, amountConvert);
console.log('Transaction hash:', tx.hash);
  res.status(200).send(tx.hash)
}
else{
  res.status(400).send("Invalid Receipt Address")
}
});

server.listen(PORT, () => console.log(`running on port ${PORT}`));

import { web3, walletConnectModalInit } from "../web3";
import Web3solana from '@solana/web3.js';
import { backendServices } from './backend.service';

async function getNetworkId() {
  try {
    return await window.ethereum.request({ method: "eth_chainId" });
  } catch (error) {
    return 1;
  }
}
async function getWeb3(isAuthenticate) {
  if (web3) {
    let web3Data = {
      isLoggedIn: false,
      accounts: [],
    };
    try {
      const responseData = await web3.eth.getAccounts();
      console.log(responseData);

      if (responseData.length) {
        web3Data.accounts = responseData;
        if (isAuthenticate) {
          web3Data.isLoggedIn = true;
        }
        return web3Data;
      } else {
        return web3Data;
      }
    } catch {
      return web3Data;
    }
  }
}

async function getSolana(nonce){
  if(window.solana){
    let solData = {
      isLogin : false,
      account : [],
      signature:null,
    };
    try {

      if("solana" in window){
        const {solana} = window;
        
            console.log(solana);
            const response = await solana.connect();
            console.log(response.publicKey.toString());
            const d = response.publicKey.toString();
            await backendServices.postSolana();
            const encodeMessage = new TextEncoder().encode("Message to sign");
            console.log(nonce);
            const signedMessage = await window.solana.request({
              method: "signMessage",
              params: {
                message: encodeMessage,
                display: "utf8",
              },
              nonce: nonce,
            })
            console.log(signedMessage.signature);
            solData.account = d;
            solData.signature = signedMessage.signature;
            if(solData.account){
              solData.isLogin = true;
            }
            else{
              solData.isLogin = false;
            }
            return solData;
      }
  
    } catch {
      return solData;
    }
  }
}

async function enabledWalletConnect() {
  try {
    await walletConnectModalInit();
    // const resp = await getWeb3();
    // const res1 = await getSolana();
    // return resp;
  } catch (error) {
    if (error.code === -32002) {
      return {
        isLoggedIn: false,
        accounts: [],
      };
    }
    return {
      isLoggedIn: false,
      accounts: [],
    };
  }
}

async function enablePhantom(){
  try {
    const solana = window;
    // await solana.connect();
    const resp1 = await getSolana();
    return resp1;
  } catch (error) {
    if (error.code === -32002) {
      return {
        error: true,
        code: error.code,
        msg: error.message,
        isLogin: false,
        account: [],
      };
    }
    if (error.code === 4001) {
      return {
        error: true,
        code: error.code,
        msg: error.message,
        isLogin: false,
        account: [],
      };
    }
    return {
      error: true,
      code: error.code,
      msg: error.message,
      isLogin: false,
      account: [],
    };
  }
}

async function enableMetamask() {
  try {
    await window.ethereum.send("eth_requestAccounts");
    const resp = await getWeb3();
    return resp;
  } catch (error) {
    if (error.code === -32002) {
      return {
        error: true,
        code: error.code,
        msg: error.message,
        isLoggedIn: false,
        accounts: [],
      };
    }
    if (error.code === 4001) {
      return {
        error: true,
        code: error.code,
        msg: error.message,
        isLoggedIn: false,
        accounts: [],
      };
    }
    return {
      error: true,
      code: error.code,
      msg: error.message,
      isLoggedIn: false,
      accounts: [],
    };
  }
}

async function getContractInstance(contractAbi, contractAddress) {
  try {
    if (web3) {
      const contractInstance = await new web3.eth.Contract(
        contractAbi,
        contractAddress
      );
      return contractInstance;
    }
  } catch (error) {
    // console.log(error);
  }
}

export const web3Services = {
  getNetworkId,
  enableMetamask,
  enablePhantom,
  getContractInstance,
  getWeb3,
  getSolana,
  enabledWalletConnect,
};

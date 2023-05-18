import axios from '../config';
import { web3 } from '../web3';
// import userBalancesContract from "../contracts/userBalances/userBalances";
// import tokens from "../tokens.json";
// import { param } from "jquery";

export const backendServices = {
  get,
  post,
  put,
  postSolana,
  solanaGet,
};

async function post(url, params) {
  const token = localStorage.getItem('avangartAuthToken');
  const header = token
    ? { 'content-type': 'application/json', 'x-auth-token': token }
    : {
        'content-type': 'application/json',
      };
  // const header = {
  //   'content-type': 'application/json'
  // }
  try {
    console.log(url, params);
    const response = await axios.post(url, params, { headers: header });
    console.log(response);
    return response;
  } catch (error) {
    // console.log("new", error.response);
    return error;
  }
}

async function postSolana(url,params) {
  const token = localStorage.getItem('avangarSolToken');
  const header = {
        'content-type': 'application/json',
      };
    try {
        console.log(url,params);
      const response = await axios.post(url, params, {headers : header});
      console.log(response);
      return response;
      
    } catch (error) {
      console.log(error);
    }

//   // POST request using fetch()
// fetch(`https://api.carny.io/api/v1`, {
//   // Adding method type
//   method: "POST",
   
//   // Adding body or contents to send
//   body: JSON.stringify(params),
   
//   // Adding headers to the request
//   headers: {
//       "Content-type": "application/json; charset=UTF-8"
//   }
// }).then((res)=> {
//   console.log(res.json())
// }).then((data)=>{
//   console.log(data)
// })
}

async function solanaGet(url) {
      const header = {
                        'content-type' : 'application/json',
                     }

      const Response = await axios.get(url, { headers : header});
      console.log(Response);
      return Response;
}

async function get(url, isAuthenticated) {
  console.log(url,isAuthenticated);
  const token = localStorage.getItem('avangartAuthToken');
  const solToken = localStorage.getItem('avangarSolToken');
  const header = isAuthenticated
    ? { 'x-auth-token': token, 'content-type': 'application/json' }
    : {
        'content-type': 'application/json',
      };
  // const solHeader = isAuthenticated
  // ? { 'x-auth-token': solToken, 'content-type': 'application/json' }
  //   : {
  //       'content-type': 'application/json',
  //     };
  try {
    const response = await axios.get(url, { headers: header });
    console.log(response);
    return response;
    // return solResponse;
  } catch (error) {
    return error;
  }
}

async function put(url, parameters) {
  const token = localStorage.getItem('avangartAuthToken');
  const header = token
    ? { 'x-auth-token': token }
    : {
        'content-type': 'application/json',
      };
  try {
    const response = await axios.put(url, parameters, { headers: header });
    return response;
  } catch (error) {
    return error;
  }
}

let web3Data = {
  isLoggedIn: false,
  accounts: [],
};

let solData = {
  isLogin : false,
  account : [],
}

// async function getWeb3(val) {
//   if (web3) {
//     try {
//       let web3Data = {
//         isLoggedIn: false,
//         accounts: [],
//       };
//       const responseData = await web3.eth.getAccounts();

//       if (responseData.length) {
//         web3Data.isLoggedIn = true;
//         web3Data.accounts = responseData;
//         return web3Data;
//       } else {
//         return web3Data;
//       }
//     } catch {
//       return web3Data;
//     }
//   }
// }

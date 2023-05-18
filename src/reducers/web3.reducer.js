export function fetchNetworkId(state = null, action) {
  switch (action.type) {
    case "FETCH_NETWORK_ID":
      return action.data;
    default:
      return state;
  }
}
export function fetchNFTContractInstance(state = null, action) {
  switch (action.type) {
    case "NFT_CONTRACT_INSTANCE":
      return action.data;
    default:
      return state;
  }
}

export function fetchWeb3Data(
  state = {
    isLoggedIn: localStorage.getItem("avangartAuthToken") ? true : false,
    accounts: [],
  },
  action
) {
  switch (action.type) {
    case "FETCH_WEB3_DATA":
      return action.data;
    case "FETCH_WEB3_DATA_ERROR":
      return action.data;
    default:
      return state;
  }
}
export function fetchSolData(
  state = {
    isLogin: localStorage.getItem("avangartAuthToken") ? true : false,
    account: [],
  },
  action
) {
  switch (action.type) {
    case "FETCH_SOL_DATA":
      return action.data;
    case "FETCH_SOL_DATA_ERROR":
      return action.data;
    default:
      return state;
  }
}

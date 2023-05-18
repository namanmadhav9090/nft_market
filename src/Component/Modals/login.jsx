import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import { isMobile } from 'react-device-detect';
import Media from './../../Theme/media-breackpoint';
// import { useDispatch, useSelector } from "react-redux";

import CloseBTN01 from '../../Assets/images/closeBTN01.svg';
import WalletICO01 from '../../Assets/images/walletICO-01.png';
import WalletICO02 from '../../Assets/images/wallet-connect.svg';
import phantomLogo from '../../Assets/images/phantom.png';

import LoaderGif from '../../Assets/images/loading.gif';
import { useEffect } from 'react';
import { useState } from 'react';
import { connect } from 'react-redux';
import { web3 } from '../../web3';
import { actions } from '../../actions';
// import {Connection, PublicKey,clusterApiUrl,LAMPORTS_PER_SOL} from '@solana/web3.js';
import Web3solana from '@solana/web3.js'
// import { getSolana } from '../../actions/web3.action';
// import { getSolana } from '../../actions/web3.action';

function Login(props) {

  const [loader, setLoader] = useState(false);
  const [genNonce, setGenNonce] = useState(false);
  const [error, setError] = useState({ isError: false, msg: '', code: 0 });
  const {
    web3Data,
    solData,
    getSolana,
    getWeb3,
    solNonce,
    generateNonce,
    generateSolNonce,
    enableMetamask,
    enablePhantom,
    solLogin,
    authLogin,
    toggle,
    nonce,
    authData,
    enabledWalletConnect,
  } = props;
  console.log(props);
  console.log(solNonce);
  console.log(nonce);
  // solLogin(solNonce);
  let solSignature = solData.signature;
  console.log(solSignature);

  // const connection = new Connection(clusterApiUrl("devnet"),"confirmed");
  // console.log(connection);
  // const solSignature = connection.requestAirdrop("Tm6TvPkgMgRNuFwuoyGmVSP2Hga3ZLFS2JeWp3osWWJ", LAMPORTS_PER_SOL);
  // solSignature.then((data)=>{
  //   console.log(data.toBase58());
  // })
  

  useEffect(() => {
    props.getWeb3();
    console.log(nonce);
  }, []);


  useEffect(()=>{
    actions.getSolana();
    console.log(solSignature);
    solLogin(solNonce,solSignature);
    console.log(solNonce,"function is calling properly....");
  },[solNonce]);

  useEffect(() => {
    if (web3Data.error)
      return setError({ isError: true, msg: 'User denied sign in..', code: 1 });
    if (web3Data.accounts[0] && genNonce) {
      setLoader(true);
      if (web3Data.accounts[0] && !nonce) signatureRequest(undefined, true);
      else if (!web3Data.accounts[0])
        setError({ isError: true, msg: 'User denied sign in..', code: 1 });
      else if (web3Data.accounts[0] && nonce) signatureRequest(nonce, false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [web3Data]);

  useEffect(() => {
    if (nonce && web3Data.accounts[0]) signatureRequest(nonce);
    // console.log(nonce)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce]);

  useEffect(() => {
    if (authData?.status === 401) {
      setLoader(false);
      setError({ isError: true, msg: authData.data.message, code: 1 });
    } else if (authData) {
      refreshStates(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authData]);

  const connectToWallet = (isWalletConnect) => {
    setGenNonce(true);
    if (isWalletConnect) enabledWalletConnect();
    else {
      setLoader(true);


      if (web3Data.accounts[0]) {
        checkAuthentication(web3Data);
      } else {
        if (typeof window.web3 !== 'undefined') {
          // console.log("1");
          enableMetamask();
          // actions.getWeb3();
        } else {
          setLoader(false);
          let msg = (
            <FormattedMessage
              id='download_metamask_lable'
              defaultMessage='Please download metamask first.!'
            />
          );
          setError({ isError: true, msg: msg, code: 2 });
        }
      }
    }
  };

  const connectPhantom = async(isWalletConnect) => {
    generateSolNonce(solData.account);
    // console.log(solNonce);
    // solLogin(solNonce)
        if(typeof window.solana !== 'undefined') {
            setLoader(true);
            enablePhantom();
            //nonce
            
            
          
            // const encodeMessage = new TextEncoder().encode("Message to sign");
            // const signedMessage = await window.solana.request({
            //   method: "signMessage",
            //   params: {
            //     message: encodeMessage,
            //     display: "utf8",
            //   }
            // })
            // console.log(signedMessage);
            // const solSignature = signedMessage.signature;
            // console.log(solSignature);
            
          
        }
        else{
          setLoader(false);
          let msg = (
            <FormattedMessage 
            id='donwload_phantom_lable'
            defaultMessage={'Please download Phantom first.!'} 
          />
          );
          setError({ isError: true, msg: msg, code: 2})
        }
      }
    // }
  // }

  const checkAuthentication = (web3Data) => {
    if (
      !localStorage.getItem('avangartAuthToken') ||
      web3Data.accounts[0] !== localStorage.getItem('userAddress')
    ) {
      signatureRequest(undefined, true);
    }
  };

  const signatureRequest = async (nonce, stepOne) => {
    if (stepOne) {
      generateNonce(web3Data.accounts[0]);
    } else {
      try {
        if (!web3Data.isLoggedIn) {
          const chainId = await web3.eth.net.getId();

          if (chainId !== 56 && chainId !== '0x38') {
            // MetaMask injects the global API into window.ethereum
            try {
              if (window.web3) {
                await window.ethereum.request({
                  method: 'wallet_addEthereumChain',
                  params: [
                    {
                      chainId: '0x38',
                      chainName: 'Binance Smart Chain',
                      nativeCurrency: {
                        name: 'Binance Chain Token',
                        symbol: 'BNB',
                        decimals: 18
                      },
                      rpcUrls: ['https://bsc-dataseed2.binance.org/'],
                    },
                  ],
                });
                // console.log("here");
                // check if the chain to connect to is installed
                // const changeRequest = await window.ethereum.request({
                //   method: "wallet_switchEthereumChain",
                //   params: [{ chainId: "0x38" }], // chainId must be in hexadecimal numbers
                // });
                // console.log(changeRequest);
                const signature = await web3.eth.personal.sign(
                  web3.utils.utf8ToHex(nonce),
                  web3Data.accounts[0],
                );
                console.log(signature);
                await authLogin(nonce,signature);
                // await solLogin(nonce, signature);
                refreshStates(true);
              } else {
                setLoader(false);
                setError({
                  isError: true,
                  msg: 'Wrong Network, please select the correct network',
                  code: 0,
                });
              }
            } catch (error) {
              // console.log('error ')
              // This error code indicates that the chain has not been added to MetaMask
              // if it is not, then install it into the user MetaMask
              if (error.code === 4902) {
                try {
                  await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [
                      {
                        chainId: '0x38',
                        chainName: 'Binance Smart Chain',
                        nativeCurrency: {
                          name: 'Binance Chain Token',
                          symbol: 'BNB',
                          decimals: 18
                        },
                        rpcUrls: ['https://bsc-dataseed2.binance.org/'],
                      },
                    ],
                  });
                } catch (addError) {
                  setLoader(false);
                  setError({ isError: true, msg: addError.message, code: 1 });
                }
              }

              if (error.code === 4001) {
                setLoader(false);
                setError({ isError: true, msg: error.message, code: 1 });
              }
              // console.error(error);
            }
          } else {
            window.localStorage.removeItem('WALLETCONNECT_DEEPLINK_CHOICE');
            const signature = await web3.eth.personal.sign(
              web3.utils.utf8ToHex(nonce),
              // nonce,
              web3Data.accounts[0]
            );
            console.log(signature);
            await authLogin(nonce,signature);
            // await solLogin(nonce, signature);
            refreshStates(true);
          }
        }
      } catch (error) {
        setLoader(false);
        setError({ isError: true, msg: error.message, code: 1 });
      }
    }
  };

  const refreshStates = (clearStorage) => {
    if (!clearStorage) {
      localStorage.clear();
      props.web3Logout();
    }
    setError({ isError: false, msg: '', code: 0 });
    setLoader(false);
    toggle(4);
  };

  return (
    <>
      <BlackWrap>
        <WhiteBX01>
          <CloseBTN
            className='ani-1'
            onClick={() => {
              refreshStates(false);
            }}
          >
            <img src={CloseBTN01} alt='' />
          </CloseBTN>
          {!error.isError ? (
            !loader ? (
              <>
                <OnbTitle01>
                  <FormattedMessage
                    id='connect_your_wallet'
                    defaultMessage='Connect your wallet'
                  />
                </OnbTitle01>
                <OnbText01>
                  <FormattedMessage
                    id='connect_wallet'
                    defaultMessage='By connecting your wallet,
                      you agree to our {termLink} and our {privacyLink}.'
                    values={{
                      termLink: (
                        <NavLink to='/legal'>
                          <FormattedMessage
                            id='term_of_service'
                            defaultMessage='Term of Service'
                          />
                        </NavLink>
                      ),
                      privacyLink: (
                        <NavLink to='/legal'>
                          <FormattedMessage
                            id='privacy_policy'
                            defaultMessage='Privacy Policy'
                          />
                        </NavLink>
                      ),
                    }}
                  />
                </OnbText01>
                <OnBTNBar>
                  {!isMobile && (
                    <button onClick={() => connectToWallet()}>
                      <i>
                        <img src={WalletICO01} alt='' />
                      </i>
                      MetaMask
                    </button>
                  )}
                    
                    <button onClick={() => connectPhantom()}>
                      <i>
                        <img src={phantomLogo} alt='' />
                      </i>
                      Phantom
                    </button>
                  
                  <button onClick={() => connectToWallet(1)}>
                    <i>
                      <img src={WalletICO02} alt='' />
                    </i>
                    WalletConnect
                  </button>
                </OnBTNBar>
              </>
            ) : (
              <>
                <OnbTitle01 className='v2'>
                  <FormattedMessage
                    id='follow_the_instructions'
                    defaultMessage='Please follow the instructions on your wallet'
                  />
                </OnbTitle01>
                <LoaderBX>
                  <img src={LoaderGif} alt='' />
                </LoaderBX>
              </>
            )
          ) : (
            <>
              <OnbTitle01 className='v2'>
                <FormattedMessage id='attention' defaultMessage='Attention.!' />
              </OnbTitle01>
              <OnbText01 className='text-center'>{error.msg}</OnbText01>
              {error.code === 2 && (
                <InstallBtn
                  className='ani-1'
                  onClick={() => window.open('https://metamask.io/', '_blank')}
                >
                  <FormattedMessage
                    id='download_metamask'
                    defaultMessage='Go to MetaMask website'
                  />
                </InstallBtn>
              )}
            </>
          )}
        </WhiteBX01>
      </BlackWrap>
    </>
  );
}

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
`;

const OnBTNBar = styled(FlexDiv)`
  flex-direction: column;
  width: 100%;
  margin-top: 25px;
  button {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    background-color: #eef2f7;
    border-radius: 10px;
    height: 58px;
    margin-bottom: 8px;
    i {
      width: 32px;
      height: 32px;
      display: flex;
      margin-right: 12px;
      margin-left: 4px;
    }
    :hover {
      filter: brightness(0.97);
    }
  }
`;

const LoaderBX = styled(FlexDiv)`
  width: 100%;
  margin: 30px auto 0 auto;
`;

const OnbTitle01 = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #000;
  margin-bottom: 15px;
  letter-spacing: -1px;
  &.v2 {
    max-width: 220px;
    margin: 0 auto;
    text-align: center;
    line-height: 28px;
  }
`;
const OnbText01 = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: #000;
  letter-spacing: -0.5px;
  &.text-center {
    text-align: center;
    width: 100%;
    margin: 20px 0px 40px;
  }
  a {
    color: #d121d6;
  }
`;

const InstallBtn = styled.button`
  background-color: #000000;
  border: 1px solid #000;
  color: #fff;
  font-size: 16px;
  letter-spacing: -0.5px;
  font-weight: 700;
  border-radius: 15px;
  margin: 0 auto;
  padding: 17px 15px;
  width: 100%;
  :hover {
    background-color: #fff;
    color: #000;
  }
`;

const BlackWrap = styled(FlexDiv)`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 101;
  backdrop-filter: blur(2px);
`;
const WhiteBX01 = styled(FlexDiv)`
  width: 100%;
  position: relative;
  max-width: 400px;
  margin: 0 15px;
  min-height: 418px;
  padding: 50px;
  background-color: #fff;
  border-radius: 30px;
  justify-content: flex-start;
  align-content: center;
  ${Media.xs} {
    padding: 50px 25px;
  }
`;
const CloseBTN = styled.button`
  width: 20px;
  height: 20px;
  position: absolute;
  right: 20px;
  top: 27px;
  padding: 0;
  margin: 0px;
  :hover {
    transform: rotate(90deg);
  }
  ${Media.xs} {
    right: 15px;
    top: 15px;
  }
`;

const mapDipatchToProps = (dispatch) => {
  return {
    getWeb3: () => dispatch(actions.getWeb3()),
    getSolana: () => dispatch(actions.getSolana()),
    enableMetamask: () => dispatch(actions.enableMetamask()),
    enablePhantom: () => dispatch(actions.enablePhantom()),
    enabledWalletConnect: () => dispatch(actions.enabledWalletConnect()),
    generateNonce: (address) => dispatch(actions.generateNonce(address)),
    generateSolNonce: (address) => dispatch(actions.generateSolNonce(address)),
    solLogin: (solNonce,solSignature) => 
      dispatch(actions.solLogin(solNonce,solSignature)),
    authLogin: (nonce,signature) =>
      dispatch(actions.authLogin(nonce,signature)),
    authenticateUser: () => dispatch(actions.authenticateUser()),
    getUserDetails: () => dispatch(actions.getUserDetails()),
    authLogout: () => dispatch({ type: 'AUTH_LOGOUT', data: null }),
    web3Logout: () =>
      dispatch({
        type: 'FETCH_WEB3_DATA',
        data: { isLoggedIn: false, accounts: [] },
      }),
  };
};
const mapStateToProps = (state) => {
  return {
    web3Data: state.fetchWeb3Data,
    solData: state.fetchSolData,
    networkId: state.fetchNetworkId,
    isMetamaskEnabled: state.fetchMetamask,
    nonce: state.fetchNonce,
    solNonce: state.fetchSolNonce,
    authData: state.fetchAuthData,
  };
};
export default connect(mapStateToProps, mapDipatchToProps)(Login);

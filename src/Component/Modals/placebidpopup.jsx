import React, { useState } from 'react';
import styled from 'styled-components';
import { FormattedMessage } from 'react-intl';
import Media from '../../Theme/media-breackpoint';

import CloseBTN01 from '../../Assets/images/closeBTN01.svg';
import { getContractInstance } from '../../helper/functions';
import { actions } from '../../actions';
import { connect } from 'react-redux';
import { useEffect } from 'react';
import { web3 } from '../../web3';
import TxnStatus from './txnStatus';

function PABpopup(props) {
  const {
    web3Data,
    nonce,
    price,
    currentBidValue,
    toggle,
    method,
    currentEdition,
    fetchNFTDetails,
    nftDetails,
    firstBid,
    secondHand,
  } = props;
  const escrowContractInstance = getContractInstance(true);
  const [txnStatus, setTxnStatus] = useState('');
  const [bnbVal, setBnbVal] = useState('');
  const [usdVal, setUsdVal] = useState('');
  const [bnbUSDPrice, setBnbUSDPrice] = useState();
  const [bnbTRYPrice, setBnbTRYPrice] = useState();
  const [tryVal, setTryVal] = useState('');
  const [accountBalance, setAccountBalance] = useState({ bnb: 0, usd: 0 });
  const [error, setError] = useState({ isError: false, msg: '' });

  useEffect(() => {
    async function fetchData() {
      const string =
        'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd%2Ctry';
      await fetch(string)
        .then((resp) => resp.json())
        .then(async (data) => {
          setBnbUSDPrice(data.binancecoin.usd);
          setBnbTRYPrice(data.binancecoin.try);
        });
    }
    fetchData();
  }, []);
  useEffect(() => {
    async function setAccount() {
      if (web3Data.accounts[0] && bnbUSDPrice) {
        const bnbBalance = Number(
          web3.utils.fromWei(await web3.eth.getBalance(web3Data.accounts[0]))
        );
        setAccountBalance({
          bnb: bnbBalance,
          usd: bnbUSDPrice * bnbBalance,
          try: bnbTRYPrice * bnbBalance,
        });
      }
    }
    setAccount();
  }, [web3Data.accounts, bnbUSDPrice]);
  // console.log(error);
  Number.prototype.noExponents = function () {
    var data = String(this).split(/[eE]/);
    if (data.length == 1) return data[0];

    var z = '',
      sign = this < 0 ? '-' : '',
      str = data[0].replace('.', ''),
      mag = Number(data[1]) + 1;

    if (mag < 0) {
      z = sign + '0.';
      while (mag++) z += '0';
      return z + str.replace(/^-/, '');
    }
    mag -= str.length;
    while (mag--) z += '0';
    return str + z;
  };
  const placeBid = async () => {
    const val = method === 'buyNow' ? price.toString() : bnbVal;
    if (!accountBalance.bnb)
      return setError({
        isError: true,
        msg: (
          <FormattedMessage
            id='not_have_enough_balance'
            defaultMessage='You do not have sufficient BNB Balance'
          />
        ),
      });
    // console.log(accountBalance);
    const sendObj = { from: web3Data.accounts[0] };
    // console.log(val);
    if (method !== 'claimAfterAuction') {
      if (!val) return;
      sendObj.value = web3.utils.toWei(Number(val).noExponents());
    }

    if (!error.isError) {
      setError({
        isError: false,
        msg: '',
      });
      setTxnStatus('initiate');
      await escrowContractInstance.methods[method](+nonce, +currentEdition)
        .send(sendObj)
        .on('transactionHash', (hash) => {
          setTxnStatus('progress');
        })
        .on('receipt', (receipt) => {
          // setTxnStatus("complete");
          setTimeout(() => {
            // refresh the state
            if (method === 'placeBid') fetchNFTDetails(+currentEdition);
            else nftDetails();
            setTxnStatus('complete');
          }, 5000);
        })
        .on('error', (error) => {
          setTxnStatus('error');
        });
    }
  };
  const onValEnter = (e, inUSD) => {
    const val = e.target.value;
    const currentCurrency = props.lng === 'en' ? bnbUSDPrice : bnbTRYPrice;
    // console.log(currentCurrency);
    const _bnbVal = inUSD ? (val / currentCurrency).toString() : val;
    const _usdval = inUSD ? val : val * bnbUSDPrice;
    const _tryVal = inUSD ? val : val * bnbTRYPrice;
    if (+_bnbVal <= +currentBidValue * 1.1) {
      setError({
        isError: true,
        msg: "Input should be at least 10% greater than NFT's current bid price",
      });
    } else if (+_bnbVal <= +price) {
      setError({
        isError: true,
        msg: "Input amount should be greater than NFT's price ",
      });
    } else if (+_bnbVal > accountBalance.bnb) {
      setError({
        isError: true,
        msg: 'Insufficient Balance',
      });
    } else {
      setError({
        isError: false,
        msg: '',
      });
    }

    setBnbVal(_bnbVal);
    setUsdVal(_usdval);
    setTryVal(_tryVal);
  };
  const refreshStates = () => {
    setBnbVal('');
    setUsdVal('');
    setTryVal('');
    setTxnStatus('');
    setError({
      isError: false,
      msg: '',
    });
  };

  return (
    <>
      <BlackWrap>
        <WhiteBX01>
          <CloseBTN
            className='ani-1'
            onClick={() => {
              toggle(8);
              refreshStates();
            }}
          >
            <img src={CloseBTN01} alt='' />
          </CloseBTN>

          {/* place a bid and make an offer popup */}
          {!txnStatus ? (
            <>
              {method === 'placeBid' ? (
                <>
                  {' '}
                  <PBtitle>
                    <FormattedMessage
                      id='place_a_bid'
                      defaultMessage='Place a Bid'
                    />
                  </PBtitle>
                  <PBDesc>
                    {secondHand ? (
                      <FormattedMessage id='place_a_bid_label_24hrs' />
                    ) : (
                      <FormattedMessage id='place_a_bid_label' />
                    )}
                  </PBDesc>
                  <BalanceLine>
                    <p className='balance'>
                      <FormattedMessage
                        id='your_balance'
                        defaultMessage='Your Balance'
                      />{' '}
                      :
                    </p>
                    <p className='price-state'>
                      {accountBalance.bnb.toLocaleString(2)} BNB |{' '}
                      {accountBalance.usd.toLocaleString(2)}{' '}
                      <FormattedMessage id='currency' defaultMessage='en' />
                    </p>
                  </BalanceLine>
                  <HalfInputs className={error.isError ? 'errorinput' : null}>
                    <HIBox>
                      <input
                        className='BR-straight'
                        type='text'
                        placeholder='0.00'
                        value={bnbVal}
                        onChange={(e) => onValEnter(e)}
                      />
                      <p>BNB</p>
                    </HIBox>
                    <HIBox>
                      <input
                        className='BL-straight'
                        type='text'
                        placeholder='0.00'
                        value={props.lng === 'en' ? usdVal : tryVal}
                        onChange={(e) => onValEnter(e, true)}
                      />
                      <p>
                        <FormattedMessage id='currency' defaultMessage='en' />{' '}
                      </p>
                    </HIBox>
                    {error.isError ? (
                      <p className='error'>{error.msg}</p>
                    ) : null}
                  </HalfInputs>
                  <PBbutton>
                    <button className='ani-1' onClick={() => placeBid()}>
                      <FormattedMessage id='place' defaultMessage='Place' />
                    </button>
                  </PBbutton>
                </>
              ) : (
                <>
                  <PBtitle className='AStitle'>
                    <FormattedMessage id='confirm' defaultMessage='Confirm' />
                  </PBtitle>
                  <PBDesc className='ASDesc mb-10'>
                    {method === 'buyNow' ? (
                      <FormattedMessage id='confirm_label_buy' />
                    ) : (
                      <FormattedMessage id='confirm_label_claim' />
                    )}
                  </PBDesc>
                  {/* <SkyWalletAddress>{reciever}</SkyWalletAddress> */}
                  <NFTcartButtons>
                    <button
                      className='ani-1 bordered'
                      onClick={() => {
                        toggle(8);
                        refreshStates();
                      }}
                    >
                      <FormattedMessage
                        id='cancel_button'
                        defaultMessage='Cancel'
                      />
                    </button>
                    <button className='ani-1' onClick={() => placeBid()}>
                      {method === 'buyNow' ? (
                        <FormattedMessage
                          id='buy_button'
                          defaultMessage='Buy'
                        />
                      ) : (
                        <FormattedMessage
                          id='claim_button'
                          defaultMessage='Claim'
                        />
                      )}
                    </button>
                    {error.isError ? (
                      <p className='error'>{error.msg}</p>
                    ) : null}
                  </NFTcartButtons>
                </>
              )}
            </>
          ) : (
            <TxnStatus
              status={txnStatus}
              toggle={toggle}
              toggleIndex={8}
              refreshStates={refreshStates}
            />
          )}
        </WhiteBX01>
      </BlackWrap>
    </>
  );
}

const toggle = (index) => {
  let collapse = 'isOpen' + index;
  this.setState((prevState) => ({ [collapse]: !prevState[collapse] }));
};
// }

const FlexDiv = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
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

const WhiteBX0D3 = styled(FlexDiv)`
  width: 100%;
  position: relative;
  max-width: 400px;
  margin: 0 15px;
  min-height: 418px;
  padding: 50px;
  background-color: #fff;
  border-radius: 30px;
  justify-content: flex-start;
  align-content: flex-start;
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

const PBtitle = styled.div`
  font-size: 24px;
  letter-spacing: -1px;
  color: #000;
  font-weight: 600;
  margin: 0px 0px 10px;
  width: 100%;
  &.AStitle {
    text-align: center;
    margin: 0px 0px 20px;
  }
  &.TN-title {
    margin: 0px 0px 20px;
  }
`;

const PBDesc = styled.div`
  font-size: 14px;
  letter-spacing: -0.55px;
  color: #000;
  margin: 0px 0px 30px;
  width: 100%;
  line-height: 18px;
  &.ASDesc {
    text-align: center;
    margin: 0px 0px 40px;
  }
  &.mb-20 {
    margin: 0px 0px 20px;
  }
  &.mb-10 {
    margin: 0px 0px 10px;
  }
`;

const BalanceLine = styled(FlexDiv)`
  justify-content: space-between;
  margin: 0px 0px 6px;
  width: 100%;
  .balance {
    font-size: 12px;
    color: #8e9194;
    margin: 0px;
    font-weight: 600;
  }
  .price-state {
    font-size: 16px;
    letter-spacing: -0.8px;
    color: #000;
    margin: 0px;
    font-weight: 300;
  }
`;

const HalfInputs = styled(FlexDiv)`
  justify-content: flex-start;

  &.errorinput {
    input {
      border-color: #ff2a44;
      &.BR-straight {
        border-right-color: #ddd;
      }
    }
    .error {
      font-size: 12px;
      color: #ff2a44;
      margin: 8px 0px 0px;
      letter-spacing: -0.6px;
    }
  }
`;

const HIBox = styled(FlexDiv)`
  width: 50%;
  position: relative;
  input {
    border: 1px solid #dddddd;
    width: 100%;
    height: 54px;
    border-radius: 10px;
    padding: 0px 40px 0px 15px;
    font-size: 24px;
    letter-spacing: -1.2px;
    color: #000;
    font-weight: 600;
    ::placeholder {
      color: #000;
    }
    &.BR-straight {
      border-top-right-radius: 0px;
      border-bottom-right-radius: 0px;
    }
    &.BL-straight {
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
      border-left: 0px;
    }
  }
  p {
    position: absolute;
    right: 15px;
    bottom: 15px;
    font-size: 12px;
    letter-spacing: -0.6px;
    font-weight: 600;
    color: #000;
    margin: 0px;
    line-height: 13px;
  }
`;

const PBbutton = styled.div`
  margin: 40px auto 0px;
  button {
    background-color: rgb(0 0 0 / 30%);
    padding: 14px 78px;
    color: #fff;
    font-size: 14px;
    border-radius: 15px;
    &.colorful {
      background: linear-gradient(90deg, #d121d6, #febf11);
    }
    :hover {
      background: linear-gradient(90deg, #d121d6, #febf11);
    }
  }
`;

const NFTcartButtons = styled.div`
  margin: 30px auto 0px;
  button {
    background-color: #000;
    color: #fff;
    width: 140px;
    height: 44px;
    border-radius: 15px;
    font-size: 14px;
    letter-spacing: -0.5px;
    margin: 0px 5px 5px;
    ${Media.sm} {
      width: 110px;
    }
    :hover {
      background-image: linear-gradient(90deg, #d121d6, #febf11);
      box-shadow: 0px 4px 5px 0px rgb(0 0 0 / 20%);
    }
    &:disabled {
      background-color: rgb(0 0 0 / 30%);
      :hover {
        background: rgb(0 0 0 / 30%);
        box-shadow: none;
      }
    }
    &.bordered {
      background-color: transparent;
      border: 1px solid #000;
      color: #000;
      :hover {
        background: none;
      }
      &.bor-large {
        padding: 12px 85px;
        width: auto;
      }
    }
    &.bor-large {
      padding: 12px 70px;
      width: auto;
    }
  }
  ${WhiteBX0D3} & {
    position: absolute;
    bottom: 50px;
    left: 0px;
    width: 100%;
    text-align: center;
  }
`;

const NFTForm = styled.div`
  position: relative;
  width: 100%;
  &.Custom-piece {
    .label-line {
      label {
        font-size: 16px;
        color: #000;
        font-weight: 500;
      }
    }
  }
  .label-line {
    margin: 0px 0px 6px;
    label {
      font-size: 12px;
      color: #8e9194;
      letter-spacing: -0.2px;
    }
  }
  input {
    width: 100%;
    height: 54px;
    border: 1px solid #dddddd;
    border-radius: 10px;
    padding: 15px;
    font-size: 16px;
    color: #000000;
    letter-spacing: -0.9px;
    margin: 0px 0px 40px;
    ::placeholder {
      color: #000;
      opacity: 20%;
    }
  }
  .errorinput {
    position: relative;
    input {
      border-color: #ff2a44;
    }
    p.error {
      color: #ff2a44;
      font-size: 12px;
      letter-spacing: -0.6px;
      font-weight: 600;
      margin: 0px;
      position: absolute;
      top: 18px;
      right: 15px;
    }
  }
`;

const SkyWalletAddress = styled.div`
  background-color: #eef2f7;
  padding: 10px 47px;
  border-radius: 15px;
  font-size: 14px;
  letter-spacing: -0.8px;
  font-weight: 600;
  color: #000;
  width: auto;
`;

const mapDipatchToProps = (dispatch) => {
  return {
    likeToggler: (id) => dispatch(actions.likeToggler(id)),
    getSingleNFTDetails: (id) => dispatch(actions.getSingleNFTDetails(id)),
    getLikesCount: (id) => dispatch(actions.getLikesCount(id)),
    getIsLiked: (id) => dispatch(actions.getIsLiked(id)),
  };
};
const mapStateToProps = (state) => {
  return {
    web3Data: state.fetchWeb3Data,
    lng: state.fetchLanguage,
  };
};

export default connect(mapStateToProps, mapDipatchToProps)(PABpopup);

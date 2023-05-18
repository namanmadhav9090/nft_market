import React, { useEffect, useState, useRef } from "react";
import styled from "styled-components";
import Media from "../../Theme/media-breackpoint";
import Collapse from "@kunukn/react-collapse";
import { FormattedMessage } from "react-intl";
import { web3 } from "../../web3";
import CloseBTN01 from "../../Assets/images/closeBTN01.svg";
import DDdownA from "../../Assets/images/dd-down-arrow.svg";
import TxnStatus from "./txnStatus";
import { getContractInstance } from "../../helper/functions";

function POSpopup({
  toggle,
  tokenId,
  editionNumber,
  web3Data,
  nftDetails,
  bnbUSDPrice,
  accountBalance,
}) {
  const wrapperRef = useRef(null);
  const [isOpen2, setIsOpen2] = useState(false);
  const [price, setPrice] = useState("");
  const [txnStatus, setTxnStatus] = useState("");
  const [method, setMethod] = useState("");
  const [error, setError] = useState("");
  const escrowContractInstance = getContractInstance(true);
  const [currencyUsed, setCurrencyUsed] = useState("BNB");
  const makeTransaction = async () => {
    if (!method) return setError("noOption");
    if (!accountBalance) return setError("noBNB");
    if (!+price) return setError("priceError");
    let newPrice = price;
    if (currencyUsed === "TR") newPrice = (+price / bnbUSDPrice.try).toString();

    if (currencyUsed === "USD")
      newPrice = (+price / bnbUSDPrice.usd).toString();

    setError("");
    // console.log(method, price);
    setTxnStatus("initiate");
    await escrowContractInstance.methods[method](
      +tokenId,
      editionNumber,
      web3.utils.toWei(newPrice, "ether")
    )
      .send({ from: web3Data.accounts[0] })
      .on("transactionHash", (hash) => {
        setTxnStatus("progress");
      })
      .on("receipt", (receipt) => {
        setTimeout(() => {
          // refresh the state
          nftDetails();
          setTxnStatus("complete");
        }, 5000);
      })
      .on("error", (error) => {
        setTxnStatus("error");
      });
  };

  useEffect(() => {
    /**
     * Alert if clicked on outside of element
     */
    function handleClickOutside(event) {
      if (
        wrapperRef &&
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        if (isOpen2) setIsOpen2(false);
      }
    }

    // Bind the event listener
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      // Unbind the event listener on clean up
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [wrapperRef, setIsOpen2, isOpen2]);

  const refreshStates = () => {
    setPrice("");
    setTxnStatus("");
    // toggle(7);
  };
  return (
    <>
      <BlackWrap>
        <WhiteBX0D3>
          <CloseBTN className="ani-1" onClick={() => toggle(7)}>
            <img src={CloseBTN01} alt="" />
          </CloseBTN>

          {!txnStatus ? (
            <>
              <PBtitle className="TN-title">
                <FormattedMessage
                  id="put_on_sale"
                  defaultMessage="Put on Sale"
                />
              </PBtitle>
              <CustomRadio1>
                <label className="radio-container">
                  <FormattedMessage id="buy_now" defaultMessage="Buy now" />
                  <input
                    className={error === "priceError" ? `error` : ``}
                    type="radio"
                    name="category"
                    value="buy now"
                    onClick={() => setMethod("putOnSaleBuy")}
                  />
                  <span className="checkmark"></span>
                </label>
                <label className="radio-container">
                  <FormattedMessage
                    id="accept_offers"
                    defaultMessage="Accept offers"
                  />
                  <input
                    type="radio"
                    name="category"
                    value="accept offers"
                    onClick={() => setMethod("requestOffer")}
                  />
                  <span className="checkmark"></span>
                </label>
              </CustomRadio1>
              <ErrorMsg>
                <div className="errorinput">
                  {error === "noOption" ? (
                    <p className="error bottom-text">Please select one option</p>
                  ) : (
                    ""
                  )}
                </div>
              </ErrorMsg>

              <NFTForm className="Custom-piece">
                <div className={error === "priceError" ? "errorinput" : ""}>
                  <div className="label-line">
                    <label>
                      {method === "requestOffer" ? (
                        <FormattedMessage
                          id="enter_minimum_price_lable"
                          defaultMessage="Enter minimum price"
                        />
                      ) : (
                        <FormattedMessage
                          id="enter_price_lable"
                          defaultMessage="Enter price"
                        />
                      )}
                    </label>
                  </div>
                  <input
                    type="text"
                    placeholder="0.00"
                    name="price"
                    onChange={(e) => {
                      if (!isNaN(Number(e.target.value)))
                        setPrice(e.target.value);
                    }}
                  />
                  {error === "priceError" ? (
                    <p className="error bottom-text">Please add valid number</p>
                  ) : (
                    ""
                  )}
                  {error === "noBNB" ? (
                    <p className="error bottom-text">
                      You don't have sufficient BNB
                    </p>
                  ) : (
                    ""
                  )}
                </div>
                <AccountBX
                  onClick={() => setIsOpen2(!isOpen2)}
                  ref={wrapperRef}
                >
                  <span>
                    {currencyUsed} <img src={DDdownA} alt="" />
                  </span>
                  <Collapse
                    isOpen={isOpen2}
                    className={
                      "app__collapse collapse-css-transition  " +
                      (isOpen2 ? "collapse-active" : "")
                    }
                  >
                    <DDContainer className="ver2">
                      <DDBtnbar02>
                        <button onClick={() => setCurrencyUsed("BNB")}>
                          BNB
                        </button>
                      </DDBtnbar02>
                      <DDBtnbar02>
                        <button onClick={() => setCurrencyUsed("TR")}>
                          TR
                        </button>
                      </DDBtnbar02>
                      <DDBtnbar02>
                        <button onClick={() => setCurrencyUsed("USD")}>
                          USD
                        </button>
                      </DDBtnbar02>
                    </DDContainer>
                  </Collapse>
                </AccountBX>
              </NFTForm>
              <NFTcartButtons>
                <button
                  className="ani-1 bor-large"
                  onClick={() => makeTransaction()}
                >
                  <FormattedMessage id="place" defaultMessage="Place" />
                </button>
              </NFTcartButtons>
            </>
          ) : (
            <TxnStatus
              status={txnStatus}
              toggle={toggle}
              toggleIndex={7}
              refreshStates={refreshStates}
            />
          )}
        </WhiteBX0D3>
      </BlackWrap>
    </>
  );
}

const toggle = (index) => {
  let collapse = "isOpen" + index;
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

const DDContainer = styled(FlexDiv)`
  position: absolute;
  background-color: #fff;
  padding: 15px;
  border-radius: 20px;
  box-shadow: 0 10px 10px 0 rgba(0, 0, 0, 0.2);
  top: calc(100% + 7px);
  width: 100%;
  left: 0;
  overflow: hidden;
  z-index: 100;

  .md-checkbox:hover {
    background-color: #d9f5f5;
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
    margin: 15px 0px 20px;
  }
`;

const NFTcartButtons = styled.div`
  margin: 0 auto;
  button {
    background-color: #000;
    color: #fff;
    width: 140px;
    height: 44px;
    border-radius: 15px;
    font-size: 14px;
    letter-spacing: -0.5px;
    margin: 0px 5px 5px;
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
  // ${WhiteBX0D3} & {
  //   position: absolute;
  //   bottom: 50px;
  //   left: 0px;
  //   width: 100%;
  //   text-align: center;
  // }
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
      margin-bottom: 5px;
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
      &.bottom-text {
        position: initial;
        margin-bottom: 30px;
      }
    }
  }
`;

const CustomRadio1 = styled(FlexDiv)`
  justify-content: flex-start;
  margin-bottom: 20px;
  width: 100%;
  .radio-container {
    display: flex;
    align-items: center;
    position: relative;
    height: 54px;
    width: calc(50% - 5px);
    margin-right: 10px;
    cursor: pointer;
    padding-left: 15px;
    line-height: 54px;
    font-weight: 600;
    font-size: 16px;
    letter-spacing: -0.9px;
    color: #000;
    img {
      margin-right: 5px;
    }
    :last-child {
      margin-right: 0px;
    }
  }
  .radio-container input {
    position: absolute;
    left: 0;
    opacity: 0;
    cursor: pointer;
    margin: 0px;
  }
  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 54px;
    width: 100%;
    background-color: transparent;
    border-radius: 10px;
    border: 1px solid #dddddd;
  }
  .radio-container input:checked ~ .checkmark {
    border: 1px solid #00babc;
  }
`;

const AccountBX = styled(FlexDiv)`
  position: absolute;
  top: 37px;
  right: 0px;
  width: auto;
  justify-content: flex-end;
  padding: 8px 10px;
  z-index: 101;
  cursor: pointer;
  & i {
    width: 50px;
    height: 50px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
    }
  }
  & span {
    font-size: 16px;
    letter-spacing: -0.9px;
    font-weight: 700;
    color: #000;
    display: flex;
    text-align: right;
    line-height: 16px;
    padding-right: 8px;
    img {
      margin-left: 5px;
    }
    span {
      font-size: 10px;
      color: #b3b3b3;
      width: 100%;
      padding-right: 0;
    }
  }
`;

const DDBtnbar02 = styled(FlexDiv)`
  width: 100%;
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 45px;
    font-size: 16px;
    font-weight: 600;
    border-bottom: 1px solid #eef2f7;
    & i {
      width: 34px;
      height: 34px;
      margin: 0 8px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    & span {
      margin-left: auto;
    }
    &:nth-last-child(01) {
      border-bottom: 0px;
    }
    &:hover {
      background-color: #d9f5f5;
    }
  }
`;

const ErrorMsg = styled.div`
  width:100%;
  .errorinput {
    position: relative;
    top:-15px;
    input {
      border-color: #ff2a44;
      margin-bottom: 5px;
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
      &.bottom-text {
        position: initial;
        margin-bottom: 0px;
      }
    }
  }
`;

export default POSpopup;

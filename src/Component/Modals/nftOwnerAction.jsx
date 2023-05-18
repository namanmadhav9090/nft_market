import React, { Component, useState } from "react";
import styled from "styled-components";

import CloseBTN01 from "../../Assets/images/closeBTN01.svg";
import { getContractInstance } from "../../helper/functions";
import { actions } from "../../actions";
import { connect } from "react-redux";
import { FormattedMessage } from "react-intl";
import TxnStatus from "./txnStatus";
import Media from "./../../Theme/media-breackpoint";
import getContractAddresses from "../../contractData/contractAddress/addresses";
import { web3 } from "../../web3";

function NftOwnerActions(props) {
  const {
    web3Data,
    toggle,
    ownerActionName,
    edition,
    tokenID,
    timeStamp,
    isApprovedForAll,
    changeOwnerActionName,
    orderNonce,
    checkUserApproval,
    nftDetails,
    nextMethod,
    accountBalance,
  } = props;
  const succesMsg = {
    burnTokenEdition: (
      <FormattedMessage id="burn_success" defaultMessage="Burn Successfull" />
    ),
    transfer: (
      <FormattedMessage
        id="transfer_success"
        defaultMessage="Transfer Successfull"
      />
    ),
  };
  const escrowContractInstance = getContractInstance(true);
  const nftContractContractInstance = getContractInstance();

  const [reciever, setReciever] = useState("");
  const [mintNFTStatus, setNFTStatus] = useState("");
  const [approved, setApproved] = useState(false);
  const [confirm, setConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleAction = async (forApproval) => {
    if (!accountBalance) {
      setErrorMsg("You do not have sufficient BNB Balance");
      setNFTStatus("error");
      return;
    }

    const { escrowContractAddres } = getContractAddresses();
    let contractInstance = escrowContractInstance;
    setApproved(false);
    // console.log("next method added", nextMethod);
    let params;
    if (ownerActionName === "burnTokenEdition") params = [+tokenID, +edition];
    else if (ownerActionName === "transfer")
      params = [
        web3Data.accounts[0],
        reciever,
        +tokenID,
        +edition,
        web3.utils.sha3("0xea"),
      ];
    else if (ownerActionName === "setApprovalForAll") {
      params = [escrowContractAddres, true];
      contractInstance = nftContractContractInstance;
    } else if (
      ownerActionName === "cancelSaleOrder" ||
      ownerActionName === "claimBack" ||
      ownerActionName === "acceptOffer"
    )
      params = [+orderNonce, +edition];
    else return;
    // console.log(params, ownerActionName);
    setNFTStatus("initiate");
    setErrorMsg("");
    await contractInstance.methods[ownerActionName](...params)
      .send({
        from: web3Data.accounts[0],
      })
      .on("transactionHash", (hash) => {
        setNFTStatus("progress");
      })
      .on("receipt", (receipt) => {
        if (ownerActionName === "setApprovalForAll") {
          setApproved(true);
          setNFTStatus("");

          checkUserApproval(web3Data);
          // console.log("this is next method", nextMethod);
          if (nextMethod) {
            changeOwnerActionName(nextMethod.name, nextMethod.open);
            return;
          }
        }

        setTimeout(() => {
          // refresh the state
          if (ownerActionName === "setApprovalForAll") {
            setNFTStatus("");
            checkUserApproval(web3Data);
          } else {
            nftDetails();
            setNFTStatus("complete");
          }
        }, 5000);
      })
      .on("error", (error) => {
        setNFTStatus("error");
      });
  };
  const refreshStates = () => {
    setApproved(false);
    setNFTStatus("");
    setReciever("");
    setConfirm(false);
  };
  return (
    <>
      <BlackWrap>
        <WhiteBX01>
          <CloseBTN
            className="ani-1"
            onClick={() => {
              toggle(1);
              refreshStates();
            }}
          >
            <img src={CloseBTN01} alt="" />
          </CloseBTN>
          {approved && (
            <PBtitle className="AStitle">
              <FormattedMessage id="user_approved" defaultMessage="User Approved" />
            </PBtitle>
          )}
          {!mintNFTStatus ? (
            <>
              {ownerActionName === "burnTokenEdition" && (
                <>
                  <PBtitle className="AStitle">
                    <FormattedMessage id="are_you_sure?" />
                  </PBtitle>
                  <PBDesc className="ASDesc">
                    <FormattedMessage id="burn_label" />
                  </PBDesc>
                  <NFTcartButtons>
                    <button className="ani-1 bordered">
                      <FormattedMessage id="cancel" defaultMessage="Cancel" />
                    </button>
                    <button className="ani-1" onClick={() => handleAction()}>
                      <FormattedMessage id="burn" defaultMessage="Burn" />
                    </button>
                  </NFTcartButtons>
                </>
              )}
              {ownerActionName === "claimBack" &&
                parseInt(timeStamp, 10) + 180 < new Date().getTime() / 1000 && (
                  <>
                    <PBtitle className="AStitle">
                      <FormattedMessage id="are_you_sure?" />
                    </PBtitle>
                    <PBDesc className="ASDesc">
                      <FormattedMessage id="are_you_sure_label" />
                    </PBDesc>
                    <NFTcartButtons>
                      <button className="ani-1 bordered">
                        <FormattedMessage id="cancel" defaultMessage="Cancel" />
                      </button>
                      <button className="ani-1" onClick={() => handleAction()}>
                        <FormattedMessage id="claim_back" defaultMessage="Claim Back" />
                      </button>
                    </NFTcartButtons>
                  </>
                )}

              {ownerActionName === "claimBack" &&
                parseInt(timeStamp, 10) + 180 >=
                  new Date().getTime() / 1000 && (
                  <>
                    <PBtitle className="AStitle">
                      <FormattedMessage id="attention" />
                    </PBtitle>
                    <PBDesc className="ASDesc">
                      <FormattedMessage id="claim_back_restriction_lable" />
                    </PBDesc>
                    <NFTcartButtons>
                      <button className="ani-1 bordered">
                        <FormattedMessage id="cancel" defaultMessage="Cancel" />
                      </button>
                      <button className="ani-1" disabled>
                        <FormattedMessage id="claim_back" defaultMessage="Claim Back" />
                      </button>
                    </NFTcartButtons>
                  </>
                )}
              {
                // {/* Transfer NFT popup */}
                ownerActionName === "transfer" && !confirm && (
                  <>
                    <PBtitle className="TN-title">
                      <FormattedMessage id="transfer_nft" />
                    </PBtitle>
                    <PBDesc className="mb-20">
                      <FormattedMessage id="transfer_nft_label" />
                    </PBDesc>
                    <NFTForm>
                      <div className="label-line">
                        <label>
                          <FormattedMessage id="wallet_address" />
                        </label>
                      </div>
                      <FormattedMessage id="add_wallet_placeholder" defaultMessage="Add Wallet Address">
                        {placeholder=>
                          <input
                            type="text"
                            className="mb-0"
                            placeholder={placeholder}
                            onChange={(e) => setReciever(e.target.value)}
                          />}
                      </FormattedMessage>
                    </NFTForm>
                    <NFTcartButtons>
                      <button
                        className="ani-1 bor-large"
                        onClick={() => setConfirm(true)}
                      >
                        <FormattedMessage
                          id="transfer"
                          defaultMessage="Transfer"
                        />
                      </button>
                    </NFTcartButtons>
                  </>
                )
              }
              {
                // {/* Transfer NFT popup */}
                ownerActionName === "setApprovalForAll" && (
                  <>
                    <PBtitle className="TN-title">
                      <FormattedMessage
                        id="approve_first_time"
                        defaultMessage="Approve The Transfer"
                      />
                    </PBtitle>
                    <PBDesc className="mb-20">
                      <FormattedMessage id="approve_first_time_label" />
                    </PBDesc>

                    <NFTcartButtons>
                      <button
                        className="ani-1 bor-large"
                        onClick={() => handleAction()}
                      >
                        <FormattedMessage id="approve" defaultMessage="Approve" />
                      </button>
                    </NFTcartButtons>
                  </>
                )
              }
              {ownerActionName === "cancelSaleOrder" && (
                <>
                  <PBtitle className="TN-title">
                    <FormattedMessage
                      id="cancel_sale_order"
                      defaultMessage="Cancel Sale Order"
                    />
                  </PBtitle>
                  <PBDesc className="mb-20">
                    <FormattedMessage id="cancel_sale_order_lable" />
                  </PBDesc>

                  <NFTcartButtons>
                    <button
                      className="ani-1 bor-large"
                      onClick={() => handleAction()}
                    >
                      <FormattedMessage id="cancel_sale_order_button" />
                    </button>
                  </NFTcartButtons>
                </>
              )}
              {ownerActionName === "acceptOffer" && (
                <>
                  <PBtitle className="TN-title">
                    <FormattedMessage
                      id="accept_offers"
                      defaultMessage="Accept offer"
                    />
                  </PBtitle>
                  <PBDesc className="mb-20">
                    <FormattedMessage id="accept_offers_label" />
                  </PBDesc>

                  <NFTcartButtons>
                    <button
                      className="ani-1 bor-large"
                      onClick={() => handleAction()}
                    >
                      <FormattedMessage id="accept" defaultMessage="Accept" />
                    </button>
                  </NFTcartButtons>
                </>
              )}
              {confirm && (
                <>
                  <PBtitle className="AStitle">
                    <FormattedMessage id="confirm" defaultMessage="Confirm" />
                  </PBtitle>
                  <PBDesc className="ASDesc mb-10">
                    <FormattedMessage id="confirm_label_transfer" />
                  </PBDesc>
                  <SkyWalletAddress>{reciever}</SkyWalletAddress>
                  <NFTcartButtons>
                    <button
                      className="ani-1 bordered"
                      onClick={() => toggle(1)}
                    >
                      Cancel
                    </button>
                    <button className="ani-1" onClick={() => handleAction()}>
                      <FormattedMessage
                        id="transfer"
                        defaultMessage="Transfer"
                      />
                    </button>
                  </NFTcartButtons>
                </>
              )}
            </>
          ) : (
            <TxnStatus
              status={mintNFTStatus}
              msg={succesMsg[ownerActionName]}
              toggleIndex={1}
              toggle={toggle}
              refreshStates={refreshStates}
              errorMsg={errorMsg}
            />
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
    &.mb-0 {
      margin-bottom: 0px;
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
  padding: 10px;
  border-radius: 15px;
  font-size: 13px;
  letter-spacing: -0.8px;
  font-weight: 600;
  color: #000;
  margin: 0 auto 10px;
  width: auto;
`;
const WGTitle = styled.div`
  color: #000000;
  font-size: 24px;
  line-height: 28px;
  font-weight: 700;
  letter-spacing: -0.6px;
  margin-bottom: 20px;
  text-align: center;
  width: 100%;
`;
const WGdescText = styled.div`
  color: #000000;
  font-size: 14px;
  letter-spacing: -0.7px;
  margin-bottom: 10px;
  text-align: center;
`;

const WGBtn = styled.button`
  color: #000000;
  font-size: 14px;
  font-weight: 700;
  letter-spacing: -0.7px;
  padding: 13px 86px;
  border-radius: 15px;
  border: 1px solid #000000;
  margin: 30px auto 0px;
  :hover {
    background-color: #000;
    color: #fff;
  }
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
  };
};

export default connect(mapStateToProps, mapDipatchToProps)(NftOwnerActions);
